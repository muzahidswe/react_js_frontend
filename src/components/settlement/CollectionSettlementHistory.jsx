import React, { useState, useEffect, Fragment } from "react";

import Loader from "react-loader-spinner";
import { useAlert } from "react-alert";
import dateFormat from "dateformat";
import FileSaver from "file-saver";
import DropdownMenuGroup from "../helper/top_dropdown";
import Datatable from "../common/datatable";
import {
  getCollectionSettlementRequest,
  postCollectionSettlementConfirm,
  postCollectionSettlementReject
} from "../../services/settlement";
import { getDhId, getDhIdBasedOnFi, getUserId, getUserType } from "../../services/authService";
import { Link } from "react-router-dom";
import CollectionSettlementDetailsModal from "./CollectionSettlementDetailsModal";
import ModalForm from "../common/modalForm";
import ConfirmationModal from "../common/confirmationModal";
import exportToExcel from "../exportToExcel";
import { getCollectionSettlementDetails } from "../../services/settlement";
import { Card, Modal } from 'react-bootstrap';
import RejectionModal from './RejectionModal';
import { useSelector } from "react-redux";

const columns = [
  {
    label: "House Name",
    field: "dh_name",
  },
  {
    label: "Account Number",
    field: "dh_acc_no",
  },
  {
    label: "Amount",
    field: "amount",
  },
  {
    label: "Status",
    field: "status",
  },
  /*   {
    label: "Attachment",
    field: "attachments",
  },
  {
    label: "Details",
    field: "details",
  }, */
  {
    label: "Date",
    field: "sys_date",
  },
  {
    label: "Actions",
    field: "actions",
  },
];

const initState = {
  date: dateFormat(new Date(), "yyyy-mm-dd"),
  date_to: dateFormat(new Date(), "yyyy-mm-dd"),
  date_from: dateFormat(new Date(), "yyyy-mm-dd")
};

