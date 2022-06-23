import React, { useState } from "react";
import styles from "../../../styles/NaturalPersonForm.module.scss";
import { Formik } from "formik";
import {
  NaturalPersonProps,
  NaturalPersonSchema,
} from "../../schemas/NaturalPerson";
import { sexEnum } from "../../schemas/enums";
import { toFormikValidationSchema } from "zod-formik-adapter";
import { fieldFabric, FieldAttributeProps } from "./FieldFabric";
import axios from "axios";

interface NaturalPersonFormProps {
  addPerson: (data: string) => void;
}

const NaturalPersonForm = ({ addPerson }: NaturalPersonFormProps) => {
  // const initialForm = NaturalPersonSchema.parse({})
  // console.log(initialForm)
  // const [naturalPersonData] = useState<NaturalPersonProps>(initialForm);
  const [naturalPersonData] = useState<NaturalPersonProps>({
    FIRST_NAME: 'lol',  // required to complete Passport, but not unique identifier of a Passport in Neo4j
  LAST_NAME: 'aaaa',
  SEX: 'Male',
  PLACE_OF_BIRTH: 'here',
  DATE_OF_BIRTH: '2020-01-01',//.regex(/[d]*4-[d]*2-[d]*2/),
  CURRENT_ADDRESS: 'there',
  });
  // console.log(naturalPersonData)

  const personal: FieldAttributeProps[] = [
    {
      type: "text",
      name: "FIRST_NAME",
      label: "First name",
    },
    {
      type: "text",
      name: "LAST_NAME",
      label: "Last name",
    },
    {
      type: "text",
      name: "otherNames",
      label: "Other names",
    },
    {
      type: "text",
      name: "previousNames",
      label: "Previous names",
    },

    {
      type: "select",
      name: "SEX",
      label: "Sex",
      options: sexEnum.options,
    },
    {
      type: "text",
      name: "PLACE_OF_BIRTH",
      label: "Place of birth",
    },
    {
      type: "date",
      name: "DATE_OF_BIRTH",
      label: "Date of birth",
    },
    {
      type: "text",
      name: "CURRENT_ADDRESS",
      label: "Date of birth",
    },
  ];

  const writeToNeo4j = async (values: NaturalPersonProps) => {
    try {
      console.log(values)
      // const data = await axios.post("/api/storePerson", values);
      // console.log(data)
      // addPerson(JSON.stringify(data?.data, null, 4));
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className={styles.container}>
      <Formik
        initialValues={naturalPersonData}
        validationSchema={toFormikValidationSchema(NaturalPersonSchema)}
        onSubmit={async (values, { setSubmitting }) => {
          await writeToNeo4j(values);
        }}
      >
        {({ errors, touched, handleSubmit }) => (
          <>
            <form onSubmit={handleSubmit}>
              <div className={styles.fields}>
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

export default NaturalPersonForm;
