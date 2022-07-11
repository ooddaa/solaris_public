import React, { useState } from "react";
import styles from "../../../styles/NaturalPersonForm.module.scss";
import { Formik, Form } from "formik";
import {
  NaturalPersonProps,
  NaturalPersonSchema,
} from "../../schemas/NaturalPerson";
import { sexEnum } from "../../schemas/enums";
import { toFormikValidationSchema } from "zod-formik-adapter";
import { fieldFabric, FieldAttributeProps } from "./FieldFabric";
import axios from "axios";
import { Button } from "@mantine/core";

interface NaturalPersonFormProps {
  addPerson: (data: string) => void;
}

interface AdhocFieldAttributeProps {
  control: {
    name: string,
    onChange: Function
  },

}

const NaturalPersonForm = ({ addPerson }: NaturalPersonFormProps) => {
  const [naturalPersonData] = useState<NaturalPersonProps>({
    FIRST_NAME: "lol", // required to complete Passport, but not unique identifier of a Passport in Neo4j
    LAST_NAME: "aaaa",
    SEX: "Male",
    PLACE_OF_BIRTH: "here",
    DATE_OF_BIRTH: "2020-01-01", //.regex(/[d]*4-[d]*2-[d]*2/),
    CURRENT_ADDRESS: "there",
    nickname: "",
    otherNames: "",
    previousNames: "",
  });

  const [adHocFields, setAdHocFileds] = useState<any>([])
  // const [adHocFields, setAdHocFileds] = useState<JSX.Element[]>([])

  /* 
    {
      type: "text",
      name: "FIRST_NAME",
      label: "First name",
    }
  */
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
      name: "nickname",
      label: "Nickname",
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
      label: "Current address",
    },
  ];

  const generateAdhocField = (formik: any) => {
    /**
     * generates a | [key] [value] [important] | fieldset?
     * which allows user to add any attributes to this NaturalPerson
     */
    // const newAddhocAttribute = (
    //   // <input type='text'/>
    //   <div>hey</div>
    // )
    const fields: FieldAttributeProps[] = [
      {
        type: "text",
        name: "whohohoh",
        label: "aosdaoi",
      }
    ]

    const rv: JSX.Element[] = fieldFabric(fields, formik)
    setAdHocFileds([...adHocFields, rv])
  }

  const writeToNeo4j = async (values: NaturalPersonProps) => {
    try {
      console.log(values);
      const data = await axios.post("/api/addNaturalPerson", values);
      console.log(data);
      addPerson(JSON.stringify(data?.data, null, 4));
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
        {(formik) => (
          <>
            <Form onSubmit={formik.handleSubmit}>
              <div className={styles.flex}>
                {/* minimum stuff */}
                <div className={styles.mainFields}>
                  {/* PERSONAL */}
                  <fieldset>
                    {/* <legend>Personal</legend> */}
                    {fieldFabric(personal, formik)}
                  </fieldset>
                </div>

                {/* add hoc props */}
                <div className={styles.adhocFields}>
                  {/* <fieldset>{fieldFabric(personal, formik)}</fieldset> */}
                  <Button onClick={() => generateAdhocField(formik)}>Add adhoc field</Button>
                  {adHocFields.map((ahf:JSX.Element) => ahf)}
                </div>
              </div>

              {/* buttons */}
              <div className="buttons">
                <Button className={styles.simpleBtn}>Clear all</Button>

                <Button type="submit" className={styles.submitBtn}>
                  Submit
                </Button>
              </div>
            </Form>
          </>
        )}
      </Formik>
    </div>
  );
};

export default NaturalPersonForm;
