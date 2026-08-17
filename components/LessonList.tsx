import Link from "next/link";
import type { Course } from "@/lib/types";

export default function LessonList({
  course,
  activeLessonId,
}: {
  course: Course;
  activeLessonId?: string;
}) {
  return (
    <ol className="divide-y divide-gray-100 rounded-2xl border border-gray-200 bg-white">
      {course.lessons.map((lesson, i) => {
        const active = lesson.id === activeLessonId;
        return (
          <li key={lesson.id}>
            <Link
              href={`/courses/${course.slug}/lessons/${lesson.id}`}
              className={`flex items-center gap-4 px-5 py-4 transition ${
                active ? "bg-brand-50" : "hover:bg-gray-50"
              }`}
            >
              <span
                className={`flex h-8 w-8 flex-none items-center justify-center rounded-full text-xs font-bold ${
                  active ? "bg-brand-600 text-white" : "bg-gray-100 text-gray-600"
                }`}
              >
                {i + 1}
              </span>
              <div className="min-w-0 flex-1">
                <p
                  className={`truncate text-sm font-medium ${
                    active ? "text-brand-700" : "text-gray-800"
                  }`}
                >
                  {lesson.title}
                </p>
                {lesson.description && (
                  <p className="mt-0.5 truncate text-xs text-gray-400">
                    {lesson.description}
                  </p>
                )}
              </div>
              <span className="flex-none text-xs text-gray-400">
                {lesson.duration}
              </span>
            </Link>
          </li>
        );
      })}
    </ol>
  );
}
