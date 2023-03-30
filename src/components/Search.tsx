import styles from "@/styles/Search.module.css";
import Image from "next/image";
import { useMemo, useState } from "react";

type SearchProps = {
  handleChange: (term: string) => void;
};

const debounce = (fn: Function, ms = 300) => {
  let timeoutId: ReturnType<typeof setTimeout>;
  return function (this: any, ...args: any[]) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn.apply(this, args), ms);
  };
};

export default function Search({ handleChange }: SearchProps) {
  // const [searchTerm, setSearchTerm] = useState("");
  const debouncedUpdate = debounce(handleChange);

  const onInputChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    debouncedUpdate(value);
  };

  return (
    <div className={styles.wrapper}>
      <input
        className={styles.inputElevated}
        type="text"
        placeholder="Search Images"
        onChange={onInputChangeHandler}
      />
    </div>
  );
}
