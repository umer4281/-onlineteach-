import Link from "next/link";
import type { ReactNode } from "react";
import { notFound, redirect } from "next/navigation";
import type { Metadata } from "next";
import { getCourse } from "@/lib/courses";
import { isAdmin } from "@/lib/auth";
import ConfirmButton from "@/components/ConfirmButton";
import {
  updateCourseAction,
  createLessonAction,
  updateLessonAction,
  deleteLessonAction,
  createResourceAction,
  deleteResourceAction,
} from "@/app/admin/actions";
import { resourceFileUrl } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Edit Course",
  description: "Manage a course and its lessons.",
};

const inputCls =
  "mt-1 w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-brand-600 focus:ring-2 focus:ring-brand-200";

type Props = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<Record<string, string | undefined>>;
};

export default async function EditCoursePage({ params, searchParams }: Props) {
  if (!(await isAdmin())) redirect("/admin/login");

  const [path, status] = await Promise.all([params, searchParams]);
  const course = await getCourse(path.slug);
  if (!course) notFound();

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
      <nav className="text-sm text-gray-400">
        <Link href="/admin" className="hover:text-brand-600">
          Admin
        </Link>
        <span className="mx-2">/</span>
        <span className="text-gray-600">{course.title}</span>
      </nav>

      <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-3xl font-extrabold text-gray-900">{course.title}</h1>
        <Link
          href={`/courses/${course.slug}`}
          className="text-sm font-semibold text-brand-600 hover:text-brand-700"
        >
          View live page →
        </Link>
      </div>

      {status.saved && <Banner kind="green">Changes saved.</Banner>}
      {status.added && <Banner kind="green">Lesson added.</Banner>}
      {status.resource && <Banner kind="green">Resource uploaded.</Banner>}
      {status.deleted && <Banner kind="green">Item deleted.</Banner>}
      {status.error && (
        <Banner kind="red">
          Something went wrong — check the fields and try again.
        </Banner>
      )}

      <section className="mt-8 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-bold text-gray-900">Course details</h2>
        <form action={updateCourseAction} className="mt-4 grid gap-4 sm:grid-cols-2">
          <input type="hidden" name="courseId" value={course.id} />
          <LabeledInput label="Title" name="title" required defaultValue={course.title} />
          <LabeledInput label="Slug" name="slug" defaultValue={course.slug} />
          <LabeledInput label="Category" name="category" defaultValue={course.category} />
          <LabeledInput label="Level" name="level" defaultValue={course.level} />
          <LabeledInput label="Instructor" name="instructor" defaultValue={course.instructor} />
          <LabeledInput label="Thumbnail path/URL" name="thumbnail" defaultValue={course.thumbnail} />
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-gray-700">Tagline</label>
            <input name="tagline" defaultValue={course.tagline} className={inputCls} />
          </div>
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-gray-700">Description</label>
            <textarea name="description" rows={3} defaultValue={course.description} className={inputCls} />
          </div>
          <div className="sm:col-span-2">
            <button
              type="submit"
              className="rounded-xl bg-brand-600 px-6 py-3 text-sm font-semibold text-white hover:bg-brand-700"
            >
              Save course
            </button>
          </div>
        </form>
      </section>

      <section className="mt-8 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-bold text-gray-900">Add a lesson</h2>
        <form action={createLessonAction} className="mt-4 grid gap-4 sm:grid-cols-2">
          <input type="hidden" name="courseId" value={course.id} />
          <input type="hidden" name="courseSlug" value={course.slug} />
          <LabeledInput label="Title" name="title" required placeholder="e.g. Lesson 1: Getting started" />
          <LabeledInput label="Google Meet / live class link" name="meetUrl" placeholder="https://meet.google.com/xxx-xxxx-xxx" />
          <LabeledInput label="Schedule / duration" name="duration" placeholder="e.g. Mon 4:00 PM" />
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-gray-700">Description</label>
            <textarea name="description" rows={2} className={inputCls} />
          </div>
          <div className="sm:col-span-2">
            <button
              type="submit"
              className="rounded-xl bg-brand-600 px-6 py-3 text-sm font-semibold text-white hover:bg-brand-700"
            >
              Add lesson
            </button>
          </div>
        </form>
      </section>

      <section className="mt-8">
        <h2 className="text-lg font-bold text-gray-900">
          Lessons ({course.lessons.length})
        </h2>
        <div className="mt-4 space-y-4">
          {course.lessons.length === 0 && (
            <p className="rounded-2xl border border-dashed border-gray-300 bg-white p-8 text-center text-gray-500">
              No lessons yet. Add one above.
            </p>
          )}
          {course.lessons.map((lesson, i) => (
            <div
              key={lesson.id}
              className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm"
            >
              <p className="text-sm font-bold text-gray-900">
                {i + 1}. {lesson.title}
              </p>
              <form
                action={updateLessonAction}
                className="mt-3 grid gap-3 sm:grid-cols-2"
              >
                <input type="hidden" name="lessonId" value={lesson.id} />
                <input type="hidden" name="courseSlug" value={course.slug} />
                <LabeledInput label="Title" name="title" required defaultValue={lesson.title} />
                <LabeledInput label="Google Meet / live class link" name="meetUrl" defaultValue={lesson.meetUrl} placeholder="https://meet.google.com/xxx-xxxx-xxx" />
                <LabeledInput label="Schedule / duration" name="duration" defaultValue={lesson.duration} />
                <div className="sm:col-span-2">
                  <label className="block text-xs font-medium text-gray-500">Description</label>
                  <textarea name="description" rows={1} defaultValue={lesson.description} className={inputCls} />
                </div>
                <div className="sm:col-span-2">
                  <button
                    type="submit"
                    className="rounded-lg bg-brand-600 px-4 py-2 text-xs font-semibold text-white hover:bg-brand-700"
                  >
                    Save lesson
                  </button>
                </div>
              </form>
              <form action={deleteLessonAction} className="mt-3">
                <input type="hidden" name="lessonId" value={lesson.id} />
                <input type="hidden" name="courseSlug" value={course.slug} />
                <ConfirmButton>Delete lesson</ConfirmButton>
              </form>

              <div className="mt-5 border-t border-gray-100 pt-4">
                <p className="text-xs font-bold uppercase tracking-wide text-gray-400">
                  Resources ({lesson.resources.length})
                </p>
                <form action={createResourceAction} className="mt-3 grid gap-3 sm:grid-cols-[1fr_1fr_auto]">
                  <input type="hidden" name="lessonId" value={lesson.id} />
                  <input type="hidden" name="courseSlug" value={course.slug} />
                  <div>
                    <label className="block text-xs font-medium text-gray-500">Title</label>
                    <input name="title" required className={inputCls} placeholder="e.g. Lesson notes" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500">
                      File (PDF, image, video, audio)
                    </label>
                    <input
                      name="file"
                      type="file"
                      required
                      className="mt-1 block w-full text-sm text-gray-500 file:mr-2 file:rounded-lg file:border-0 file:bg-brand-50 file:px-3 file:py-2 file:text-xs file:font-semibold file:text-brand-700 hover:file:bg-brand-100"
                    />
                  </div>
                  <div className="flex items-end">
                    <button
                      type="submit"
                      className="rounded-lg bg-brand-600 px-4 py-2 text-xs font-semibold text-white hover:bg-brand-700"
                    >
                      Upload
                    </button>
                  </div>
                </form>

                <ul className="mt-3 space-y-2">
                  {lesson.resources.length === 0 && (
                    <li className="text-xs text-gray-400">No resources yet.</li>
                  )}
                  {lesson.resources.map((res) => (
                    <li
                      key={res.id}
                      className="flex items-center gap-3 rounded-lg bg-gray-50 px-3 py-2"
                    >
                      <span className="min-w-0 flex-1 truncate text-sm font-medium text-gray-800">
                        {res.title}
                      </span>
                      <span className="text-xs text-gray-400">♥ {res.likes}</span>
                      <a
                        href={resourceFileUrl(res.filePath)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs font-semibold text-brand-600 hover:text-brand-700"
                      >
                        Open
                      </a>
                      <form action={deleteResourceAction}>
                        <input type="hidden" name="resourceId" value={res.id} />
                        <input type="hidden" name="courseSlug" value={course.slug} />
                        <button
                          type="submit"
                          className="text-xs font-semibold text-red-500 hover:text-red-600"
                        >
                          Remove
                        </button>
                      </form>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

function LabeledInput({
  label,
  name,
  required,
  defaultValue,
  placeholder,
}: {
  label: string;
  name: string;
  required?: boolean;
  defaultValue?: string;
  placeholder?: string;
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
        defaultValue={defaultValue}
        placeholder={placeholder}
        className={inputCls}
      />
    </div>
  );
}

function Banner({
  kind,
  children,
}: {
  kind: "green" | "red";
  children: ReactNode;
}) {
  const cls =
    kind === "green" ? "bg-green-50 text-green-700" : "bg-red-50 text-red-600";
  return (
    <div className={`mb-6 rounded-xl ${cls} px-4 py-3 text-sm font-medium`}>
      {children}
    </div>
  );
}
