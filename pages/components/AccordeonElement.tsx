import React, { useState } from "react";
import styles from '../../styles/AccordeonElement.module.scss'
import '../../styles/AccordeonElement.module.scss'
interface AccordeonElementProps {
      id: number,
      header: string,
      body: JSX.Element,
    }


export function AccordeonElement({ id, header, body }: AccordeonElementProps) {
  const [isOpen, toggleOpen] = useState(false);

  const chevronDown = (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className={styles['chevron-down']}
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
      className={`${styles['accordeon__elm']} ${isOpen ? styles.open : styles.closed}`}
    >
      <div className={styles['top-green-border']}></div>
      <div className={`${styles['accordeon__head']}`}>
        <div className={styles.left}>
          <div className={`${styles['accordeon__head--id']} ${isOpen && styles["text-green"]}`}>
            {id}
          </div>
          <div className={`${styles['accordeon__head--text']} ${isOpen && styles["text-green"]}`}>
            {header}
          </div>
        </div>
        <div className={styles.right}>
          <div
            className={styles["accordeon__head--btn"]}
            onClick={() => toggleOpen((val) => !val)}
          >
            {isOpen ? cross : chevronDown}
          </div>
        </div>
      </div>
      <div className={styles["accordeon__body"]}>
        {body}
        </div>
    </div>
  );
}

