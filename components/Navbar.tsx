import Link from "next/link";
import Image from "next/image";

const links = [
  { href: "/", label: "Home" },
  { href: "/courses", label: "Courses" },
  { href: "/about", label: "About" },
];

export default function Navbar() {
  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-white/80 backdrop-blur-xl">
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="group flex items-center gap-2.5">
          <span className="relative">
            <Image
              src="/images/smart-logo.jpg"
              alt="Smart Learning logo"
              width={40}
              height={40}
              className="h-9 w-9 rounded-xl object-cover ring-1 ring-brand-200"
            />
            <span className="absolute -bottom-1 -right-1 h-3 w-3 rounded-full bg-emerald-400 ring-2 ring-white" />
          </span>
          <span className="text-lg font-extrabold tracking-tight text-gray-900">
            Smart <span className="text-hero-gradient">Learning</span>
          </span>
        </Link>

        <div className="hidden items-center gap-1 md:flex">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="rounded-lg px-3.5 py-2 text-sm font-medium text-gray-600 transition hover:bg-indigo-50 hover:text-gray-900"
            >
              {l.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/student/login"
            className="hidden items-center gap-2 rounded-xl border border-brand-200 px-3.5 py-2 text-sm font-medium text-brand-700 transition hover:bg-brand-50 sm:flex"
          >
            <span aria-hidden>🎓</span> Student
          </Link>
          <Link
            href="/admin/login"
            className="hidden items-center gap-2 rounded-xl border border-gray-200 px-3.5 py-2 text-sm font-medium text-gray-600 transition hover:bg-gray-50 lg:flex"
          >
            <span aria-hidden>🛠</span> Admin
          </Link>
          <Link
            href="/courses"
            className="rounded-xl bg-gradient-to-r from-brand-600 to-violet-500 px-4 py-2 text-sm font-semibold text-white shadow-md shadow-brand-600/20 transition hover:brightness-110"
          >
            Start Learning
          </Link>
        </div>
      </nav>
    </header>
  );
}
