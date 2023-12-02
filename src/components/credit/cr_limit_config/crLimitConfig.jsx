import React, { useState, useEffect } from "react";
/* import { toast, ToastContainer } from "react-toastify"; */
import { useAlert } from "react-alert";
import DropdownMenuGroup from "../../helper/top_dropdown";
import Datatable from "../../common/datatable";
import CrLimitForm from "./crLimitForm";
import { getCurrentUser } from "../../../services/authService";
import {
  postCrLimitConfig,
  getCrLimitConfig,
  deleteConfigService,
  fileUploadCrLimitByOutlet
} from "../../../services/crLImitService";
import { Card, Modal, Button } from 'react-bootstrap';
import ModalHeader from 'react-bootstrap/ModalHeader';
import LimitEditModal from './LimitEditModal';
import { baseURL } from "../../../constants/constants";
import axios from 'axios';
import { useFormik } from "formik";
import * as Yup from "yup";
import swal from 'sweetalert';
import styles from './crLimitConfig.module.css';


const initState = {
  region_id: "",
  area_id: "",
  house_id: "",
  territory_id: "",
  point_id: "",
  allowed_percentage: "",
  effective_percentage: "",
  effective_date: "",
  duration: "",
  duration_month: "",
  duration_year: "",
  monthly_percentage: "",
  daily_percentage: "",
  end_date: "",
};
const columns = [
  {
    label: "House Name",
    field: "dh_name",
  },
  {
    label: "Point Name",
    field: "point_name",
  },
  {
    label: "Allowed Percentage",
    field: "allowed_percentage",
  },
//   {
//     label: "Effective Percentage",
//     field: "effective_percentage",
//   },
//   {
//     label: "Monthly Percentage",
//     field: "monthly_percentage",
//   },

  {
    label: "Daily Percentage",
    field: "daily_percentage",
  }
];

