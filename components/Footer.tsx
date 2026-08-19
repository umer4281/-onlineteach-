import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-gray-100 bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2.5">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-brand-500 to-brand-700 text-sm text-white">
                🎓
              </span>
              <span className="text-lg font-extrabold tracking-tight text-gray-900">
                LearnHub
              </span>
            </div>
            <p className="mt-3 max-w-sm text-sm leading-relaxed text-gray-500">
              Free online courses taught live over Google Meet — with
              downloadable resources and notes you can like and share.
            </p>
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-900">Explore</p>
            <ul className="mt-3 space-y-2 text-sm">
              <li>
                <Link href="/courses" className="text-gray-500 hover:text-gray-900">
                  Courses
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-gray-500 hover:text-gray-900">
                  About
                </Link>
              </li>
              <li>
                <Link href="/" className="text-gray-500 hover:text-gray-900">
                  Home
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-900">Teachers</p>
            <ul className="mt-3 space-y-2 text-sm">
              <li>
                <Link
                  href="/admin/login"
                  className="text-gray-400 hover:text-gray-900"
                >
                  Admin login
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-10 flex flex-col items-center justify-between gap-3 border-t border-gray-200 pt-6 sm:flex-row">
          <p className="text-xs text-gray-400">
            © {new Date().getFullYear()} LearnHub. All rights reserved.
          </p>
          <p className="text-xs text-gray-400">
            Made with 💜 for learning everywhere
          </p>
        </div>
      </div>
    </footer>
  );
}
