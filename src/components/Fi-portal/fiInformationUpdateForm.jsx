import React, { useState, useEffect } from "react";

import FormInput from "../common/formInput";

function ServiceTypeForm(props) {
  let [
    { name, branch, address, phone, email, contact_person_name },
    setDefaultValue,
  ] = useState(props.defaultValue);

  const handleChange = (name, value) => {
    if (props.onChange) props.onChange(name, value);
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    if (props.onSubmit) {
      props.onSubmit();
    }
  };

  useEffect(() => {
    //console.log("image nf  ",props.inputDefaultValue.image)
    setDefaultValue(props.defaultValue);
  }, [props.defaultValue]);

  return (
    <form
      id="fi-information-update-form"
      className="form pt-5"
      onSubmit={handleSubmit}
    >
      <FormInput
        name="name"
        type="text"
        label="Name"
        placeHolder="Enter  Name"
        inputDefaultValue={name}
        onChange={handleChange}
      />

      <FormInput
        name="branch"
        type="text"
        label="Branch"
        placeHolder="Enter  Branch"
        inputDefaultValue={branch}
        onChange={handleChange}
      />

      <FormInput
        name="address"
        type="text"
        label="Address"
        placeHolder="Enter Address"
        inputDefaultValue={address}
        onChange={handleChange}
      />
      <FormInput
        name="phone"
        type="text"
        label="Contact No."
        placeHolder="Enter Contact Number"
        inputDefaultValue={phone}
        onChange={handleChange}
      />
      <FormInput
        name="email"
        type="text"
        label="Email"
        placeHolder="Enter Email"
        inputDefaultValue={email}
        onChange={handleChange}
      />
      <FormInput
        name="contact_person_name"
        type="text"
        label="User Name"
        placeHolder="Enter Username"
        inputDefaultValue={contact_person_name}
        onChange={handleChange}
      />
      <div className="form-group row">
            <label className="col-xl-3 col-lg-3 text-right col-form-label">Logo</label>
            <div className="col-lg-9 col-xl-8">
                <input
                    type="file"
                    className={`form-control`}
                    name="logo"
                    id="uploadFileUpdate"
                />
            </div>
        </div>
    </form>
  );
}

export default ServiceTypeForm;
