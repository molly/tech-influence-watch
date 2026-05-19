import { notFound } from "next/navigation";

import sharedStyles from "@/app/shared.module.css";

import AuthProvider from "./AuthProvider";

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  if (process.env.NODE_ENV === "production") {
    notFound();
  }

  return (
    <AuthProvider>
      <main className={sharedStyles.mainLayout}>{children}</main>
    </AuthProvider>
  );
}
