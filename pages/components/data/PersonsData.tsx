import React, { useState } from "react";
import styles from "../../../styles/PersonsData.module.scss";
import axios from "axios";
import { isArray } from "lodash";
import { AccordionElement } from "../AccordionElement";

interface PersonsDataProps {
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

function PersonsData(/* { onData }: PersonsDataProps */) {
  const [persons, setPersons] = useState<EnhancedNode[]>([]);
  const getAllPersons = async () => {
    try {
      const response = await axios.get("/api/getAllPersons");
      const result = response?.data;
      if (!result.success) {
        throw new Error(
          `PersonsData.getAllPersons: result was not a success.\nresult: ${JSON.stringify(
            result,
            null,
            5
          )}`
        );
      }
      const allPersons = result.data;
      // console.log(allPersons)

      /* checks */
      if (!allPersons) return;
      if (!isArray(allPersons)) {
        throw new Error(
          `PersonsData.getAllPersons: allPersons must be array.\n${JSON.stringify(
            allPersons,
            null,
            5
          )}`
        );
      }
      setPersons(allPersons);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className={styles.container}>
      <button onClick={getAllPersons}>Get all Persons</button>
      <div className={`persons-data ${styles["persons-data"]} ${styles.container}`}>
        {persons && persons.length
          ? persons.map(thinkOfAGoodName)
          : `persons found: ${persons.length}`}
      </div>
    </div>
  );
}

const thinkOfAGoodName = (person: EnhancedNode, i: number): JSX.Element => {
  /* 
    FIRST_NAME: 'lol',  // required to complete Passport, but not unique identifier of a Passport in Neo4j
    LAST_NAME: 'aaaa',
    SEX: 'Male',
    PLACE_OF_BIRTH: 'here',
    DATE_OF_BIRTH: '2020-01-01',//.regex(/[d]*4-[d]*2-[d]*2/),
    CURRENT_ADDRESS: 'there',
  */
  const { properties } = person;
  const header = `${properties.FIRST_NAME} ${properties.LAST_NAME}`;
  const body = (
    <div className={styles["person-card"]}>
      <div className={styles["data-column"]}>
        <table>
          <tbody>
            <tr>
              <td>First Name</td>
              <td>{properties.FIRST_NAME}</td>
              <td>5</td>
            </tr>
            <tr>
              <td>Last Name </td>
              <td>{properties.LAST_NAME}</td>
            </tr>
            <tr>
              <td>Sex </td>
              <td>{properties.SEX}</td>
            </tr>
            <tr>
              <td>Place of birth </td>
              <td>{properties.PLACE_OF_BIRTH}</td>
            </tr>
            <tr>
              <td>Date of birth </td>
              <td>{properties.DATE_OF_BIRTH}</td>
            </tr>
            <tr>
              <td>Current address </td>
              <td>{properties.CURRENT_ADDRESS}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div className={styles["control-column"]}>
        <button>share</button>
        <button>copy</button>
        <button>edit</button>
        <button>verify</button>
        <button>see verifications</button>
        <button className="delete--btn"> delete </button>
      </div>
    </div>
  );
  return (
    <div key={i} className={styles.person}>
      <AccordionElement id={i} header={header} body={body} />
    </div>
  );
};

export default PersonsData;
