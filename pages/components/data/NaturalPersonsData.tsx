import React, { useState } from "react";
import styles from "../../../styles/NaturalPersonsData.module.scss";
// import { stringify } from 'mango'
import axios from "axios";
import { isArray } from "lodash";
import { AccordionElement } from "../AccordionElement";
import type { EnhancedNode, Relationship, GetAllNaturalPersonsResponse, NaturalPersonStatistics } from "../../types";
import { Button } from "@mantine/core";

interface NaturalPersonsDataProps {
  onData?: (data: string) => void;
  onVerificationRequest: (data: any) => void;
}

function NaturalPersonsData({
  onVerificationRequest,
}: NaturalPersonsDataProps) {
  const [persons, setPersons] = useState<[EnhancedNode, NaturalPersonStatistics][]>([]);
  const [verify, toggleVerify] = useState<boolean>(false);

  const getAllNaturalPersons = async () => {
    try {
      const response = await axios.get("/api/getAllNaturalPersons");
      const result: GetAllNaturalPersonsResponse = response?.data;
      if (!result.success) {
        throw new Error(
          `NaturalPersonsData.getAllNaturalPersons: result was not a success.\nresult: ${JSON.stringify(result, null, 4)}`
        );
      }
      const allPersons: [EnhancedNode, NaturalPersonStatistics][] = result.data;
      // console.log(allPersons)

      /* checks */
      if (!allPersons) return;
      if (!isArray(allPersons)) {
        throw new Error(
          `NaturalPersonsData.getAllNaturalPersons: allPersons must be array.\n${JSON.stringify(allPersons, null, 4)}`
        );
      }
      setPersons(allPersons);
    } catch (error) {
      console.error(error);
    }
  };

  /**
   * This grabs all persons attributes and creates VerificationRequest for each. 
   * @param {EnhancedNode} person 
   */
  const addNaturalPersonVerificationRequest = async (person: EnhancedNode) => {
    try {
      const response = await axios.post(
        "/api/addNaturalPersonVerificationRequest",
        person
      );
      const result = response?.data;
      if (!result.success) {
        throw new Error(
          `NaturalPersonsData.addNaturalPersonVerificationRequest: result was not a success.\nresult: ${JSON.stringify(result, null, 4)}`
        );
      }
      const verificationRequests: Relationship[] = result.data; // Relationship[]
      // console.log(verificationRequests);

      /**
       * Once we've got back results, we want to render them in DataEntryWindow for user to interact with them.
       * onVerificationRequest just sets verificationRequests state in Parent state holder - index.tsx. verificationRequests is passed to DataDisplayWindow->VerifyNaturalPersonForm.
       * @todo Transform into a VerificationRequest[] before sending
       */
      onVerificationRequest(verificationRequests);

    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className={styles.container}>
      <Button
        onClick={getAllNaturalPersons}
        className={styles.getAllButton}
        variant="gradient"
        gradient={{ from: "orange", to: "red", deg: 90 }}
      >
        Get all Persons
      </Button>
      <div
        className={`persons-data ${styles["persons-data"]} ${styles.container}`}
      >
        {persons && persons.length
          ? persons.map(([person, stats], i) =>
              producePersonCard(
                person,
                i,
                verify,
                toggleVerify,
                addNaturalPersonVerificationRequest,
                stats.baseScore
              )
            )
          : `persons found: ${persons.length}`}
      </div>
    </div>
  );
}

const producePersonCard = (
  person: EnhancedNode,
  i: number,
  verify: boolean,
  toggleVerify: Function,
  addNaturalPersonVerificationRequest: Function,
  personVerificationScore: number, // make it simple atm
): JSX.Element => {
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
      <div className={styles["verification-score"]}>
        Total score: {personVerificationScore}
      </div>
      <div className={styles["data-column"]}>
        <table>
          <tbody>
            <tr>
              <td style={{color: 'grey'}}>First Name</td>
              <td>{properties.FIRST_NAME}</td>
              {verify && (
                <td>
                  <input type="checkbox"></input>
                </td>
              )}
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

        <button
          onClick={() => {
            console.log("verify", verify);
            toggleVerify((v: boolean) => !v);
          }}
        >
          verify
        </button>

        <button onClick={() => addNaturalPersonVerificationRequest(person)}>
          verify all
        </button>
        <button className="delete--btn"> delete </button>
      </div>
    </div>
  );
  return (
    <div key={i}>
      <AccordionElement id={i} header={header} body={body} />
    </div>
  );
};

export default NaturalPersonsData;
