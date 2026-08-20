import type { Metadata } from "next";
import { redirect, notFound } from "next/navigation";
import { getStudentSessionUser } from "@/lib/auth";
import { getStudentWithAttendance } from "@/lib/students";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "My Page",
  description: "Your madrasah attendance and profile.",
};

const statusMeta: Record<string, { label: string; cls: string; dot: string }> = {
  present: { label: "Present", cls: "bg-emerald-50 text-emerald-700", dot: "bg-emerald-500" },
  absent: { label: "Absent", cls: "bg-red-50 text-red-600", dot: "bg-red-500" },
  late: { label: "Late", cls: "bg-amber-50 text-amber-700", dot: "bg-amber-500" },
};

export default async function StudentHomePage() {
  const me = await getStudentSessionUser();
  if (!me?.uid) redirect("/student/login");

  const data = await getStudentWithAttendance(me.uid);
  if (!data) notFound();
  const { student, attendance } = data;

  const present = attendance.filter((a) => a.status === "present").length;
  const late = attendance.filter((a) => a.status === "late").length;
  const absent = attendance.filter((a) => a.status === "absent").length;
  const days = attendance.length;

  const stats = [
    { label: "Days on record", value: days, color: "text-gray-900" },
    { label: "Present", value: present, color: "text-emerald-600" },
    { label: "Late", value: late, color: "text-amber-600" },
    { label: "Absent", value: absent, color: "text-red-600" },
  ];

  return (
    <div>
      <div className="rounded-3xl overflow-hidden bg-gradient-to-br from-brand-600 via-violet-600 to-indigo-600 p-8 text-white shadow-xl shadow-brand-600/30">
        <div className="flex items-center gap-5">
          <span className="flex h-20 w-20 items-center justify-center rounded-2xl bg-white/15 text-3xl font-extrabold ring-1 ring-white/30">
            {initial(student.name)}
          </span>
          <div>
            <p className="text-xl font-extrabold">{student.name}</p>
            <p className="mt-0.5 text-brand-100">
              Roll {student.roll_no} · Class {student.class || "—"}
            </p>
          </div>
        </div>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <div
            key={s.label}
            className="rounded-2xl border border-brand-100 bg-white p-5 shadow-sm"
          >
            <p className={`text-3xl font-extrabold ${s.color}`}>{s.value}</p>
            <p className="mt-1 text-sm font-medium text-gray-500">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="mt-8 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
        <div className="border-b border-gray-100 px-6 py-4">
          <h2 className="font-bold text-gray-900">My attendance</h2>
          <p className="mt-1 text-xs text-gray-400">
            Daily attendance recorded by the madrasah.
          </p>
        </div>
        {attendance.length === 0 ? (
          <p className="px-6 py-10 text-center text-sm text-gray-400">
            No attendance recorded yet. Your teacher will add it each day.
          </p>
        ) : (
          <ul className="divide-y divide-gray-100">
            {attendance.map((a) => {
              const meta = statusMeta[a.status] ?? statusMeta.present;
              return (
                <li key={a.id} className="flex items-center justify-between px-6 py-3.5">
                  <span className="flex items-center gap-3">
                    <span className={`h-2.5 w-2.5 rounded-full ${meta.dot}`} />
                    <span className="font-medium text-gray-800">
                      {formatDate(a.date)}
                    </span>
                  </span>
                  <span
                    className={`inline-block rounded-full px-3 py-1 text-xs font-semibold ${meta.cls}`}
                  >
                    {meta.label}
                  </span>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      <p className="mt-6 text-center text-sm text-gray-400">
        Need help? Ask your teacher to update your details or reset your password.
      </p>
    </div>
  );
}

function initial(name: string): string {
  return (name.trim().charAt(0) || "S").toUpperCase();
}

function formatDate(date: string): string {
  const d = new Date(date + "T00:00:00");
  return d.toLocaleDateString(undefined, {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}