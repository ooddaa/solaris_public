import React, { useState } from "react";
import styles from "../../styles/Passport.module.scss";
import { Formik, Field, getIn } from "formik";
import { Tooltip } from "@mantine/core";
import { z } from "zod";
import { toFormikValidationSchema } from "zod-formik-adapter";
import isArray from "lodash/isArray";
import axios from "axios";

const sexEnum = z.enum(["Male", "Female", "None"]);
// type SexEnum = z.infer<typeof sexEnum>;

const typeEnum = z.enum(["P", "ID"]);
// type TypeEnum = z.infer<typeof typeEnum>;

const codeOfIssuingStateEnum = z.enum(["ISR", "RUS", "GBR", "unknown"]);
// type CodeOfIssuingStateEnum = z.infer<typeof codeOfIssuingStateEnum>;

interface FieldAttributeProps {
  type: "text" | "date" | "select" | "textarea",
  name: string,
  label: string,
  options?: string[],
}

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
  // OTHERPROP: z.string().max(20).optional(),
});



function optionalKeys<Schema extends z.SomeZodObject>(
  objectSchema: Schema
): string[] {
  return Object.entries(objectSchema.shape).reduce(
    (acc: string[], [key, value]) => {
      if (value.isOptional()) {
        return [...acc, key];
      }
      return acc;
    },
    []
  );
}

// console.log(optionalKeys(PassportSchema))

export type PassportProps = z.infer<typeof PassportSchema>;

const Passport = () => {
  const [passportData, setPassportData] = useState<PassportProps>({
    TYPE: "P",
    CODE_OF_ISSUING_STATE: "unknown",
    PASSPORT_NUMBER: "",
    firstName: "",
    lastName: "",
    otherNames: "",
    nationality: "",
    placeOfBirth: "",
    dateOfBirth: "",
    sex: "None",
    DATE_ISSUED: "",
    DATE_EXPIRES: "",
    ISSUING_AUTHORITY: "",
    otherProps: "",
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
      label: "sex",
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
      const rv = await axios.post('/api/storePassport', values )
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <div className={styles.passport}>
      <Formik
        initialValues={passportData}
        validationSchema={toFormikValidationSchema(PassportSchema)}
        onSubmit={async (values, { setSubmitting }) => {
          await writeToNeo4j(values);
        }}
      >
        {({
          values,
          errors,
          touched,
          handleSubmit,
          handleChange,
          handleBlur,
          getFieldProps,
        }) => (
          <form onSubmit={handleSubmit}>
            {/* DOCUMENT SPECIFIC */}
            <fieldset>
              <legend>Document</legend>
              {fieldFabricWorker(docSpecific, errors, touched)}
            </fieldset>

            {/* PERSONAL */}
            <fieldset>
              <legend>Personal</legend>
              {fieldFabricWorker(personal, errors, touched)}
            </fieldset>
            <button type="submit">Submit</button>
          </form>
        )}
      </Formik>
    </div>
  );
};

function fieldFabricWorker(attributes: FieldAttributeProps[], errors: Object, touched: Object) {
  return attributes.map(({ type, name, label, options }: FieldAttributeProps) => {
    if (!["text", "date", "select"].includes(type)) {
      throw new Error(`Unsupported type: ${type}. Must be text | date.`);
    }
    return (
      <div key={name} className={styles["attribute-container"]}>
        <label htmlFor={name}>{label}: </label>
        <Tooltip
          position="right"
          placement="center"
          gutter={10}
          color="red"
          withArrow
          transitionDuration={10}
          label={errors && getIn(errors, name)}
          opened={
            !!(getIn(touched, name) && errors && getIn(errors, name))
          }
        >
          {["text", "date"].includes(type) ? (
            <Field name={name} type={type} />
          ) : (
            <Field name={name} as={type}>
              {type === "select" &&
                options &&
                isArray(options) &&
                options.map((option: any) => {
                  return (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  );
                })}
            </Field>
          )}
        </Tooltip>
      </div>
    );
  });
}

export default Passport;