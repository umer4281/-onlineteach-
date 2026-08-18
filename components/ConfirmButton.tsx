"use client";

import type { ReactNode } from "react";

/** A submit button that asks for confirmation before doing a destructive action. */
export default function ConfirmButton({ children }: { children: ReactNode }) {
  return (
    <button
      type="submit"
      className="rounded-lg border border-red-200 px-3 py-2 text-xs font-semibold text-red-600 hover:bg-red-50"
      onClick={(e) => {
        if (!window.confirm("Delete this? This cannot be undone.")) {
          e.preventDefault();
        }
      }}
    >
      {children}
    </button>
  );
}
