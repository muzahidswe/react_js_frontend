import React, { useEffect, useState, Fragment } from "react";
import { Link } from "react-router-dom";
import Loader from "react-loader-spinner";
import FiInformationForm from "./fiInformationForm";
import {
  postFiInstitute,
  getFiDetails,
  updateFi,
  deleteFi,
} from "../../services/fiPortalService";
import { getCurrentUser } from "../../services/authService";
/* import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; */

import Datatable from "./../common/datatable";
import UpdateFiModal from "./updateFiModal";
import DeleteModal from "../common/deleteModal";
import { useAlert } from "react-alert";
import { baseURL } from "../../constants/constants";
import { confirmAlert } from 'react-confirm-alert';
import axios from 'axios';

const DEACTIVE_URL = baseURL+'deactivate-fi-transaction';
const ACTIVATE_URL = baseURL+'activate-fi-transaction';

const initState = {
  name: "",
  address: "",
  branch: "",
  phone: "",
  email: "",
  contact_person_name: "",
  created_by: "",
};
const columns = [
  {
    label: "Name",
    field: "name",
  },
  {
    label: "Branch",
    field: "branch",
  },
  {
    label: "Contact No",
    field: "phone",
  },
  {
    label: "Address",
    field: "address",
  },
  {
      label: "TRX Status",
      field: "transactional_status"
  },
  {
    label: "Actions",
    field: "actions",
    sort: "disabled",
  },
];
function FiPortal(props) {
  const [value, setValue] = useState(initState);
  const [updatableRow, setUpdatableRow] = useState();
  const [deletableRow, setDeletableRow] = useState();
  const [onEdit, setOnEdit] = useState(false);
  const [onDelete, setOnDelete] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const toast = useAlert();
  const [currentUser, setCurrentUser] = useState("");
  const [fiList, setFiList] = useState({
    columns: [...columns],
    rows: [],
  });
  const [modal, setModal] = useState(false);

  const toggle = () => setModal(!modal);
  const handleChange = (name, value) => {
    setValue((prevState) => {
      return { ...prevState, [name]: value };
    });
  };

  const handleUpdateChange = (name, value) => {
    setUpdatableRow((prevState) => {
      return { ...prevState, [name]: value };
    });
  };
  const handleValidation = () => {
    if (
      value.name === "" ||
      value.email === "" ||
      value.address === "" ||
      value.phone === "" ||
      value.branch === "" ||
      value.contact_person_name === "" ||
      value.created_by === ""
    ) {
      toast.error("Field can't be empty");
      return false;
    }
    return true;
  };

  const addButton = (rowData) => {
    const rows = rowData.map((row) => {
      row.actions = (
        <Fragment>
          {/*<Link
            className="btn btn-sm btn-clean btn-icon"
            data-toggle="tooltip"
            data-placement="bottom"
            title="Preview"
            onClick={() => handleView(row)}
          >
            <i className="la la-desktop"></i>
          </Link>{" "}*/}
          {row.transactional_status == 'Active' ? (
              <Link
                className="btn btn-sm btn-clean btn-icon"
                data-toggle="tooltip"
                data-placement="bottom"
                title="Change Transactional Status"
                onClick={() => handleDeActive(row)}
            >
                <i className="la la-scissors text-warning"></i>
            </Link>
          ) : (
              <Link
                className="btn btn-sm btn-clean btn-icon"
                data-toggle="tooltip"
                data-placement="bottom"
                title="Change Transactional Status"
                onClick={() => handleActive(row)}
            >
                <i className="la la-handshake text-success"></i>
            </Link>
          )}
          
          <Link
            className="btn btn-sm btn-clean btn-icon"
            data-toggle="tooltip"
            data-placement="bottom"
            title="Edit"
            onClick={() => handleEdit(row)}
          >
            <i className="la la-edit text-info"></i>
          </Link>          
          <Link
            className="btn btn-sm btn-clean btn-icon"
            data-toggle="tooltip"
            data-placement="bottom"
            title="Delete"
            onClick={() => handleDelete(row)}
          >
            <i className="la la-trash text-danger"></i>
          </Link>          
        </Fragment>
      );
      return row;
    });
    return rows;
  };

  const handleDeActive = (row) => {
      confirmAlert({
        title: 'Are you sure?',
        message: 'Do you want to Deactivate all transactions for this Finantial Institute?',
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

  const handleActive = (row) => {
    confirmAlert({
        title: 'Are you sure?',
        message: 'Do you want to Allow transactions for this Finantial Institute?',
        buttons: [
            {
                label: 'Yes',
                onClick: () => confirmActive(row.id),
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

  const confirmDeActive = (id) => {
      axios.post(`${DEACTIVE_URL}`,{
            id: id
        }).then(res => {
            toast.success('Successfully Deactivated.');
            getFiList();
        }).catch(err => {
            toast.error('Something went wrong.');
        });
  }
  const confirmActive = (id) => {
      axios.post(`${ACTIVATE_URL}`,{
            id: id
        }).then(res => {
            toast.success('Successfully Deactivated.');
            getFiList();
        }).catch(err => {
            toast.error('Something went wrong.');
        });
  }

  const handleView = () => {
      toast.success("view");
    //toast("view");
  };

  //Fi information update
  const handleEdit = async (row) => {
    //setOnView(false);
    setOnDelete(false);
    setUpdatableRow(row);
    setOnEdit(true);
    toggle();
  };

  const handleUpdate = async () => {
    //toast(JSON.stringify(updatableRow));
    try {
      const {
        id,
        name,
        branch,
        address,
        email,
        phone,
        contact_person_name,
      } = updatableRow;
      const requestObject = {
        id,
        name,
        branch,
        address,
        email,
        phone,
        contact_person_name,
        updated_by: currentUser,
      };
      const status = await updateFi(requestObject, document.getElementById('uploadFileUpdate').files[0]);
      toast.success(status);
      await getFiList();
    } catch (error) {
      console.log("error ", error);
      toast.error(error);
    }
  };

  //For deleting a row from table
  const handleDelete = (row) => {
    setDeletableRow(row);
    setOnEdit(false);
    setOnDelete(true);
    toggle();
  };

  const deleteRow = async () => {
    const originalData = { ...fiList };
    const newList = fiList["rows"].filter(
      (item) => item.id !== deletableRow.id
    );
    setOnDelete(false);
    toggle();
    setFiList((prevState) => {
      return { ...prevState, ["rows"]: [...newList] };
    });

    try {
      const status = await deleteFi(deletableRow.id);
      toast.success(status);
    } catch (error) {
      toast.error("Something went wrong while trying to delete");
      setFiList(originalData);
    }
  };
  //Submit fi form
  const handleSubmit = async () => {
    try {
      value.created_by = currentUser;
      if (!handleValidation()) return;
      const status = await postFiInstitute(value, document.getElementById('uploadFile').files[0]);
      if (status.success) {
          toast.success(status.message);
      }else{
          toast.error(status.message);
      }
      
      await getFiList();
    } catch (error) {
      
    }
  };
  async function getFiList() {
    try {
      const rowData = await getFiDetails();
      const rows = addButton(rowData);
      setFiList((prevState) => {
        return { ...prevState, ["rows"]: [...rows] };
      });
      setIsLoading(false);
    } catch (error) {
      console.log("......... ", error);
    }
  }

  useEffect(() => {
    const user = getCurrentUser();
    if (user?.data) setCurrentUser(user.data.id);
    getFiList();
  }, []);
  return (
    <div
      className="content d-flex flex-column flex-column-fluid"
      id="kt_content"
    >
      {/*  <ToastContainer /> */}
      {/*begin::Entry*/}
      <div className="d-flex flex-column-fluid">
        {/*begin::Container*/}
        <div className="container">
          {/*begin::Dashboard*/}
          {/*begin::Row*/}
          <div className="row">
            <div className="col-lg-5 col-xxl-5">
              {/*begin::Mixed Widget 1  bg-gray-100*/}
              <div className="card text-center card-custom  card-stretch gutter-b">
                <div className="card-header border-0 ">
                  <h3 className="card-title font-weight-bolder">
                    FI Information
                  </h3>
                </div>
                <div className="card-body pt-4">
                  <FiInformationForm
                    onChange={handleChange}
                    onSubmit={handleSubmit}
                    defaultValue={value}
                  />
                  <button
                    form="fi-information-form"
                    type="submit"
                    className="btn btn-primary float-right"
                    style = {{"margin-right": 37}}
                  >
                    Submit
                  </button>
                </div>
              </div>
              {/*end::Mixed Widget 1*/}
            </div>
            <div className="col-lg-7 col-xxl-7">
              {/*begin::List Widget 9*/}
              <div className="card card-custom card-stretch gutter-b">
                <div className="card-header border-0 ">
                  <h3 className="card-title font-weight-bolder">FI List</h3>
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
                    <Datatable data={fiList} />
                  )}
                </div>
              </div>

              {/*end: List Widget 9*/}
            </div>
          </div>
          {onEdit && (
            <UpdateFiModal
              modalTitle="Update"
              btnName="Update"
              toggle={toggle}
              modal={modal}
              handleUpdate={handleUpdate}
              handleChange={handleUpdateChange}
              defaultValue={updatableRow}
            />
          )}

          {onDelete && (
            <DeleteModal
              modalTitle="Delete Record"
              toggle={toggle}
              modal={modal}
              handleClick={deleteRow}
            />
          )}
        </div>
        {/*end::Container*/}
      </div>
      {/*end::Entry*/}
    </div>
  );
}

export default FiPortal;
