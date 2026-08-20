import { redirect } from "next/navigation";

export const metadata = {
  title: "Admin registration",
  description: "Admin accounts are created by the site owner.",
};

/**
 * Public admin self-registration has been removed for security. New admins are
 * created by signed-in admins from /admin/admins. This route just sends anyone
 * who lands here to the login (proxy blocks it for anonymous users anyway).
 */
export default function RegisterRedirectPage() {
  redirect("/admin/login");
}