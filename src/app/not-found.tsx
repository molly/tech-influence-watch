import Link from "next/link";

import sharedStyles from "@/app/shared.module.css";

import Header from "./components/Header";

export default function NotFound() {
  return (
    <>
      <Header />
      <main className={sharedStyles.mainLayout}>
        <h1 className={sharedStyles.title}>404</h1>
        <div>
          Page not found. <Link href="/">Go back home?</Link>
        </div>
      </main>
    </>
  );
}
