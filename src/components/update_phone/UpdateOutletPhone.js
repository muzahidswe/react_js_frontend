import React, { useEffect, useState } from "react";
import { Card, Form, InputGroup } from "react-bootstrap";
import DropdownMenuGroup from "../helper/top_dropdown_with_outlet";
import Loader from "react-loader-spinner";
import { updateRetailerPhone, fileUploadPhoneNo } from "../../services/retailerServices";
import Select from 'react-select';
import { useAlert } from 'react-alert';
import * as Yup from "yup";
import { useFormik } from "formik";
import { baseURL } from "../../constants/constants";
import axios from "axios";
import styled from "styled-components";
import DataTable from "react-data-table-component";
import Paper from '@material-ui/core/Paper';
import InputBase from '@material-ui/core/InputBase';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import swal from 'sweetalert';
import styles from './updateOutletPhone.module.css';

const initialValues = {
  interest_percentage: "",
  service_charge_percentage: "",
  penalty_percentage: "",
}

const DATA_TABLE_URL = baseURL + "get-uploaded-interest-settings";

function UpdateOutletPhone(props) {
  const sampleDownload = '/./assets/samples/retailer_phone_number_change.xlsx';

  const [isLoading, setIsLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [dpids, setDpids] = useState(localStorage.getItem("dpids").split(","));
  const [outletIds, setOutletIds] = useState([]);
  const alert = useAlert();
  const [selectedFi, setSelectedFi] = useState({ label: "Select Fi", value: "" });
  const [selectedFiForFileUpload, setSelectedFiForFileUpload] = useState({ label: "Select Fi", value: "" }); 
  const insertInterestSchema = Yup.object().shape({
    phone_number: Yup.number().required("Please Enter Contact No")
  })

  const handleDpidChange = (ids) => {
    setDpids(ids);
  };

  const handleOutletIdChange = (ids) => {
    setOutletIds(ids);
  };

  const [data, setData] = useState([]);
  
  const formik = useFormik({
    initialValues,
    validationSchema: insertInterestSchema,
    onSubmit: async (values, { setStatus, setSubmitting, resetForm }) => {
      if (outletIds.length > 0) {
        if(outletIds.length > 1) {
          alert.info("Please select a single outlet for updating the contact no.");
        } else {
          setSubmitting(true);
          setLoading(true);
          const update = await updateRetailerPhone(outletIds, values.phone_number);
          if (update.success) {
              alert.success(`${update.message}`);
          } else {
              alert.error(`${update.message}`);
          }
          setLoading(false);
          setSubmitting(false);
          resetForm({});
        }
      } else {
        alert.info("Please select the outlet you want to update the contact no.");
      }
    }
  })

  const initialValues2 = { file: "" };

  const uploadFile = Yup.object().shape({ file: Yup.mixed().required() });

  const formik2 = useFormik({
    initialValues: initialValues2,
    validationSchema: uploadFile,
    onSubmit: (values, { setStatus, setSubmitting }) => {   
      swal({
        icon: "load.gif",
        buttons: false,
      });         
      setSubmitting(true);
      setLoading(true);
      fileUploadPhoneNo(document.getElementById('uploadFile').files[0]).then((val)=>{
        if (val.data.success) {
          alert.success(val.data.message);
        }else{
          alert.error(val.data.message);
        }
        swal.close();
      });
    }
  });

  const getInputClasses = (fieldname) => {
    if (formik.touched[fieldname] && formik.errors[fieldname]) {
      return "is-invalid";
    }

    if (formik.touched[fieldname] && !formik.errors[fieldname]) {
      return "is-valid";
    }

    return "";
  };

  return (
    isLoading ? (<div>
        <div style={{ textAlign: "center" }}>
            <Loader type="Rings" color="#00BFFF" height={100} width={100} />
        </div>
    </div>) : (
      <div className="container dash-tabs pt-9 pb-9">
        <Card style={{zIndex: 2, marginBottom: '2rem'}}>
          <Card.Body>
            <form onSubmit={formik2.handleSubmit} autoComplete="off" className="form fv-plugins-bootstrap fv-plugins-framework animated animate__animated animate__backInUp">
              <div className="row">
                <div className="col-3">
                    <h4 className="card-title">Upload Retailer Contact No.</h4>
                </div>
                <div className="col-6">
                  <div>
                    <div className="input-group">
                        <input
                            type="file"
                            className={`form-control ${getInputClasses("file")}`}
                            name="file"
                            id="uploadFile"
                            {...formik2.getFieldProps("file")}
                        />
                    </div>
                    {formik2.touched.file && formik2.errors.file ? (
                        <div className="fv-plugins-message-container">
                            <div className="fv-help-block">{formik2.errors.file}</div>
                        </div>
                    ) : null}
                  </div>
                </div>

                <div className="col-3">
                  <button
                    type="submit"
                    //onClick={addPaymentMethod}
                    className="btn btn-success btn-sm"
                  >
                    <span>Upload</span>
                    {/* {loading && <span className="ml-3 spinner spinner-white"></span>} */}
                  </button>
                  <a href={sampleDownload} className="pl-5">
                    <button
                      type="button"
                      //onClick={addPaymentMethod}
                      className="btn btn-primary btn-sm"
                    >
                      <span>Download Sample</span>
                      {/* {loading && <span className="ml-3 spinner spinner-white"></span>} */}
                    </button>
                  </a>
                </div>
              </div>
            </form>
          </Card.Body>
        </Card>

        <Card class="m-5" style={{marginBottom: '2rem'}}>
          <Card.Body >
            <Card.Header className="p-0">
              <h4 className="card-title">Update Retailer Contact No.</h4>
            </Card.Header>
            
            <DropdownMenuGroup onDpidChange={handleDpidChange} onOutletIdChange={handleOutletIdChange} isSearch={false} />
            
            <div className="row">
              <div className="col-md-12">
                <Card>
                  <Form class="m-10" onSubmit={formik.handleSubmit} autoComplete="off">
                    <div className="row m-2">
                      <div className="col-md-3">
                        <label for="phone_number"><strong>Contact No.</strong></label>
                        <InputGroup >
                          <input
                            placeholder="Contact No."
                            type="text"
                            className={`form-control  h-auto  px-6 ${getInputClasses(
                                "phone_number"
                            )}`}
                            name="phone_number"
                            {...formik.getFieldProps("phone_number")}
                          />
                          <InputGroup.Append>
                            <InputGroup.Text>&#9742;</InputGroup.Text>
                          </InputGroup.Append>
                        </InputGroup>
                        {formik.touched.phone_number && formik.errors.phone_number ? (
                          <div className="fv-plugins-message-container">
                            <div className="fv-help-block">{formik.errors.phone_number}</div>
                          </div>
                        ) : null}
                      </div>
                    </div>

                    <br></br>
                    
                    <div className="row mr-2">
                      <div className="col-md-12">
                        <div className="form-group pull-right float-right d-flex flex-wrap flex-center">
                          <button
                            type="submit"
                            //onClick={addPaymentMethod}
                            className="btn btn-primary font-weight-bold"
                          >
                            <span>SAVE</span>
                            {loading && <span className="ml-3 spinner spinner-white"></span>}
                          </button>
                        </div>
                      </div>
                    </div>
                  </Form>
                </Card>
              </div>
            </div>
          </Card.Body>
        </Card>
      </div>
    )
  );
}

export default UpdateOutletPhone;