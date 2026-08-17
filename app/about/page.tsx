import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About",
  description: "Learn about the teacher behind LearnHub.",
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
      <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
        About LearnHub
      </h1>
      <div className="mt-8 flex items-center gap-4">
        <span className="flex h-16 w-16 items-center justify-center rounded-full bg-brand-100 text-2xl font-bold text-brand-700">
          YN
        </span>
        <div>
          <p className="text-lg font-bold text-gray-900">Your Name</p>
          <p className="text-sm text-gray-500">Founder &amp; Lead Instructor</p>
        </div>
      </div>
      <div className="mt-8 space-y-5 text-lg leading-relaxed text-gray-600">
        <p>
          Welcome! LearnHub is a free online teaching platform built with one
          simple goal: make quality education accessible to everyone.
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
      <Link
        href="/courses"
        className="mt-8 inline-block rounded-xl bg-brand-600 px-6 py-3 font-semibold text-white hover:bg-brand-700"
      >
        Start Learning
      </Link>
    </div>
  );
}