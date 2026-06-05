import NotFoundContent from "@/app/components/NotFoundContent";
import styles from "@/app/not-found.module.css";

// Scoped not-found boundary for the (drilldown) group. The drilldown layout
// already renders the Header and the <main> wrapper, so this only supplies the
// 404 body — avoiding the doubled header/nested-main the root not-found caused
// when triggered from inside this group.
export default function DrilldownNotFound() {
  return (
    <div className={styles.page}>
      <NotFoundContent />
    </div>
  );
}
