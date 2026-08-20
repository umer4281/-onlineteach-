import Link from "next/link";
import Image from "next/image";

const subjects = ["📖 Quran", "🗂️ Fiqh", "💬 Hadith", "📜 Sirah", "✏️ Aqidah"];

export default function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-white/10 bg-gray-950 text-gray-300">
      <div className="pointer-events-none absolute inset-0 opacity-40">
        <div className="absolute -left-20 top-10 h-72 w-72 rounded-full bg-brand-600/20 blur-3xl" />
        <div className="absolute -right-20 bottom-10 h-72 w-72 rounded-full bg-violet-600/20 blur-3xl" />
      </div>

      <div className="mx-auto max-w-7xl px-4 pt-12 sm:px-6">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2.5">
              <Image
                src="/images/smart-logo.jpg"
                alt="Smart Learning logo"
                width={36}
                height={36}
                className="h-8 w-8 rounded-xl object-cover ring-1 ring-brand-400/40"
              />
              <span className="text-lg font-extrabold tracking-tight text-white">
                Smart <span className="text-hero-gradient">Learning</span>
              </span>
            </div>
            <p className="mt-3 max-w-sm text-sm leading-relaxed text-gray-400">
              Live free classes over Google Meet — with downloadable resources
              and notes you can like and share. Learn anything, anywhere.
            </p>
            <div className="mt-5 flex flex-wrap gap-2">
              {subjects.map((s) => (
                <span
                  key={s}
                  className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-gray-200"
                >
                  {s}
                </span>
              ))}
            </div>
          </div>

          <div>
            <p className="text-sm font-semibold text-white">Explore</p>
            <ul className="mt-3 space-y-2 text-sm">
              <li>
                <Link href="/courses" className="text-gray-400 hover:text-white">
                  Courses
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-gray-400 hover:text-white">
                  About
                </Link>
              </li>
              <li>
                <Link href="/" className="text-gray-400 hover:text-white">
                  Home
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <p className="text-sm font-semibold text-white">Students</p>
            <ul className="mt-3 space-y-2 text-sm">
              <li>
                <Link href="/student/login" className="text-gray-400 hover:text-white">
                  Student login
                </Link>
              </li>
              <li>
                <Link href="/courses" className="text-gray-400 hover:text-white">
                  Browse courses
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <p className="text-sm font-semibold text-white">Teachers</p>
            <ul className="mt-3 space-y-2 text-sm">
              <li>
                <Link href="/admin/login" className="text-gray-400 hover:text-white">
                  Admin login
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-3 border-t border-white/10 pt-6 sm:flex-row">
          <p className="text-xs text-gray-500">
            © {new Date().getFullYear()} Smart Learning. All rights reserved.
          </p>
          <p className="text-xs text-gray-500">
            Made with 💜 for learning everywhere
          </p>
        </div>
      </div>
    </footer>
  );
}
