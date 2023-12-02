import React, { useState, useEffect } from "react";

import FormMultiSelect from "../common/formMultiSelect";
import FormSelect from "../common/formSelect";

import FormInput from "../common/formInput";

function DhForm(props) {
  /* let [{ id_dh, id_fi }, setDefaultValue] = useState(props.defaultValue); */
  let [documentData, setDhData] = useState(props.documentData);
  let [fiData, setFiData] = useState(props.fiData);
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
    setDhData(props.documentData);
  }, [props.documentData]);

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
        fullwidth={true}
        onChange={handleChange}
      />
      <FormMultiSelect
        label="Select Docs"
        name="id_document_title"
        data={documentData}
        onChange={handleChange}
      />
    </form>
  );
}

export default DhForm;
