import React, { useState } from "react";
import styles from "../../styles/AccordionElement.module.scss";
interface AccordionElementProps {
  id: number;
  header: string;
  body: JSX.Element;
}

export function AccordionElement({ id, header, body }: AccordionElementProps) {
  const [isOpen, toggleOpen] = useState(false);

  const chevronDown = (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className={styles.chevron}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M19 9l-7 7-7-7"
      />
    </svg>
  );
  const chevronUp = (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className={styles.chevron}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
    </svg>
  );
  const cross = (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className={styles.cross}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M6 18L18 6M6 6l12 12"
      />
    </svg>
  );

  return (
    <div
      className={`${styles["accordion__elm"]} ${
        isOpen ? styles.open : styles.closed
      }`}
    >
      <div className={styles["top-green-border"]}></div>
      <div className={`${styles["accordion__head"]}`}>
        <div className={styles.left}>
          <div
            className={`${styles["accordion__head--id"]} ${
              isOpen && styles["text-green"]
            }`}
          >
            {id}
          </div>
          <div
            className={`${styles["accordion__head--text"]} ${
              isOpen && styles["text-green"]
            }`}
          >
            {header}
          </div>
        </div>
        <div className={styles.right}>
          <div
            className={styles["accordion__head--btn"]}
            onClick={() => toggleOpen((val) => !val)}
          >
            {isOpen ? chevronUp : chevronDown}
          </div>
        </div>
      </div>
      <div className={styles["accordion__body"]}>{body}</div>
    </div>
  );
}
