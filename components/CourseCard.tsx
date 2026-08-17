import Link from "next/link";
import Image from "next/image";
import type { Course } from "@/lib/types";
import { pluralize } from "@/lib/courses";

export default function CourseCard({ course }: { course: Course }) {
  return (
    <Link
      href={`/courses/${course.slug}`}
      className="group overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
    >
      <div className="relative aspect-video w-full overflow-hidden bg-gray-100">
        <Image
          src={course.thumbnail}
          alt={course.title}
          fill
          className="object-cover transition duration-300 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, 33vw"
        />
      </div>
      <div className="p-5">
        <div className="flex items-center gap-2 text-xs">
          <span className="rounded-full bg-brand-50 px-2.5 py-1 font-medium text-brand-700">
            {course.category}
          </span>
          <span className="text-gray-400">{course.level}</span>
        </div>
        <h3 className="mt-3 text-lg font-bold text-gray-900 group-hover:text-brand-600">
          {course.title}
        </h3>
        <p className="mt-1 line-clamp-2 text-sm text-gray-500">{course.tagline}</p>
        <div className="mt-4 flex items-center justify-between text-xs text-gray-400">
          <span>{pluralize(course.lessons.length, "lesson")}</span>
          <span>{course.instructor}</span>
        </div>
      </div>
    </Link>
  );
}
