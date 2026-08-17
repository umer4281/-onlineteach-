import Link from "next/link";
import type { Metadata } from "next";
import { loginAction } from "@/app/admin/actions";
import { getAdminCredentials } from "@/lib/session";

export const metadata: Metadata = {
  title: "Admin Login",
  description: "Sign in to manage your teaching site.",
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; loggedOut?: string }>;
}) {
  const { error, loggedOut } = await searchParams;
  const creds = getAdminCredentials();

  return (
    <div className="mx-auto flex max-w-md flex-col px-4 py-16 sm:px-6">
      <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
        <div className="text-center">
          <span className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-brand-600 text-2xl">
            🔐
          </span>
          <h1 className="mt-4 text-2xl font-bold text-gray-900">
            Admin Login
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Sign in to manage your teaching site.
          </p>
        </div>

        {error && (
          <p className="mt-4 rounded-lg bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
            Invalid email or password. Please try again.
          </p>
        )}
        {loggedOut && (
          <p className="mt-4 rounded-lg bg-green-50 px-4 py-3 text-sm font-medium text-green-700">
            You&apos;ve been signed out.
          </p>
        )}

        <form action={loginAction} className="mt-6 space-y-4">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              autoComplete="email"
              defaultValue={creds.email}
              className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-brand-600 focus:ring-2 focus:ring-brand-200"
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              autoComplete="current-password"
              defaultValue={creds.password}
              className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-brand-600 focus:ring-2 focus:ring-brand-200"
            />
          </div>
          <button
            type="submit"
            className="w-full rounded-lg bg-brand-600 py-3 text-sm font-semibold text-white hover:bg-brand-700"
          >
            Sign in
          </button>
        </form>
      </div>

      <p className="mt-4 text-center text-xs text-gray-400">
        Seeded demo credentials shown above — override with{" "}
        <code className="font-mono">ADMIN_EMAIL</code> /{" "}
        <code className="font-mono">ADMIN_PASSWORD</code> env vars.
      </p>
      <div className="mt-6 text-center">
        <Link
          href="/"
          className="text-sm font-medium text-brand-600 hover:text-brand-700"
        >
          ← Back to site
        </Link>
      </div>
    </div>
  );
}