import React, { useEffect, useState } from "react";
import moment from 'react-moment';
import { changePassword, logOut } from '../../services/authService';
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
import Loader from "react-loader-spinner";

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

function Myprofile(props) {

    const initialValues = {
        curr_pass: "",
        new_pass: "",
        conf_new_pass: ""
    };
    const alert = useAlert();
    const [isLoading, setIsLoading] = useState(true);
    const classes = useStyles();
    const [loading, setLoading] = useState(false);
    //const alert = useAlert();
    const [selectedDate, setSelectedDate] = useState(new Date());

    const handleDateChange = (date) => {
        setSelectedDate(date);
    };
    const [file,setFile] = useState(null);
    const validation = Yup.object().shape({
        curr_pass: Yup.string().required("This Field is Required"),
        new_pass: Yup.string().required("This Field is Required"),
        conf_new_pass: Yup.string().required("This Field is Required").oneOf([Yup.ref('new_pass'), null], 'Passwords must match')
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
        val.curr_pass = '';
        val.new_pass = '';
        val.conf_new_pass = '';
    }
    const USER_INFO_URL = baseURL+'user';
    const [userId, setUserId] = useState(localStorage.getItem('id'));
    const [userName,setUserName] = useState('');
    const [phone,setPhone] = useState('');
    const [email,setEmail] = useState('');
    useEffect(() => {
        const token = localStorage.getItem('token');
        const config = {
            headers: { 
                Authorization: `Bearer ${token}`,
                'content-type': 'multipart/form-data'
            },
        };
        axios.get(`${USER_INFO_URL}/${userId}`, config)
        .then((data) => {
            const userinfo = data.data.data;
            setUserName(userinfo.name)
            setPhone(userinfo.phone)
            setEmail(userinfo.email)
            setIsLoading(false);
        })
    }, []);
    
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
            changePassword(values).then((val)=>{
                if (val.data.success) {
                    alert.success(val.data.message);
                }else{
                    alert.error(val.data.message);
                }
                swal.close();
                logOut();
                window.location = "/";                
            });
            resetFields(values);
            resetForm({});         
        }
    });
  return isLoading ? 
    <div>
      <div style={{ textAlign: "center" }}>
        <Loader type="Rings" color="#00BFFF" height={100} width={100} />
      </div>
    </div> : (
    <div className="row">
        <div className="col-6">
            <div className="container dash-tabs pt-9 pb-9">
                <Card>
                    <Card.Header>
                        <div className="row">
                            <div className="col-6">
                                <h3 className="card-title">Profile Information</h3>
                            </div>
                        </div>                        
                    </Card.Header>
                    <Card.Body>
                        <div className="col-12 row">
                            <label className="form-label font-weight-bolder">Name:{'\u00A0\u00A0'}</label>
                            <label className="form-label">{userName}</label>
                        </div>
                        <div className="col-12 row">
                            <label className="form-label font-weight-bolder">Email:{'\u00A0\u00A0'}</label>
                            <label className="form-label">{email}</label>
                        </div>
                        <div className="col-12 row">
                            <label className="form-label font-weight-bolder">Phone:{'\u00A0\u00A0'}</label>
                            <label className="form-label">{phone}</label>
                        </div>
                    </Card.Body>
                </Card>
            </div>
        </div>
        <div className="col-6">
            <div className="container dash-tabs pt-9 pb-9">
                <Card>
                    <Card.Header>
                        <div className="row">
                            <div className="col-6">
                                <h3 className="card-title">Change Password</h3>
                            </div>
                        </div>
                        
                    </Card.Header>
                    <form onSubmit={formik.handleSubmit} autoComplete="off" className="form fv-plugins-bootstrap fv-plugins-framework">
                        <Card.Body>
                            <div className="form-group row">
                                <div className="col-12">
                                    <label className="form-label font-weight-bolder">Current Password</label>
                                    <div className="input-group">
                                        <input
                                            placeholder="Enter Current Password"
                                            type="password"
                                            className={`form-control ${getInputClasses("curr_pass")}`}
                                            name="curr_pass"                                    
                                            {...formik.getFieldProps("curr_pass")}
                                        />                            
                                    </div>
                                    {formik.touched.curr_pass && formik.errors.curr_pass ? (
                                        <div className="fv-plugins-message-container">
                                            <div className="fv-help-block">{formik.errors.curr_pass}</div>
                                        </div>
                                ) : null}
                                </div>
                                <div className="col-12">
                                    <label className="form-label font-weight-bolder">New Password</label>
                                    <div className="input-group">
                                        <input
                                            placeholder="Enter New Password"
                                            type="password"
                                            className={`form-control ${getInputClasses("new_pass")}`}
                                            name="new_pass"                                    
                                            {...formik.getFieldProps("new_pass")}
                                        />                            
                                    </div>
                                    {formik.touched.new_pass && formik.errors.new_pass ? (
                                        <div className="fv-plugins-message-container">
                                            <div className="fv-help-block">{formik.errors.new_pass}</div>
                                        </div>
                                ) : null}
                                </div>
                                <div className="col-12">
                                    <label className="form-label font-weight-bolder">Retype New Password</label>
                                    <div className="input-group">
                                        <input
                                            placeholder="Retype New Password"
                                            type="password"
                                            className={`form-control ${getInputClasses("conf_new_pass")}`}
                                            name="conf_new_pass"                                    
                                            {...formik.getFieldProps("conf_new_pass")}
                                        />                            
                                    </div>
                                    {formik.touched.conf_new_pass && formik.errors.conf_new_pass ? (
                                        <div className="fv-plugins-message-container">
                                            <div className="fv-help-block">{formik.errors.conf_new_pass}</div>
                                        </div>
                                ) : null}
                                </div>
                                <div className="col-12 mt-2">
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
        </div>
    </div>
    
  );
}

export default Myprofile;
