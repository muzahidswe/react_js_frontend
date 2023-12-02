import React, { useEffect, useState } from "react";
import styles from './select.module.css';

const Select = ({ label, ...props }) => {
  const [selected, setSelected] = useState();

  const handleChange = (event) => {
    setSelected(event.target.value);
    props.updateData(event.target.value);
  }

  useEffect(() => {
    let initialVal = document.getElementById('select').value;
    setSelected(initialVal);
    props.updateData(initialVal);
  }, [])

  return (
    <div className={styles.wrapper}>
      <select id="select" className={styles.input} onChange={handleChange}>
        {props.data?.map((data) => (
          data.value === new Date() ?
            <option value={data.value} selected>{data.label}</option>
            :
            <option value={data.value}>{data.label}</option>
          )
        )}
      </select>
    </div>
  );
};

export default Select;
