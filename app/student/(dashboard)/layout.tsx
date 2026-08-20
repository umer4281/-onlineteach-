import type { ReactNode } from "react";
import Link from "next/link";
import Image from "next/image";
import { redirect } from "next/navigation";
import { isStudent, getStudentSessionUser } from "@/lib/auth";
import { studentLogoutAction } from "@/app/student/actions";

export const dynamic = "force-dynamic";

export default async function StudentLayout({
  children,
}: {
  children: ReactNode;
}) {
  if (!(await isStudent())) redirect("/student/login");
  const me = await getStudentSessionUser();

  return (
    <div className="min-h-screen bg-gradient-to-b from-brand-50 via-white to-white">
      <header className="sticky top-0 z-40 border-b border-brand-100/60 bg-white/80 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4 sm:px-6">
          <Link href="/" className="flex items-center gap-2.5">
            <Image
              src="/images/smart-logo.jpg"
              alt="Smart Learning logo"
              width={36}
              height={36}
              className="h-8 w-8 rounded-xl object-cover ring-1 ring-brand-200"
            />
            <span className="text-base font-extrabold tracking-tight text-gray-900">
              Madrasah <span className="text-hero-gradient">Student</span>
            </span>
          </Link>
          <div className="flex items-center gap-3">
            <span className="hidden text-sm text-gray-500 sm:block">
              Assalamu alaikum, <b className="text-gray-900">{me?.name}</b>
            </span>
            <form action={studentLogoutAction}>
              <button
                type="submit"
                className="rounded-xl border border-brand-200 px-4 py-2 text-sm font-semibold text-brand-700 hover:bg-brand-50"
              >
                Log out
              </button>
            </form>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-5xl px-4 py-10 sm:px-6">{children}</main>
    </div>
  );
}