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
    <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
      <div className="mx-auto max-w-2xl text-center">
        <span className="inline-flex items-center rounded-full border border-brand-200 bg-brand-50 px-4 py-1.5 text-sm font-medium text-brand-700">
          📚 Course catalogue
        </span>
        <h1 className="mt-5 text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
          All Courses
        </h1>
        <p className="mt-3 text-lg text-gray-500">
          {courses.length} {pluralize(courses.length, "course")} with live
          classes and downloadable resources. Learn at your own pace.
        </p>
      </div>
      <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {courses.map((course) => (
          <CourseCard key={course.slug} course={course} />
        ))}
      </div>
    </div>
  );
}