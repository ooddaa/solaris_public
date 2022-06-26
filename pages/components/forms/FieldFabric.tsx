import { Tooltip, TextInput, Text } from "@mantine/core";
import { FormikProps, getIn } from "formik";
import styles from "../../../styles/AttributeContainer.module.scss";

export interface FieldAttributeProps {
  type: "text" | "date" | "select" | "textarea",
  name: string,
  id?: string,
  label: string,
  options?: string[],
}
export interface TextFieldAttributeProps {
  type: "text" | "date" | "select" | "textarea",
  name: string,
  id?: string,
  label: string,
}

/**
 * https://formik.org/docs/tutorial#leveraging-react-context
 */

export function fieldFabric(attributes: TextFieldAttributeProps[],  formik: FormikProps<any>) {
  return attributes.map(function MyTextInput({ label, name, id, type }: TextFieldAttributeProps) {
    if (!["text", "date", "select", "textarea"].includes(type)) {
      throw new Error(`Unsupported type: ${type}. Must be text | date.`);
    }
    return (
      <div key={id || name} className={styles["attribute-input-container"]}>
        <label htmlFor={id || name}><Text color="dimmed" className={styles["label"]} size='sm'>{label}: </Text></label>
        <Tooltip
          position="right"
          placement="center"
          gutter={10}
          color="red"
          withArrow
          transitionDuration={10}
          label={formik.errors && getIn(formik.errors, name)}
          opened={
            !!(getIn(formik.touched, name) && formik.errors && getIn(formik.errors, name))
          }
        >
          <TextInput className={styles["text-input"]} {...formik.getFieldProps(name)} />
        </Tooltip>
      </div>
    );
  });
}