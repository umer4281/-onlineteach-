import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import type { Resource } from "@/lib/types";
import { getCourseByLesson } from "@/lib/courses";
import { resourceFileUrl } from "@/lib/supabase";
import LessonList from "@/components/LessonList";
import LikeButton from "@/components/LikeButton";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ slug: string; lessonId: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug, lessonId } = await params;
  const found = await getCourseByLesson(slug, lessonId);
  if (!found) return { title: "Lesson not found" };
  return { title: found.lesson.title, description: found.lesson.description };
}

export default async function LessonPage({ params }: Props) {
  const { slug, lessonId } = await params;
  const found = await getCourseByLesson(slug, lessonId);
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
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-2 text-sm font-semibold text-brand-700">
              🎥 Live class
            </div>
            <h1 className="mt-3 text-2xl font-bold text-gray-900 sm:text-3xl">
              {lesson.title}
            </h1>
            <p className="mt-2 text-gray-600">{lesson.description}</p>

            {lesson.meetUrl ? (
              <a
                href={lesson.meetUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-5 inline-flex items-center gap-2 rounded-xl bg-brand-600 px-6 py-3 text-sm font-semibold text-white hover:bg-brand-700"
              >
                ▶ Join live class
              </a>
            ) : (
              <p className="mt-5 rounded-xl bg-gray-50 px-4 py-3 text-sm text-gray-500">
                No live-class link yet — check back soon.
              </p>
            )}
            {lesson.duration && (
              <p className="mt-4 text-xs text-gray-400">⏱ {lesson.duration}</p>
            )}
          </div>

          <section className="mt-8">
            <h2 className="text-xl font-bold text-gray-900">Resources</h2>
            <p className="mt-1 text-sm text-gray-500">
              Files the teacher shared for this lesson — open them and like the
              useful ones.
            </p>
            <div className="mt-4 space-y-3">
              {lesson.resources.length === 0 && (
                <p className="rounded-2xl border border-dashed border-gray-300 bg-white p-6 text-center text-sm text-gray-500">
                  No resources for this lesson yet.
                </p>
              )}
              {lesson.resources.map((resource) => (
                <ResourceCard key={resource.id} resource={resource} />
              ))}
            </div>
          </section>

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

function resourceMeta(type: string) {
  switch (type) {
    case "pdf":
      return { emoji: "📄", label: "PDF", cls: "bg-red-50 text-red-600" };
    case "image":
      return { emoji: "🖼️", label: "Image", cls: "bg-violet-50 text-violet-600" };
    case "video":
      return { emoji: "🎬", label: "Video", cls: "bg-blue-50 text-blue-600" };
    case "audio":
      return { emoji: "🎧", label: "Audio", cls: "bg-emerald-50 text-emerald-600" };
    default:
      return { emoji: "📁", label: "File", cls: "bg-gray-100 text-gray-600" };
  }
}

function ResourceCard({ resource }: { resource: Resource }) {
  const meta = resourceMeta(resource.type);
  const href = resourceFileUrl(resource.filePath);
  return (
    <div className="flex items-center gap-4 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
      {resource.type === "image" ? (
        <div className="h-14 w-14 flex-none overflow-hidden rounded-lg bg-gray-100">
          {/* eslint-disable-next-line @next/next/no-img-element -- external storage URL (host unknown at build) */}
          <img
            src={href}
            alt={resource.title}
            className="h-full w-full object-cover"
          />
        </div>
      ) : (
        <span
          className={`flex h-12 w-12 flex-none items-center justify-center rounded-lg text-xl ${meta.cls}`}
        >
          {meta.emoji}
        </span>
      )}
      <div className="min-w-0 flex-1">
        <p className="truncate font-semibold text-gray-900">{resource.title}</p>
        <span
          className={`mt-1 inline-block rounded-full px-2 py-0.5 text-xs font-medium ${meta.cls}`}
        >
          {meta.label}
        </span>
      </div>
      <div className="flex flex-none items-center gap-2">
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-lg border border-gray-300 px-3 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50"
        >
          Open
        </a>
        <LikeButton resourceId={resource.id} initialLikes={resource.likes} />
      </div>
    </div>
  );
}