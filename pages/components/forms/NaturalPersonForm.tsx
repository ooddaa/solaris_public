import React, { useState, ChangeEvent } from "react";
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
import identity from "lodash/identity";
import findIndex from "lodash/findIndex";
import { v4 as uuidv4 } from "uuid";

interface NaturalPersonFormProps {
  addPerson: (data: string) => void;
}

interface AdhocKey {
  uuid: string;
  type: "key";
  value: string;
}
interface AdhocValue {
  uuid: string;
  type: "value";
  value: string;
}
interface AdhocFieldContainer {
  key: AdhocKey, value: AdhocValue
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

  const [adHocFields, setAdHocFileds] = useState<AdhocFieldContainer[]>([]);

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

  /**
   * @because I need to control the inputs created with generateAdhocField. writeToNeo4j will transform each AdhocFieldContainer into an additional key-value pair on values object and send to API to be written to Neo4j.
   * 
   * @param type 
   * @param e 
   * @param uuid 
   */
  const handleChange = (
    type: "key" | "value",
    e: ChangeEvent<HTMLInputElement>,
    uuid: string
  ) => {
    const newAdhocFields: any[] = [...adHocFields];
    const index = findIndex(
      newAdhocFields,
      (adHocField) => {
        console.log(adHocField)
        return adHocField[type]['uuid'] === uuid
      }
    );

    if (index === -1) {
      throw new Error(
        `uuid ${uuid} was not found among adHocFields.\nadHocFields ${JSON.stringify(adHocFields, null, 4)}`
      );
    }

    newAdhocFields[index][type]['value'] = e.target["value"];
    setAdHocFileds(newAdhocFields);
  };

  /**
   * @because I need to generate two input fields - to grab "key" and "value" - user can enter arbitrary attributes and get those stored in Neo4j.
   * @param formik 
   */
  const generateAdhocField = (formik: any) => {
    /**
     * generates a | [key] [value] [important] | fieldset?
     * which allows user to add any attributes to this NaturalPerson
     */

    /* make an idetifier to glue this together on submission */
    const uuid = uuidv4();

    const key: AdhocKey = { uuid, type: "key", value: "" };
    const value: AdhocValue = { uuid, type: "value", value: "" };
    setAdHocFileds([...adHocFields, { key, value }]);
  };

  const writeToNeo4j = async (values: NaturalPersonProps) => {
    try {
      console.log('main values', values);
      console.log('adHoc values', adHocFields);
      /** now glue together adHocFields and add to values */
      // const data = await axios.post("/api/addNaturalPerson", values);
      // console.log(data);
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
                <div className={styles.adhocFieldsContainer}>
                  {/* <fieldset>{fieldFabric(personal, formik)}</fieldset> */}
                  <fieldset>
                    <Button onClick={() => generateAdhocField(formik)}>
                      Add adhoc field
                    </Button>
                    <div className={styles.adhocFields}>
                      {/* {adHocFields.map(identity)} */}
                      {/* {adHocFields.map((ahf:JSX.Element) => ahf)} */}
                      {adHocFields.map(({ key, value }) => {
                          return <div key={key.uuid}>
                            {/* {`${key.uuid === value.uuid}`} */}
                            <input type='text' value={key.value} onChange={(e) => handleChange(key.type, e, key.uuid)}/>
                            <input type='text' value={value.value} onChange={(e) => handleChange(value.type, e, value.uuid)}/>

                          </div>
                      })}
                    </div>
                  </fieldset>
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
