"use server";

import { signIn, signOut } from "@/lib/auth";
export async function doSocialLogin(formData) {
  const action = formData.get("action");
  await signIn(action, { redirectTo: "/getStarted" });
  console.log(action);
}

export async function doLogout() {
  await signOut({ redirectTo: "/" });
}
