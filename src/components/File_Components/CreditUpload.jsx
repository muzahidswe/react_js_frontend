import React, { useEffect, useState } from "react";
import moment from 'react-moment';
import { fileSubmit } from '../../services/fileUploadServices';
import { useAlert } from 'react-alert';
import { makeStyles } from '@material-ui/core/styles';
import { useFormik } from "formik";
import * as Yup from "yup";
import { Card } from 'react-bootstrap';
import axios from 'axios';
import Button from '@material-ui/core/Button';
//import { useAlert } from 'react-alert';
import { TextField } from "@material-ui/core";
import swal from 'sweetalert';
import { DateTimePicker, MuiPickersUtilsProvider } from "@material-ui/pickers";

import { baseURL } from "../../constants/constants";

const useStyles = makeStyles(theme => ({
    container: {
        display: 'flex',
        flexWrap: 'wrap',
    },
    textField: {
        // marginLeft: theme.spacing(1),
        // marginRight: theme.spacing(1),
    },
    dense: {
        //marginTop: theme.spacing(2),
    },
    menu: {
        width: 200,
    },
    button: {
        //margin: theme.spacing(1),
        color: "#FFFFFF"
    },

}));

function CreditUpload(props) {

    const initialValues = {
        title: props.prevTitle ? props.prevTitle : "",
        effective_date: props.effectiveDate ? props.effectiveDate : "",
        note: "",
        duration: props.endDate ? props.endDate : "",
        file: ""
    };
    const alert = useAlert();
    const classes = useStyles();
    const [loading, setLoading] = useState(false);
    //const alert = useAlert();
    const [selectedDate, setSelectedDate] = useState(new Date());

    const handleDateChange = (date) => {
        setSelectedDate(date);
    };
    const [file,setFile] = useState(null);
    const uploadFile = Yup.object().shape({

        title: Yup.string().required(),
      // note: Yup.string().required(),
        //acc_no: Yup.string().required(),
        effective_date: Yup.string().required(),
        duration: Yup.string().required(),
        note: Yup.string().required(),
        file: Yup.mixed().required()
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

    const resetFields = (val)=>{
        val.title = '';
        val.note = '';
        val.effective_date = '';
        val.duration = '';
        val.note = '';
        val.file = '';
    }
    
    const [fileInfo,setFileinfo] = useState({});
    const [status, setStatus] = useState('FI Initiated');
    const [cr_retail_limit_info_id, setCrRetailLimitInfoId] = useState(0);
    useEffect(() => {
        props.status ? setStatus(props.status) : setStatus('FI Initiated');
        props.cr_retail_limit_info_id ? setCrRetailLimitInfoId(props.cr_retail_limit_info_id) : setCrRetailLimitInfoId(0)
    }, []);
    
    const formik = useFormik({
        initialValues,
        validationSchema: uploadFile,
        onSubmit: (values, { setStatus, setSubmitting, resetForm }) => {
            swal({
                icon: "load.gif",
                buttons: false,
            });
            setSubmitting(true);
            setLoading(true);
            fileSubmit(values, document.getElementById('uploadFile').files[0], status, cr_retail_limit_info_id ).then((val)=>{
                if (props.handleClose) {
                    props.handleClose();
                }
                if (val.data.success) {
                    alert.success(val.data.message);
                }else{
                    alert.error(val.data.message);
                }
                swal.close();
                resetFields(values);
                resetForm({});                
            });
            const fi_info = {
                // shop:values.shop,
                // type:values.type,
                // address:values.address,
                // area:values.area,
                // phone:values.phone,
                // pickup_address:values.pickupAddress,
                // pickup_phone:values.pickupPhone,
                // pickup_area:values.pickupArea,
                // pickup_type:values.pickupType

                title:values.title = '',
                note:values.note = '',
                effective_date:values.effective_date = '',
                duration:values.duration = '',
                note:values.note = '',
                file:values.file = ''
            };            
            // setTimeout(
            //     () => window.location.reload(),
            //     2000
            // );            
        }
    });

    const showMessage=(message,success)=>{
        if(success){
            alert.success(message)
        }else{
            //alert.error(message);
        }        
    }
    const SAMPLE_GENERATE_URL = baseURL + 'generate-fi-credit-upload-sample/' + localStorage.getItem('fi_id');
    const downloadSampleFile = () =>{
        swal({
            icon: "load.gif",
            buttons: false,
        });
        var token = localStorage.getItem("token");
        axios.get(`${SAMPLE_GENERATE_URL}`,{},
        {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
          },
        }).then(res => {
            window.open(res?.data?.data, "_blank");
            swal.close();
        }).catch(err => {
            alert.err(err.message)
            swal.close();
        });
    }
  const [userType, setUserType] = useState(localStorage.getItem('cr_user_type'));
  //const sampleDownload = baseURL + 'download/samples/scope_outlets_with_credit_limit.xlsx'
  return (
    <div className="container dash-tabs pt-9 pb-9">
        <Card>
            <Card.Header>
                <div className="row">
                    <div className="col-6">
                        <h3 className="card-title">{props.headerLabel ? props.headerLabel : 'Credit Limit Upload'}</h3>
                    </div>
                    {(userType == 'fi' && !props.noDownloadBtn) ?
                    (<div className="col-6" style={{textAlign: 'end'}}>
                         <button
                            type="button"
                            onClick={downloadSampleFile}
                            className="btn btn-primary"
                        >
                            <span>Download Sample</span>
                            {/* {loading && <span className="ml-3 spinner spinner-white"></span>} */}
                        </button>
                    </div>) : <></>}
                </div>
                
            </Card.Header>
            <form onSubmit={formik.handleSubmit} autoComplete="off" className="form fv-plugins-bootstrap fv-plugins-framework">
                <Card.Body>
                    <div className="form-group row">
                        <div className="col-4">
                            <label className="form-label font-weight-bolder">Title</label>
                            <div className={props.prevTitle ? 'input-group pointer-none' : 'input-group'}>
                                <div className="input-group-prepend">
                                    <span className="input-group-text"><i className="fas fa-edit"></i></span>
                                </div>
                                <input
                                    placeholder="Add Title"
                                    type="text"
                                    className={`form-control ${getInputClasses("title")}`}
                                    name="title"
                                    readOnly={props.prevTitle ? true : false}                                     
                                    {...formik.getFieldProps("title")}
                                />                            
                            </div>
                            {formik.touched.title && formik.errors.title ? (
                                <div className="fv-plugins-message-container">
                                    <div className="fv-help-block">{formik.errors.title}</div>
                                </div>
                        ) : null}
                        </div>
                        <div className="col-4">
                            <label className="form-label font-weight-bolder">Effective Date</label>
                            <div className={props.prevTitle ? 'input-group pointer-none' : 'input-group'}>
                                <TextField
                                    id="date"                                
                                    type="date" 
                                    name="effective_date"                               
                                  className={classes.textField}
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                    {...formik.getFieldProps("effective_date")}
                                />
                            </div>
                            <span className="form-text text-muted">Please select Effective Date</span>
                            {formik.touched.effective_date && formik.errors.effective_date ? (
                                <div className="fv-plugins-message-container">
                                    <div className="fv-help-block">{formik.errors.effective_date}</div>
                                </div>
                            ) : null}
                        </div>
                        <div className="col-4">
                            <label className="pull-left form-label font-weight-bolder">Duration</label>
                            <div className={props.prevTitle ? 'input-group pointer-none' : 'input-group'}>
                                <TextField
                                    id="month"
                                    type="month"
                                    className={classes.textField}
                                    InputLabelProps={{
                                    shrink: true,
                                    }}
                                    {...formik.getFieldProps("duration")}
                                />
                            </div>
                            <span className="form-text text-muted">Please select duration</span>
                            {formik.touched.duration && formik.errors.duration ? (
                                <div className="fv-plugins-message-container">
                                    <div className="fv-help-block">{formik.errors.duration}</div>
                                </div>
                            ) : null}
                        </div>
                    </div>
                    
                    <div className="form-group row">
                        <div className="col-4">
                            <label className="form-label font-weight-bolder">File</label>
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
                        <div className="col-4">
                            <label className="form-label font-weight-bolder">Note</label>
                            <div className="input-group">
                                <textarea
                                    placeholder="Type notes here"
                                    type="text"
                                    className={`form-control ${getInputClasses("note")}`}
                                    name="note"
                                    rows={1}
                                    {...formik.getFieldProps("note")}
                                ></textarea>
                            </div>
                            {formik.touched.note && formik.errors.note ? (
                                <div className="fv-plugins-message-container">
                                    <div className="fv-help-block">{formik.errors.note}</div>
                                </div>
                            ) : null}
                        </div>
                        <div className="col-2">
                            <label className="form-label font-weight-bolder" style={{color: 'transparent'}}>{"__"}</label>
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
    </div>
  );
}

export default CreditUpload;
