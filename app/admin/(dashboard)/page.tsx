import Link from "next/link";
import type { Metadata } from "next";
import { getCourses, pluralize } from "@/lib/courses";
import { getStudents } from "@/lib/students";
import { isSupabaseConfigured, missingSupabaseEnv } from "@/lib/supabase";
import { getSessionUser } from "@/lib/auth";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Overview of your teaching site.",
};

export default async function AdminDashboardPage() {
  const courses = await getCourses();
  const students = await getStudents();
  const user = await getSessionUser();
  const firstName = (user?.name || "Admin").trim().split(" ")[0];

  const totalLessons = courses.reduce((s, c) => s + c.lessons.length, 0);
  const totalResources = courses.reduce(
    (s, c) => s + c.lessons.reduce((x, l) => x + l.resources.length, 0),
    0
  );

  const stats = [
    { label: "Students", value: students.length, icon: "🎓" },
    { label: "Courses", value: courses.length, icon: "📚" },
    { label: "Lessons", value: totalLessons, icon: "🎥" },
    { label: "Resources", value: totalResources, icon: "📎" },
  ];

  return (
    <div>
      {!isSupabaseConfigured && (
        <div className="mb-8 rounded-2xl border border-amber-300 bg-amber-50 p-5 text-amber-800">
          <h2 className="font-bold">Supabase not connected yet</h2>
          <p className="mt-1 text-sm">
            These environment variables are still missing on the deployed site:
          </p>
          <ul className="mt-2 space-y-1">
            {missingSupabaseEnv().map((name) => (
              <li key={name} className="text-sm">
                →{" "}
                <code className="rounded bg-white px-1.5 py-0.5 font-mono">
                  {name}
                </code>
              </li>
            ))}
          </ul>
          <p className="mt-3 text-sm">
            Add them in Vercel → Settings → Environment Variables, then click{" "}
            <b>Redeploy</b>. See the README.
          </p>
        </div>
      )}

      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">
            Hey{firstName ? `, ${firstName}` : ""} 👋
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Here&apos;s what&apos;s happening on your teaching site.
          </p>
        </div>
        <Link
          href="/admin/courses"
          className="rounded-xl bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-700"
        >
          + New course
        </Link>
      </div>

      <div className="mt-8 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="flex items-center gap-4 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm"
          >
            <span className="flex h-12 w-12 flex-none items-center justify-center rounded-xl bg-brand-50 text-2xl">
              {stat.icon}
            </span>
            <div>
              <p className="text-3xl font-extrabold text-gray-900">
                {stat.value}
              </p>
              <p className="text-sm font-medium text-gray-500">
                {stat.label}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-3">
        <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm lg:col-span-2">
          <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
            <h2 className="font-bold text-gray-900">Recent courses</h2>
            <Link
              href="/admin/courses"
              className="text-sm font-semibold text-brand-600 hover:text-brand-700"
            >
              Manage all →
            </Link>
          </div>
          <ul className="divide-y divide-gray-100">
            {courses.length === 0 && (
              <li className="px-6 py-10 text-center text-sm text-gray-400">
                No courses yet. Click{" "}
                <Link
                  href="/admin/courses"
                  className="font-semibold text-brand-600"
                >
                  + New course
                </Link>{" "}
                to create your first one.
              </li>
            )}
            {courses.slice(0, 6).map((course) => (
              <li key={course.id}>
                <Link
                  href={`/admin/courses/${course.slug}/edit`}
                  className="flex items-center justify-between gap-4 px-6 py-4 transition hover:bg-gray-50"
                >
                  <span className="min-w-0">
                    <span className="block truncate font-semibold text-gray-900">
                      {course.title}
                    </span>
                    <span className="block text-xs text-gray-400">
                      {course.category} ·{" "}
                      {pluralize(course.lessons.length, "lesson")}
                    </span>
                  </span>
                  <span className="text-sm font-semibold text-brand-600">
                    Manage →
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white shadow-sm">
          <div className="border-b border-gray-100 px-6 py-4">
            <h2 className="font-bold text-gray-900">Quick actions</h2>
          </div>
          <div className="space-y-2 p-4">
            <Link
              href="/admin/students"
              className="flex items-center gap-3 rounded-xl bg-brand-50 px-4 py-3 text-sm font-semibold text-brand-700 transition hover:bg-brand-100"
            >
              <span aria-hidden>🎓</span> Register students & mark attendance
            </Link>
            <Link
              href="/admin/courses"
              className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-gray-600 transition hover:bg-gray-50"
            >
              <span aria-hidden>➕</span> Add a new course
            </Link>
            <Link
              href="/admin/admins"
              className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-gray-600 transition hover:bg-gray-50"
            >
              <span aria-hidden>👥</span> Manage admin accounts
            </Link>
            <Link
              href="/"
              className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-gray-600 transition hover:bg-gray-50"
            >
              <span aria-hidden>🌐</span> View the website
            </Link>
            <Link
              href="/admin/login?loggedOut=1"
              className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-red-600 transition hover:bg-red-50"
            >
              <span aria-hidden>🚪</span> Log out
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}