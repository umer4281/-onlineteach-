import Link from "next/link";
import type { Metadata } from "next";
import { courses, pluralize } from "@/lib/courses";
import { getAdminCredentials } from "@/lib/session";
import { logoutAction } from "@/app/admin/actions";

export const metadata: Metadata = {
  title: "Admin Dashboard",
  description: "Manage your teaching site.",
};

export default function AdminDashboardPage() {
  const creds = getAdminCredentials();
  const totalLessons = courses.reduce(
    (sum, course) => sum + course.lessons.length,
    0
  );

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Admin Dashboard
          </h1>
          <p className="mt-2 text-sm text-gray-500">
            Signed in as{" "}
            <span className="font-medium text-gray-700">{creds.email}</span>
          </p>
        </div>
        <form action={logoutAction}>
          <button
            type="submit"
            className="rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50"
          >
            Log out
          </button>
        </form>
      </div>

      <div className="mt-8 grid gap-6 sm:grid-cols-3">
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <p className="text-sm font-medium text-gray-500">Courses</p>
          <p className="mt-2 text-4xl font-extrabold text-brand-600">
            {courses.length}
          </p>
        </div>
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <p className="text-sm font-medium text-gray-500">Video lessons</p>
          <p className="mt-2 text-4xl font-extrabold text-brand-600">
            {totalLessons}
          </p>
        </div>
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <p className="text-sm font-medium text-gray-500">Categories</p>
          <p className="mt-2 text-4xl font-extrabold text-brand-600">
            {new Set(courses.map((c) => c.category)).size}
          </p>
        </div>
      </div>

      <div className="mt-10">
        <h2 className="text-xl font-bold text-gray-900">Your courses</h2>
        <div className="mt-4 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-gray-100 bg-gray-50 text-xs uppercase tracking-wide text-gray-500">
              <tr>
                <th className="px-5 py-3 font-semibold">Course</th>
                <th className="px-5 py-3 font-semibold">Category</th>
                <th className="px-5 py-3 font-semibold">Level</th>
                <th className="px-5 py-3 text-right font-semibold">
                  Lessons
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {courses.map((course) => (
                <tr key={course.slug}>
                  <td className="px-5 py-4">
                    <span className="font-semibold text-gray-900">
                      {course.title}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-gray-600">
                    {course.category}
                  </td>
                  <td className="px-5 py-4 text-gray-600">{course.level}</td>
                  <td className="px-5 py-4 text-right text-gray-600">
                    {pluralize(course.lessons.length, "lesson")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-10 rounded-2xl border border-brand-100 bg-brand-50 p-6">
        <h2 className="text-lg font-bold text-gray-900">How to add courses</h2>
        <p className="mt-2 text-sm leading-relaxed text-gray-600">
          All content lives in{" "}
          <code className="rounded bg-white px-1.5 py-0.5 font-mono text-xs">
            content/courses.json
          </code>
          . Edit that file, then run{" "}
          <code className="rounded bg-white px-1.5 py-0.5 font-mono text-xs">
            git push
          </code>{" "}
          and Vercel publishes the update automatically. Each course needs a
          unique <code className="rounded bg-white px-1.5 py-0.5 font-mono text-xs">slug</code>, a{" "}
          <code className="rounded bg-white px-1.5 py-0.5 font-mono text-xs">thumbnail</code> path,
          and a list of <code className="rounded bg-white px-1.5 py-0.5 font-mono text-xs">lessons</code>{" "}
          with YouTube video IDs.
        </p>
        <Link
          href="/courses"
          className="mt-4 inline-block text-sm font-semibold text-brand-700 hover:text-brand-800"
        >
          View the public site →
        </Link>
      </div>
    </div>
  );
}