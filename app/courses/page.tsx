import Link from "next/link";
import type { Metadata } from "next";
import { getCourses, pluralize } from "@/lib/courses";
import CourseCard from "@/components/CourseCard";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Courses",
  description: "Browse all free courses and start learning.",
};

export default async function CoursesPage() {
  const courses = await getCourses();

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <section className="relative isolate overflow-hidden rounded-3xl bg-gradient-to-br from-brand-600 via-violet-600 to-indigo-600 px-8 py-12 text-white shadow-xl shadow-brand-600/30">
        <div className="pointer-events-none absolute -top-20 -right-20 h-64 w-64 rounded-full bg-violet-400/30 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-brand-400/30 blur-3xl" />
        <span className="inline-flex items-center rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-sm font-medium backdrop-blur">
          📚 Course catalogue
        </span>
        <h1 className="mt-4 text-3xl font-extrabold tracking-tight sm:text-4xl">
          All Courses
        </h1>
        <p className="mx-auto mt-3 max-w-2xl text-brand-100">
          {courses.length} {pluralize(courses.length, "course")} with live
          classes and downloadable resources. Learn at your own pace.
        </p>
      </section>

      {courses.length === 0 ? (
        <div className="mt-10 rounded-3xl border border-dashed border-gray-300 bg-white p-12 text-center">
          <p className="text-5xl">📚</p>
          <h2 className="mt-4 text-xl font-bold text-gray-900">
            No courses yet
          </h2>
          <p className="mt-2 text-sm text-gray-500">
            New courses will appear here the moment they&apos;re published.
          </p>
        </div>
      ) : (
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {courses.map((course) => (
            <CourseCard key={course.slug} course={course} />
          ))}
        </div>
      )}

      <div className="mt-10 text-center">
        <Link
          href="/"
          className="text-sm font-semibold text-brand-600 hover:text-brand-700"
        >
          ← Back to home
        </Link>
      </div>
    </div>
  );
}