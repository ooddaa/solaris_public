import React, { useState } from "react";
import styles from "../../styles/DataWindow.module.scss";
import { Prism } from "@mantine/prism";

interface DataWindowProps {
  data: string
}
const DataWindow = ({ data }: DataWindowProps) => {
  return (
    <div className={styles.container}>
      {/* {JSON.stringify(data)} */}
      {/* {data} */}
      <Prism language="tsx">{data}</Prism>
      {/* Lorem ipsum dolor sit amet consectetur, adipisicing elit. Quidem cupiditate, quas sunt quasi eos in aspernatur dolores ratione, fuga consequatur illum corporis? Laboriosam quidem ea obcaecati omnis sequi asperiores neque? */}
    </div>
  )
}

export default DataWindow