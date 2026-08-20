import Link from "next/link";
import type { Metadata } from "next";
import ConfirmButton from "@/components/ConfirmButton";
import { getSessionUser } from "@/lib/auth";
import {
  registerAdminAction,
  deleteAdminAction,
} from "@/app/admin/actions";
import {
  isSupabaseConfigured,
  supabaseAdmin,
} from "@/lib/supabase";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Admins",
  description: "Manage admin accounts.",
};

type PageProps = { searchParams: Promise<Record<string, string | undefined>> };

const inputCls =
  "mt-1 w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-brand-600 focus:ring-2 focus:ring-brand-200";

interface AdminRow {
  id: string;
  name: string;
  email: string;
  created_at: string;
}

const notices: Record<string, { tone: "ok" | "err"; text: string }> = {
  created: { tone: "ok", text: "Admin account created." },
  deleted: { tone: "ok", text: "Admin account removed." },
  required: { tone: "err", text: "Please fill in every field." },
  short: { tone: "err", text: "Password must be at least 6 characters." },
  mismatch: { tone: "err", text: "The two passwords don't match." },
  exists: { tone: "err", text: "An admin with this email already exists." },
  failed: { tone: "err", text: "Something went wrong. Please retry." },
  invalid: { tone: "err", text: "No admin selected to delete." },
  "self-delete": {
    tone: "err",
    text: "You can't delete your own account.",
  },
  "last-admin": {
    tone: "err",
    text: "You can't delete the last admin account.",
  },
};

export default async function AdminAdminsPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const me = await getSessionUser();

  let admins: AdminRow[] = [];
  let loadFailed = false;
  if (isSupabaseConfigured && supabaseAdmin) {
    const { data, error } = await supabaseAdmin
      .from("admins")
      .select("id,name,email,created_at")
      .order("created_at", { ascending: true });
    if (error) {
      loadFailed = true;
    } else {
      admins = (data as AdminRow[]) ?? [];
    }
  }

  const notice = params.error || params.created || params.deleted;
  const noticeMeta = notice ? notices[notice] : null;

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">
            Admins
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Add or remove people who can manage your teaching site
          </p>
        </div>
      </div>
{!isSupabaseConfigured && (
        <div className="mt-6 rounded-xl border border-amber-300 bg-amber-50 px-4 py-4 text-amber-800">
          <p className="font-semibold">Supabase isn&apos;t connected yet.</p>
          <p className="mt-1 text-sm">
            Add the Supabase env vars to manage your admin accounts here.
          </p>
        </div>
      )}

      {noticeMeta && (
        <div
          className={`mt-6 rounded-xl px-4 py-3 text-sm font-medium ${
            noticeMeta.tone === "ok"
              ? "bg-green-50 text-green-700"
              : "bg-red-50 text-red-600"
          }`}
        >
          {noticeMeta.text}
        </div>
      )}

      <section className="mt-8 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
        <div className="border-b border-gray-100 px-6 py-4">
          <h2 className="font-bold text-gray-900">Add an admin</h2>
          <p className="mt-1 text-xs text-gray-400">
            Creates a new login for a teammate. (The seeded{" "}
            <code className="font-mono">ADMIN_EMAIL</code> user still works too.)
          </p>
        </div>
        <form action={registerAdminAction} className="grid gap-4 p-6 sm:grid-cols-2">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Full name
            </label>
            <input id="name" name="name" type="text" required className={inputCls} placeholder="e.g. Umer Khan" />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input id="email" name="email" type="email" required className={inputCls} placeholder="teammate@example.com" />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input id="password" name="password" type="password" required minLength={6} className={inputCls} placeholder="At least 6 characters" />
          </div>
          <div>
            <label htmlFor="confirm" className="block text-sm font-medium text-gray-700">
              Confirm password
            </label>
            <input id="confirm" name="confirm" type="password" required className={inputCls} placeholder="Repeat password" />
          </div>
          <div className="sm:col-span-2">
            <button
              type="submit"
              className="rounded-xl bg-brand-600 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-brand-700"
            >
              + Add admin
            </button>
          </div>
        </form>
      </section>

      <div className="mt-8">
        <h2 className="text-xl font-bold text-gray-900">
          Team ({admins.length})
        </h2>
        <div className="mt-4 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
          {loadFailed && (
            <p className="px-6 py-8 text-sm text-red-600">
              Could not load admin accounts.
            </p>
          )}
          {!loadFailed && admins.length === 0 && (
            <p className="px-6 py-8 text-center text-sm text-gray-400">
              No registered admins yet. Add your first one above.
            </p>
          )}
          {!loadFailed && admins.length > 0 && (
            <ul className="divide-y divide-gray-100">
              {admins.map((admin) => {
                const isSelf = Boolean(me?.uid) && me?.uid === admin.id;
                return (
                  <li key={admin.id} className="flex items-center justify-between gap-4 px-6 py-4">
                    <div className="min-w-0">
                      <p className="font-semibold text-gray-900">
                        {admin.name}
                        {isSelf && (
                          <span className="ml-2 rounded-full bg-brand-50 px-2 py-0.5 text-xs font-medium text-brand-700">
                            You
                          </span>
                        )}
                      </p>
                      <p className="mt-0.5 text-xs text-gray-400">
                        {admin.email} · joined{" "}
                        {new Date(admin.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    {isSelf ? (
                      <span className="text-xs text-gray-300">—</span>
                    ) : (
                      <form action={deleteAdminAction}>
                        <input type="hidden" name="adminId" value={admin.id} />
                        <ConfirmButton>Remove</ConfirmButton>
                      </form>
                    )}
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>

      <div className="mt-6">
        <Link href="/admin" className="text-sm font-semibold text-brand-600 hover:text-brand-700">
          ← Back to dashboard
        </Link>
      </div>
    </div>
  );
}