import { supabaseAdmin, isSupabaseConfigured } from "./supabase";

export interface Student {
  id: string;
  roll_no: string;
  name: string;
  class: string;
  guardian_name: string;
  guardian_phone: string;
  created_at: string;
}

export interface AttendanceRecord {
  id: string;
  student_id: string;
  date: string;
  status: "present" | "absent" | "late";
}

/** All students (name, roll, class, guardian) for the admin dashboard. */
export async function getStudents(): Promise<Student[]> {
  if (!isSupabaseConfigured || !supabaseAdmin) return [];
  const { data, error } = await supabaseAdmin
    .from("students")
    .select("id,roll_no,name,class,guardian_name,guardian_phone,created_at")
    .order("roll_no", { ascending: true });
  if (error) return [];
  return (data as Student[]) ?? [];
}

/** One student by id with their full attendance history (newest first). */
export async function getStudentWithAttendance(
  id: string
): Promise<{ student: Student; attendance: AttendanceRecord[] } | null> {
  if (!isSupabaseConfigured || !supabaseAdmin) return null;
  const { data: student, error } = await supabaseAdmin
    .from("students")
    .select("id,roll_no,name,class,guardian_name,guardian_phone,created_at")
    .eq("id", id)
    .maybeSingle();
  if (error || !student) return null;

  const { data: attendance } = await supabaseAdmin
    .from("attendance")
    .select("*")
    .eq("student_id", id)
    .order("date", { ascending: false });
  return {
    student: student as Student,
    attendance: (attendance as AttendanceRecord[]) ?? [],
  };
}