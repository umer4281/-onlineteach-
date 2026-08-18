import Link from "next/link";
import type { Metadata } from "next";
import { getCourses, pluralize } from "@/lib/courses";
import { getAdminCredentials } from "@/lib/session";
import { isSupabaseConfigured } from "@/lib/supabase";
import ConfirmButton from "@/components/ConfirmButton";
import {
  logoutAction,
  createCourseAction,
  deleteCourseAction,
} from "@/app/admin/actions";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Admin Dashboard",
  description: "Manage your teaching site dynamically.",
};

type PageProps = {
  searchParams: Promise<Record<string, string | undefined>>;
};

export default async function AdminDashboardPage({ searchParams }: PageProps) {
  const [params, creds, courses] = await Promise.all([
    searchParams,
    Promise.resolve(getAdminCredentials()),
    getCourses(),
  ]);

  const totalLessons = courses.reduce(
    (sum, course) => sum + course.lessons.length,
    0
  );

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      {!isSupabaseConfigured && (
        <div className="mb-8 rounded-2xl border border-amber-300 bg-amber-50 p-5 text-amber-800">
          <h2 className="font-bold">Supabase not connected yet</h2>
          <p className="mt-1 text-sm">
            Add{" "}
            <code className="rounded bg-white px-1 py-0.5">
              NEXT_PUBLIC_SUPABASE_URL
            </code>
            ,{" "}
            <code className="rounded bg-white px-1 py-0.5">
              NEXT_PUBLIC_SUPABASE_ANON_KEY
            </code>{" "}
            and{" "}
            <code className="rounded bg-white px-1 py-0.5">
              SUPABASE_SERVICE_ROLE_KEY
            </code>{" "}
            on Vercel, run{" "}
            <code className="rounded bg-white px-1 py-0.5">
              scripts/supabase-schema.sql
            </code>
            , then redeploy. See the README.
          </p>
        </div>
      )}

      {params.saved && (
        <div className="mb-6 rounded-xl bg-green-50 px-4 py-3 text-sm font-medium text-green-700">
          Changes saved.
        </div>
      )}
      {params.deleted && (
        <div className="mb-6 rounded-xl bg-green-50 px-4 py-3 text-sm font-medium text-green-700">
          Course deleted.
        </div>
      )}
      {(params.error === "slug-exists" || params.error === "title-required") && (
        <div className="mb-6 rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
          Could not create the course — check the title and that the slug is
          unique.
        </div>
      )}

      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Admin Dashboard
          </h1>
          <p className="mt-2 text-sm text-gray-500">
            Signed in as{" "}
            <span className="font-medium text-gray-700">{creds.email}</span>
          </p>
        </div>
        <form action={logoutAction}>
          <button
            type="submit"
            className="rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50"
          >
            Log out
          </button>
        </form>
      </div>

      <div className="mt-8 grid gap-6 sm:grid-cols-3">
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <p className="text-sm font-medium text-gray-500">Courses</p>
          <p className="mt-2 text-4xl font-extrabold text-brand-600">
            {courses.length}
          </p>
        </div>
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <p className="text-sm font-medium text-gray-500">Video lessons</p>
          <p className="mt-2 text-4xl font-extrabold text-brand-600">
            {totalLessons}
          </p>
        </div>
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <p className="text-sm font-medium text-gray-500">Categories</p>
          <p className="mt-2 text-4xl font-extrabold text-brand-600">
            {new Set(courses.map((c) => c.category)).size}
          </p>
        </div>
      </div>

      <div className="mt-10 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="text-xl font-bold text-gray-900">Add a new course</h2>
        <form
          action={createCourseAction}
          className="mt-5 grid gap-4 sm:grid-cols-2"
        >
          <Field name="title" label="Title" placeholder="e.g. Physics Essentials" required />
          <Field name="slug" label="Slug (optional — used in the URL)" placeholder="physics-essentials" />
          <Field name="category" label="Category" placeholder="Science" />
          <Field name="level" label="Level" placeholder="Beginner" />
          <Field name="instructor" label="Instructor" placeholder="Your Name" />
          <Field name="thumbnail" label="Thumbnail path/URL" placeholder="/images/course.svg" />
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
              className="rounded-xl bg-brand-600 px-6 py-3 text-sm font-semibold text-white hover:bg-brand-700"
            >
              Create course
            </button>
          </div>
        </form>
      </div>

      <div className="mt-10">
        <h2 className="text-xl font-bold text-gray-900">Your courses</h2>
        <div className="mt-4 space-y-4">
          {courses.length === 0 && (
            <p className="rounded-2xl border border-dashed border-gray-300 bg-white p-8 text-center text-gray-500">
              No courses yet. Add your first one above — it appears on the site
              instantly.
            </p>
          )}
          {courses.map((course) => (
            <div
              key={course.id}
              className="flex items-center justify-between gap-4 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm"
            >
              <div className="min-w-0">
                <Link
                  href={`/admin/courses/${course.slug}/edit`}
                  className="font-semibold text-gray-900 hover:text-brand-600"
                >
                  {course.title}
                </Link>
                <p className="mt-0.5 text-sm text-gray-400">
                  {course.category} · {course.level} ·{" "}
                  {pluralize(course.lessons.length, "lesson")}
                </p>
              </div>
              <div className="flex flex-none gap-2">
                <Link
                  href={`/admin/courses/${course.slug}/edit`}
                  className="rounded-lg border border-gray-300 px-3 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50"
                >
                  Manage lessons
                </Link>
                <form action={deleteCourseAction}>
                  <input type="hidden" name="courseId" value={course.id} />
                  <ConfirmButton>Delete</ConfirmButton>
                </form>
              </div>
            </div>
          ))}
        </div>
      </div>

      <Link
        href="/courses"
        className="mt-10 inline-block text-sm font-semibold text-brand-600 hover:text-brand-800"
      >
        View the public site →
      </Link>
    </div>
  );
}

const inputCls =
  "mt-1 w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-brand-600 focus:ring-2 focus:ring-brand-200";

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
