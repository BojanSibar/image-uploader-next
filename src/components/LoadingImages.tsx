import Skeleton from "react-loading-skeleton";
import styles from "@/styles/ImageGrid.module.css";
import "react-loading-skeleton/dist/skeleton.css";

type SiteLayoutProps = {};

export default function LoadingImages({}: SiteLayoutProps) {
  return (
    <div className={styles.wrapper}>
      <Skeleton className={styles.gridItem} count={1} />
      <Skeleton className={styles.gridItem} count={1} />
      <Skeleton className={styles.gridItem} count={1} />
      <Skeleton className={styles.gridItem} count={1} />
    </div>
  );
}
