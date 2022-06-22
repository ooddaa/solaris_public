import React, { useState } from "react";
import styles from "../../styles/DataWindow.module.scss";

interface DataWindowProps {
  data: string
}
const DataWindow = ({ data }: DataWindowProps) => {
  return (
    <div className={styles.container}>
      {/* {JSON.stringify(data)} */}
      {data}
    </div>
  )
}

export default DataWindow