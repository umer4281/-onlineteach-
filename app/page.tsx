import Link from "next/link";
import Image from "next/image";
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

const features = [
  {
    emoji: "🎥",
    title: "Live classes",
    text: "Join lessons over Google Meet with your teacher in real time.",
  },
  {
    emoji: "📚",
    title: "Structured courses",
    text: "Subjects organised into bite-sized lessons you can follow at your pace.",
  },
  {
    emoji: "📎",
    title: "Free resources",
    text: "Download notes, PDFs, images, videos and audio — and like useful ones.",
  },
  {
    emoji: "🫶",
    title: "Totally free",
    text: "No sign-up and no subscriptions. Just open a course and start.",
  },
];

const subjects = [
  {
    image: "/images/quran.jpg",
    title: "Qur'an",
    text: "Learn tajweed, recitation and the meaning of the Qur'an in gentle, structured lessons.",
    cta: "Explore Qur'an",
  },
  {
    image: "/images/hadith.jpg",
    title: "Hadith",
    text: "Study the sayings of the Prophet ﷺ — their meaning, context and daily application.",
    cta: "Explore Hadith",
  },
  {
    image: "/images/fiqh.jpg",
    title: "Fiqh",
    text: "Practical rulings of worship and daily life, taught clearly for every level.",
    cta: "Explore Fiqh",
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
      <section className="relative isolate overflow-hidden bg-gradient-to-b from-brand-50 via-white to-white">
        <HeroDecor />
        <div className="mx-auto max-w-6xl px-4 py-20 text-center sm:px-6 sm:py-24">
          <span className="animate-fade-up inline-flex items-center gap-2 rounded-full border border-brand-200 bg-white/70 px-4 py-1.5 text-sm font-medium text-brand-700 shadow-sm backdrop-blur">
            <Image
              src="/images/smart-logo.jpg"
              alt="Smart Learning logo"
              width={22}
              height={22}
              className="h-5 w-5 rounded-full object-cover"
            />
            Smart Learning — free online teaching
          </span>
          <h1 className="animate-fade-up mx-auto mt-6 max-w-3xl text-5xl font-extrabold tracking-tight sm:text-6xl">
            Learn anything,{" "}
            <span className="text-hero-gradient">anywhere.</span>
          </h1>
          <p className="animate-fade-up mx-auto mt-6 max-w-2xl text-lg text-gray-500 sm:text-xl">
            Live classes over Google Meet plus downloadable resources and notes
            — completely free, at your own pace.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              href="/courses"
              className="rounded-xl bg-gradient-to-r from-brand-600 to-violet-500 px-8 py-3.5 text-base font-semibold text-white shadow-lg shadow-brand-600/20 transition hover:brightness-110"
            >
              Browse Courses
            </Link>
            <Link
              href="/about"
              className="rounded-xl border border-gray-300 bg-white/80 px-8 py-3.5 text-base font-semibold text-gray-700 backdrop-blur transition hover:bg-gray-50"
            >
              Meet Your Teacher
            </Link>
          </div>

          <div className="mx-auto mt-12 grid max-w-2xl grid-cols-3 divide-x divide-brand-100 rounded-2xl border border-brand-100 bg-white/70 py-5 shadow-md shadow-brand-600/10 backdrop-blur">
            {heroStats.map((stat) => (
              <div key={stat.label} className="px-2 text-center">
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
        <div className="flex items-end justify-between gap-4">
          <div>
            <span className="text-xs font-semibold uppercase tracking-widest text-brand-600">
              Featured
            </span>
            <h2 className="mt-2 text-2xl font-bold text-gray-900 sm:text-3xl">
              Popular courses
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
        <div className="mt-6 text-center sm:hidden">
          <Link href="/courses" className="font-semibold text-brand-600 hover:text-brand-700">
            View all courses →
          </Link>
        </div>
      </section>

      <section className="border-t border-brand-100 bg-gradient-to-br from-white via-brand-50 to-indigo-50 py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="text-center">
            <span className="text-xs font-semibold uppercase tracking-widest text-brand-600">
              Our subjects
            </span>
            <h2 className="mt-2 text-2xl font-bold text-gray-900 sm:text-3xl">
              Rooted in authentic knowledge
            </h2>
            <p className="mt-3 text-gray-500 max-w-2xl mx-auto">
              Free, live classes across the core Islamic sciences — taught with
              clarity and care for students of all ages.
            </p>
          </div>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {subjects.map((subject) => (
              <div
                key={subject.title}
                className="group relative overflow-hidden rounded-2xl border border-brand-100 bg-white shadow-sm transition hover:-translate-y-1.5 hover:shadow-2xl"
              >
                <div className="relative aspect-[4/3] w-full overflow-hidden bg-gray-100">
                  <Image
                    src={subject.image}
                    alt={subject.title}
                    fill
                    className="object-cover transition duration-500 group-hover:scale-110"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-brand-900/40 via-transparent to-transparent" />
                  <span className="absolute left-3 bottom-3 rounded-full bg-white/90 px-3 py-1.5 text-xs font-bold text-brand-700 shadow-sm backdrop-blur">
                    {subject.title}
                  </span>
                </div>
                <div className="p-5">
                  <p className="text-sm leading-relaxed text-gray-500">
                    {subject.text}
                  </p>
                  <Link
                    href="/courses"
                    className="mt-4 inline-flex items-center gap-1.5 text-sm font-bold text-brand-600 group-hover:text-brand-700"
                  >
                    {subject.cta} →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-brand-100 bg-gradient-to-br from-brand-50 to-indigo-50 py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="text-center">
            <span className="text-xs font-semibold uppercase tracking-widest text-brand-600">
              Why Smart Learning
            </span>
            <h2 className="mt-2 text-2xl font-bold text-gray-900 sm:text-3xl">
              Everything you need to learn for free
            </h2>
          </div>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((f) => (
              <div
                key={f.title}
                className="rounded-2xl border border-brand-100 bg-white/80 p-6 text-center shadow-sm backdrop-blur"
              >
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-100 to-violet-100 text-2xl">
                  {f.emoji}
                </div>
                <h3 className="mt-4 font-bold text-gray-900">{f.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-gray-500">
                  {f.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <h2 className="text-center text-2xl font-bold text-gray-900 sm:text-3xl">
          How it works
        </h2>
        <div className="mt-10 grid gap-8 sm:grid-cols-3">
          {steps.map((step, i) => (
            <div
              key={step.title}
              className="relative rounded-2xl border border-gray-100 bg-white p-6 shadow-sm"
            >
              <span className="absolute right-4 top-4 flex h-7 w-7 items-center justify-center rounded-full bg-brand-600 text-xs font-bold text-white">
                {i + 1}
              </span>
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
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-brand-600 via-violet-600 to-indigo-600 px-8 py-12 text-center text-white shadow-xl shadow-brand-600/30">
          <div className="pointer-events-none absolute -top-24 -right-24 h-64 w-64 rounded-full bg-violet-400/30 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-24 -left-24 h-64 w-64 rounded-full bg-brand-400/30 blur-3xl" />
          <span className="text-4xl">✨</span>
          <h2 className="mt-3 text-2xl font-bold sm:text-3xl">
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

function HeroDecor() {
  return (
    <>
      <div aria-hidden className="pointer-events-none absolute -top-24 -right-20 h-96 w-96 rounded-full bg-brand-500/10 blur-3xl animate-float" />
      <div aria-hidden className="pointer-events-none absolute -bottom-32 -left-20 h-96 w-96 rounded-full bg-violet-500/10 blur-3xl animate-float" />
    </>
  );
}
