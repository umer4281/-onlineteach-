"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import {
  verifyAdminCredentials,
  hashAdminPassword,
  verifyAdminPassword,
} from "@/lib/session";
import { setAdminSession, clearAdminSession, isAdmin, getSessionUser } from "@/lib/auth";
import {
  supabaseAdmin,
  isSupabaseConfigured,
  RESOURCE_BUCKET,
} from "@/lib/supabase";

/* ---------------------------------- auth ---------------------------------- */

/** Keep the redirect target on /admin paths only (defence against open redirect). */
function safeNextPath(value: string | null): string {
  if (!value) return "/admin";
  try {
    const path = new URL(value, "http://localhost").pathname;
    return path.startsWith("/admin") ? path : "/admin";
  } catch {
    return "/admin";
  }
}

export async function loginAction(formData: FormData) {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");
  const next = safeNextPath(String(formData.get("next") ?? ""));

  // 1) Registered admins — stored in the database (hashed passwords).
  if (isSupabaseConfigured && supabaseAdmin) {
    const { data } = await supabaseAdmin
      .from("admins")
      .select("id,email,name,password_hash")
      .eq("email", email)
      .maybeSingle();

    if (data) {
      if (await verifyAdminPassword(password, data.password_hash)) {
        await setAdminSession({
          uid: data.id,
          email: data.email,
          name: data.name,
        });
        redirect(next);
      }
      redirect("/admin/login?error=1");
    }
  }

  // 2) Fall back to the seeded demo admin (ADMIN_EMAIL / ADMIN_PASSWORD env vars).
  if (await verifyAdminCredentials(email, password)) {
    await setAdminSession({ email, name: "Admin" });
    redirect("/admin");
  }

  redirect("/admin/login?error=1");
}

export async function registerAdminAction(formData: FormData) {
  await requireAdmin();

  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");
  const confirm = String(formData.get("confirm") ?? "");

  if (!name || !email || !password || !confirm) {
    redirect("/admin/admins?error=required");
  }
  if (password.length < 6) redirect("/admin/admins?error=short");
  if (password !== confirm) redirect("/admin/admins?error=mismatch");

  const { data: existing } = await supabaseAdmin!
    .from("admins")
    .select("id")
    .eq("email", email)
    .maybeSingle();
  if (existing) redirect("/admin/admins?error=exists");

  const password_hash = await hashAdminPassword(password);
  const { error } = await supabaseAdmin!
    .from("admins")
    .insert({ name, email, password_hash });

  if (error) redirect("/admin/admins?error=failed");
  redirect("/admin/admins?created=1");
}

export async function deleteAdminAction(formData: FormData) {
  await requireAdmin();

  const me = await getSessionUser();
  const targetId = String(formData.get("adminId") ?? "");

  if (!targetId) redirect("/admin/admins?error=invalid");

  // Never allow an admin to remove their own account (would lock you out).
  if (me?.uid && me.uid === targetId) {
    redirect("/admin/admins?error=self-delete");
  }

  // Guard against deleting the last admin. Read remaining count first.
  const { count } = await supabaseAdmin!
    .from("admins")
    .select("id", { count: "exact" });
  if ((count ?? 0) <= 1) redirect("/admin/admins?error=last-admin");

  const { error } = await supabaseAdmin!
    .from("admins")
    .delete()
    .eq("id", targetId);

  if (error) redirect("/admin/admins?error=failed");
  redirect("/admin/admins?deleted=1");
}

export async function logoutAction() {
  await clearAdminSession();
  redirect("/admin/login?loggedOut=1");
}

/* ------------------------------- students -------------------------------- */

