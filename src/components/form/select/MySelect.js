import React from "react";
import { useField } from "formik";
import styles from './myselect.module.css';

const MySelect = ({ label, ...props }) => {
  const [field, meta] = useField(props);

  return (
    <div className={styles.wrapper}>
      <label htmlFor={props.id || props.name} className={styles.label}>{label}</label>
      <select className={styles.input} {...field} {...props}>
        {props.data?.map((data) => (
            <option value={data._id}>{data.title}</option>
          )
        )}
      </select>

      {meta.touched && meta.error ? (
        <div className="error">{meta.error}</div>
      ) : null}
    </div>
  );
};

export default MySelect;
