import React, { Fragment, useEffect, useState, useMemo } from "react";
import { Card, Table } from 'react-bootstrap';
import axios from 'axios';
import { baseURL } from "../../constants/constants";
import Loader from "react-loader-spinner";
import DropdownMenuGroup from "../helper/top_dropdown_for_report";
import 'react-confirm-alert/src/react-confirm-alert.css';
import { useFormik } from "formik";
import { useAlert } from 'react-alert';
import { fileSubmitDocSubmitted } from '../../services/fileUploadServices';
import swal from 'sweetalert';
import * as Yup from "yup";
import { Link } from "react-router-dom";

const API_URL = baseURL + 'registration-information';    


function RegInfoReport(props) {
    const alert = useAlert();
    const [data, setData] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isLoadingReport, setIsLoadingReport] = useState(false);
    const [success, setSeccess] = useState(false);
    const [userType, setUserType] = useState(localStorage.getItem("cr_user_type"));

    const getData = (dpids,routeSections) => {
        setIsLoadingReport(true);
        axios.post(`${API_URL}`, 
            {dpids, routeSections}
        )
        .then(res => {
            setData(res.data.data);
            setIsLoadingReport(false);
            setSeccess(res.data.success);
        }).catch(err => {
            setData([]);
            setIsLoadingReport(false);
            setSeccess(false);
        });
    };

    useEffect(() => {
        //getReportData();
    }, []);

    const getInputClasses = (fieldname) => {
        if (formik.touched[fieldname] && formik.errors[fieldname]) {
            return "is-invalid";
        }

        if (formik.touched[fieldname] && !formik.errors[fieldname]) {
            return "is-valid";
        }

        return "";
    };

    const initialValues = {
        file: ""
    };

    const uploadFile = Yup.object().shape({
        file: Yup.mixed().required('An Excel file is required.')
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
            //setIsLoading(true);
            fileSubmitDocSubmitted(document.getElementById('uploadFile').files[0]).then((val)=>{
                if (val.data.success) {
                    alert.success(val.data.message);
                }else{
                    alert.error(val.data.message);
                }
                swal.close();
            });
        }
    });
  const sampleDownload = baseURL + 'download/samples/doc_uploaded_sample.xlsx';
  return isLoading ? 
    (<div>
        <div style={{ textAlign: "center" }}>
            <Loader type="Rings" color="#00BFFF" height={100} width={100} />
        </div>
    </div>) : (
        <Card className="m-5">
            <Card.Header>
                <div className="row">
                    <h3 className="card-title">Registration Information</h3>
                </div>
                
            </Card.Header>
            {userType == 'bat' ? (
                <Card.Header>
                <form onSubmit={formik.handleSubmit} autoComplete="off" className="form fv-plugins-bootstrap fv-plugins-framework animated animate__animated animate__backInUp">
                    <div className="row">
                        <div className="col-3">
                            <h4 className="card-title">Submit Document to FI</h4>
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
                                className="btn btn-success btn-sm"
                            >
                                <span>Upload</span>
                            </button>
                            <a href={sampleDownload} className="pl-5">
                                <button
                                    type="button"
                                    className="btn btn-primary btn-sm"
                                >
                                    <span>Download Sample</span>
                                </button>
                            </a>
                        </div>
                    </div>
                </form>
                </Card.Header>
            ) : (<></>)}
            <Card.Body style={{padding: "0.25rem"}}>
                <DropdownMenuGroup onSearch={getData} />
            </Card.Body>
            <Card.Footer>
            {isLoadingReport ? (
                <div>
                    <div style={{ textAlign: "center" }}>
                        <Loader type="Rings" color="#00BFFF" height={100} width={100} />
                    </div>
                </div>
            ) : (
                <Table striped bordered hover>
                    <thead>
                        <tr>
                            <th>Scope Outlets</th>
                            <th>Documents Prepared at Retail</th>
                            <th>KYC Completed by SS</th>
                            <th>Doc Submitted to FI</th>
                            <th>Doc Rejected by FI</th>
                            <th>Loan Approved</th>
                            <th>Loan Activated</th>
                        </tr>
                    </thead>
                    <tbody>
                        {success ? (
                            <tr>
                                <td>
                                    <Link to="/scope-outlet-preview">
                                        <u>{data.scoped_outlets}</u>
                                    </Link>
                                </td>
                                <td>{data.documents_prepared}</td>
                                <td>
                                    <Link to="/kyc-without-docs">
                                        <u>{data.kyc_completed}</u>
                                    </Link>
                                </td>
                                <td>
                                    <Link to="/kyc-doc-submitted">
                                        <u>{data.doc_submitted_to_fi}</u>
                                    </Link>
                                </td>
                                <td>
                                    <Link to="/kyc-doc-submitted">
                                        <u>{data.doc_rejected_by_fi}</u>
                                    </Link>
                                </td>
                                <td><Link to="/confirmed-limits"> <u>{data.loan_approved}</u></Link></td>
                                <td><Link to="/credit-information-by-outlet"> <u>{data.loan_availed}</u></Link></td>
                            </tr>
                        ) : (<tr>
                                <td>N/A</td>
                                <td>N/A</td>
                                <td>N/A</td>
                                <td>N/A</td>
                                <td>N/A</td>
                                <td>N/A</td>
                                <td>N/A</td>
                            </tr>)
                        }
                    </tbody>
                </Table>
            )}                
            </Card.Footer>
        </Card>
    )
}
export default RegInfoReport;
