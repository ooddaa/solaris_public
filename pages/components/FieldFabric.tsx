import { Tooltip } from "@mantine/core";
import { Field, getIn } from "formik";
import styles from "../../styles/Passport.module.scss";
import isArray from "lodash/isArray";

export interface FieldAttributeProps {
  type: "text" | "date" | "select" | "textarea",
  name: string,
  label: string,
  options?: string[],
}

export function fieldFabric(attributes: FieldAttributeProps[], errors: Object, touched: Object) {
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