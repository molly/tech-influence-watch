"use client";

import { redirect } from "next/navigation";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";

import { useAuth } from "@/app/admin/AuthProvider";
import sharedStyles from "@/app/shared.module.css";

export default function Login() {
  const { authenticate, user } = useAuth();
  const [errorMessage, dispatch] = useActionState(authenticate, undefined);

  if (user) {
    redirect("/admin");
  }
  return (
    <form className={sharedStyles.smallCard} action={dispatch}>
      <input type="email" name="email" placeholder="Email" required />
      <input type="password" name="password" placeholder="Password" required />
      <div>{errorMessage && <p>{errorMessage}</p>}</div>
      <LoginButton />
    </form>
  );
}

function LoginButton() {
  const { pending } = useFormStatus();

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    if (pending) {
      event.preventDefault();
    }
  };

  return (
    <button aria-disabled={pending} type="submit" onClick={handleClick}>
      Login
    </button>
  );
}
