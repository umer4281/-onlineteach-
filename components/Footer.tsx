import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-gray-50">
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
          <div>
            <div className="flex items-center gap-2 text-lg font-bold text-gray-900">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-600 text-sm">
                🎓
              </span>
              LearnHub
            </div>
            <p className="mt-2 text-sm text-gray-500">
              Free online courses and video lessons.
            </p>
          </div>
          <div className="flex gap-6 text-sm text-gray-500">
            <Link href="/courses" className="hover:text-gray-900">
              Courses
            </Link>
            <Link href="/about" className="hover:text-gray-900">
              About
            </Link>
          </div>
        </div>
        <p className="mt-8 text-center text-xs text-gray-400">
          © {new Date().getFullYear()} LearnHub. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
