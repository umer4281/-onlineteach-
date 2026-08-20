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
      className="group relative flex flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition hover:-translate-y-1.5 hover:shadow-xl"
    >
      <div className="relative aspect-video w-full overflow-hidden bg-gray-100">
        <Image
          src={course.thumbnail}
          alt={course.title}
          fill
          className="object-cover transition duration-500 group-hover:scale-110"
          sizes="(max-width: 768px) 100vw, 33vw"
        />
        <span className="absolute left-3 top-3 rounded-full bg-white/90 px-2.5 py-1 text-xs font-bold text-brand-700 shadow-sm backdrop-blur">
          {course.category}
        </span>
        <div className="absolute inset-0 bg-gradient-to-t from-brand-900/20 to-transparent opacity-0 transition group-hover:opacity-100" />
        <span className="absolute bottom-3 right-3 inline-flex items-center gap-1.5 rounded-full bg-white/90 px-3 py-1.5 text-xs font-semibold text-brand-700 opacity-0 translate-y-2 shadow-sm backdrop-blur transition group-hover:opacity-100 group-hover:translate-y-0">
          Open course →
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
            🎥 {pluralize(course.lessons.length, "live class")} ·📎{" "}
            {pluralize(resourceCount, "resource")}
          </span>
          <span className="font-semibold text-brand-600">Learn more →</span>
        </div>
      </div>
    </Link>
  );
}
