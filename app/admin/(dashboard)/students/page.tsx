import Link from "next/link";
import type { Metadata } from "next";
import ConfirmButton from "@/components/ConfirmButton";
import { getStudents } from "@/lib/students";
import { isSupabaseConfigured, supabaseAdmin } from "@/lib/supabase";
import {
  createStudentAction,
  deleteStudentAction,
  recordAttendanceAction,
} from "@/app/admin/actions";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Students",
  description: "Register students and mark attendance.",
};

type PageProps = { searchParams: Promise<Record<string, string | undefined>> };

const inputCls =
  "mt-1 w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-brand-600 focus:ring-2 focus:ring-brand-200";

const notices: Record<string, { tone: "ok" | "err"; text: string }> = {
  created: { tone: "ok", text: "Student registered. They can now log in at /student/login with their roll number." },
  deleted: { tone: "ok", text: "Student removed." },
  saved: { tone: "ok", text: "Attendance saved." },
  required: { tone: "err", text: "Roll number, name & password are required." },
  short: { tone: "err", text: "Password must be at least 6 characters." },
  mismatch: { tone: "err", text: "The two passwords don't match." },
  exists: { tone: "err", text: "A student with this roll number already exists." },
  failed: { tone: "err", text: "Something went wrong. Please retry." },
  invalid: { tone: "err", text: "No student selected to remove." },
  attendance: { tone: "err", text: "Couldn't read the attendance form." },
  "attendance-save": { tone: "err", text: "Couldn't save attendance. Please retry." },
};

export default async function AdminStudentsPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const students = await getStudents();

  // Today's (or chosen) attendance so the marking grid can pre-select.
  const date = params.date || new Date().toISOString().slice(0, 10);
  let todayStatus: Record<string, string> = {};
  if (isSupabaseConfigured && supabaseAdmin) {
    const { data } = await supabaseAdmin
      .from("attendance")
      .select("student_id,status")
      .eq("date", date);
    for (const row of data ?? []) todayStatus[row.student_id] = row.status;
  }

  const notice =
    params.error || (params.created && "created") || (params.deleted && "deleted") || (params.saved && "saved");
  const noticeMeta = notice ? notices[notice] : null;

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">
            Students
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Register students, then mark daily attendance. Each student gets their
            own page to view it.
          </p>
        </div>
        <Link
          href="/admin/admins"
          className="text-sm font-semibold text-brand-600 hover:text-brand-700"
        >
          Manage admins →
        </Link>
      </div>
{noticeMeta && (
        <div
          className={`mt-6 rounded-xl px-4 py-3 text-sm font-medium ${
            noticeMeta.tone === "ok"
              ? "bg-green-50 text-green-700"
              : "bg-red-50 text-red-600"
          }`}
        >
          {noticeMeta.text}
        </div>
      )}

      <section className="mt-8 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
        <div className="border-b border-gray-100 px-6 py-4">
          <h2 className="font-bold text-gray-900">Register a student</h2>
          <p className="mt-1 text-xs text-gray-400">
            Add a new student here — they can then log in and open their page.
          </p>
        </div>
        <form action={createStudentAction} className="grid gap-4 p-6 sm:grid-cols-2 lg:grid-cols-3">
          <div>
            <label htmlFor="rollNo" className="block text-sm font-medium text-gray-700">
              Roll number
            </label>
            <input id="rollNo" name="rollNo" type="text" required className={inputCls} placeholder="e.g. M-101" />
          </div>
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Full name
            </label>
            <input id="name" name="name" type="text" required className={inputCls} placeholder="e.g. Ahmad Khan" />
          </div>
          <div>
            <label htmlFor="class" className="block text-sm font-medium text-gray-700">
              Class
            </label>
            <input id="class" name="class" type="text" className={inputCls} placeholder="e.g. Class 4" />
          </div>
          <div>
            <label htmlFor="guardianName" className="block text-sm font-medium text-gray-700">
              Guardian name
            </label>
            <input id="guardianName" name="guardianName" type="text" className={inputCls} placeholder="e.g. Mr. Khan" />
          </div>
          <div>
            <label htmlFor="guardianPhone" className="block text-sm font-medium text-gray-700">
              Guardian phone
            </label>
            <input id="guardianPhone" name="guardianPhone" type="text" className={inputCls} placeholder="e.g. 03xx-xxxxxxx" />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input id="password" name="password" type="password" required minLength={6} className={inputCls} placeholder="At least 6 characters" />
          </div>
          <div>
            <label htmlFor="confirm" className="block text-sm font-medium text-gray-700">
              Confirm password
            </label>
            <input id="confirm" name="confirm" type="password" required className={inputCls} placeholder="Repeat password" />
          </div>
          <div className="sm:col-span-2 lg:col-span-1">
            <button
              type="submit"
              className="rounded-xl bg-brand-600 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-brand-700"
            >
              + Register student
            </button>
          </div>
        </form>
      </section>
