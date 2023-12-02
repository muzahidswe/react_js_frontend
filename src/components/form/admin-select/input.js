import React, { useEffect, useState } from "react";
import styles from './input.module.css';

const Input = (props) => {
  const [selected, setSelected] = useState();
  const [maxDate, setMaxDate] = useState(new Date().toISOString().split('T')[0]);
  const handleChange = (event) => {
    setSelected(event.target.value);
    props.updateData(event.target.value);
  }

  useEffect(() => {
    setSelected(props.initialValue);
    props.updateData(props.initialValue);
  }, [])

  return (
    <div className={styles.wrapper}>
      {props.label &&
        <label htmlFor={props.id || props.name} className={styles.label}>{props.label}</label>
      }

      <input
        type={props.type || "text"}
        value={selected}
        className={styles.input}
        onChange={handleChange}
        max={maxDate}
      />
    </div>
  );
};

export default Input
