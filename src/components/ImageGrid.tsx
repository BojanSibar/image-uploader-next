import { CreateImageDB } from "@/helpers/image-repo";
import styles from "@/styles/ImageGrid.module.css";
import Image from "next/image";

type ImageGridProps = {
  imagePaths: string[];
  imageData: Record<string, CreateImageDB>;
  onRemove: (id: string) => void;
};

export default function ImageGrid({
  imagePaths,
  imageData,
  onRemove,
}: ImageGridProps) {
  const onRemoveHandler = (e: React.MouseEvent<HTMLButtonElement>) => {
    const { value } = e.currentTarget;
    onRemove(value);
  };
  // reverse method changes original array
  const copyOfArray = JSON.parse(JSON.stringify(imagePaths)) as string[];
  const reversed = copyOfArray.reverse();
  return (
    <div className={styles.wrapper}>
      {reversed.map((image) => {
        return (
          <div key={image} className={styles.gridItem}>
            <div className={styles.imageWrapper}>
              <Image
                className={styles.logo}
                src={image}
                alt={imageData[image].name}
                fill
              />
            </div>
            <div className={styles.imageLabel}>
              <strong>Name:</strong>
              <div className={styles.imageLabelName}>
                {imageData[image].name}
              </div>
              <div className={styles.imageButton}>
                <button onClick={onRemoveHandler} value={imageData[image].path}>
                  X
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
