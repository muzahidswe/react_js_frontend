import React, { Fragment } from "react";
import { useState } from "react";
import { useEffect } from "react";

function UserDetails({ userDetails }) {
  // const [userDetails,setUserDetails] = useState(props.userDetails)
  const {
    outlet_name,
    outlet_code,
    owner_name,
    phone,
    address,
    point,
    territory,
    house,
    area,
    region,
  } = userDetails;

  /*  useEffect(()=>{
        setUserDetails(props.userDetails)
    },[props.userDetails]) */
  return (
    <Fragment>
      <div className="form-group row">
        <label className="col-xl-3 col-lg-3 text-right col-form-label">
          Outlet Name:
        </label>
        <div className="col-lg-9 col-xl-6">
          <span className="form-control form-control-lg form-control-solid">
            {outlet_name}
          </span>
        </div>
      </div>
      <div className="form-group row">
        <label className="col-xl-3 col-lg-3 text-right col-form-label">
          Outlet Code:
        </label>
        <div className="col-lg-9 col-xl-6">
          <span className="form-control form-control-lg form-control-solid">
            {outlet_code}
          </span>
        </div>
      </div>
      <div className="form-group row">
        <label className="col-xl-3 col-lg-3 text-right col-form-label">
          Owner Name:
        </label>
        <div className="col-lg-9 col-xl-6">
          <span className="form-control form-control-lg form-control-solid">
            {owner_name}
          </span>
        </div>
      </div>
      <div className="form-group row">
        <label className="col-xl-3 col-lg-3 text-right col-form-label">
          Phone:
        </label>
        <div className="col-lg-9 col-xl-6">
          <span className="form-control form-control-lg form-control-solid">
            {phone}
          </span>
        </div>
      </div>
      <div className="form-group row">
        <label className="col-xl-3 col-lg-3 text-right col-form-label">
          Address:
        </label>
        <div className="col-lg-9 col-xl-6">
          <span className="form-control form-control-lg form-control-solid">
            {address}
          </span>
        </div>
      </div>
      <div className="form-group row">
        <label className="col-xl-3 col-lg-3 text-right col-form-label">
          Point:
        </label>
        <div className="col-lg-9 col-xl-6">
          <span className="form-control form-control-lg form-control-solid">
            {point}
          </span>
        </div>
      </div>
      <div className="form-group row">
        <label className="col-xl-3 col-lg-3 text-right col-form-label">
          Territory:
        </label>
        <div className="col-lg-9 col-xl-6">
          <span className="form-control form-control-lg form-control-solid">
            {territory}
          </span>
        </div>
      </div>
      <div className="form-group row">
        <label className="col-xl-3 col-lg-3 text-right col-form-label">
          House:
        </label>
        <div className="col-lg-9 col-xl-6">
          <span className="form-control form-control-lg form-control-solid">
            {house}
          </span>
        </div>
      </div>
      <div className="form-group row">
        <label className="col-xl-3 col-lg-3 text-right col-form-label">
          Area:
        </label>
        <div className="col-lg-9 col-xl-6">
          <span className="form-control form-control-lg form-control-solid">
            {area}
          </span>
        </div>
      </div>

      <div className="form-group row">
        <label className="col-xl-3 col-lg-3 text-right col-form-label">
          Region:
        </label>
        <div className="col-lg-9 col-xl-6">
          <span className="form-control form-control-lg form-control-solid">
            {region}
          </span>
        </div>
      </div>
    </Fragment>
  );
}

export default UserDetails;