function CrLimitConfig(props) {
  const [id, setId] = useState(0);
  const deleteConfig = async (config_id) => {
    try {
        const status = await deleteConfigService(config_id);
        if (status.success) {
            toast.success(status.message);
            crLimitConfigList();
        }else{
            toast.error("Error.");
        }
    } catch (error) {
        toast.error(error);
    }
  }
  const [value, setValue] = useState(initState);
  const toast = useAlert();
  const [dpids, setDpids] = useState(localStorage.getItem("dpids").split(","));
  const [currentUser, setCurrentUser] = useState("");
  const [crLimitList, setCrLimitList] = useState({
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
      ...crLimitList.columns,
       {
        label: 'Action(s)',
        sort: 'disabled',
        field: 'badge',
      }
    ],
    rows: [
      ...crLimitList.rows.map((row, order) => ({
        sl: (
           <span key={order} searchvalue={order}>
            {order + 1}
          </span>
        ),
        ...row,
        badge: ( 
          <>
            <button onClick={() => handleShow(row.id)} className="btn btn-info btn-sm mr-2" color='primary'>
                <i className="fa fa-edit"></i>
            </button>
            {/*<button onClick={() => deleteConfig(row.id)} className="btn btn-danger btn-sm" color='primary' key={order} searchvalue={order}>
                <i className="fa fa-trash"></i>
            </button>*/}
          </>
        ),
      })),
    ],
  };  

  const handleChange = (name, value) => {
    setValue((prevState) => {
      return { ...prevState, [name]: value };
    });
  };
  const handleDpidChange = (ids) => {
    setDpids(ids);
  };
  const validation = () => {
    if (
      !value.allowed_percentage ||
      !value.daily_percentage
    ) {
      toast.error("Field can't be empty");

      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validation()) return;
    //Need refractor here.
    //const total_days = value.duration_year * 365 + value.duration_month * 30;
    //const end_date = addDays(value.effective_date, total_days);

    const postObject = {
      point_id: dpids,
      allowed_percentage: value.allowed_percentage,
      effective_percentage: value.effective_percentage,
      monthly_percentage: value.monthly_percentage,
      daily_percentage: value.daily_percentage,
      created_by: currentUser,
    };

    try {
      const status = await postCrLimitConfig(postObject);
      if (status.success) {
          toast.success(status.message);
      }else{
          toast.error("Duplicate Point Configuration is not allowed.");
      }
    } catch (error) {
      toast.error(error);
    }
    crLimitConfigList();
  };

  async function crLimitConfigList() {
    try {
      const cr_limit_config_list = await getCrLimitConfig();

      setCrLimitList((prevState) => {
        return { ...prevState, ["rows"]: [...cr_limit_config_list] };
      });
    } catch (error) {
      toast.error(error);
    }
  }
  
  useEffect(() => {
    const user = getCurrentUser();
    if (user?.data) setCurrentUser(user.data.id);
    crLimitConfigList();
  }, []);
  const [show, setShow] = useState(false);
  const DETAILS_URL = baseURL+'get-config';
  const handleShow = async (id) => {
       getDetails(id);
       setId(id);
        
    };
    const [allowedPercentage, setAllowedPercentage] = useState(0);
    const [dailyPercentage, setDailyPercentage] = useState(0);
    const getDetails = async (id) => {
        const token = localStorage.getItem('token');
        const config = {
            headers: { 
                Authorization: `Bearer ${token}`,
                'content-type': 'multipart/form-data'
            },
        };
        var res = await axios.get(`${DETAILS_URL}/${id}`,config)
        .then((data)=>{
            if (!data.data.success) {
                alert.error("Data not found.")
            }
            setAllowedPercentage(data.data.data.allowed_percentage);
            setDailyPercentage(data.data.data.daily_percentage);
            setShow(true);
        });        
    }
  const handleClose = () => {
      setShow(false);
      crLimitConfigList();
  };

  const initialValues2 = {
    file: "",
    fi_select: null
  };

  const [loading, setLoading] = useState(false);

  const uploadFile = Yup.object().shape({
    file: Yup.mixed().required()
  });

  const getInputClasses = (fieldname) => {
    if (formik2.touched[fieldname] && formik2.errors[fieldname]) {
        return "is-invalid";
    }

    if (formik2.touched[fieldname] && !formik2.errors[fieldname]) {
        return "is-valid";
    }

    return "";
  };

  const sampleDownload = baseURL + 'download/samples/sample_limit_config_by_outlet.xlsx';

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
        fileUploadCrLimitByOutlet(document.getElementById('uploadFile').files[0]).then((val)=>{
            if (val.data.success) {
                toast.success(val.data.message);
            }else{
              toast.error(val.data.message);
            }
            swal.close();
        });
    }
  });

  return (
    <div
      className="content d-flex flex-column flex-column-fluid"
      id="kt_content"
    >
      <div className="d-flex flex-column-fluid">
        <div className="container">
          <div className="row">
            <Card className="m-5" style={{width: '100%', zIndex: 2, marginBottom: '2rem'}}>
              <Card.Body>
                  <form onSubmit={formik2.handleSubmit} autoComplete="off" className="form fv-plugins-bootstrap fv-plugins-framework animated animate__animated animate__backInUp">
                      <div className="row">
                          <div className="col-3">
                              <h4 className="card-title">Upload Credit Limit Config By Outlet</h4>
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



            <Card className="m-5">
                <Card.Header>
                    <div className="row">
                        <h3 className="card-title">Scope Outlets</h3>
                    </div>
                    
                </Card.Header>
                    <Card.Body>
                        <DropdownMenuGroup
                            onDpidChange={handleDpidChange}
                            isSearch={false}
                        />
                        <CrLimitForm
                            onChange={handleChange}
                            onSubmit={handleSubmit}
                            defaultValue={value}
                        />

                        <button
                            form="cr-limit-form"
                            type="submit"
                            className="btn btn-primary float-right "
                            style={{'margin-right': 103}}
                        >
                            Submit
                        </button>
                    </Card.Body>
            </Card>
            {/*<div className="col-lg-12 col-xxl-12">
              <div className="card text-center card-custom  card-stretch gutter-b">
                <div className="card-header border-0 ">
                  <h3 className="card-title font-weight-bolder">
                    Credit Limit Configuration Form
                  </h3>
                </div>
                <div className="card-body pt-4">
                  <DropdownMenuGroup
                    onDpidChange={handleDpidChange}
                    isSearch={false}
                  />
                  <CrLimitForm
                    onChange={handleChange}
                    onSubmit={handleSubmit}
                    defaultValue={value}
                  />

                  <button
                    form="cr-limit-form"
                    type="submit"
                    className="btn btn-primary float-right "
                    style={{'margin-right': 103}}
                  >
                    Submit
                  </button>
                </div>
              </div>
            </div>*/}
            <div className="col-lg-12 col-xxl-12">
              <div className="card card-custom card-stretch gutter-b">
                <div className="card-header border-0 ">
                  <h3 className="card-title font-weight-bolder">
                    Credit Limit Configuration List
                  </h3>
                </div>
                <div className="card-body pt-4">
                  <Datatable topSearch={true} data={badgesData} />
                </div>
                <Modal show={show} 
                    onHide={handleClose} 
                    backdrop="static" 
                    keyboard={false} 
                    size="lg"
                    centered>
                    <Modal.Header>
                        <Modal.Title>Edit Credit Limit Configuration</Modal.Title>
                        <Button className="close" variant="secondary" onClick={handleClose}>
                            <i className="fa fa-times"></i>
                        </Button>
                    </Modal.Header>
                    <Modal.Body>
                        <LimitEditModal
                             handleClose = {handleClose} 
                             allowedPercentage={allowedPercentage}
                             dailyPercentage={dailyPercentage}
                             id={id}></LimitEditModal>
                    </Modal.Body>
                </Modal>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CrLimitConfig;
