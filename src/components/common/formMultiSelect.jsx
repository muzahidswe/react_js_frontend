import React, { useEffect, useState } from "react";
import Select from "react-select";
function FormSelect(props) {
  const [name] = useState(props.name);
  const [data, setData] = useState(props.data);
  //const [key, setKey] = useState(props.key);
  const [label] = useState(props.label);
  const [selectedData, updateSelectedData] = useState("");
  function handleChange(event) {
    updateSelectedData(event);
  }

  /*   useEffect(() => {
    if (props.onChange) props.onChange(name, selectedData);
    setData(props.data);
  }, [selectedData, props.data]); */

  useEffect(() => {
    if (props.onChange) props.onChange(name, selectedData);
    setData(props.data);
  }, [selectedData, props.data]);

  return (
    <div className="form-group row">
      <label className="col-xl-3 col-lg-3 text-right col-form-label">
        {label}
      </label>
      <div className="col-lg-9 col-xl-9">
        <Select
          isMulti
          //key={props.key || ""}
          name={name}
          options={data}
          onChange={handleChange}
          className="basic-multi-select"
          classNamePrefix="select"
        />
      </div>
    </div>
  );
}
export default FormSelect;
