import React, { useState, useEffect } from "react";

import FormInput from "../../common/formInput";

import FormSelect from "../../common/formSelect";
import FormMultiSelect from "../../common/formMultiSelect";

const duration_year = [
  { label: "1 Year", value: 1 },
  { label: "2 Years", value: 2 },
  { label: "3 Years", value: 3 },
  { label: "4 Years", value: 4 },
  { label: "5 Years", value: 5 },
];

const duration_month = [
  { label: "0 month", value: 0 },
  { label: "1 month", value: 1 },
  { label: "2 months", value: 2 },
  { label: "3 months", value: 3 },
  { label: "4 months", value: 4 },
  { label: "5 months", value: 5 },
  { label: "6 months", value: 6 },
  { label: "7 months", value: 7 },
  { label: "8 months", value: 8 },
  { label: "9 months", value: 9 },
  { label: "10 months", value: 10 },
  { label: "11 months", value: 11 },
];
function CrLimitForm(props) {
  let [
    {
      allowed_percentage,
      effective_percentage,
      effective_date,
      /* duration_year,
      duration_month, */
      monthly_percentage,
      daily_percentage,
      region_id,
      area_id,
      house_id,
      territory_id,
      point_id,
    },
    setDefaultValue,
  ] = useState(props.defaultValue);
  let [region, setRegion] = useState(props.regionData);
  let [area, setArea] = useState(props.areaData);
  let [house, setHouse] = useState(props.houseData);
  let [territory, setTerritory] = useState(props.territoryData);
  let [point, setPoint] = useState(props.pointData);

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

  useEffect(() => {
    //console.log("image nf  ",props.inputDefaultValue.image)
    setDefaultValue(props.defaultValue);
  }, [props.defaultValue]);

  useEffect(() => {
    setRegion(props.regionData);
  }, [props.regionData]);

  useEffect(() => {
    //console.log("image nf  ",props.inputDefaultValue.image)
    setArea(props.areaData);
  }, [props.areaData]);

  useEffect(() => {
    //console.log("image nf  ",props.inputDefaultValue.image)
    setHouse(props.houseData);
  }, [props.houseData]);

  useEffect(() => {
    //console.log("image nf  ",props.inputDefaultValue.image)
    setTerritory(props.territoryData);
  }, [props.territoryData]);

  useEffect(() => {
    //console.log("image nf  ",props.inputDefaultValue.image)
    setPoint(props.pointData);
  }, [props.pointData]);

  return (
    <form id="cr-limit-form" className="form pt-5" onSubmit={handleSubmit}>
      {/*   <div className="row">
     <FormSelect
        label="Select Region"
        name="region_id"
        data={region}
        onChange={handleChange}
      />
       <FormSelect
        label="Select Area"
        name="area_id"
        data={area}
        onChange={handleChange}
      />
       <FormSelect
        label="Select House"
        name="house_id"
        data={house}
        onChange={handleChange}
      />
       <FormSelect
        label="Select Territory"
        name="territory_id"
        data={territory}
        onChange={handleChange}
      />
      <FormMultiSelect
              label="Select Point"
              name="point_id"
              //key={`my_unique_select_key__${evalQues}`}
              data={point || ""}
              onChange={handleChange}
            />
         </div>   
 */}
      <FormInput
        name="allowed_percentage"
        type="number"
        step="any"
        label="Allowed Percentage"
        placeHolder="Enter  Percentage"
        inputDefaultValue={allowed_percentage}
        onChange={handleChange}
      />
      {/*<FormInput
        name="effective_percentage"
        type="number"
        step="any"
        label="Effective percentage"
        placeHolder="Enter  Percentage"
        inputDefaultValue={effective_percentage}
        onChange={handleChange}
      />*/}
      {/*      <FormInput
        name="effective_date"
        type="date"
        label="Effective_date"
        placeHolder="Enter  Date"
        inputDefaultValue={effective_date}
        onChange={handleChange}
      /> */}
      {/*  <div className="row">
        <label className="col-xl-3 col-lg-3 text-right col-form-label">
          Duration{" "}
        </label>
        <div className="col">
          <FormSelect
            name="duration_year"
            data={duration_year}
            onChange={handleChange}
          />
        </div>
        <div className="col">
          <FormSelect
            name="duration_month"
            data={duration_month}
            onChange={handleChange}
          />
        </div>
      </div>
 */}{" "}
      {/*<FormInput
        name="monthly_percentage"
        type="number"
        step="any"
        label="Monthly Percentage"
        placeHolder="Enter monthly percentage"
        inputDefaultValue={0}
        inputDefaultValue={monthly_percentage}
        onChange={handleChange}
      />*/}
      <FormInput
        name="daily_percentage"
        type="number"
        step="any"
        label="Daily Percentage"
        placeHolder="Enter daily percentage"
        inputDefaultValue={daily_percentage}
        onChange={handleChange}
      />
    </form>
  );
}

export default CrLimitForm;
