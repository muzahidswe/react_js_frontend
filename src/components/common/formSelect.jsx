import React, { useEffect, useState } from "react";
/* import Select from "react-select"; */
function FormSelect(props) {
  const [name] = useState(props.name);
  const [data, setData] = useState(props.data);
  const [label] = useState(props.label);
  const [selectedData, updateSelectedData] = useState(props.selectedValue);

  const handleChange = (event)=> {      
    updateSelectedData(event.target.value);
  }

  useEffect(() => {
    if (props.onChange) props.onChange(name, selectedData);
    setData(props.data);
  }, [selectedData, props.data]);

  useEffect(() => {
    updateSelectedData(props.selectedValue)
  }, [props.selectedValue]);

  return (
    <div className="form-group row">
      {label && (
        <label className="col-xl-3 col-lg-3 text-right col-form-label">
          {label}
        </label>
      )}
      <div className={props.fullwidth? "col-lg-9 col-xl-9" : ""}>
        <select
          className="form-control"
          name={name}
          onChange={handleChange}
          selectedValue={selectedData}
          value={selectedData}          
        >
          <option value="">Select</option>
          {data.map((data) => (
            <option key={data.value} value={data.value}>
              {data.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
export default FormSelect;
