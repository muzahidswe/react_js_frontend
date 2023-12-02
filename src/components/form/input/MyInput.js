import React from "react";
import { useField } from "formik";
import styles from './MyInput.module.css';

const MyInput = ({ label, ...props }) => {
  const [field, meta] = useField(props);

  return (
    <div className={styles.wrapper}>
      <label htmlFor={props.id || props.name} className={styles.label}>{label}</label>
      <input className={styles.input} {...field} {...props} />
      {meta.touched && meta.error ? (
        <div className={styles.error}>{meta.error}</div>
      ) : null}
    </div>
  );
};

export default MyInput
