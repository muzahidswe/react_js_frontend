import React, { useState, useEffect } from "react";

function FormInputFile(props) {
  const [inputName] = useState(props.name);
  const [inputType] = useState(props.type);
  const [label] = useState(props.label);
  /*  const [defaultValue] = useState(props.defaultValue); */
  const [placeholder] = useState(props.placeHolder);
  const [value, setValue] = useState(props.defaultValue);
  function handleChange(event) {
    setValue([...event.target.files]);
    /* event.target.files.map((file) => {
      console.log("main file ", file);
    }); */
  }

  useEffect(() => {
    if (props.onChange) {
      props.onChange(inputName, value);
    }
  }, [inputName, value]);

  useEffect(() => {
    setValue(props.defaultValue);
  }, [props.defaultValue]);
  return (
    <>
      <div className="form-group row">
        <label className="col-xl-3 col-lg-3 text-right col-form-label">
          {label}
        </label>
        <div className="col-lg-9 col-xl-6">
          <input
            className="form-control form-control-lg form-control-solid class_number"
            type={inputType}
            //defaultValue={defaultValue}
            multiple
            name={inputName}
            placeholder={placeholder}
            onChange={handleChange}
          />
        </div>
      </div>
    </>
  );
}
export default FormInputFile;
