import React, { useEffect, useState } from "react";
import moment from 'react-moment';
import { userSubmit, getUserListService, deleteUserService } from '../../services/adminService';
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
import {getDh} from "../../services/dhPortalService";
import { getFiDetails } from "../../services/fiPortalService";
import Datatable from "../common/datatable";
import Loader from "react-loader-spinner";
import { confirmAlert } from 'react-confirm-alert';
import MultiSelect from "react-multi-select-component";

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

const columns = [
  {
    label: "Name",
    field: "name",
  },
  {
    label: "Email",
    field: "email",
  },
  {
    label: "Phone",
    field: "phone",
  },
  {
    label: "User Type",
    field: "uc_user_type",
  },
  {
    label: "FI Name",
    field: "fi_name",
  },
  {
    label: "DH Name",
    field: "dh_name"
  },
  {
    label: "Status",
    field: "activation_status"
  }
];

function User(props) {

    const initialValues = {
        name: "",
        email: "",
        phone: "",
        password: ""
    };
    const alert = useAlert();
    const classes = useStyles();
    const [loading, setLoading] = useState(false);
    //const alert = useAlert();
    const formValidation = Yup.object().shape({
        name: Yup.string().required("This field is required"),
        email: Yup.string().email("Invalid Email").required("This field is required"),
        phone: Yup.string().required("This field is required"),
        password: Yup.string().required("This field is required")
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
        val.name = '';
        val.email = '';
        val.phone = '';
        val.password = '';
        val.cr_user_type = '';
        val.id_fi = '';
        val.id_dh = '';
    }
    const [fiData, setFiData] = useState([]);
    const [dhData, setDhData] = useState([]);
    async function getFiList() {
        try {
            const fi_list = await getFiDetails();
            const data = fi_list.map((fi) => {
                let list = {};
                list.value = fi.id;
                list.label = fi.name;
                return list;
            });
            setFiData(data);
        } catch (error) {
            console.log("......... ", error);
        }
    }
    async function getDhList() {
        try {
            const dh_list = await getDh();
            setDhData(dh_list);
        } catch (error) {
            console.log("......... ", error);
        }
    }
    const [userTypeFi, setUserTypeFi] = useState(false);
    const [userTypeBat, setUserTypeBat] = useState(true);
    const [userTypeAdmin, setUserTypeAdmin] = useState(false);
    const [crUserType, setCrUserType] = useState('bat');
    const handleUserTypeChange= (event)=> {
        setCrUserType(event.target.value);
        event.target.value == 'fi' ? setUserTypeFi(true) : setUserTypeFi(false);
        event.target.value == 'bat' ? setUserTypeBat(true) : setUserTypeBat(false);
        event.target.value == 'admin' ? setUserTypeAdmin(true) : setUserTypeAdmin(false);
    }
    const [id_dh, setDh] = useState('');
    const [dhMulti, setDhMulti] = useState([]);
    const handleDhChange = (value)=> {
        setDhMulti(value);
    }
    const [id_fi, setFi] = useState('');
    const handleFiChange = (event)=> {
        setFi(event.target.value);
    }
    useEffect(() => {
        getFiList();
        getDhList();
    }, []);
    
    const formik = useFormik({
        initialValues,
        validationSchema: formValidation,
        onSubmit: (values, { setStatus, setSubmitting, resetForm }) => {
            swal({
                icon: "load.gif",
                buttons: false,
            });
            let dhArray = [];
            let dhValue = '';
            dhMulti.forEach((item) => {
                dhArray.push(item.value);
            });
            dhValue = dhArray.join();
            setSubmitting(true);
            setLoading(true);
            userSubmit(values,crUserType,dhValue,id_fi).then((val)=>{
                if (val.data.success) {
                    alert.success(val.data.message);
                    resetFields(values);
                    resetForm({});        
                }else{
                    alert.error(val.data.message);
                }
                swal.close();                        
            });          
        }
    });

    const deleteUser = async (row) => {
        confirmAlert({
            title: 'Are you sure?',
            message: 'You wont be able to revert this.',
            buttons: [
                {
                    label: 'Yes',
                    onClick: () => confirmDelete(row.id),
                    className: "btn btn-danger"
                },
                {
                    label: 'No',
                    onClick: () => console.log('Click No'),
                    className: "btn btn-success"
                }
            ]
        });         
    }

    const confirmDelete = async (id) => {
        try {
            const status = await deleteUserService(id);
            if (status.success) {
                alert.success(status.message);
                getUserList();
            }else{
                alert.error("Error.");
            }
        } catch (error) {
            alert.error(error);
        }
    }

    const [isLoading, setIsLoading] = useState(true);
    const [userList, setUserList] = useState({
        columns: [...columns],
        rows: [],
    });
    const badgesData = {
        columns: [     
            {
                label: 'SL No.',
                sort: 'disabled',
                field: 'sl',
            },
            ...userList.columns,
            {
                label: 'Action(s)',
                sort: 'disabled',
                field: 'badge',
            }
            ],
            rows: [
            ...userList.rows.map((row, order) => ({
                sl: (
                <span key={order} searchvalue={order}>
                    {order + 1}
                </span>
                ),
                ...row,
                badge: (
                <button onClick={() => deleteUser(row)} className="btn btn-danger btn-sm" color='primary' key={order} searchvalue={order}>
                    <i className="fa fa-trash"></i>
                </button>
                ),
            })),
        ],
    };  

    async function getUserList() {
        try {
            const userList = await getUserListService();

            setUserList((prevState) => {
                return { ...prevState, ["rows"]: [...userList] };
            });
            setIsLoading(false);
        } catch (error) {
            alert.error(error);
        }
    }

    useEffect(() => {
        getUserList();
    }, []);

  return (
    <div className="container dash-tabs pt-9 pb-9">
        <Card>
            <Card.Header>
                <div className="row">
                    <div className="col-6">
                        <h3 className="card-title">User Form</h3>
                    </div>
                </div>                
            </Card.Header>
            <form onSubmit={formik.handleSubmit} autoComplete="off" className="form fv-plugins-bootstrap fv-plugins-framework">
                <Card.Body>
                    <div className="form-group row">
                        <div className="col-4">
                            <label className="form-label font-weight-bolder">Name</label>
                            <div className="input-group">
                                <div className="input-group-prepend">
                                    <span className="input-group-text"><i className="fas fa-edit"></i></span>
                                </div>
                                <input
                                    placeholder="Type Name"
                                    type="text"
                                    className={`form-control ${getInputClasses("name")}`}
                                    name="name"                                     
                                    {...formik.getFieldProps("name")}
                                />                            
                            </div>
                            {formik.touched.name && formik.errors.name ? (
                                <div className="fv-plugins-message-container">
                                    <div className="fv-help-block">{formik.errors.name}</div>
                                </div>
                        ) : null}
                        </div>
                        <div className="col-4">
                            <label className="form-label font-weight-bolder">Email</label>
                            <div className="input-group">
                                <div className="input-group-prepend">
                                    <span className="input-group-text"><i className="fas fa-edit"></i></span>
                                </div>
                                <input
                                    placeholder="someone@example.com"
                                    type="text"
                                    className={`form-control ${getInputClasses("email")}`}
                                    name="email"                                     
                                    {...formik.getFieldProps("email")}
                                />                            
                            </div>
                            {formik.touched.email && formik.errors.email ? (
                                <div className="fv-plugins-message-container">
                                    <div className="fv-help-block">{formik.errors.email}</div>
                                </div>
                        ) : null}
                        </div>
                        <div className="col-4">
                            <label className="form-label font-weight-bolder">Password</label>
                            <div className="input-group">
                                <div className="input-group-prepend">
                                    <span className="input-group-text"><i className="fas fa-key"></i></span>
                                </div>
                                <input
                                    placeholder="Add Password"
                                    type="password"
                                    className={`form-control ${getInputClasses("password")}`}
                                    name="password"                                     
                                    {...formik.getFieldProps("password")}
                                />                            
                            </div>
                            {formik.touched.password && formik.errors.password ? (
                                <div className="fv-plugins-message-container">
                                    <div className="fv-help-block">{formik.errors.password}</div>
                                </div>
                        ) : null}
                        </div>
                        <div className="col-4">
                            <label className="form-label font-weight-bolder">Phone</label>
                            <div className="input-group">
                                <div className="input-group-prepend">
                                    <span className="input-group-text"><i className="fas fa-phone"></i></span>
                                </div>
                                <input
                                    placeholder="Add Phone Number"
                                    type="text"
                                    className={`form-control ${getInputClasses("phone")}`}
                                    name="phone"                                     
                                    {...formik.getFieldProps("phone")}
                                />                            
                            </div>
                            {formik.touched.phone && formik.errors.phone ? (
                                <div className="fv-plugins-message-container">
                                    <div className="fv-help-block">{formik.errors.phone}</div>
                                </div>
                        ) : null}
                        </div>
                        <div className="col-4">
                            <label className="form-label font-weight-bolder">User Type</label>
                            <div className="input-group">
                                <div className="input-group-prepend">
                                    <span className="input-group-text"><i className="fas fa-arrow-down"></i></span>
                                </div>
                                <select
                                    className="form-control"
                                    name={"cr_user_type"}        
                                    id={"cr_user_type"}         
                                    onChange={handleUserTypeChange}
                                    {...formik.getFieldProps("cr_user_type").onBlur}
                                >                                
                                    <option key={"bat"} value={"bat"}>{"Bat"}</option>
                                    <option key={"fi"} value={"fi"}>{"FI"}</option>
                                    <option key={"admin"} value={"admin"}>{"Admin"}</option>
                                </select>                          
                            </div>
                            {formik.touched.cr_user_type && formik.errors.cr_user_type ? (
                                    <div className="fv-plugins-message-container">
                                        <div className="fv-help-block">{formik.errors.cr_user_type}</div>
                                    </div>
                            ) : null}
                        </div>
                        {userTypeBat &&  
                        (<div className="col-4">
                            <label className="form-label font-weight-bolder">Select DH</label>
                            <div className="input-group">
                                <div className="input-group-prepend">
                                    <span className="input-group-text"><i className="fas fa-arrow-down"></i></span>
                                </div>

                                <MultiSelect
                                    options={dhData}
                                    value={dhMulti}
                                    onChange={handleDhChange}
                                    labelledBy="dhMulti"
                                    className="custom-multiselect"
                                />
                            </div>
                        </div>)}
                        {userTypeFi &&
                        (<div className="col-4">
                            <label className="form-label font-weight-bolder">Select FI</label>
                            <div className="input-group">
                                <div className="input-group-prepend">
                                    <span className="input-group-text"><i className="fas fa-arrow-down"></i></span>
                                </div>
                                <select
                                    className="form-control"
                                    name={"id_fi"}
                                    onChange={handleFiChange}   
                                    id="id_fi"
                                >
                                    {/*<option value="">Select</option>*/}
                                    {fiData.map((data) => (
                                        <option key={data.value} value={data.value}>
                                        {data.label}
                                        </option>
                                    ))}
                                </select>                          
                            </div>
                        </div>)}

                        {userTypeBat && (
                            <div className="col-4">
                                <label className="form-label font-weight-bolder">Remarks</label>
                                <div className="input-group">
                                    <div className="input-group-prepend">
                                        <span className="input-group-text"><i className="fas fa-edit"></i></span>
                                    </div>
                                    <input
                                        placeholder="Type Remarks"
                                        type="text"
                                        className={`form-control ${getInputClasses("remarks")}`}
                                        name="remarks"                                     
                                        {...formik.getFieldProps("remarks")}
                                    />                            
                                </div>
                                {formik.touched.name && formik.errors.name ? (
                                    <div className="fv-plugins-message-container">
                                        <div className="fv-help-block">{formik.errors.name}</div>
                                    </div>
                                ) : null}
                            </div>
                        )}

                        <div className="col-4">
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
        <Card className="mt-4">
            <Card.Header>
                <div className="row">
                    <div className="col-6">
                        <h3 className="card-title">User List</h3>
                    </div>
                </div>                
            </Card.Header>
            <Card.Body>
                {isLoading ? (
                    <div>
                      <div style={{ textAlign: "center" }}>
                        <Loader
                          type="Rings"
                          color="#00BFFF"
                          height={100}
                          width={100}
                        />
                      </div>
                    </div>
                  ) : (
                    <Datatable topSearch={true} data={badgesData} />
                  )}
            </Card.Body>
        </Card>
    </div>
  );
}

export default User;
