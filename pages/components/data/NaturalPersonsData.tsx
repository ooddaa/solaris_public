import React, { useState } from "react";
import styles from "../../../styles/NaturalPersonsData.module.scss";
import axios from "axios";
import { isArray } from "lodash";
import { AccordionElement } from "../AccordionElement";
import type { EnhancedNode } from "../../types";
import { Button } from "@mantine/core";

interface NaturalPersonsDataProps {
  onData?: (data: string) => void;
  onVerificationRequest: (data: any) => void;
}

function NaturalPersonsData({
  onVerificationRequest,
}: NaturalPersonsDataProps) {
  const [persons, setPersons] = useState<EnhancedNode[]>([]);
  const [verify, toggleVerify] = useState<boolean>(false);

  const getAllNaturalPersons = async () => {
    try {
      const response = await axios.get("/api/getAllNaturalPersons");
      const result = response?.data;
      if (!result.success) {
        throw new Error(
          `NaturalPersonsData.getAllNaturalPersons: result was not a success.\nresult: ${JSON.stringify(
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
          `NaturalPersonsData.getAllNaturalPersons: allPersons must be array.\n${JSON.stringify(
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

  const addNaturalPersonVerificationRequest = async (person: EnhancedNode) => {
    try {
      const response = await axios.post(
        "/api/addNaturalPersonVerificationRequest",
        person
      );
      const result = response?.data;
      if (!result.success) {
        throw new Error(
          `NaturalPersonsData.addNaturalPersonVerificationRequest: result was not a success.\nresult: ${JSON.stringify(
            result,
            null,
            5
          )}`
        );
      }
      const verificationRequests = result.data; // Relationship[]
      console.log(verificationRequests);

      /**
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
          ? persons.map((person, i) =>
              producePersonCard(
                person,
                i,
                verify,
                toggleVerify,
                addNaturalPersonVerificationRequest
              )
            )
          : `persons found: ${persons.length}`}
      </div>
    </div>
  );
}

const PersonCard = () => {};

const producePersonCard = (
  person: EnhancedNode,
  i: number,
  verify: boolean,
  toggleVerify: Function,
  addNaturalPersonVerificationRequest: Function
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
      <div className={styles["data-column"]}>
        <table>
          <tbody>
            <tr>
              <td>First Name</td>
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
    <div key={i} className={styles.person}>
      <AccordionElement id={i} header={header} body={body} />
    </div>
  );
};

export default NaturalPersonsData;