export async function createStudentAction(formData: FormData) {
  await requireAdmin();

  const rollNo = String(formData.get("rollNo") ?? "").trim().toUpperCase();
  const name = String(formData.get("name") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const confirm = String(formData.get("confirm") ?? "");

  if (!rollNo || !name || !password || !confirm) {
    redirect("/admin/students?error=required");
  }
  if (password.length < 6) redirect("/admin/students?error=short");
  if (password !== confirm) redirect("/admin/students?error=mismatch");

  const { data: existing } = await supabaseAdmin!
    .from("students")
    .select("id")
    .eq("roll_no", rollNo)
    .maybeSingle();
  if (existing) redirect("/admin/students?error=exists");

  const password_hash = await hashAdminPassword(password);
  const { error } = await supabaseAdmin!.from("students").insert({
    roll_no: rollNo,
    name,
    class: String(formData.get("class") ?? "").trim(),
    guardian_name: String(formData.get("guardianName") ?? "").trim(),
    guardian_phone: String(formData.get("guardianPhone") ?? "").trim(),
    password_hash,
  });

  if (error) redirect("/admin/students?error=failed");
  redirect("/admin/students?created=1");
}

export async function deleteStudentAction(formData: FormData) {
  await requireAdmin();
  const studentId = String(formData.get("studentId") ?? "");
  if (!studentId) redirect("/admin/students?error=invalid");

  const { error } = await supabaseAdmin!
    .from("students")
    .delete()
    .eq("id", studentId);
  if (error) redirect("/admin/students?error=failed");
  redirect("/admin/students?deleted=1");
}

/* ------------------------------ attendance ------------------------------- */

export async function recordAttendanceAction(formData: FormData) {
  await requireAdmin();

  const date = String(formData.get("date") ?? "");
  const studentIds = formData.getAll("studentId").map(String);
  const statuses = formData.getAll("status").map(String);

  if (!date || !studentIds.length || studentIds.length !== statuses.length) {
    redirect("/admin/students?error=attendance");
  }

  const rows = studentIds.map((studentId, i) => ({
    student_id: studentId,
    date,
    status: statuses[i] === "absent" ? "absent" : statuses[i] === "late" ? "late" : "present",
  }));

  // Upsert on (student_id, date) so re-saving today's list just updates it.
  const { error } = await supabaseAdmin!.from("attendance").upsert(rows, {
    onConflict: "student_id,date",
  });

  if (error) redirect("/admin/students?error=attendance-save");
  redirect(`/admin/students?saved=1&date=${date}`);
}

/* ------------------------------ shared helpers ----------------------------- */

function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

/** Must be logged in AND have Supabase configured before any admin write. */
async function requireAdmin() {
  if (!(await isAdmin())) redirect("/admin/login");
  if (!isSupabaseConfigured) redirect("/admin?setup=1");
}

function refreshUserPages() {
  revalidatePath("/");
  revalidatePath("/courses");
  revalidatePath("/courses/[slug]", "page");
  revalidatePath("/courses/[slug]/lessons/[lessonId]", "page");
}

/* --------------------------------- courses -------------------------------- */

export async function createCourseAction(formData: FormData) {
  await requireAdmin();

  const title = String(formData.get("title") ?? "").trim();
  if (!title) redirect("/admin?error=title-required");

  const slug = slugify(String(formData.get("slug") ?? "") || title);

  const { error } = await supabaseAdmin!.from("courses").insert({
    slug,
    title,
    tagline: String(formData.get("tagline") ?? "").trim(),
    description: String(formData.get("description") ?? "").trim(),
    thumbnail:
      String(formData.get("thumbnail") ?? "").trim() || "/images/smart-logo.jpg",
    instructor: String(formData.get("instructor") ?? "").trim(),
    level: String(formData.get("level") ?? "Beginner").trim(),
    category: String(formData.get("category") ?? "General").trim(),
  });

  refreshUserPages();
  if (error) redirect("/admin?error=slug-exists");
  redirect(`/admin/courses/${slug}/edit`);
}

export async function updateCourseAction(formData: FormData) {
  await requireAdmin();

  const courseId = String(formData.get("courseId") ?? "");
  const title = String(formData.get("title") ?? "").trim();
  if (!courseId || !title) redirect("/admin?error=invalid");

  const slug = slugify(String(formData.get("slug") ?? "") || title);

  const { error } = await supabaseAdmin!
    .from("courses")
    .update({
      slug,
      title,
      tagline: String(formData.get("tagline") ?? "").trim(),
      description: String(formData.get("description") ?? "").trim(),
      thumbnail:
        String(formData.get("thumbnail") ?? "").trim() || "/images/smart-logo.jpg",
      instructor: String(formData.get("instructor") ?? "").trim(),
      level: String(formData.get("level") ?? "Beginner").trim(),
      category: String(formData.get("category") ?? "General").trim(),
    })
    .eq("id", courseId);

  refreshUserPages();
  if (error) redirect(`/admin/courses/${slug}/edit?error=save-failed`);
  redirect(`/admin/courses/${slug}/edit?saved=1`);
}

export async function deleteCourseAction(formData: FormData) {
  await requireAdmin();

  const courseId = String(formData.get("courseId") ?? "");
  if (!courseId) redirect("/admin?error=invalid");

  // lessons delete automatically (on delete cascade)
  await supabaseAdmin!.from("courses").delete().eq("id", courseId);

  refreshUserPages();
  redirect("/admin?deleted=1");
}


/* --------------------------------- lessons -------------------------------- */

export async function createLessonAction(formData: FormData) {
  await requireAdmin();

  const courseId = String(formData.get("courseId") ?? "");
  const courseSlug = String(formData.get("courseSlug") ?? "");
  const title = String(formData.get("title") ?? "").trim();
  const meetUrl = String(formData.get("meetUrl") ?? "").trim();

  if (!courseId || !courseSlug || !title) {
    redirect(`/admin/courses/${courseSlug}/edit?error=lesson-invalid`);
  }

  const { data: maxRow } = await supabaseAdmin!
    .from("lessons")
    .select("sequence")
    .eq("course_id", courseId)
    .order("sequence", { ascending: false })
    .limit(1)
    .maybeSingle();

  const { error } = await supabaseAdmin!.from("lessons").insert({
    course_id: courseId,
    sequence: (maxRow?.sequence ?? 0) + 1,
    title,
    description: String(formData.get("description") ?? "").trim(),
    meet_url: meetUrl,
    duration: String(formData.get("duration") ?? "Live").trim(),
  });

  refreshUserPages();
  if (error) redirect(`/admin/courses/${courseSlug}/edit?error=lesson-failed`);
  redirect(`/admin/courses/${courseSlug}/edit?added=1`);
}

export async function updateLessonAction(formData: FormData) {
  await requireAdmin();

  const lessonId = String(formData.get("lessonId") ?? "");
  const courseSlug = String(formData.get("courseSlug") ?? "");
  const title = String(formData.get("title") ?? "").trim();
  const meetUrl = String(formData.get("meetUrl") ?? "").trim();

  if (!lessonId || !title) {
    redirect(`/admin/courses/${courseSlug}/edit?error=lesson-invalid`);
  }

  const { error } = await supabaseAdmin!
    .from("lessons")
    .update({
      title,
      description: String(formData.get("description") ?? "").trim(),
      meet_url: meetUrl,
      duration: String(formData.get("duration") ?? "Live").trim(),
    })
    .eq("id", lessonId);

  refreshUserPages();
  if (error) redirect(`/admin/courses/${courseSlug}/edit?error=save-failed`);
  redirect(`/admin/courses/${courseSlug}/edit?saved=1`);
}

export async function deleteLessonAction(formData: FormData) {
  await requireAdmin();

  const lessonId = String(formData.get("lessonId") ?? "");
  const courseSlug = String(formData.get("courseSlug") ?? "");

  if (lessonId) {
    await supabaseAdmin!.from("lessons").delete().eq("id", lessonId);
  }

  refreshUserPages();
  redirect(`/admin/courses/${courseSlug}/edit?deleted=1`);
}

/* --------------------------------- resources ------------------------------ */

function resourceTypeFromExtension(ext: string): string {
  const pdf = ["pdf"];
  const image = ["png", "jpg", "jpeg", "gif", "webp", "svg", "bmp"];
  const video = ["mp4", "webm", "mov", "mkv", "avi"];
  const audio = ["mp3", "wav", "ogg", "m4a", "aac", "flac"];
  if (pdf.includes(ext)) return "pdf";
  if (image.includes(ext)) return "image";
  if (video.includes(ext)) return "video";
  if (audio.includes(ext)) return "audio";
  return "file";
}

async function ensureResourceBucket() {
  const { data: buckets } = await supabaseAdmin!.storage.listBuckets();
  if (!buckets?.some((b) => b.name === RESOURCE_BUCKET)) {
    await supabaseAdmin!.storage.createBucket(RESOURCE_BUCKET, {
      public: true,
    });
  }
}

export async function createResourceAction(formData: FormData) {
  await requireAdmin();

  const lessonId = String(formData.get("lessonId") ?? "");
  const courseSlug = String(formData.get("courseSlug") ?? "");
  const title = String(formData.get("title") ?? "").trim();
  const file = formData.get("file") as File | null;

  if (!lessonId || !courseSlug || !title || !file || file.size === 0) {
    redirect(`/admin/courses/${courseSlug}/edit?error=resource-invalid`);
  }

  await ensureResourceBucket();

  const ext = (file.name.split(".").pop() ?? "file").toLowerCase();
  const path = `${lessonId}/${crypto.randomUUID()}.${ext}`;

  const { error: upErr } = await supabaseAdmin!.storage
    .from(RESOURCE_BUCKET)
    .upload(path, file, { contentType: file.type || undefined, upsert: false });
  if (upErr) redirect(`/admin/courses/${courseSlug}/edit?error=upload-failed`);

  const { data: maxRow } = await supabaseAdmin!
    .from("resources")
    .select("sequence")
    .eq("lesson_id", lessonId)
    .order("sequence", { ascending: false })
    .limit(1)
    .maybeSingle();

  const { error: insErr } = await supabaseAdmin!.from("resources").insert({
    lesson_id: lessonId,
    sequence: (maxRow?.sequence ?? 0) + 1,
    title,
    type: resourceTypeFromExtension(ext),
    file_path: path,
    likes: 0,
  });

  refreshUserPages();
  if (insErr) redirect(`/admin/courses/${courseSlug}/edit?error=resource-failed`);
  redirect(`/admin/courses/${courseSlug}/edit?resource=1`);
}

export async function deleteResourceAction(formData: FormData) {
  await requireAdmin();

  const resourceId = String(formData.get("resourceId") ?? "");
  const courseSlug = String(formData.get("courseSlug") ?? "");

  if (resourceId) {
    const { data } = await supabaseAdmin!
      .from("resources")
      .select("file_path")
      .eq("id", resourceId)
      .maybeSingle();

    await supabaseAdmin!.from("resources").delete().eq("id", resourceId);

    if (data?.file_path) {
      await supabaseAdmin!.storage
        .from(RESOURCE_BUCKET)
        .remove([data.file_path]);
    }
  }

  refreshUserPages();
  redirect(`/admin/courses/${courseSlug}/edit?deleted=1`);
}
