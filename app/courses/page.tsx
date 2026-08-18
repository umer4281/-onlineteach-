import type { Metadata } from "next";
import { getCourses } from "@/lib/courses";
import CourseCard from "@/components/CourseCard";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Courses",
  description: "Browse all free courses and start learning.",
};

export default async function CoursesPage() {
  const courses = await getCourses();
  return (
    <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
      <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
        All Courses
      </h1>
      <p className="mt-3 max-w-2xl text-lg text-gray-500">
        {courses.length} free courses. Watch lessons at your own pace.
      </p>
      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {courses.map((course) => (
          <CourseCard key={course.slug} course={course} />
        ))}
      </div>
    </div>
  );
}