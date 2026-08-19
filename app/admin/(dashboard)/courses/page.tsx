import Link from "next/link";
import type { Metadata } from "next";
import { getCourses, pluralize } from "@/lib/courses";
import ConfirmButton from "@/components/ConfirmButton";
import { createCourseAction, deleteCourseAction } from "@/app/admin/actions";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Courses",
  description: "Manage your courses.",
};

const inputCls =
  "mt-1 w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-brand-600 focus:ring-2 focus:ring-brand-200";

type PageProps = {
  searchParams: Promise<Record<string, string | undefined>>;
};

export default async function AdminCoursesPage({
  searchParams,
}: PageProps) {
  const [params, courses] = await Promise.all([
    searchParams,
    getCourses(),
  ]);

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">
            Courses
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            {courses.length} {pluralize(courses.length, "course")} · add and
            edit content anytime
          </p>
        </div>
        <Link
          href="/"
          className="text-sm font-semibold text-brand-600 hover:text-brand-700"
        >
          View website →
        </Link>
      </div>

      {params.deleted && (
        <div className="mt-6 rounded-xl bg-green-50 px-4 py-3 text-sm font-medium text-green-700">
          Course deleted.
        </div>
      )}
      {(params.error === "slug-exists" || params.error === "title-required") && (
        <div className="mt-6 rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
          Could not create the course — check the title and that the slug is
          unique.
        </div>
      )}

      <section className="mt-8 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
        <div className="border-b border-gray-100 px-6 py-4">
          <h2 className="font-bold text-gray-900">Add a new course</h2>
        </div>
        <form
          action={createCourseAction}
          className="grid gap-4 p-6 sm:grid-cols-2"
        >
          <Field name="title" label="Title" required placeholder="e.g. Physics Essentials" />
          <Field name="slug" label="Slug (optional — URL)" placeholder="physics-essentials" />
          <Field name="category" label="Category" placeholder="Science" />
          <Field name="level" label="Level" placeholder="Beginner" />
          <Field name="instructor" label="Instructor" placeholder="Your Name" />
          <Field name="thumbnail" label="Thumbnail path/URL" placeholder="/images/quran.jpg" />
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-gray-700">
              Tagline
            </label>
            <input name="tagline" className={inputCls} placeholder="A short, punchy tagline" />
          </div>
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea name="description" rows={3} className={inputCls} placeholder="What students will learn..." />
          </div>
          <div className="sm:col-span-2">
            <button
              type="submit"
              className="rounded-xl bg-brand-600 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-brand-700"
            >
              Create course
            </button>
          </div>
        </form>
      </section>

      <div className="mt-8">
        <h2 className="text-xl font-bold text-gray-900">Your courses</h2>
        <div className="mt-4 space-y-4">
          {courses.length === 0 && (
            <div className="rounded-2xl border border-dashed border-gray-300 bg-white p-10 text-center">
              <p className="text-4xl">📚</p>
              <p className="mt-3 font-semibold text-gray-700">
                No courses yet
              </p>
              <p className="mt-1 text-sm text-gray-400">
                Add your first course above — it appears on the site instantly.
              </p>
            </div>
          )}
          {courses.map((course) => {
            const resourceCount = course.lessons.reduce(
              (s, l) => s + l.resources.length,
              0
            );
            return (
              <div
                key={course.id}
                className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm"
              >
                <div className="min-w-0">
                  <Link
                    href={`/admin/courses/${course.slug}/edit`}
                    className="font-semibold text-gray-900 hover:text-brand-600"
                  >
                    {course.title}
                  </Link>
                  <p className="mt-1 text-xs text-gray-400">
                    {course.category} · {course.level} ·{" "}
                    {pluralize(course.lessons.length, "lesson")} ·{" "}
                    {pluralize(resourceCount, "resource")}
                  </p>
                </div>
                <div className="flex flex-none items-center gap-2">
                  <Link
                    href={`/admin/courses/${course.slug}/edit`}
                    className="rounded-xl border border-gray-300 px-4 py-2 text-xs font-semibold text-gray-700 transition hover:bg-gray-50"
                  >
                    Manage lessons & resources
                  </Link>
                  <form action={deleteCourseAction}>
                    <input type="hidden" name="courseId" value={course.id} />
                    <ConfirmButton>Delete</ConfirmButton>
                  </form>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function Field({
  name,
  label,
  placeholder,
  required,
}: {
  name: string;
  label: string;
  placeholder?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label htmlFor={name} className="block text-sm font-medium text-gray-700">
        {label}
      </label>
      <input
        id={name}
        name={name}
        required={required}
        placeholder={placeholder}
        className={inputCls}
      />
    </div>
  );
}