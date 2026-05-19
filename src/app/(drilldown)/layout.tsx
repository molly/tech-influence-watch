import "@/app/globals.css";

import sharedStyles from "@/app/shared.module.css";

import Header from "../components/Header";

export default function DrilldownLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Header />
      <main
        className={`${sharedStyles.mainLayout} ${sharedStyles.mainWithHeader}`}
      >
        {children}
      </main>
    </>
  );
}
