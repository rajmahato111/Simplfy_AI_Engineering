"use server";

import { signIn } from "@/auth";

export async function signInDemo() {
  await signIn("credentials", {
    email: "demo@simplify.ai",
    redirectTo: "/dashboard",
  });
}