function CollectionSettlementHistory(props) {
  const {selected_fi} = useSelector(state => state.fi);

  const [value, setValue] = useState(initState);
  const toast = useAlert();
  const [isLoading, setIsLoading] = useState(false);
  const [tableDataCopy, setTableDataCopy] = useState([]);
  const [onDetails, setOnDetails] = useState(false);
  const [onConfirm, setOnConfirm] = useState(false);
  const [onReject, setOnReject] = useState(false);
  const [id, setId] = useState("");
  const [modal, setModal] = useState(false);

  const toggle = () => setModal(!modal);
  const [tableData, setTableData] = useState({
    columns: [...columns],
    rows: [],
  });

  const addButton = (rowData) => {
    const rows = rowData.map((row) => {
      row.actions = (
        <Fragment>
          <button
            className="btn btn-sm btn-clean btn-primary"
            onClick={() => handleDownloadAttachment(row)}
            data-toggle="tooltip"
            data-placement="bottom"
            title="Download Transaction Attachment"
          >
            <i className=" flaticon-download" />
          </button>{" "}
          <button
            className="btn btn-sm btn-clean btn-success"
            style={{ backgroundColor: "green" }}
            onClick={() => handleDownloadExcel(row)}
            data-toggle="tooltip"
            data-placement="bottom"
            title="Download outlet list as excel"
          >
            <i className="far fa-file-excel" />
          </button>{" "}
          <button
            className="btn btn-sm btn-clean btn-info"
            onClick={() => handleDetails(row)}
            data-toggle="tooltip"
            data-placement="bottom"
            title="Show outlets"
          >
            <i className="la la-user" />
          </button>{" "}
          {(1==2 && getUserType() === "fi" && row.status == 'Requested') && (
            <><button
              className="btn btn-sm btn-clean btn-success"
              onClick={() => handleConfirm(row)}
              data-toggle="tooltip"
              data-placement="bottom"
              title="Confirm"
            >
              <i className="fas fa-check btn-success"></i> 
            </button> {" "}
            <button
              className="btn btn-sm btn-clean btn-danger"
              onClick={() => handleReject(row)}
              data-toggle="tooltip"
              data-placement="bottom"
              title="Reject"
            >
              <i className="fas fa-times btn-danger"></i>
            </button></>
          )}
        </Fragment>
      );

      return row;
    });
    return rows;
  };

  function handleDownloadAttachment(row) {
    try {
      //alert(row.attachment);
      if (typeof row.attachment !== "string")
        throw new Error("No file to download");

      FileSaver.saveAs(row.attachment, row.dh_acc_no);
    } catch (error) {
      toast.info(error.message);
    }
  }

  async function handleDownloadExcel(row) {
    try {
      const { list } = await getCollectionSettlementDetails({
        id: row.id,
      });
      if (Array.isArray(list)) {
        const newList = list.map((lst) => {
          delete lst.id;
          return lst;
        });
        exportToExcel(newList, row.dh_name + '-' + dateFormat(value.date, "yyyy-mm-dd") + 'Settlement History.xlsx');
      } else throw new Error("Nothing to download");
    } catch (error) {
      toast.error(error.message);
    }
  }
  function handleDetails(row) {
    setId(row.id);
    /* setDisburse(false);
    setReject(false); */
    setOnConfirm(false);
    setOnDetails(true);
    setShow(true);
    toggle();
  }
  function handleConfirm(row) {
    setId(row.id);
    setOnDetails(false);    
    setOnConfirm(true);
    toggle();
  }
  function handleReject(row) {
    setId(row.id);
    setOnDetails(false);    
    setOnConfirm(false);
    setOnReject(true);
    setShowRejection(true);
    toggle();
  }
  const handleConfirmation = async () => {
    try {
      const status = await postCollectionSettlementConfirm(id);
      //alert(status);
      toast.success(status);
      toggle();
    } catch (error) {
      toast.error(error.message);
    }
  };
    const [showRejection, setShowRejection] = useState(false);
    const handleRejectionClose = () => {
        setShowRejection(false);
        handleSearch();
    };
    const handleRejectionShow = () => setShowRejection(true);
    const showRejectionModal = () => {
        setShowRejection(true)
    }
  const handleRejection = async () => {
    try {
        const status = await postCollectionSettlementReject(id);
        //alert(status);
        toast.success(status);
        toggle();
    } catch (error) {
        toast.error(error.message);
    }
  }
  const handleChange = (name, value) => {
    setValue((prevState) => {
      return { ...prevState, [name]: value };
    });
  };

  const handleSearch = async () => {
    let date_from = dateFormat(new Date(), "yyyy-mm-dd");
    let date_to = dateFormat(new Date(), "yyyy-mm-dd");
    if (value.date_from) {
        date_from = dateFormat(value.date_from, "yyyy-mm-dd");
    } 
    if (value.date_to) {
        date_to = dateFormat(value.date_to, "yyyy-mm-dd");
    }
    await collectionSettlementRequest(getDhId().split(","), {date_from, date_to});
  };

  const handleOnSearch = async (e) => {
    const search_param = e.target.value;
    if (search_param.length >= 4) {
      // alert(search_param);
      let date_from = dateFormat(new Date(), "yyyy-mm-dd");
      let date_to = dateFormat(new Date(), "yyyy-mm-dd");
      if (value.date_from) {
          date_from = dateFormat(value.date_from, "yyyy-mm-dd");
      } 
      if (value.date_to) {
          date_to = dateFormat(value.date_to, "yyyy-mm-dd");
      }
      //alert(search_param);
      await collectionSettlementRequest(getDhId().split(","), {date_from, date_to}, search_param);
      //alert(search_param);
    } else {
      setTableData((prevState) => ({ ...prevState, ["rows"]: tableDataCopy }));
    }
  };

  const handleSubmit = async () => {
    let date_from = dateFormat(new Date(), "yyyy-mm-dd");
    let date_to = dateFormat(new Date(), "yyyy-mm-dd");
    if (value.date_from) {
        date_from = dateFormat(value.date_from, "yyyy-mm-dd");
    } 
    if (value.date_to) {
        date_to = dateFormat(value.date_to, "yyyy-mm-dd");
    }
    const requestObject = {
      dates: {date_from, date_to},
      user_id: getUserId(),
      dh_id: getDhId(),
    };
    // alert(JSON.stringify(requestObject));
    const status = await collectionSettlementRequest(requestObject);
    toast.info(status);
  };

  async function collectionSettlementRequest(dh_id, dates, search_param = "") {
    try {
      // setIsLoading(true);
      const requObj = {
        dh_id,
        dates,
        search_param,
      };

      const data = await getCollectionSettlementRequest(requObj);
      // setTableData(list)
      //setTotalAmount(total_amount);

      if (Array.isArray(data)) {
        const rows = addButton(data);
        setTableData((prevState) => ({ ...prevState, ["rows"]: rows }));
        if (!tableDataCopy.length) setTableDataCopy([...rows]);
      } else setTableData((prevState) => ({ ...prevState, ["rows"]: [] }));
      //setIsLoading(false);
    } catch (error) {
      console.log(error);
    }
  }

  const [show, setShow] = useState(false);
  const handleClose = () => {
      setShow(false);
  };

  useEffect(async () => {
    const date_from = dateFormat(new Date(), "yyyy-mm-dd");
    const date_to = dateFormat(new Date(), "yyyy-mm-dd");
    if (selected_fi) {
      let dh_id = await getDhIdBasedOnFi(selected_fi);
      if (dh_id.length > 0) {
        collectionSettlementRequest(dh_id, {date_from, date_to});
      }
    }
  }, [selected_fi]);

  return (
    <div className="card p-5 m-5" style={{ minHeight: "78vh" }}>
      <br />
      <h2 className="d-flex justify-content">
        Settlement History
      </h2>
      <br />

      <div className="row">
        <div className="col-12 ">
          {/* <b>
            <span>
              <strong>Total Amount: </strong>
              {totalAmount}
            </span>
          </b> */}
        </div>
        <div className="pull-right float-right">
            <div className="input-group py-5 col-12 pull-right float-right" >
                <span className="input-group-text ">Date From</span>
                <input
                
                    type="date"
                    className="form-control  form-control-md form-control-solid "
                    value={value.date_from || ""}
                    onChange={(e) => handleChange("date_from", e.target.value)}
                />
                <span className="input-group-text ml-10">Date To</span>
                <input
                
                    type="date"
                    className="form-control  form-control-md form-control-solid "
                    value={value.date_to || ""}
                    onChange={(e) => handleChange("date_to", e.target.value)}
                />
                <button
                    className="btn btn-primary mr-20 ml-10"
                    onClick={handleSearch}
                >
                    {" "}
                    Search
                </button>
            </div>
        </div>
      </div>

      {isLoading ? (
        <div>
          <div style={{ textAlign: "center" }}>
            <Loader type="Rings" color="#00BFFF" height={100} width={100} />
          </div>
        </div>
      ) : (
        <Fragment>
          <div className="d-flex justify-content-end ml-auto">
            <input
              className="form-control"
              type="text"
              placeholder="search here..."
              onChange={handleOnSearch}
            />
          </div>
          <Datatable data={tableData} topSearch={false} />
        </Fragment>
      )}

      {onDetails && (
        <Modal show={show} 
                onHide={handleClose} 
                backdrop="static" 
                keyboard={false} 
                size="xl"
                centered>
            <Modal.Header>
                <Modal.Title> </Modal.Title>
                <button className="close" variant="secondary" onClick={handleClose}>
                    <i className="fa fa-times"></i>
                </button>
            </Modal.Header>
            <Modal.Body className="customModalBody">
                <CollectionSettlementDetailsModal id={id} />
            </Modal.Body>
        </Modal>
      )}

      {onConfirm && (
        <ConfirmationModal
          modalTitle="Confirm"
          modal={modal}
          toggle={toggle}
          btnName="Confirm"
          handleClick={handleConfirmation}
          msg="Are you sure you want to confirm ?"
        />
      )}
      {
          onReject && (
              <Modal show={showRejection} 
                    onHide={handleRejectionClose} 
                    backdrop="static" 
                    keyboard={false} 
                    size="lg"
                    centered>
                <Modal.Header>
                    <Modal.Title>Are you sure you want to Reject?</Modal.Title>
                    <button className="close" variant="secondary" onClick={handleRejectionClose}>
                        <i className="fa fa-times"></i>
                    </button>
                </Modal.Header>
                <Modal.Body className="customModalBody">
                    <RejectionModal id={id} handleClose={handleRejectionClose}/>
                </Modal.Body>
            </Modal>              
          )
      }
    </div>
  );
}

export default CollectionSettlementHistory;
