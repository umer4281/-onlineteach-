"use server";

import { redirect } from "next/navigation";
import { supabaseAdmin } from "@/lib/supabase";
import { verifyPassword } from "@/lib/session";
import {
  setStudentSession,
  clearStudentSession,
} from "@/lib/auth";

/** Student sign-in using their roll_no + password (set by the admin). */
export async function studentLoginAction(formData: FormData) {
  const rollNo = String(formData.get("rollNo") ?? "").trim().toUpperCase();
  const password = String(formData.get("password") ?? "");

  if (!rollNo || !password) redirect("/student/login?error=1");

  if (!supabaseAdmin) redirect("/student/login?error=setup");

  const { data, error } = await supabaseAdmin
    .from("students")
    .select("id,roll_no,name,class,password_hash")
    .eq("roll_no", rollNo)
    .maybeSingle();

  if (error || !data) redirect("/student/login?error=1");

  if (!(await verifyPassword(password, data.password_hash))) {
    redirect("/student/login?error=1");
  }

  await setStudentSession({
    uid: data.id,
    name: data.name,
    email: data.roll_no,
  });
  redirect("/student");
}

export async function studentLogoutAction() {
  await clearStudentSession();
  redirect("/student/login?loggedOut=1");
}