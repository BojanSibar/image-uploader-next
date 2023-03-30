import styles from "@/styles/UploadButton.module.css";
import Image from "next/image";
import { useState } from "react";

type UploadButtonProps = {
  handleUpload: (file: File) => void;
};

export default function UploadButton({ handleUpload }: UploadButtonProps) {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const onFileClickHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { files } = e.target;
    if (files && files.length) {
      const file = files[0];
      setPreviewUrl(URL.createObjectURL(file));
      setFile(file);
    } else {
      setPreviewUrl(null);
      setFile(null);
    }
    e.currentTarget.type = "text";
    e.currentTarget.type = "file";
  };

  const onInputChangeHandler = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (file) {
      handleUpload(file);
    }
    setPreviewUrl(null);
    setFile(null);
  };

  const onRemoveHandler = (e: React.MouseEvent<HTMLButtonElement>) => {
    setPreviewUrl(null);
    setFile(null);
  };

  return (
    <div className={styles.wrapper}>
      {previewUrl ? (
        <div className={styles.imageWrapper}>
          <Image
            alt="image uploader preview"
            src={previewUrl}
            width={90}
            height={90}
          />
          <div className={styles.imageButton}>
            <button onClick={onRemoveHandler}>X</button>
          </div>
        </div>
      ) : (
        <label>
          <strong className={styles.uploadLabel}>Choose image</strong>
          <input
            type="file"
            accept="image/*"
            hidden
            onChange={onFileClickHandler}
          />
        </label>
      )}
      <button
        disabled={!previewUrl}
        onClick={onInputChangeHandler}
        className={styles.uploadLabel}
      >
        Upload file
      </button>
    </div>
  );
}
