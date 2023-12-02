import React, { useEffect, useState } from "react";
import { fileSubmit } from '../../services/fileUploadServices';
import { useAlert } from 'react-alert';
import { makeStyles } from '@material-ui/core/styles';
import { useFormik } from "formik";
import * as Yup from "yup";
import { Card } from 'react-bootstrap';
import { postCollectionSettlementReject } from "../../services/settlement";
import swal from 'sweetalert';

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

function RejectionModal(props) {

    const initialValues = {
        rejection_reason: "",
        historyId: props.id ? props.id : ""
    };
    const alert = useAlert();
    const classes = useStyles();
    const [file,setFile] = useState(null);

    const validation = Yup.object().shape({
        rejection_reason: Yup.string().required("Reason is a rquired field.")
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
        val.rejection_reason = '';
    }
    
    const [historyId, setHistoryId] = useState(0);
    useEffect(() => {
        props.id ? setHistoryId(props.id) : setHistoryId(0)
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
            postCollectionSettlementReject(values).then((val)=>{
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
                if (props.handleClose) {
                    props.handleClose();
                }
            });                    
        }
    });
  return (
    <div className="container dash-tabs pt-9 pb-9">
        <Card>
            <form onSubmit={formik.handleSubmit} autoComplete="off" className="form fv-plugins-bootstrap fv-plugins-framework">
                <Card.Body>
                    <div className="form-group row">
                        <div className="col-12">
                            <label className="form-label font-weight-bolder">Rejection reason</label>
                            <div className={props.prevTitle ? 'input-group pointer-none' : 'input-group'}>
                                <textarea
                                    placeholder="Type Reason Here"
                                    type="text"
                                    className={`form-control ${getInputClasses("note")}`}
                                    name="rejection_reason"
                                    rows={3}
                                    {...formik.getFieldProps("rejection_reason")}
                                ></textarea>                           
                            </div>
                            {formik.touched.rejection_reason && formik.errors.rejection_reason ? (
                                <div className="fv-plugins-message-container">
                                    <div className="fv-help-block">{formik.errors.rejection_reason}</div>
                                </div>
                        ) : null}
                        </div>
                    </div>
                    
                    <div className="form-group row">
                        <div className="col-12">
                            
                            <div className="input-group">
                                <button
                                    type="submit"
                                    //onClick={addPaymentMethod}
                                    className="btn btn-danger font-weight-bold"
                                >
                                    <span>Reject</span>
                                    {/* {loading && <span className="ml-3 spinner spinner-white"></span>} */}
                                </button>
                                {"\u00A0\u00A0"}
                                <button
                                    type="button"
                                    onClick={props.handleClose ? props.handleClose : ''}
                                    className="btn btn-success font-weight-bold"
                                >
                                    <span>Close</span>
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

export default RejectionModal;
