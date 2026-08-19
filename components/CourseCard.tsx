import Link from "next/link";
import Image from "next/image";
import type { Course } from "@/lib/types";
import { pluralize } from "@/lib/courses";

export default function CourseCard({ course }: { course: Course }) {
  const resourceCount = course.lessons.reduce(
    (s, l) => s + l.resources.length,
    0
  );

  return (
    <Link
      href={`/courses/${course.slug}`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition hover:-translate-y-1 hover:border-brand-200 hover:shadow-lg"
    >
      <div className="relative aspect-video w-full overflow-hidden bg-gray-100">
        <Image
          src={course.thumbnail}
          alt={course.title}
          fill
          className="object-cover transition duration-300 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, 33vw"
        />
        <span className="absolute left-3 top-3 rounded-full bg-white/90 px-2.5 py-1 text-xs font-semibold text-brand-700 shadow-sm backdrop-blur">
          {course.category}
        </span>
      </div>
      <div className="flex flex-1 flex-col p-5">
        <h3 className="text-lg font-bold text-gray-900 group-hover:text-brand-600">
          {course.title}
        </h3>
        <p className="mt-1 line-clamp-2 flex-1 text-sm text-gray-500">
          {course.tagline}
        </p>
        <div className="mt-4 flex items-center justify-between border-t border-gray-100 pt-4 text-xs text-gray-400">
          <span>
            {pluralize(course.lessons.length, "live class")} ·{" "}
            {pluralize(resourceCount, "resource")}
          </span>
          <span className="font-semibold text-brand-600">Learn more →</span>
        </div>
      </div>
    </Link>
  );
}
