import React, { useState } from "react";
import styles from "../../styles/Passport.module.scss";
import { Formik, FieldProps } from "formik";
import { Tooltip, FloatingTooltip } from '@mantine/core';

interface PassportProps {
  type?: string; // P
  codeOfIssuingState?: string; // CountryTuple
  passportNumber: string; // alphanumeric
  firstName: string; // alphanumeric
  lastName: string; // alphanumeric
  // otherNames?: string[];
  otherNames?: string;
  nationality: string; // CountryTuple
  placeOfBirth: string; // Location
  dateOfBirth: string /* Date; */;
  sex: string; // M/F - anything else?
  dateIssued: string /* Date; */;
  dateExpires: string /* Date; */;
  issuingAuthority: string;
  otherProps?: string;
}

const Passport = () => {
  const [passportData, setPassportData] = useState<PassportProps>({
    type: "",
    codeOfIssuingState: "",
    passportNumber: "",
    firstName: "",
    lastName: "",
    otherNames: "",
    // otherNames: [],
    nationality: "",
    placeOfBirth: "",
    dateOfBirth: "" /* new Date(), */,
    sex: "",
    dateIssued: "" /* new Date(), */,
    dateExpires: "" /* new Date(), */,
    issuingAuthority: "",
    otherProps: "",
  });


  const validation = (values:PassportProps) => {
    const errors: { [key: string]: string } = {};

    if (!values.type) {
      errors.type = 'Required';
    } else if (values.type.length > 5) {
      errors.type = 'Must be 5 characters or less';
    }

    if (!values.firstName) {
      errors.firstName = 'Required';
    } else if (values.firstName.length > 15) {
      errors.firstName = 'Must be 15 characters or less';
    }

    if (!values.lastName) {
      errors.lastName = 'Required';
    } else if (values.lastName.length > 15) {
      errors.lastName = 'Must be 15 characters or less';
    }

    console.log(errors)
    return errors;
  }

  return (
    <div className={styles.passport}>
      <Formik
        initialValues={passportData}
        validate={validation}
        onSubmit={(values, { setSubmitting }) => {
          console.log(values);
        }}
      >
        {({ values, errors, touched, handleSubmit, handleChange, handleBlur }) => (
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
                opened={!!(touched.type && errors && errors.type)}>
                <input
                  type="text"
                  id="type"
                  name="type"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.type}
                />
                </Tooltip>
              </div>

              <div className={styles["attribute-container"]}>
                <label htmlFor="codeOfIssuingState">Issuing State: </label>
                <input
                  type="text"
                  id="codeOfIssuingState"
                  name="codeOfIssuingState"
                  onChange={handleChange}
                  value={values.codeOfIssuingState}
                />
              </div>

              <div className={styles["attribute-container"]}>
                <label htmlFor="passportNumber">Passport Number: </label>
                <input
                  type="text"
                  id="passportNumber"
                  name="passportNumber"
                  onChange={handleChange}
                  value={values.passportNumber}
                />
              </div>

              <div className={styles["attribute-container"]}>
                <label htmlFor="dateIssued">Date Issued: </label>
                <input
                  type="date"
                  id="dateIssued"
                  name="dateIssued"
                  onChange={handleChange}
                  value={values.dateIssued}
                />
              </div>
              <div className={styles["attribute-container"]}>
                <label htmlFor="dateExpires">Date Expires: </label>
                <input
                  type="date"
                  id="dateExpires"
                  name="dateExpires"
                  onChange={handleChange}
                  value={values.dateExpires}
                />
              </div>
              <div className={styles["attribute-container"]}>
                <label htmlFor="issuingAuthority">Issuing Authority: </label>
                <input
                  type="text"
                  id="issuingAuthority"
                  name="issuingAuthority"
                  onChange={handleChange}
                  value={values.issuingAuthority}
                />
              </div>
            </fieldset>

            {/* PERSONAL */}
            <fieldset>
              <legend>Personal</legend>

              <div className={styles["attribute-container"]}>
                <label htmlFor="firstName">First: </label>
                <Tooltip 
                  position="right" 
                  placement="center" 
                  gutter={10} 
                  color="red" 
                  withArrow 
                  transitionDuration={10}
                label={errors && errors.firstName}
                opened={!!(touched.firstName && errors && errors.firstName)}>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    onChange={handleChange}
                    value={values.firstName}
                  />
                </Tooltip>
              </div>

              <div className={styles["attribute-container"]}>
                <label htmlFor="lastName">Last: </label>
                <Tooltip 
                  position="right" 
                  placement="center" 
                  gutter={10} 
                  color="red" 
                  withArrow 
                  transitionDuration={10}
                label={errors && errors.lastName}
                opened={!!(touched.lastName && errors && errors.lastName)}>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  onChange={handleChange}
                  value={values.lastName}
                />
                </Tooltip>
              </div>

              <div className={styles["attribute-container"]}>
                <label htmlFor="otherNames">Others: </label>
                <input
                  type="text"
                  id="otherNames"
                  name="otherNames"
                  onChange={handleChange}
                  value={values.otherNames}
                />
              </div>
              <div className={styles["attribute-container"]}>
                <label htmlFor="nationality">Nationality: </label>
                <input
                  type="text"
                  id="nationality"
                  name="nationality"
                  onChange={handleChange}
                  value={values.nationality}
                />
              </div>
              <div className={styles["attribute-container"]}>
                <label htmlFor="placeOfBirth">Place of birth: </label>
                <input
                  type="text"
                  id="placeOfBirth"
                  name="placeOfBirth"
                  onChange={handleChange}
                  value={values.placeOfBirth}
                />
              </div>
              <div className={styles["attribute-container"]}>
                <label htmlFor="dateOfBirth">Date of birth: </label>
                <input
                  type="date"
                  id="dateOfBirth"
                  name="dateOfBirth"
                  onChange={handleChange}
                  value={values.dateOfBirth}
                />
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
