import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getCourse, pluralize, initial } from "@/lib/courses";
import LessonList from "@/components/LessonList";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const course = await getCourse(slug);
  if (!course) return { title: "Course not found" };
  return { title: course.title, description: course.tagline };
}

export default async function CoursePage({ params }: Props) {
  const { slug } = await params;
  const course = await getCourse(slug);
  if (!course) notFound();

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <nav className="text-sm text-gray-400">
        <Link href="/courses" className="hover:text-brand-600">
          Courses
        </Link>
        <span className="mx-2">/</span>
        <span className="text-gray-600">{course.title}</span>
      </nav>

      <div className="mt-8 grid gap-10 lg:grid-cols-[1fr_360px]">
        <div>
          <div className="relative aspect-video w-full overflow-hidden rounded-2xl bg-gray-100">
            <Image
              src={course.thumbnail}
              alt={course.title}
              fill
              className="object-cover"
              priority
              sizes="(max-width: 1024px) 100vw, 60vw"
            />
          </div>
          <div className="mt-6">
            <div className="flex flex-wrap items-center gap-2 text-sm">
              <span className="rounded-full bg-brand-50 px-3 py-1 font-medium text-brand-700">
                {course.category}
              </span>
              <span className="rounded-full bg-gray-100 px-3 py-1 text-gray-600">
                {course.level}
              </span>
              <span className="rounded-full bg-gray-100 px-3 py-1 text-gray-600">
                {pluralize(course.lessons.length, "lesson")}
              </span>
            </div>
            <h1 className="mt-4 text-3xl font-extrabold text-gray-900 sm:text-4xl">
              {course.title}
            </h1>
            <p className="mt-3 text-lg leading-relaxed text-gray-600">
              {course.description}
            </p>
            <div className="mt-6 flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-full bg-brand-100 text-lg font-bold text-brand-700">
                {initial(course.instructor)}
              </span>
              <div>
                <p className="text-sm font-semibold text-gray-900">
                  {course.instructor}
                </p>
                <p className="text-xs text-gray-400">Course Instructor</p>
              </div>
            </div>
          </div>
        </div>

        <aside>
          <h2 className="mb-3 text-lg font-bold text-gray-900">
            Course Curriculum
          </h2>
          <LessonList course={course} />
        </aside>
      </div>
    </div>
  );
}