<div className="mt-8 grid gap-6 lg:grid-cols-2">
        <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
          <div className="border-b border-gray-100 px-6 py-4">
            <h2 className="font-bold text-gray-900">Mark daily attendance</h2>
            <p className="mt-1 text-xs text-gray-400">
              Pick a date, set each student&apos;s status, then save. Re-saving
              updates the same day.
            </p>
          </div>
          <form action={recordAttendanceAction}>
            <div className="p-5">
              <label htmlFor="date" className="block text-sm font-medium text-gray-700">
                Date
              </label>
              <input
                id="date"
                name="date"
                type="date"
                required
                defaultValue={date}
                className={inputCls}
              />
            </div>
            {students.length === 0 ? (
              <p className="px-6 py-8 text-center text-sm text-gray-400">
                Register at least one student above to start marking attendance.
              </p>
            ) : (
              <ul className="divide-y divide-gray-100">
                {students.map((s) => (
                  <li key={s.id} className="flex items-center justify-between gap-4 px-5 py-3">
                    <input type="hidden" name="studentId" value={s.id} />
                    <span className="min-w-0">
                      <span className="block truncate font-semibold text-gray-900">
                        {s.name}
                      </span>
                      <span className="block text-xs text-gray-400">
                        {s.roll_no} · {s.class || "No class"}
                      </span>
                    </span>
                    <select
                      name="status"
                      defaultValue={todayStatus[s.id] || "present"}
                      className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:border-brand-600"
                    >
                      <option value="present">Present</option>
                      <option value="late">Late</option>
                      <option value="absent">Absent</option>
                    </select>
                  </li>
                ))}
              </ul>
            )}
            {students.length > 0 && (
              <div className="px-6 py-4">
                <button
                  type="submit"
                  className="rounded-xl bg-brand-600 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-brand-700"
                >
                  Save attendance
                </button>
              </div>
            )}
          </form>
        </section>

        <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
          <div className="border-b border-gray-100 px-6 py-4">
            <h2 className="font-bold text-gray-900">
              Registered students ({students.length})
            </h2>
          </div>
          {students.length === 0 ? (
            <p className="px-6 py-10 text-center text-sm text-gray-400">
              No students yet. Register them with the form on the left.
            </p>
          ) : (
            <ul className="divide-y divide-gray-100">
              {students.map((s) => (
                <li key={s.id} className="flex items-center justify-between gap-4 px-6 py-4">
                  <div className="min-w-0">
                    <p className="font-semibold text-gray-900">{s.name}</p>
                    <p className="mt-0.5 text-xs text-gray-400">
                      {s.roll_no} · {s.class || "No class"} · guardian{" "}
                      {s.guardian_name || "—"}
                    </p>
                  </div>
                  <form action={deleteStudentAction}>
                    <input type="hidden" name="studentId" value={s.id} />
                    <ConfirmButton>Remove</ConfirmButton>
                  </form>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>

      <div className="mt-6">
        <Link href="/admin" className="text-sm font-semibold text-brand-600 hover:text-brand-700">
          ← Back to dashboard
        </Link>
      </div>
    </div>
  );
}