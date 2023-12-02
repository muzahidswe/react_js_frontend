import React, { useEffect, useState, Fragment } from "react";
import { Link } from "react-router-dom";
import FiInformationForm from "./FiDocForm";
import Loader from "react-loader-spinner";
import { getFiDetails } from "../../services/fiPortalService";

import {
  getDocuments,getFiWiseDocList, deleteRelationService, postFiDocMapping
} from "../../services/fiPortalService";
import { getCurrentUser } from "../../services/authService";
/* import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; */
import { useAlert } from "react-alert";

import Datatable from "../common/datatable";
/* import UpdateFiModal from "./updateFiModal"; */
import DeleteModal from "../common/deleteModal";
import FiDocForm from "./FiDocForm";
import { confirmAlert } from 'react-confirm-alert';

const initState = {
  id_document_title: "",
  id_fi: "",
  created_by: "",
};
const columns = [
  {
    label: "FI Name",
    field: "name",
  },
  {
    label: "Document Title",
    field: "title",
  }
];
function FiDocumentMapping(props) {

    const confirmDelete = async (id) => {
        try {
            const status = await deleteRelationService(id);
            if (status.success) {
                toast.success(status.message);
                fiWiseDocList();
            }else{
                toast.error("Error.");
            }
        } catch (error) {
            toast.error(error);
        }
    }

    const deleteRelation = async (row) => {
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
  const [value, setValue] = useState(initState);
  const toast = useAlert();
  const [currentUser, setCurrentUser] = useState("");
  const [fiData, setFiData] = useState([]);
  const [documentData, setDocumentData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [fiDocList, setFiDocList] = useState({
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
      ...fiDocList.columns,
       {
        label: 'Action(s)',
        sort: 'disabled',
        field: 'badge',
      }
    ],
    rows: [
      ...fiDocList.rows.map((row, order) => ({
        sl: (
           <span key={order} searchvalue={order}>
            {order + 1}
          </span>
        ),
        ...row,
        badge: (
          <button onClick={() => deleteRelation(row)} className="btn btn-danger btn-sm" color='primary' key={order} searchvalue={order}>
            <i className="fa fa-trash"></i>
          </button>
        ),
      })),
    ],
  };  

  const handleChange = (name, value) => {
    setValue((prevState) => {
      return { ...prevState, [name]: value };
    });
  };
  const handleValidation = () => {
    if (!value.id_document_title || !value.id_fi) {
      toast.error("Field can't be empty");
      return false;
    }

    return true;
  };

  const handleSubmit = async () => {
    try {
      value.created_by = currentUser;
      if (!handleValidation()) return;
      const status = await postFiDocMapping(value);
      toast.success(status);
      window.location.reload(false);
      await fiWiseDocList();
      
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
      const doc_list = await getDocuments();

      setDocumentData(doc_list);
    } catch (error) {
      toast.error(error);
    }
  }

  async function fiWiseDocList() {
    try {
      const dh_fi_list = await getFiWiseDocList();

      setFiDocList((prevState) => {
        return { ...prevState, ["rows"]: [...dh_fi_list] };
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
    fiWiseDocList();
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
            <div className="col-lg-5 col-xxl-5">
              {/*begin::Mixed Widget 1  bg-gray-100*/}
              <div className="card text-center card-custom  card-stretch gutter-b">
                <div className="card-header border-0 ">
                  <h3 className="card-title font-weight-bolder">
                    FI-Document Mapping
                  </h3>
                </div>
                <div className="card-body pt-4">
                  <FiDocForm
                    onChange={handleChange}
                    onSubmit={handleSubmit}
                    documentData={documentData}
                    fiData={fiData}
                    // defaultValue={value}
                  />
                  <button
                    form="dh-information-form"
                    type="submit"
                    className="btn btn-primary"
                  >
                    Submit
                  </button>
                </div>
              </div>
              {/*end::Mixed Widget 1*/}
            </div>
            <div className="col-lg-7 col-xxl-6">
              {/*begin::List Widget 9*/}
              <div className="card card-custom card-stretch gutter-b">
                <div className="card-header border-0 ">
                  <h3 className="card-title font-weight-bolder">
                    FI Wise Document List
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
                    <Datatable data={badgesData} />
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

export default FiDocumentMapping;
