import styles from "@/styles/SiteLayout.module.css";
import { ReactNode } from "react";

type SiteLayoutProps = {
  searchNode: ReactNode;
  fileUploadNode: ReactNode;
  imagesNode: ReactNode;
};

export default function SiteLayout({
  searchNode,
  fileUploadNode,
  imagesNode,
}: SiteLayoutProps) {
  return (
    <div className={styles.wrapper}>
      <div className={styles.searchWrapper}>{searchNode}</div>
      <div className={styles.inputWrapper}>{fileUploadNode}</div>
      <div className={styles.imagesWrapper}>{imagesNode}</div>
    </div>
  );
}
