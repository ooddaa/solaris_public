import React from "react";
import styles from "../../../styles/PassportsData.module.scss";

function PassportsData() {

  const getPassportsData = () => {

  }
  
  return (
    <div>
      <button onClick={getPassportsData}>Get all Passports</button>
      <div className={`passports-data ${styles["passports-data"]}`}></div>
    </div>
  );
}

export default PassportsData;
