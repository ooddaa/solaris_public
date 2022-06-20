import React, { useState } from "react";
import styles from "../../styles/Passport.module.scss";
import { Formik, FieldProps } from "formik";
import { Tooltip, FloatingTooltip } from "@mantine/core";
import { z } from "zod";
import { toFormikValidationSchema } from 'zod-formik-adapter';

const dateSchema = z.preprocess((arg) => {
  if (typeof arg == "string" || arg instanceof Date) return new Date(arg);
}, z.date());
type DateSchema = z.infer<typeof dateSchema>;
// type DateSchema = Date

const sexEnum = z.enum(["Male", "Female", "None"]);
type SexEnum = z.infer<typeof sexEnum>;

const typeEnum = z.enum(["P", "ID"]);
type TypeEnum = z.infer<typeof typeEnum>;

const codeOfIssuingStateEnum = z.enum(["ISR", "RUS", "GBR", " "]);
type CodeOfIssuingStateEnum = z.infer<typeof codeOfIssuingStateEnum>;

const PassportSchema = z.object({
  type: typeEnum,
  // codeOfIssuingState: z.string().max(20), // list of state codes
  codeOfIssuingState: codeOfIssuingStateEnum, // list of state codes
  passportNumber: z.string().max(20),
  idNumber: z.optional(z.string().max(20)), // Israeli passport
  firstName: z
    .string()
    .max(20),
  lastName: z.string().max(20),
  otherNames: z.optional(z.string().max(20)),
  // otherNames: [],
  nationality: z.string().max(20),
  sex: sexEnum,
  placeOfBirth: z.string().max(20),
  dateOfBirth: z.string() /* new Date(), */,
  // dateIssued: dateSchema.safeParse() /* new Date(), */,
  dateIssued: z.string() /* new Date(), */,
  dateExpires: z.string() /* new Date(), */,
  issuingAuthority: z.string().max(20),
  otherProps: z.optional(z.string().max(20)),
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
    // otherNames: [],
    nationality: "",
    placeOfBirth: "",
    dateOfBirth: "" /* new Date(), */,
    sex: "None",
    dateIssued: "" /* new Date(), */,
    dateExpires: "" /* new Date(), */,
    issuingAuthority: "",
    otherProps: "",
  });

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
          getFieldProps
        }) => (
          <form onSubmit={handleSubmit}>
            {/* DOCUMENT SPECIFIC */}
            <fieldset>
              <legend>Document</legend>
              <div className={styles["attribute-container"]}>
                <label htmlFor="type">Type: </label>
                <Tooltip
                  position="right"
                  placement="center"
                  gutter={10}
                  color="red"
                  withArrow
                  transitionDuration={10}
                  label={errors && errors.type}
                  opened={!!(touched.type && errors && errors.type)}
                >
                  <input
                    type="text"
                    id="type"
                    {...getFieldProps('type')}
                  />
                </Tooltip>
              </div>

              <div className={styles["attribute-container"]}>
                <label htmlFor="codeOfIssuingState">Issuing State: </label>
                <Tooltip
                  position="right"
                  placement="center"
                  gutter={10}
                  color="red"
                  withArrow
                  transitionDuration={10}
                  label={errors && errors.codeOfIssuingState}
                  opened={!!(touched.codeOfIssuingState && errors && errors.codeOfIssuingState)}
                >
                <select
                  id="codeOfIssuingState"
                  {...getFieldProps('codeOfIssuingState')}
                >
                  {codeOfIssuingStateEnum.options.map((state) => (
                    <option key={state}>{state}</option>
                  ))}
                </select>
                </Tooltip>
              </div>

              <div className={styles["attribute-container"]}>
                <label htmlFor="passportNumber">Passport Number: </label>
                <Tooltip
                  position="right"
                  placement="center"
                  gutter={10}
                  color="red"
                  withArrow
                  transitionDuration={10}
                  label={errors && errors.passportNumber}
                  opened={!!(touched.passportNumber && errors && errors.passportNumber)}
                >
                <input
                  type="text"
                  id="passportNumber"
                  {...getFieldProps('passportNumber')}
                />
                </Tooltip>
              </div>

              <div className={styles["attribute-container"]}>
                <label htmlFor="dateIssued">Date Issued: </label>
                <Tooltip
                  position="right"
                  placement="center"
                  gutter={10}
                  color="red"
                  withArrow
                  transitionDuration={10}
                  label={errors && errors.dateIssued}
                  opened={!!(touched.dateIssued && errors && errors.dateIssued)}
                >
                <input
                  type="date"
                  id="dateIssued"
                  {...getFieldProps('dateIssued')}
                />
                </Tooltip>
              </div>
              <div className={styles["attribute-container"]}>
                <label htmlFor="dateExpires">Date Expires: </label>
                <Tooltip
                  position="right"
                  placement="center"
                  gutter={10}
                  color="red"
                  withArrow
                  transitionDuration={10}
                  label={errors && errors.dateExpires}
                  opened={!!(touched.dateExpires && errors && errors.dateExpires)}
                >
                <input
                  type="date"
                  id="dateExpires"
                  {...getFieldProps('dateExpires')}
                />
                </Tooltip>
              </div>
              <div className={styles["attribute-container"]}>
                <label htmlFor="issuingAuthority">Issuing Authority: </label>
                <Tooltip
                  position="right"
                  placement="center"
                  gutter={10}
                  color="red"
                  withArrow
                  transitionDuration={10}
                  label={errors && errors.issuingAuthority}
                  opened={!!(touched.issuingAuthority && errors && errors.issuingAuthority)}
                >
                <input
                  type="text"
                  id="issuingAuthority"
                  {...getFieldProps('issuingAuthority')}
                />
                </Tooltip>
              </div>
            </fieldset>

            {/* PERSONAL */}
            <fieldset>
              <legend>Personal</legend>

              <div className={styles["attribute-container"]}>
                <label htmlFor="firstName">First name: </label>
                <Tooltip
                  position="right"
                  placement="center"
                  gutter={10}
                  color="red"
                  withArrow
                  transitionDuration={10}
                  label={errors && errors.firstName}
                  opened={!!(touched.firstName && errors && errors.firstName)}
                >
                  <input
                    type="text"
                    id="firstName"
                    {...getFieldProps('firstName')}
                  />
                </Tooltip>
              </div>

              <div className={styles["attribute-container"]}>
                <label htmlFor="lastName">Last Name: </label>
                <Tooltip
                  position="right"
                  placement="center"
                  gutter={10}
                  color="red"
                  withArrow
                  transitionDuration={10}
                  label={errors && errors.lastName}
                  opened={!!(touched.lastName && errors && errors.lastName)}
                >
                  <input
                    type="text"
                    id="lastName"
                    {...getFieldProps('lastName')}
                  />
                </Tooltip>
              </div>

              <div className={styles["attribute-container"]}>
                <label htmlFor="otherNames">Other names: </label>
                <Tooltip
                  position="right"
                  placement="center"
                  gutter={10}
                  color="red"
                  withArrow
                  transitionDuration={10}
                  label={errors && errors.otherNames}
                  opened={!!(touched.otherNames && errors && errors.otherNames)}
                >
                <input
                  type="text"
                  id="otherNames"
                  {...getFieldProps('otherNames')}
                />
                </Tooltip>
              </div>
              <div className={styles["attribute-container"]}>
                <label htmlFor="nationality">Nationality: </label>
                <Tooltip
                  position="right"
                  placement="center"
                  gutter={10}
                  color="red"
                  withArrow
                  transitionDuration={10}
                  label={errors && errors.nationality}
                  opened={!!(touched.nationality && errors && errors.nationality)}
                >
                <input
                  type="text"
                  id="nationality"
                  {...getFieldProps('nationality')}
                />
                </Tooltip>
              </div>

              <div className={styles["attribute-container"]}>
                <label htmlFor="sex">Sex: </label>
                <Tooltip
                  position="right"
                  placement="center"
                  gutter={10}
                  color="red"
                  withArrow
                  transitionDuration={10}
                  label={errors && errors.sex}
                  opened={!!(touched.sex && errors && errors.sex)}
                >
                <select
                  id="sex"
                  {...getFieldProps('sex')}
                >
                  {sexEnum.options.map((sex) => (
                    <option key={sex}>{sex}</option>
                  ))}
                </select>
                </Tooltip>
              </div>

              <div className={styles["attribute-container"]}>
                <label htmlFor="placeOfBirth">Place of birth: </label>
                <Tooltip
                  position="right"
                  placement="center"
                  gutter={10}
                  color="red"
                  withArrow
                  transitionDuration={10}
                  label={errors && errors.placeOfBirth}
                  opened={!!(touched.placeOfBirth && errors && errors.placeOfBirth)}
                >
                <input
                  type="text"
                  id="placeOfBirth"
                  {...getFieldProps('placeOfBirth')}
                />
                </Tooltip>
              </div>
              <div className={styles["attribute-container"]}>
                <label htmlFor="dateOfBirth">Date of birth: </label>
                <Tooltip
                  position="right"
                  placement="center"
                  gutter={10}
                  color="red"
                  withArrow
                  transitionDuration={10}
                  label={errors && errors.dateOfBirth}
                  opened={!!(touched.dateOfBirth && errors && errors.dateOfBirth)}
                >
                <input
                  type="date"
                  id="dateOfBirth"
                  {...getFieldProps('dateOfBirth')}
                />
                </Tooltip>
              </div>
            </fieldset>
            <button type="submit">Submit</button>
          </form>
        )}
      </Formik>
    </div>
  );
};

export default Passport;
