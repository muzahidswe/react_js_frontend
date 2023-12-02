import React, { useEffect, useState } from "react";
import axios from 'axios';
import { baseURL } from "../../../constants/constants";
import Loader from "react-loader-spinner";
import {useAlert} from "react-alert";
import { useFormik } from "formik";
import * as Yup from "yup";
import swal from 'sweetalert';
import { Card } from 'react-bootstrap';
import {
  limitUpdate
} from "../../../services/crLImitService";

const DETAILS_URL = baseURL+'get-config';

function LimitEditModal(params) { 
    const alert = useAlert()
    const [isLoading, setIsLoading] = useState(false);

    const initialValues = {
        allowed_percentage: params.allowedPercentage,
        daily_percentage: params.dailyPercentage,
        id: params.id
    };

    const getInputClasses = (fieldname) => {
        if (formik.touched[fieldname] && formik.errors[fieldname]) {
            return "is-invalid";
        }

        if (formik.touched[fieldname] && !formik.errors[fieldname]) {
            return "is-valid";
        }

        return "";
    };

    const resetFields = (val)=>{
        val.allowed_percentage = '';
        val.daily_percentage = '';
    }

    const validation = Yup.object().shape({
        allowed_percentage: Yup.number().required("This Field is Required"),
        daily_percentage: Yup.number().required("This Field is Required")
    });
    const [loading, setLoading] = useState(false);

    const formik = useFormik({
        initialValues,
        validationSchema: validation,
        onSubmit: (values, { setStatus, setSubmitting, resetForm }) => {
            swal({
                icon: "load.gif",
                buttons: false,
            });
            setSubmitting(true);
            setLoading(true);
            limitUpdate(values).then((val)=>{
                if (val.data.success) {
                    alert.success(val.data.message);
                }else{
                    alert.error(val.data.message);
                }
                swal.close();   
                if (params.handleClose) {
                    params.handleClose();
                }           
            });
            resetFields(values);
            resetForm({});         
        }
    });   
    
    useEffect(() => {

    }, []);

    return isLoading ? (<div>
                            <div style={{ textAlign: "center" }}>
                                <Loader type="Rings" color="#00BFFF" height={100} width={100} />
                            </div>
                        </div>) : 
        (
            <Card>
                <form onSubmit={formik.handleSubmit} autoComplete="off" className="form fv-plugins-bootstrap fv-plugins-framework">
                    <Card.Body>
                        <div className="form-group row">
                            <div className="col-12">
                                <label className="form-label font-weight-bolder">Allowed Percentage</label>
                                <div className="input-group">
                                    <input
                                        placeholder="Enter Current Password"
                                        type="number"
                                        className={`form-control ${getInputClasses("curr_pass")}`}
                                        name="allowed_percentage"
                                        value={params.allowedPercentage}                                    
                                        {...formik.getFieldProps("allowed_percentage")}
                                    />                            
                                </div>
                                {formik.touched.allowed_percentage && formik.errors.allowed_percentage ? (
                                    <div className="fv-plugins-message-container">
                                        <div className="fv-help-block">{formik.errors.allowed_percentage}</div>
                                    </div>
                            ) : null}
                            </div>
                            <div className="col-12">
                                <br/>
                                <label className="form-label font-weight-bolder">Daily Percentage</label>
                                <div className="input-group">
                                    <input
                                        placeholder="Enter New Password"
                                        type="number"
                                        className={`form-control ${getInputClasses("daily_percentage")}`}
                                        name="daily_percentage"
                                        value={params.dailyPercentage}                                    
                                        {...formik.getFieldProps("daily_percentage")}
                                    />                            
                                </div>
                                {formik.touched.daily_percentage && formik.errors.daily_percentage ? (
                                    <div className="fv-plugins-message-container">
                                        <div className="fv-help-block">{formik.errors.daily_percentage}</div>
                                    </div>
                            ) : null}
                            </div>
                            
                            <div className="col-12 mt-8">
                                <div className="input-group">
                                    <button
                                        type="submit"
                                        //onClick={addPaymentMethod}
                                        className="btn btn-primary font-weight-bold"
                                    >
                                        <span>Submit</span>
                                        {/* {loading && <span className="ml-3 spinner spinner-white"></span>} */}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </Card.Body>
                </form>
            </Card>
    );
}

export default LimitEditModal;