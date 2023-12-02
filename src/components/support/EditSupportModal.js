import React, { useEffect, useState } from "react";
import axios from 'axios';
import { baseURL } from "../../constants/constants";
import Loader from "react-loader-spinner";
import {useAlert} from "react-alert";
import { useFormik } from "formik";
import * as Yup from "yup";
import swal from 'sweetalert';
import { Card } from 'react-bootstrap';
import { id } from "date-fns/locale";

const UPDATE_URL = baseURL+'update-outlet-info';

export default function EditSupportModal(params) { 
    const alert = useAlert()
    const [isLoading, setIsLoading] = useState(false);

    const initialValues = {
        outlet_code: params.outletCode,
        outlet_name: params.outletName,
        phone: params.phone,
        minimum_due: params.minimumDue,
        total_due: params.totalDue,
        kyc_status: params.kyc_status,
        status: params.status,
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
        val.outlet_code = '';
        val.outlet_name = '';
        val.phone = '';
        val.minimum_due = '';
        val.total_due = '';
        val.kyc_status = '';
        val.status = '';
    }

    const validation = Yup.object().shape({
        // allowed_percentage: Yup.number().required("This Field is Required"),
        // daily_percentage: Yup.number().required("This Field is Required")
    });
    const [loading, setLoading] = useState(false);

    const formik = useFormik({
        initialValues,
        validationSchema: validation,
        onSubmit: async (values, { setStatus, setSubmitting, resetForm }) => {
            swal({
                icon: "load.gif",
                buttons: false,
            });
            setSubmitting(true);
            setLoading(true);
            await axios.post(UPDATE_URL, {
                    id_outlet: params.id, 
                    phone: values.phone,
                    kyc_status: values.kyc_status,
                    status: values.status,
                    minimum_due: parseFloat(values.minimum_due).toFixed(2),
                    total_due: parseFloat(values.total_due).toFixed(2)
                }).then((val)=>{
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
                            <div className="col-12 mb-4">
                                <label className="form-label font-weight-bolder">Outlet Code</label>
                                <div className="input-group">
                                    <input
                                        type="text"
                                        className={`form-control ${getInputClasses("curr_pass")}`}
                                        name="outlet_code"
                                        value={params.outletCode}
                                        disabled                                 
                                        {...formik.getFieldProps("outlet_code")}
                                    />                            
                                </div>
                            </div>

                            <div className="col-12 mb-4">
                                <label className="form-label font-weight-bolder">Outlet Name</label>
                                <div className="input-group">
                                    <input
                                        type="text"
                                        className="form-control"
                                        name="outlet_name"
                                        value={params.outletName}
                                        disabled                                  
                                        {...formik.getFieldProps("outlet_name")}
                                    />                            
                                </div>
                            </div>
                            <div className="col-12 mb-4">
                                <label className="form-label font-weight-bolder">Phone</label>
                                <div className="input-group">
                                    <input
                                        placeholder="Enter Phone Number"
                                        type="text"
                                        className="form-control"
                                        name="phone"
                                        value={params.phone}                                    
                                        {...formik.getFieldProps("phone")}
                                    />                            
                                </div>
                                {formik.touched.phone && formik.errors.phone ? (
                                        <div className="fv-plugins-message-container">
                                            <div className="fv-help-block">{formik.errors.phone}</div>
                                        </div>
                                ) : null}
                            </div>

                            <div className="col-12 mb-4">
                                <label className="form-label font-weight-bolder">Minimum Due</label>
                                <div className="input-group">
                                    <input
                                        placeholder="Enter Phone Number"
                                        type="number"
                                        className="form-control"
                                        name="minimum_due"
                                        value={params.minimumDue}                                    
                                        {...formik.getFieldProps("minimum_due")}
                                    />                            
                                </div>
                                {formik.touched.minimum_due && formik.errors.minimum_due ? (
                                        <div className="fv-plugins-message-container">
                                            <div className="fv-help-block">{formik.errors.minimum_due}</div>
                                        </div>
                                ) : null}
                            </div>

                            <div className="col-12 mb-4">
                                <label className="form-label font-weight-bolder">Total Due</label>
                                <div className="input-group">
                                    <input
                                        placeholder="Enter Phone Number"
                                        type="number"
                                        className="form-control"
                                        name="total_due"
                                        value={params.totalDue}                                    
                                        {...formik.getFieldProps("total_due")}
                                    />                            
                                </div>
                                {formik.touched.total_due && formik.errors.total_due ? (
                                        <div className="fv-plugins-message-container">
                                            <div className="fv-help-block">{formik.errors.total_due}</div>
                                        </div>
                                ) : null}
                            </div>
							
							<div className="col-12">
                                <label className="form-label font-weight-bolder">KYC Status</label>
                                <div className="input-group">
                                    <select
                                        name="kyc_status"
                                        value={params.kyc_status}
                                        className="form-control"
                                        {...formik.getFieldProps("kyc_status")}
                                    >
                                        <option value="Pending">Pending</option>
                                        <option value="Approved">Approved</option> 
                                        <option value="Rejected">Rejected</option> 
                                        <option value="Initial">Initial</option> 
                                        <option value="Doc Submitted">Doc Submitted</option> 
                                    </select>                       
                                </div>
                            </div>

                            <div className="col-12">
                                <label className="form-label font-weight-bolder">Status</label>
                                <div className="input-group">
                                    <select
                                        name="status"
                                        value={params.status}
                                        className="form-control"
                                        {...formik.getFieldProps("status")}
                                    >
                                        <option value="Active">Active</option>
                                        <option value="Inactive">Inactive</option>    
                                    </select>                       
                                </div>
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