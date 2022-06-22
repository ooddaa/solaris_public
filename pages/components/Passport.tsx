import React, { useState } from "react";
import styles from "../../styles/Passport.module.scss";
import { Formik } from "formik";
import { z } from "zod";
import { toFormikValidationSchema } from "zod-formik-adapter";
import { fieldFabric, FieldAttributeProps } from "./FieldFabric";
import axios from "axios";

const sexEnum = z.enum(["Male", "Female", "None"]);
// type SexEnum = z.infer<typeof sexEnum>;

const typeEnum = z.enum(["P", "ID"]);
// type TypeEnum = z.infer<typeof typeEnum>;

const codeOfIssuingStateEnum = z.enum(["ISR", "RUS", "GBR", "unknown"]);
// type CodeOfIssuingStateEnum = z.infer<typeof codeOfIssuingStateEnum>;

/**
 * There are two layers of "required props" expressed via schema. 
 * 1. Neo4j level.
 *    SNAKE_CASED   - "a required prop" which will be used to uniquely identify the Passport in Neo4j.
 *                    We can have > 1 of required props, makes a Node constrained on set of its keys.
 *    camelCased    - "an optional prop" - this does not affect the 'uniquness' of Passport in Neo4j.
 * 
 * 2. Zod level. 
 *    The usual API to implement the form validation. 
 * 
 * @example
 * [Neo4j, Zod] 
 * [required, required]
 * [optional, required]
 * [optional, optional]
 * 
 * note that [required, optional] is not possible as we want to guarantee that users is required to 
 * supply data that is required to make Neo4j Passport a unique entity.
 * 
 * We could just request one required prop - PASSPORT_NUMBER, but in terms of business domain usage, 
 * it's never enough just to know the passport number, dates of issue/expiry, authority are always 
 * asked for.
 */
const PassportSchema = z.object({
  /* document specific */
  TYPE: typeEnum,
  CODE_OF_ISSUING_STATE: codeOfIssuingStateEnum, // list of state codes
  PASSPORT_NUMBER: z.string().max(20),
  idNumber: z.string().max(20).optional(), // Israeli passport
  nationality: z.string().max(20),
  DATE_ISSUED: z.string(),
  DATE_EXPIRES: z.string(),
  ISSUING_AUTHORITY: z.string().max(20),
  
  /* person specific - wont */ 
  firstName: z.string().max(20),  // required to complete Passport, but not unique identifier of a Passport in Neo4j
  lastName: z.string().max(20),
  otherNames: z.string().max(20).optional(),
  sex: sexEnum,
  placeOfBirth: z.string().max(20),
  dateOfBirth: z.string(),
  otherProps: z.string().max(20).optional(),
});

export type PassportProps = z.infer<typeof PassportSchema>;
interface PassportComponentProps {
  onData: (data: string) => void
}

const Passport = ({ onData }: PassportComponentProps) => {
  const [passportData, setPassportData] = useState<PassportProps>({
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
    // OTHERPROP: "lol",
  });

  const docSpecific: FieldAttributeProps[] = [
    { type: "text", name: "TYPE", label: "Type" },
    {
      type: "select",
      name: "CODE_OF_ISSUING_STATE",
      label: "Issuing State",
      options: codeOfIssuingStateEnum.options
    },
    {
      type: "text",
      name: "PASSPORT_NUMBER",
      label: "Passport Number",
    },
    {
      type: "date",
      name: "DATE_ISSUED",
      label: "Date Issued",
    },
    {
      type: "date",
      name: "DATE_EXPIRES",
      label: "Date Expires"
    },
    {
      type: "text",
      name: "ISSUING_AUTHORITY",
      label: "Issuing Authority",
    },
    {
      type: "text",
      name: "nationality",
      label: "Nationality",
    },
  ];

  const personal: FieldAttributeProps[] = [
    {
      type: "text",
      name: "firstName",
      label: "First name",
    },
    {
      type: "text",
      name: "lastName",
      label: "Last name",
    },
    {
      type: "text",
      name: "otherNames",
      label: "Other names",
    },
    
    {
      type: "select",
      name: "sex",
      label: "Sex",
      options: sexEnum.options,
    },
    {
      type: "text",
      name: "placeOfBirth",
      label: "Place of birth",
    },
    {
      type: "date",
      name: "dateOfBirth",
      label: "Date of birth",
    },
  ];

  const writeToNeo4j = async (values: PassportProps) => {
    try {
      const data = await axios.post('/api/storePassport', values )
      // console.log(data)
      onData(JSON.stringify(data?.data, null, 4))
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <div className={styles.container}>
      <Formik
        initialValues={passportData}
        validationSchema={toFormikValidationSchema(PassportSchema)}
        onSubmit={async (values, { setSubmitting }) => {
          await writeToNeo4j(values);
        }}
      >
        {({
          errors,
          touched,
          handleSubmit,
        }) => (
          <>
          
          <form onSubmit={handleSubmit}>
            {/* DOCUMENT SPECIFIC */}
            <div className={styles.fields}>
            <fieldset>
              <legend>Document</legend>
              {fieldFabric(docSpecific, errors, touched)}
            </fieldset>

            {/* PERSONAL */}
            <fieldset>
              <legend>Personal</legend>
              {fieldFabric(personal, errors, touched)}
            </fieldset>
            </div>
            <div className="buttons">
            <button type="submit" className={styles.submitBtn}>Submit</button>

            </div>
          </form>
            </>
        )}
      </Formik>
    </div>
  );
};

export default Passport;
