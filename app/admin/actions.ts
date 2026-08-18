"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { verifyAdminCredentials } from "@/lib/session";
import { setAdminSession, clearAdminSession, isAdmin } from "@/lib/auth";
import { supabaseAdmin, isSupabaseConfigured } from "@/lib/supabase";

/* ---------------------------------- auth ---------------------------------- */

export async function loginAction(formData: FormData) {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  if (!(await verifyAdminCredentials(email, password))) {
    redirect("/admin/login?error=1");
  }

  await setAdminSession();
  redirect("/admin");
}

export async function logoutAction() {
  await clearAdminSession();
  redirect("/admin/login?loggedOut=1");
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
      String(formData.get("thumbnail") ?? "").trim() || "/images/course.svg",
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
        String(formData.get("thumbnail") ?? "").trim() || "/images/course.svg",
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
  const youtubeId = String(formData.get("youtubeId") ?? "").trim();

  if (!courseId || !courseSlug || !title || !youtubeId) {
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
    youtube_id: youtubeId,
    duration: String(formData.get("duration") ?? "10:00").trim(),
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
  const youtubeId = String(formData.get("youtubeId") ?? "").trim();

  if (!lessonId || !title || !youtubeId) {
    redirect(`/admin/courses/${courseSlug}/edit?error=lesson-invalid`);
  }

  const { error } = await supabaseAdmin!
    .from("lessons")
    .update({
      title,
      description: String(formData.get("description") ?? "").trim(),
      youtube_id: youtubeId,
      duration: String(formData.get("duration") ?? "10:00").trim(),
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
