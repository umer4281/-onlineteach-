import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { studentLoginAction } from "@/app/student/actions";

export const metadata: Metadata = {
  title: "Student Login",
  description: "Sign in to view your attendance and profile.",
};

type SearchParams = Promise<{ error?: string; loggedOut?: string }>;

const inputCls =
  "mt-1 w-full rounded-xl border border-white/15 bg-white/10 px-4 py-2.5 text-sm text-white placeholder-gray-400 outline-none backdrop-blur focus:border-brand-400 focus:ring-2 focus:ring-brand-400/40";

export default async function StudentLoginPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const { error, loggedOut } = await searchParams;

  return (
    <div className="relative isolate min-h-screen overflow-hidden bg-gray-950">
      <DecorativeBg />
      <div className="mx-auto flex max-w-md flex-col px-4 py-16 sm:px-6">
        <Link href="/" className="mx-auto flex items-center gap-2">
          <Image
            src="/images/smart-logo.jpg"
            alt="Smart Learning logo"
            width={56}
            height={56}
            className="h-14 w-14 rounded-2xl object-cover ring-2 ring-brand-400/40"
          />
        </Link>

        <div className="mt-6 rounded-3xl border border-white/10 bg-white/5 p-8 shadow-2xl shadow-brand-900/20 backdrop-blur-xl">
          <div className="text-center">
            <h1 className="text-2xl font-extrabold text-white">Student login</h1>
            <p className="mt-1 text-sm text-brand-200">
              Enter the roll number and password your teacher gave you.
            </p>
          </div>

          {error && (
            <p className="mt-4 rounded-xl bg-rose-500/15 px-4 py-3 text-sm font-medium text-rose-200">
              Invalid roll number or password. Please try again.
            </p>
          )}
          {loggedOut && (
            <p className="mt-4 rounded-xl bg-emerald-500/15 px-4 py-3 text-sm font-medium text-emerald-200">
              You&apos;ve been signed out.
            </p>
          )}

          <form action={studentLoginAction} className="mt-6 space-y-4">
            <div>
              <label htmlFor="rollNo" className="block text-sm font-medium text-brand-100">
                Roll number
              </label>
              <input
                id="rollNo"
                name="rollNo"
                type="text"
                required
                autoComplete="username"
                className={inputCls}
                placeholder="e.g. M-101"
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-brand-100">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                autoComplete="current-password"
                className={inputCls}
                placeholder="Your password"
              />
            </div>
            <button
              type="submit"
              className="w-full rounded-xl bg-gradient-to-r from-brand-500 to-violet-500 py-3 text-sm font-bold text-white shadow-lg transition hover:brightness-110"
            >
              View my page
            </button>
          </form>
        </div>

        <div className="mt-6 text-center space-y-2 text-sm">
          <Link href="/" className="block font-medium text-brand-200 hover:text-brand-100">
            ← Back to home
          </Link>
          <Link href="/admin/login" className="block text-brand-200/70 hover:text-brand-100">
            Are you the admin? Sign in here
          </Link>
        </div>
      </div>
    </div>
  );
}

function DecorativeBg() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0">
      <div className="absolute -top-32 -right-24 h-96 w-96 rounded-full bg-brand-600/30 blur-3xl" />
      <div className="absolute -bottom-28 -left-24 h-96 w-96 rounded-full bg-violet-600/25 blur-3xl" />
      <div className="absolute left-1/2 top-1/3 h-72 w-72 rounded-full bg-brand-400/15 blur-3xl" />
    </div>
  );
}