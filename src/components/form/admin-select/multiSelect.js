import React, { useState } from "react";
import { useField } from "formik";
import MultiSelect from "react-multi-select-component";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import styles from './multiselect.module.css';

const MultipleSelect = ({ label, ...props }) => {
  const [field, meta] = useField(props);

  const [selected, setSelected] = useState(props.initialSelected ? props.initialSelected : props.value);
  
  const overrideStrings = {
    "allItemsAreSelected": "All",
    "clearSearch": "Clear Search",
    "noOptions": "No options",
    "search": "Search",
    "selectAll": "Select All",
    "selectSomeItems": "Select..."
  }

  const handleChange = (value) => {
    setSelected(value);
    props.updateData(props.name, value);
  }
  return (
    <div className={styles.wrapper}>
      <div className={styles.label}>
        <FontAwesomeIcon
          icon={props.icon}
          size="2x"
          transform="shrink-6"
          className={`${styles.green} ${styles.callIcon}`}
        />

        {props.name}
      </div>
      <MultiSelect
        {...field} {...props}
        options={props.data}
        value={selected}
        onChange={handleChange}
        labelledBy={props.name}
        overrideStrings={overrideStrings}
        className={styles.input}        
        isLoading={props.isLoading}
      />

      {meta.touched && meta.error ? (
        <div className="error">{meta.error}</div>
      ) : null}
    </div>
  );
};

export default MultipleSelect;
