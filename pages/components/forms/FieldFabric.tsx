import { Tooltip, TextInput, Text, Select } from "@mantine/core";
import { DatePicker } from "@mantine/dates";
import { FormikProps, getIn } from "formik";
import { isArray } from "lodash";
import styles from "../../../styles/AttributeContainer.module.scss";

export interface FieldAttributeProps {
  type?: "text" | "date" | "select" | "textarea";
  name: string;
  id?: string;
  label: string;
  options?: string[];
}
export interface TextFieldAttributeProps extends FieldAttributeProps {
  type: "text" | "textarea";
}

export interface DateFieldAttributeProps extends FieldAttributeProps {
  type: "date";
}
export interface SelectFieldAttributeProps extends FieldAttributeProps {
  type: "select";
  options: string[];
}

/**
 * https://formik.org/docs/tutorial#leveraging-react-context
 */

export function fieldFabric(
  attributes: FieldAttributeProps[],
  formik: FormikProps<any>
) {
  // let element;
  // if (type === 'date') {
  //   element = <DatePicker {...formik.getFieldProps(name)} />
  // } else if (type === 'text') {
  //   element = <TextInput className={styles["text-input"]} {...formik.getFieldProps(name)} />
  // } else if (type === 'select') {
  //   element = <Select className={styles["text-input"]} {...formik.getFieldProps(name)} />
  // }
  const makeTextInput = MyTextInput(formik);
  const makeDateInput = MyDateInput(formik);
  const makeSelectInput = MySelectInput(formik);
  return attributes.map(({ type, ...attr }) => {
    if (type === "text") {
      return makeTextInput({ type, ...attr });
    } else if (type === "date") {
      return makeDateInput({ type, ...attr });
    } else if (type === "select") {
      return makeSelectInput({ type, ...attr });
    }
  });
}

function MyTextInput(formik: FormikProps<any>): Function {
  return function inner({ label, name, id, type }: TextFieldAttributeProps) {
    if (!["text", "textarea"].includes(type)) {
      throw new Error(
        `MyTextInput: unsupported type ${type}. Must be text | textarea.`
      );
    }

    return (
      <div key={id || name} className={styles["attribute-input-container"]}>
        <label htmlFor={id || name}>
          <Text color="dimmed" className={styles["label"]} size="sm">
            {label}:{" "}
          </Text>
        </label>
        <Tooltip
          position="right"
          placement="center"
          gutter={10}
          color="red"
          withArrow
          transitionDuration={10}
          label={formik.errors && getIn(formik.errors, name)}
          opened={
            !!(
              getIn(formik.touched, name) &&
              formik.errors &&
              getIn(formik.errors, name)
            )
          }
        >
          <TextInput
            className={styles["text-input"]}
            {...formik.getFieldProps(name)}
          />
        </Tooltip>
      </div>
    );
  };
}

function MyDateInput(formik: FormikProps<any>): Function {
  return function inner({ label, name, id, type }: DateFieldAttributeProps) {
    if (!["date"].includes(type)) {
      throw new Error(`MyDateInput: unsupported type ${type}. Must be date.`);
    }

    return (
      <div key={id || name} className={styles["attribute-input-container"]}>
        <label htmlFor={id || name}>
          <Text color="dimmed" className={styles["label"]} size="sm">
            {label}:{" "}
          </Text>
        </label>
        <Tooltip
          position="right"
          placement="center"
          gutter={10}
          color="red"
          withArrow
          transitionDuration={10}
          label={formik.errors && getIn(formik.errors, name)}
          opened={
            !!(
              getIn(formik.touched, name) &&
              formik.errors &&
              getIn(formik.errors, name)
            )
          }
        >
          <input
            className={styles["date-input"]}
            type="date"
            {...formik.getFieldProps(name)}
          />
          {/* <DatePicker
            className={styles["date-input"]}
            type='date'
            {...formik.getFieldProps(name)}
          /> */}
        </Tooltip>
      </div>
    );
  };
}

function MySelectInput(formik: FormikProps<any>): Function {
  return function inner({
    label,
    name,
    id,
    type,
    options,
  }: SelectFieldAttributeProps) {
    if (!["select"].includes(type)) {
      throw new Error(
        `MySelectInput: unsupported type ${type}. Must be select.`
      );
    }

    return (
      <div key={id || name} className={styles["attribute-input-container"]}>
        <label htmlFor={id || name}>
          <Text color="dimmed" className={styles["label"]} size="sm">
            {label}:{" "}
          </Text>
        </label>
        <Tooltip
          position="right"
          placement="center"
          gutter={10}
          color="red"
          withArrow
          transitionDuration={10}
          label={formik.errors && getIn(formik.errors, name)}
          opened={
            !!(
              getIn(formik.touched, name) &&
              formik.errors &&
              getIn(formik.errors, name)
            )
          }
        >
          <select
            className={styles["select-input"]}
            {...formik.getFieldProps(name)}
          >
            {options && isArray(options) && options.map((option: string) => {
              return <option key={option}>{option}</option>
            })}
          </select>
          {/* {options && isArray(options) && (
            <Select
              className={styles["select-input"]}
              {...formik.getFieldProps(name)}
              data={options.map((option: string) => {
                return { value: option, label: option };
              })}
            />
          )} */}
        </Tooltip>
      </div>
    );
  };
}
