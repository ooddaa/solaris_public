import React, { useState } from "react";
import styles from "../../../styles/PassportsData.module.scss";
import axios from "axios";
import { isArray } from "lodash";
import { AccordeonElement } from "../AccordeonElement";

interface PassportsDataProps {
  onData: (data: string) => void;
}

/**
 * @todo this should come from Mango
 * just mocking for now
 */
type EnhancedNode = {
  labels: string[];
  properties: {
    [key: string]: string | boolean | (string[] | number[] | boolean[]);
  };
  identity: { low: number; high: number };
  relationships?: {
    inbound: any[];
    oubound: any[];
  };
};

function PassportsData(/* { onData }: PassportsDataProps */) {
  const [passports, setPassports] = useState<EnhancedNode[]>([]);
  const getAllPassports = async () => {
    try {
      const response = await axios.get("/api/getAllPassports");
      const result = response?.data;
      if (!result.success) {
        throw new Error(
          `PassportsData.getAllPassports: result was not a success.\nresult: ${JSON.stringify(
            result,
            null,
            5
          )}`
        );
      }
      const allPassports = result.data;
      // console.log(allPassports)

      /* checks */
      if (!allPassports) return;
      if (!isArray(allPassports)) {
        throw new Error(
          `PassportsData.getAllPassports: allPassports must be array.\n${JSON.stringify(
            allPassports,
            null,
            5
          )}`
        );
      }
      setPassports(allPassports);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <button onClick={getAllPassports}>Get all Passports</button>
      <div className={`passports-data ${styles["passports-data"]}`}>
        {passports && passports.length
          ? passports.map(thinkOfAGoodName)
          : `passports found: ${passports.length}`}
      </div>
    </div>
  );
}

const thinkOfAGoodName = (passport: EnhancedNode, i: number): JSX.Element => {
  /* 
    TYPE: "P",
    CODE_OF_ISSUING_STATE: "unknown",
    PASSPORT_NUMBER: "123",
    firstName: "firstName",
    lastName: "lastName",
    otherNames: "otherNames",
    nationality: "nationality",
    placeOfBirth: "placeOfBirth",
    dateOfBirth: "2000-01-01",
    sex: "Male",
    DATE_ISSUED: "2000-01-01",
    DATE_EXPIRES: "2022-01-01",
    ISSUING_AUTHORITY: "MacDonalds",
    otherProps: "otherProps",
  */
  const { properties } = passport;
  const header = `${properties.firstName} ${properties.lastName}`;
  const body = (
    <div className={styles["passport-card"]}>
      <div className={styles["data-column"]}>
        {/* <ul>
        <li>Number: {properties.PASSPORT_NUMBER}</li>
        <li>Date Issued: {properties.DATE_ISSUED}</li>
        <li>{properties.DATE_EXPIRES}</li>
        <li>{properties.CODE_OF_ISSUING_STATE}</li>
        <li>{properties.CODE_OF_ISSUING_STATE}</li>
        <li>{properties.CODE_OF_ISSUING_STATE}</li>
        <li>{properties.CODE_OF_ISSUING_STATE}</li>
        <li>{properties.CODE_OF_ISSUING_STATE}</li>
        <li>{properties.CODE_OF_ISSUING_STATE}</li>
      </ul> */}
        <table>
          <tr>
            <td>Number</td>
            <td>{properties.PASSPORT_NUMBER}</td>
          </tr>
          <tr>
            <td>Date Issued </td>
            <td>{properties.DATE_ISSUED}</td>
          </tr>
          <tr>
            <td>Date Expires </td>
            <td>{properties.DATE_EXPIRES}</td>
          </tr>
          <tr>
            <td>Country </td>
            <td>{properties.CODE_OF_ISSUING_STATE}</td>
          </tr>
        </table>
      </div>
      <div className={styles["control-column"]}>
        <button>share</button>
        <button>copy</button>
        <button>edit</button>
        {/* <button className={ styles["delete--btn"] }>delete</button> */}
        <button className="delete--btn"> delete </button>
      </div>
    </div>
  );
  return (
    <div key={i} className={styles.passport}>
      <AccordeonElement id={i} header={header} body={body} />
    </div>
  );
};

export default PassportsData;
