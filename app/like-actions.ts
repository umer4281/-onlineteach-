"use server";

import { revalidatePath } from "next/cache";
import { supabaseAdmin } from "@/lib/supabase";

/** Anyone can like a resource; the server increments the counter. */
export async function likeResourceAction(resourceId: string) {
  if (!resourceId || !supabaseAdmin) return;

  const { data, error } = await supabaseAdmin
    .from("resources")
    .select("likes")
    .eq("id", resourceId)
    .maybeSingle();

  if (error) return;

  const next = (data?.likes ?? 0) + 1;
  await supabaseAdmin
    .from("resources")
    .update({ likes: next })
    .eq("id", resourceId);

  revalidatePath("/courses/[slug]/lessons/[lessonId]", "page");
}
