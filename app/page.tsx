import Link from "next/link";
import { getCourses } from "@/lib/courses";
import CourseCard from "@/components/CourseCard";

export const dynamic = "force-dynamic";

const steps = [
  {
    emoji: "📚",
    title: "Pick a course",
    text: "Choose a subject that interests you from our free catalogue.",
  },
  {
    emoji: "🎬",
    title: "Watch short lessons",
    text: "Learn with clear, focused video lessons you can watch anytime.",
  },
  {
    emoji: "🚀",
    title: "Learn at your pace",
    text: "Pause, rewatch and go back whenever you need. No deadlines.",
  },
];

export default async function Home() {
  const courses = await getCourses();
  const featured = courses.slice(0, 3);

  return (
    <>
      <section className="bg-gradient-to-b from-brand-50 via-white to-white">
        <div className="mx-auto max-w-6xl px-4 py-20 text-center sm:px-6 sm:py-28">
          <span className="inline-flex items-center rounded-full border border-brand-200 bg-white px-4 py-1.5 text-sm font-medium text-brand-700">
            🎓 Free online courses
          </span>
          <h1 className="mx-auto mt-6 max-w-3xl text-4xl font-extrabold tracking-tight sm:text-6xl">
            Learn anything,{" "}
            <span className="text-brand-600">anywhere.</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-500 sm:text-xl">
            High-quality video lessons on mathematics, programming and more —
            completely free, at your own pace.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              href="/courses"
              className="rounded-xl bg-brand-600 px-8 py-3.5 text-base font-semibold text-white shadow-sm hover:bg-brand-700"
            >
              Browse Courses
            </Link>
            <Link
              href="/about"
              className="rounded-xl border border-gray-300 bg-white px-8 py-3.5 text-base font-semibold text-gray-700 hover:bg-gray-50"
            >
              Meet Your Teacher
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <div className="flex items-end justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl">
              Featured courses
            </h2>
            <p className="mt-2 text-gray-500">
              Pick a subject and start learning today.
            </p>
          </div>
          <Link
            href="/courses"
            className="hidden text-sm font-semibold text-brand-600 hover:text-brand-700 sm:block"
          >
            View all →
          </Link>
        </div>
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((course) => (
            <CourseCard key={course.slug} course={course} />
          ))}
        </div>
      </section>

      <section className="border-t border-gray-100 bg-gray-50">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
          <h2 className="text-center text-2xl font-bold text-gray-900 sm:text-3xl">
            How it works
          </h2>
          <div className="mt-10 grid gap-8 sm:grid-cols-3">
            {steps.map((step) => (
              <div
                key={step.title}
                className="rounded-2xl border border-gray-100 bg-white p-6 text-center shadow-sm"
              >
                <div className="text-4xl">{step.emoji}</div>
                <h3 className="mt-4 text-lg font-bold text-gray-900">
                  {step.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-gray-500">
                  {step.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <div className="rounded-3xl bg-brand-600 px-8 py-12 text-center text-white">
          <h2 className="text-2xl font-bold sm:text-3xl">
            Ready to start learning?
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-brand-100">
            It&apos;s free and there&apos;s no sign-up required.
          </p>
          <Link
            href="/courses"
            className="mt-6 inline-block rounded-xl bg-white px-8 py-3.5 font-semibold text-brand-700 hover:bg-brand-50"
          >
            Start Learning Free
          </Link>
        </div>
      </section>
    </>
  );
}
