"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { logoutAction } from "@/app/admin/actions";

const navItems = [
  { href: "/admin", label: "Dashboard", icon: "📊", exact: true },
  { href: "/admin/courses", label: "Courses", icon: "📚", exact: false },
];

function DesktopSidebar({ pathname }: { pathname: string }) {
  return (
    <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 flex-col border-r border-gray-200 bg-white lg:flex">
      <div className="flex items-center gap-3 px-6 py-6">
        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-600 text-lg text-white">
          🎓
        </span>
        <div>
          <p className="font-bold leading-tight text-gray-900">LearnHub</p>
          <p className="text-xs font-medium text-gray-400">Admin</p>
        </div>
      </div>

      <nav className="flex-1 space-y-1 px-3 py-2">
        <p className="px-3 pb-2 pt-4 text-xs font-semibold uppercase tracking-wider text-gray-400">
          Manage
        </p>
        {navItems.map((item) => {
          const active = item.exact
            ? pathname === item.href
            : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
                active
                  ? "bg-brand-600 text-white shadow-sm"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              <span aria-hidden>{item.icon}</span>
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="space-y-1 border-t border-gray-100 px-3 py-4">
        <Link
          href="/"
          className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-100"
        >
          <span aria-hidden>🌐</span> View website
        </Link>
        <form action={logoutAction}>
          <button
            type="submit"
            className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-red-600 transition hover:bg-red-50"
          >
            <span aria-hidden>🚪</span> Log out
          </button>
        </form>
        <p className="px-3 pt-2 text-xs text-gray-400">
          © {new Date().getFullYear()} LearnHub
        </p>
      </div>
    </aside>
  );
}

function MobileBar({ pathname }: { pathname: string }) {
  return (
    <header className="sticky top-0 z-30 flex items-center justify-between border-b border-gray-200 bg-white px-4 py-3 lg:hidden">
      <div className="flex items-center gap-2">
        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-600 text-sm text-white">
          🎓
        </span>
        <span className="text-sm font-bold text-gray-900">LearnHub Admin</span>
      </div>
      <nav className="flex items-center gap-1">
        {navItems.map((item) => {
          const active = item.exact
            ? pathname === item.href
            : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`rounded-lg px-3 py-1.5 text-xs font-semibold ${
                active ? "bg-brand-600 text-white" : "text-gray-600"
              }`}
            >
              {item.label}
            </Link>
          );
        })}
        <Link
          href="/"
          className="rounded-lg px-3 py-1.5 text-xs font-semibold text-gray-500"
        >
          Site
        </Link>
      </nav>
    </header>
  );
}

export default function AdminSidebar() {
  const pathname = usePathname() ?? "";
  return (
    <>
      <DesktopSidebar pathname={pathname} />
      <MobileBar pathname={pathname} />
    </>
  );
}