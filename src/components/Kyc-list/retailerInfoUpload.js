import React, { Fragment, useEffect, useState } from "react";
import { Card } from 'react-bootstrap';
import axios from 'axios';
import { baseURL } from "../../constants/constants";
import { useFormik } from "formik";
import { fileSubmitRetailerNIDInfoUpload } from '../../services/fileUploadServices';
import * as Yup from "yup";
import { useAlert } from 'react-alert';
import swal from 'sweetalert';
import Loader from "react-loader-spinner";
import 'react-confirm-alert/src/react-confirm-alert.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import styles from './retailerInfo.module.css';
import { useSelector } from "react-redux";

const DATA_TABLE_URL = baseURL+'retailer-nid-information';
const DATA_TABLE_DOWNLOAD_URL = baseURL+'scope-outlets-download';
const DELETE_URL = baseURL+'delete-scope-outlet';

function RetailerInfoUpload(props) {
    const {selected_fi} = useSelector(state => state.fi);
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
            fileSubmitRetailerNIDInfoUpload(document.getElementById('uploadFile').files[0]).then((val)=>{
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

    const sampleDownload = baseURL + 'download/samples/NID_Infomation_Format.xlsx';
    const [userType, setUserType] = useState(localStorage.getItem("cr_user_type"));
    const [data, setData] = useState([]);

    const [isLoading, setIsLoading] = useState(false);
    const [showTable, setShowTable] = useState(false);

    const formatNumber = (number) => {
        return parseFloat(number)?.toLocaleString('en-US');
    }

    const onDownload = async (data) => {
        const downloadLink = document.createElement("a");
        const fileName = data.file_name;
        downloadLink.href = `${baseURL}${data.file_path}${data.file_name}`;
        downloadLink.download = fileName;
        downloadLink.click();

        // var token = localStorage.getItem("token");
        // setIsLoading(true);
        // await axios.get(`${baseURL}${data.file_path}${data.file_name}`, {},
        //     {
        //     headers: {
        //         // Accept: "application/json",
        //         // "Content-Type": "application/json",
        //         Authorization: "Bearer " + token,
        //     },
        //     }
        // )
        // .then((res) => {
        //     downloadPDF(res.data.data.blod_data, res.data.data.file_name);
        //     setIsLoading(false);
        // })
        // .catch((err) => {
        //     setIsLoading(false);
        // });
    }

    const downloadPDF = (blob, name) => {
        const linkSource = `data:application/pdf;base64,${blob}`;
        const downloadLink = document.createElement("a");
        const fileName = name;
        downloadLink.href = linkSource;
        downloadLink.download = fileName;
        downloadLink.click();
    }

    const getRetailerInfo = async () => {
        setIsLoading(true);

        var token = localStorage.getItem("token");
        await axios.get(DATA_TABLE_URL, {params: {fi_id: selected_fi}}, {headers: {
                    // Accept: "application/json",
                    // "Content-Type": "application/json",
                    Authorization: "Bearer " + token,
                }})
        .then(res => {
            setData(res?.data?.data);
            res.data.success ? setShowTable(true) : setShowTable(false);
        }).catch(err => {
            setData({});
        });
        setIsLoading(false);
    };

    useEffect(() => {
        getRetailerInfo();
    }, [selected_fi]);
    return (            
        <Card className="m-5">
            <Card.Body>
                {(userType == 'fi') &&                 
                    <form onSubmit={formik.handleSubmit} autoComplete="off" className="form fv-plugins-bootstrap fv-plugins-framework animated animate__animated animate__backInUp">
                        <div className="row">
                            <div className="col-3">
                                <h4 className="card-title">Upload Retailer Information</h4>
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
                }

                {isLoading ? 
                    <div>
                        <div style={{ textAlign: "center" }}>
                            <Loader type="Rings" color="#00BFFF" height={100} width={100} />
                        </div>
                    </div>
                    : 
                    <div>
                        {showTable &&
                            <div className={styles.generatedContent}>
                                <div className={`${styles.tableWrapper} table-responsive`}>
                                    <table className="table table-bordered">
                                        <thead>
                                            <tr>
                                                <th>Sl.</th>
                                                <th>File Name</th>
                                                <th>Found Rows</th>
                                                <th>Upload Rows</th>
                                                <th>Gap</th>
                                                <th>Upload By</th>
                                                <th>Upload Date</th>
                                                {/* <th>Download File</th> */}
                                            </tr>
                                        </thead>

                                        <tbody>
                                            {data.map((data, index) => {
                                                return (
                                                    <tr key={index}>
                                                        <td className={styles.valueText}>{index+1}.</td>
                                                        <td className={styles.valueText}>{data?.file_name}</td>
                                                        <td className={styles.valueText}>{data?.found_rows}</td>
                                                        <td className={styles.valueText}>{data?.upload_rows}</td>
                                                        <td className={styles.valueText}>{data?.difference}</td>
                                                        <td className={styles.valueText}>{data?.upload_by}</td>
                                                        <td className={styles.valueText}>{data?.sys_date}</td>

                                                        {/* <td className={styles.valueText}>
                                                            <FontAwesomeIcon
                                                                icon="file-download"
                                                                size="2x"
                                                                className={`${styles.downloadBtn}`}
                                                                onClick={() => onDownload(data)}
                                                            />
                                                        </td> */}
                                                    </tr>
                                                )
                                            })}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        }
                    </div>
                }
            </Card.Body>
        </Card>
    );
}

export default RetailerInfoUpload;