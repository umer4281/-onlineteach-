"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { likeResourceAction } from "@/app/like-actions";

export default function LikeButton({
  resourceId,
  initialLikes,
}: {
  resourceId: string;
  initialLikes: number;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  return (
    <button
      type="button"
      disabled={pending}
      onClick={() => {
        startTransition(async () => {
          await likeResourceAction(resourceId);
          router.refresh();
        });
      }}
      className="inline-flex items-center gap-1.5 rounded-full border border-rose-200 bg-rose-50 px-3 py-1.5 text-sm font-semibold text-rose-600 transition hover:bg-rose-100 disabled:opacity-60"
    >
      <span aria-hidden>♥</span> {initialLikes}
    </button>
  );
}
