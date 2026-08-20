import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About",
  description: "Learn about the teacher behind Smart Learning.",
};

const values = [
  {
    emoji: "🎓",
    title: "Education for all",
    text: "Quality learning shouldn't be locked behind a paywall.",
  },
  {
    emoji: "⏱️",
    title: "Learn at your pace",
    text: "Revisit lessons whenever you need — no deadlines, no pressure.",
  },
  {
    emoji: "💬",
    title: "Real, live teaching",
    text: "Every course is taught by an instructor you can actually interact with.",
  },
];

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-14 sm:px-6">
      <span className="inline-flex items-center rounded-full border border-brand-200 bg-brand-50 px-4 py-1.5 text-sm font-medium text-brand-700">
        🧑‍🏫 About us
      </span>
      <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-gray-900 sm:text-5xl">
        About <span className="text-hero-gradient">Smart Learning</span>
      </h1>
      <p className="mt-3 max-w-2xl text-lg text-gray-500">
        A free online teaching platform with one goal — make quality education
        accessible to everyone, everywhere.
      </p>

      <div className="mt-10 flex items-center gap-5 rounded-3xl border border-brand-100 bg-white p-6 shadow-sm">
        <span className="flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-500 to-violet-500 text-3xl font-bold text-white">
          YN
        </span>
        <div>
          <p className="text-xl font-bold text-gray-900">Your Name</p>
          <p className="text-sm text-gray-500">Founder &amp; Lead Instructor</p>
          <p className="mt-1 text-sm text-gray-400">
            Teaching the subjects you love with live classes and notes you can keep.
          </p>
        </div>
      </div>

      <div className="mt-10 space-y-5 text-lg leading-relaxed text-gray-600">
        <p>
          Welcome! Smart Learning is a free online teaching platform built with
          one simple goal: make quality education accessible to everyone.
        </p>
        <p>
          Every course is taught through short, focused video lessons that you
          can watch at your own pace — no deadlines, no expensive subscriptions,
          no sign-up required.
        </p>
        <p>
          Replace this text with your own story: who you are, what you teach,
          and why you love sharing your knowledge.
        </p>
      </div>

      <div className="mt-10 grid gap-6 sm:grid-cols-3">
        {values.map((v) => (
          <div key={v.title} className="rounded-2xl border border-gray-100 bg-brand-50 p-6">
            <div className="text-3xl">{v.emoji}</div>
            <h3 className="mt-3 font-bold text-gray-900">{v.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-gray-600">{v.text}</p>
          </div>
        ))}
      </div>

      <div className="mt-12 flex justify-center">
        <Link
          href="/courses"
          className="rounded-xl bg-gradient-to-r from-brand-600 to-violet-500 px-8 py-3.5 font-semibold text-white shadow-lg shadow-brand-600/20 transition hover:brightness-110"
        >
          Start Learning Free
        </Link>
      </div>
    </div>
  );
}