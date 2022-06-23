import React, { useState } from "react";
import styles from "../../../styles/PassportForm.module.scss";
import { Formik } from "formik";
import { PassportProps, PassportSchema } from "../../schemas/Passport";
import { sexEnum, typeEnum, codeOfIssuingStateEnum } from "../../schemas/enums";
import { toFormikValidationSchema } from "zod-formik-adapter";
import { fieldFabric, FieldAttributeProps } from "./FieldFabric";
import axios from "axios";

interface PassportFormProps {
  addPassport: (data: string) => void;
}

const PassportForm = ({ addPassport }: PassportFormProps) => {
  const [passportData] = useState<PassportProps>({
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
  });

  const docSpecific: FieldAttributeProps[] = [
    { type: "text", name: "TYPE", label: "Type" },
    {
      type: "select",
      name: "CODE_OF_ISSUING_STATE",
      label: "Issuing State",
      options: codeOfIssuingStateEnum.options,
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
      label: "Date Expires",
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
      const data = await axios.post("/api/storePassport", values);
      addPassport(JSON.stringify(data?.data, null, 4));
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className={styles.container}>
      <Formik
        initialValues={passportData}
        validationSchema={toFormikValidationSchema(PassportSchema)}
        onSubmit={async (values, { setSubmitting }) => {
          await writeToNeo4j(values);
        }}
      >
        {({ errors, touched, handleSubmit }) => (
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
                <button type="submit" className={styles.submitBtn}>
                  Submit
                </button>
              </div>
            </form>
          </>
        )}
      </Formik>
    </div>
  );
};

export default PassportForm;
