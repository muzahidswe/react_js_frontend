import React, { Fragment, useEffect, useState } from "react";
import { Card } from 'react-bootstrap';
import axios from 'axios';
import { baseURL } from "../../constants/constants";
import { useFormik } from "formik";
import { fileSubmitBulkKYCApprove } from '../../services/fileUploadServices';
import * as Yup from "yup";
import { useAlert } from 'react-alert';
import swal from 'sweetalert';
import 'react-confirm-alert/src/react-confirm-alert.css';

const DATA_TABLE_URL = baseURL+'scope-outlets';
const DATA_TABLE_DOWNLOAD_URL = baseURL+'scope-outlets-download';

function BulkKYCApprove(props) {
    const alert = useAlert();

    const initialValues = {
        file: ""
    };

    const [loading, setLoading] = useState(false);

    const uploadFile = Yup.object().shape({
        file: Yup.mixed().required()
    });

    const formik = useFormik({
        initialValues,
        validationSchema: uploadFile,
        onSubmit: (values, { setStatus, setSubmitting }) => {   
            swal({
                icon: "load.gif",
                buttons: false,
            });         
            setSubmitting(true);
            setLoading(true);
            fileSubmitBulkKYCApprove(document.getElementById('uploadFile').files[0]).then((val)=>{
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

    const sampleDownload = baseURL + 'download/samples/kyc_approve_excel.xlsx';
    const [userType, setUserType] = useState(localStorage.getItem("cr_user_type"));
    return (            
        <Card className="m-5">
            <Card.Body>                    
                <form onSubmit={formik.handleSubmit} autoComplete="off" className="form fv-plugins-bootstrap fv-plugins-framework animated animate__animated animate__backInUp">
                    <div className="row">
                        <div className="col-3">
                            <h4 className="card-title">Upload KYC Approve (Excel) </h4>
                        </div>
                        <div className="col-6">
                            <div className="input-group">
                                <input
                                    type="file"
                                    className={`form-control ${getInputClasses("file")}`}
                                    name="file"
                                    id="uploadFile"
                                    {...formik.getFieldProps("file")}
                                />
                            </div>
                            {formik.touched.file && formik.errors.file ? (
                                <div className="fv-plugins-message-container">
                                    <div className="fv-help-block">{formik.errors.file}</div>
                                </div>
                            ) : null}
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
    );
}

export default BulkKYCApprove;