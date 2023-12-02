import React, { useState, useEffect } from "react";

import FormSelect from "./../common/formSelect";

import FormInput from "../common/formInput";

function DhForm(props) {
  /* let [{ id_dh, id_fi }, setDefaultValue] = useState(props.defaultValue); */
  let [dhData, setDhData] = useState(props.dhData);
  let [fiData, setFiData] = useState(props.fiData);
  let [selectedFi, setSelectedFi] = useState(props.selectedRow.id_fi);
  let [selectedDh, setSelectedDh] = useState(props.selectedRow.id_dh);
  const handleChange = (name, value) => {
    if (props.onChange) props.onChange(name, value);
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    if (props.onSubmit) {        
        props.onSubmit();    
    }
  };

  /*   useEffect(() => {
    setDefaultValue(props.defaultValue);
  }, [props.defaultValue]); */

  useEffect(() => {
    setFiData(props.fiData);
  }, [props.fiData]);

  useEffect(() => {
    setSelectedFi(typeof props.selectedRow.id_fi !== 'undefined' ? props.selectedRow.id_fi : "");
    setSelectedDh(typeof props.selectedRow.id_dh !== 'undefined' ? props.selectedRow.id_dh : "");
  }, [props.selectedRow]);

  useEffect(() => {
    setDhData(props.dhData);
  }, [props.dhData]);

  return (
    <form
      id="dh-information-form"
      className="form pt-5"
      onSubmit={handleSubmit}
    >
      <FormSelect
        label="Select FI"
        name="id_fi"
        data={fiData}
        fullwidth={1}
        selectedValue={selectedFi}
        onChange={handleChange}
      />
      <FormSelect
        label="Select DH"
        name="id_dh"
        data={dhData}
        fullwidth={1}
        selectedValue={selectedDh}
        onChange={handleChange}
      />
      <FormInput
        name="dh_acc_no"
        type="text"
        label="Account Number"
        placeHolder="Enter Account Number"
        data={dhData}
        inputDefaultValue={typeof props.selectedRow.dh_acc_no !== 'undefined' ? props.selectedRow.dh_acc_no : ""}
        onChange={handleChange}
      />
    </form>
  );
}

export default DhForm;
