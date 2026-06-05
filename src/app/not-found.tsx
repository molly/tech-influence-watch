import Header from "./components/Header";
import NotFoundContent from "./components/NotFoundContent";
import styles from "./not-found.module.css";

export default function NotFound() {
  return (
    <>
      <Header />
      <main className={styles.page}>
        <NotFoundContent />
      </main>
    </>
  );
}
