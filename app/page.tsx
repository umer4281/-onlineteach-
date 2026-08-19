import Link from "next/link";
import { getCourses } from "@/lib/courses";
import CourseCard from "@/components/CourseCard";

export const dynamic = "force-dynamic";

const steps = [
  {
    emoji: "📚",
    title: "Pick a course",
    text: "Choose a subject that interests you from the course catalogue.",
  },
  {
    emoji: "🎥",
    title: "Join live classes",
    text: "Learn over Google Meet with the teacher, then grab the materials.",
  },
  {
    emoji: "📎",
    title: "Download resources",
    text: "Notes, PDFs, images, videos and audio — and like the ones you love.",
  },
];

export default async function Home() {
  const courses = await getCourses();
  const featured = courses.slice(0, 3);
  const totalLessons = courses.reduce((s, c) => s + c.lessons.length, 0);
  const totalResources = courses.reduce(
    (s, c) => s + c.lessons.reduce((x, l) => x + l.resources.length, 0),
    0
  );
  const heroStats = [
    { value: courses.length, label: "Courses" },
    { value: totalLessons, label: "Live classes" },
    { value: totalResources, label: "Resources" },
  ];

  return (
    <>
      <section className="bg-gradient-to-b from-brand-50 via-white to-white">
        <div className="mx-auto max-w-6xl px-4 py-20 text-center sm:px-6 sm:py-28">
          <span className="inline-flex items-center rounded-full border border-brand-200 bg-white px-4 py-1.5 text-sm font-medium text-brand-700 shadow-sm">
            🎓 Free online teaching
          </span>
          <h1 className="mx-auto mt-6 max-w-3xl text-4xl font-extrabold tracking-tight sm:text-6xl">
            Learn anything,{" "}
            <span className="bg-gradient-to-r from-brand-600 to-violet-500 bg-clip-text text-transparent">
              anywhere.
            </span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-500 sm:text-xl">
            Live classes over Google Meet plus downloadable resources and notes —
            completely free, at your own pace.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              href="/courses"
              className="rounded-xl bg-brand-600 px-8 py-3.5 text-base font-semibold text-white shadow-md transition hover:bg-brand-700"
            >
              Browse Courses
            </Link>
            <Link
              href="/about"
              className="rounded-xl border border-gray-300 bg-white px-8 py-3.5 text-base font-semibold text-gray-700 transition hover:bg-gray-50"
            >
              Meet Your Teacher
            </Link>
          </div>

          <div className="mx-auto mt-14 grid max-w-2xl grid-cols-3 divide-x divide-gray-200 rounded-2xl border border-gray-100 bg-white/70 py-5 shadow-sm backdrop-blur">
            {heroStats.map((stat) => (
              <div key={stat.label} className="px-2">
                <p className="text-2xl font-extrabold text-gray-900 sm:text-3xl">
                  {stat.value}
                </p>
                <p className="mt-0.5 text-xs font-medium text-gray-500 sm:text-sm">
                  {stat.label}
                </p>
              </div>
            ))}
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
