import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { courses, getCourseByLesson } from "@/lib/courses";
import VideoPlayer from "@/components/VideoPlayer";
import LessonList from "@/components/LessonList";

type Props = { params: Promise<{ slug: string; lessonId: string }> };

export function generateStaticParams() {
  return courses.flatMap((course) =>
    course.lessons.map((lesson) => ({
      slug: course.slug,
      lessonId: lesson.id,
    }))
  );
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug, lessonId } = await params;
  const found = getCourseByLesson(slug, lessonId);
  if (!found) return { title: "Lesson not found" };
  return { title: found.lesson.title, description: found.lesson.description };
}

export default async function LessonPage({ params }: Props) {
  const { slug, lessonId } = await params;
  const found = getCourseByLesson(slug, lessonId);
  if (!found) notFound();

  const { course, lesson, index } = found;
  const prev = course.lessons[index - 1];
  const next = course.lessons[index + 1];
  const lessonUrl = (id: string) => `/courses/${course.slug}/lessons/${id}`;

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <nav className="text-sm text-gray-400">
        <Link href="/courses" className="hover:text-brand-600">
          Courses
        </Link>
        <span className="mx-2">/</span>
        <Link
          href={`/courses/${course.slug}`}
          className="hover:text-brand-600"
        >
          {course.title}
        </Link>
        <span className="mx-2">/</span>
        <span className="text-gray-600">{lesson.title}</span>
      </nav>

      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_340px]">
        <div>
          <VideoPlayer youtubeId={lesson.youtubeId} />
          <h1 className="mt-6 text-2xl font-bold text-gray-900 sm:text-3xl">
            {lesson.title}
          </h1>
          <p className="mt-3 text-lg text-gray-600">{lesson.description}</p>

          <div className="mt-8 flex items-center justify-between gap-4 border-t border-gray-100 pt-6">
            {prev ? (
              <Link
                href={lessonUrl(prev.id)}
                className="flex items-center gap-2 rounded-xl border border-gray-300 px-5 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50"
              >
                <span aria-hidden>←</span>
                <span className="max-w-[200px] truncate">{prev.title}</span>
              </Link>
            ) : (
              <span />
            )}
            {next ? (
              <Link
                href={lessonUrl(next.id)}
                className="flex items-center gap-2 rounded-xl bg-brand-600 px-5 py-3 text-sm font-semibold text-white hover:bg-brand-700"
              >
                <span className="max-w-[200px] truncate">{next.title}</span>
                <span aria-hidden>→</span>
              </Link>
            ) : (
              <Link
                href={`/courses/${course.slug}`}
                className="rounded-xl bg-brand-600 px-5 py-3 text-sm font-semibold text-white hover:bg-brand-700"
              >
                Back to course →
              </Link>
            )}
          </div>
        </div>

        <aside>
          <h2 className="mb-3 text-lg font-bold text-gray-900">
            Course Lessons
          </h2>
          <LessonList course={course} activeLessonId={lesson.id} />
        </aside>
      </div>
    </div>
  );
}