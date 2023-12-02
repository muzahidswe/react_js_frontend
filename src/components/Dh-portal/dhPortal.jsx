import React, { useEffect, useState, Fragment } from "react";
import { Link } from "react-router-dom";
import FiInformationForm from "./dhForm";
import Loader from "react-loader-spinner";
import { getFiDetails } from "../../services/fiPortalService";
import {
  getDh,
  postFiDhMapping,
  getDhWiseList,
} from "../../services/dhPortalService";
import { getCurrentUser } from "../../services/authService";
/* import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; */
import { useAlert } from "react-alert";

import Datatable from "../common/datatable";
/* import UpdateFiModal from "./updateFiModal"; */
import DeleteModal from "../common/deleteModal";
import DhForm from "./dhForm";
import { confirmAlert } from 'react-confirm-alert';
import axios from 'axios';
import { baseURL } from "../../constants/constants";

const DEACTIVE_URL = baseURL+'deactivate-fi-dh-relation';
const ACTIVE_URL = baseURL+'activate-fi-dh-relation';

const initState = {
  id_dh: "",
  id_fi: "",
  created_by: "",
  dh_acc_no:""
};
const columns = [
  {
    label: "FI",
    field: "fi",
  },
  {
    label: "DH",
    field: "dh",
  },
  {
    label: "DH Acc No",
    field: "dh_acc_no",
  },
  {
    label: "Status",
    field: "status",
  },
  {
    label: "Actions",
    field: "actions",
    sort: "disabled",
  },
];
function FiPortal(props) {
  const [value, setValue] = useState(initState);
  const toast = useAlert();
  const [currentUser, setCurrentUser] = useState("");
  const [fiData, setFiData] = useState([]);
  const [dhData, setDhData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedRow, setSelectedRow] = useState([]);
  const [dhList, setDhList] = useState({
    columns: [...columns],
    rows: [],
  });
  const addButton = (rowData) => {
    const rows = rowData.map((row) => {
      row.actions = (
        <Fragment>
         <Link
            className="btn btn-sm btn-clean btn-icon"
            data-toggle="tooltip"
            data-placement="bottom"
            title="Edit"
            to="#"
            onClick={() => handleEdit(row)}
          >
            <i className="la la-edit text-primary"></i>
          </Link>
         {row.status != 'Active' ? (
              <Link
            className="btn btn-sm btn-clean btn-icon"
            data-toggle="tooltip"
            data-placement="bottom"
            title="Active"
            to="#"
            onClick={() => handleActive(row)}
          >
            <i className="la la-check text-success"></i>
          </Link>
         ) : (<Link
            className="btn btn-sm btn-clean btn-icon"
            data-toggle="tooltip"
            data-placement="bottom"
            title="Deactive"
            to="#"
            onClick={() => handleDeActive(row)}
          >
            <i className="la la-times text-danger"></i>
          </Link>)} 
        </Fragment>
      );
      return row;
    });
    return rows;
  };

  const handleEdit = (row) => {
    setSelectedRow(row);
  }

  const handleActive = (row) => {
    confirmAlert({
        title: 'Are you sure?',
        message: 'Do you want to Activate this relation?',
        buttons: [
            {
                label: 'Yes',
                onClick: () => confirmActive(row.id, row.id_dh),
                className: "btn btn-success"
            },
            {
                label: 'No',
                onClick: () => console.log('Click No'),
                className: "btn btn-danger"
            }
        ]
    });
  }

  const handleDeActive = (row) => {
      confirmAlert({
        title: 'Are you sure?',
        message: 'Do you want to Deactivate this relation?',
        buttons: [
            {
                label: 'Yes',
                onClick: () => confirmDeActive(row.id),
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
  
  const confirmDeActive = async (id) => {
        axios.post(`${DEACTIVE_URL}`,{
            id: id
        }).then(res => {
            toast.success('Successfully Deactivated.');
            dhWiseList();
        }).catch(err => {
            toast.error('Something went wrong.');
        });
    }

  const confirmActive = async (id, id_dh) => {
        axios.post(`${ACTIVE_URL}`,{
            id: id,
            id_dh: id_dh
        }).then(res => {
            if (res.data.data.success) {
                toast.success('Successfully Activated.');                
            }else{
                toast.error(res.data.message);
            }       
            dhWiseList();
        }).catch(err => {
            toast.error('Something went wrong.');
        });
    }

  const handleChange = (name, value) => {
    setValue((prevState) => {
      return { ...prevState, [name]: value };
    });
  };
  const handleValidation = () => {
    if (!value.id_dh || !value.id_fi || !value.dh_acc_no) {
      toast.error("Field can't be empty");
      return false;
    }

    return true;
  };
  
  const handleSubmit = async () => {
    try {
      value.created_by = currentUser;
      if (!handleValidation()) return;
      if (typeof selectedRow.id !== 'undefined') {
          value.id = selectedRow.id;
      }
      const status = await postFiDhMapping(value);
      
      if (status.success) {          
          toast.success(status.message);
      }else{
          toast.error(status.message);
      }      
      await dhWiseList();
      setSelectedRow({});
    } catch (error) {
      toast.error(error);
    }
  };
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
      toast.error(error);
    }
  }

  async function dhWiseList() {
    try {
      const dh_list = await getDhWiseList();
      const rows = addButton(dh_list);
      setDhList((prevState) => {
        return { ...prevState, ["rows"]: [...rows] };
      });
      setIsLoading(false);
    } catch (error) {
      toast.error(error);
    }
  }

  useEffect(() => {
    const user = getCurrentUser();
    if (user?.data) setCurrentUser(user.data.id);
    getFiList();
    getDhList();
    dhWiseList();
  }, []);
  return (
    <div
      className="content d-flex flex-column flex-column-fluid"
      id="kt_content"
      style={{ minHeight: "80vh" }}
    >
      {/* <ToastContainer /> */}
      {/*begin::Entry*/}
      <div className="d-flex flex-column-fluid">
        {/*begin::Container*/}
        <div className="container">
          {/*begin::Dashboard*/}
          {/*begin::Row*/}
          <div className="row">
            <div className="col-4">
              {/*begin::Mixed Widget 1  bg-gray-100*/}
              <div className="card text-center card-custom  card-stretch gutter-b">
                <div className="card-header border-0 ">
                  <h3 className="card-title font-weight-bolder">
                    DH-FI Mapping
                  </h3>
                </div>
                <div className="card-body pt-4">
                  <DhForm
                    onChange={handleChange}
                    onSubmit={handleSubmit}
                    dhData={dhData}
                    fiData={fiData}
                    selectedRow={selectedRow}
                    // defaultValue={value}
                  />
                  <div className="pull-right float-right">
                  <button
                    form="dh-information-form"
                    type="submit"
                    className="btn btn-primary "
                  >
                    Submit
                  </button>
                  </div>
                </div>
              </div>
              {/*end::Mixed Widget 1*/}
            </div>
            <div className="col-lg-8 col-xxl-8">
              {/*begin::List Widget 9*/}
              <div className="card card-custom card-stretch gutter-b">
                <div className="card-header border-0 ">
                  <h3 className="card-title font-weight-bolder">
                    FI Wise DH List
                  </h3>
                </div>
                <div className="card-body pt-4">
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
                    <Datatable data={dhList} topSearch={true}/>
                  )}
                </div>
              </div>

              {/*end: List Widget 9*/}
            </div>
          </div>
        </div>
        {/*end::Container*/}
      </div>
      {/*end::Entry*/}
    </div>
  );
}

export default FiPortal;
