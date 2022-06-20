import React, { useState } from "react";
import styles from "../../styles/Passport.module.scss";
import { Formik, Field, getIn } from "formik";
import { Tooltip } from "@mantine/core";
import { z } from "zod";
import { toFormikValidationSchema } from "zod-formik-adapter";
import isArray from "lodash/isArray";

const sexEnum = z.enum(["Male", "Female", "None"]);
type SexEnum = z.infer<typeof sexEnum>;

const typeEnum = z.enum(["P", "ID"]);
type TypeEnum = z.infer<typeof typeEnum>;

const codeOfIssuingStateEnum = z.enum(["ISR", "RUS", "GBR", " "]);
type CodeOfIssuingStateEnum = z.infer<typeof codeOfIssuingStateEnum>;

interface FieldAttributeProps {
  type: "text" | "date" | "select" | "textarea",
  name: string,
  label: string,
  options?: string[],
}

const PassportSchema = z.object({
  type: typeEnum,
  codeOfIssuingState: codeOfIssuingStateEnum, // list of state codes
  passportNumber: z.string().max(20),
  idNumber: z.string().max(20).optional(), // Israeli passport
  firstName: z.string().max(20),
  lastName: z.string().max(20),
  otherNames: z.string().max(20).optional(),
  nationality: z.string().max(20),
  sex: sexEnum,
  placeOfBirth: z.string().max(20),
  dateOfBirth: z.string(),
  dateIssued: z.string(),
  dateExpires: z.string(),
  issuingAuthority: z.string().max(20),
  otherProps: z.string().max(20).optional(),
});

type PassportProps = z.infer<typeof PassportSchema>;

const Passport = () => {
  const [passportData, setPassportData] = useState<PassportProps>({
    type: "P",
    codeOfIssuingState: " ",
    passportNumber: "",
    firstName: "",
    lastName: "",
    otherNames: "",
    nationality: "",
    placeOfBirth: "",
    dateOfBirth: "",
    sex: "None",
    dateIssued: "",
    dateExpires: "",
    issuingAuthority: "",
    otherProps: "",
  });

  const docSpecific: FieldAttributeProps[] = [
    { type: "text", name: "type", label: "Type" },
    {
      type: "text",
      name: "codeOfIssuingState",
      label: "Issuing State",
    },
    {
      type: "text",
      name: "passportNumber",
      label: "Passport Number",
    },
    {
      type: "date",
      name: "dateIssued",
      label: "Date Issued",
    },
    {
      type: "date",
      name: "dateExpires",
      label: "Date Expires",
    },
    {
      type: "text",
      name: "issuingAuthority",
      label: "Issuing Authority",
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
      type: "text",
      name: "nationality",
      label: "Nationality",
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

  return (
    <div className={styles.passport}>
      <Formik
        initialValues={passportData}
        validationSchema={toFormikValidationSchema(PassportSchema)}
        onSubmit={(values, { setSubmitting }) => {
          console.log(values);
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
