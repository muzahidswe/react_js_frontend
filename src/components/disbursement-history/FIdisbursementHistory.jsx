import React, {useEffect, useState, Fragment} from "react";
import Loader from "react-loader-spinner";
import Datatable from "./../common/datatable";
import {useAlert} from "react-alert";
import {
    getDisbursementHistoryList,
    requestedCollectionsByDh,
    rejectDisbursementRequest, setCreditDisburse
} from "../../services/disbursementHistroryService";

import {getTransactionDisbursementDetails} from "../../services/disbursement";

import {getCurrentUser, getDhId} from "../../services/authService";
import {Link} from "react-router-dom";
// import DropdownMenuGroup from "../common/TopDropdownTwo";
import DropdownMenuGroup from "../helper/top_dropdown_without_territory_point";

import ConfirmationModal from "../common/confirmationModal";
import FiDisbursmentModal from "./FiDisbursmentModal";
import FileSaver from "file-saver";
import { Card, Modal, Button } from 'react-bootstrap';

import dateFormat from "dateformat";
import Details from "../disbursement/Details";
import ModalForm from "../common/modalForm";
import {baseURL} from "../../constants/constants";
import { useSelector } from "react-redux";

const initState = {
    dh_name: "",
    dh_acc_no: "",
    amount: "",
    sys_date: "",
    status: "",
    attachment: "",
};
const columns = [
    {
        label: "SL.",
        field: "serial",
    },
    {
        label: "House Name",
        field: "dh_name",
    },
    {
        label: "Acc No",
        field: "dh_acc_no",
    },
    {
        label: "Amount",
        field: "amount",
    },
    {
        label: "Date",
        field: "sys_date",
    },
    {
        label: "Status",
        field: "status",
    },
    {
        label: "Attachment",
        field: 'attachments'
    },
    {
        label: "Outlets",
        field: 'details'

    },
    {
        label: "Action",
        field: 'action'
    }
];

const init = {
    tnxNumber: "",
    filename: "",
    id: "",
};

function FiDisbursementHistory(props) {
    const {selected_fi} = useSelector(state => state.fi);
    const [value, setValue] = useState(initState);

    const [isLoading, setIsLoading] = useState(true);
    const [dpids, setDpids] = useState();
    const toast = useAlert();
    const [currentUser, setCurrentUser] = useState("");
    const [dh, setDh] = useState([]);
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]); 
    const [historyList, setHistoryList] = useState({
        columns: [...columns],
        rows: [],
    });

    const [onDetails, setOnDetails] = useState(false);
    const [id, setId] = useState("");

    const [formValue, setFormValue] = useState(init);
    const [modal, setModal] = useState(false);
    const [disburse, setDisburse] = useState(false);
    const [reject, setReject] = useState(false);
    const [actionId, setActionId] = useState("");
    const [deletedRow, setDeletedRow] = useState();

    const [rejectionReason, setRejectionReason] = useState('');

    const toggle = () => setModal(!modal);

    const addButton = (rowData) => {
        const rows = rowData.map((row) => {
            row.details = (
                <Fragment>
                    <button
                        className="btn btn-sm btn-clean btn-info"
                        data-toggle="tooltip"
                        data-placement="bottom"
                        title="Outlets Preview"
                        onClick={() => handleDetails(row)}
                    >
                        <i className="la la-user"></i>
                    </button>
                </Fragment>
            );

            row.attachments = (
                <Fragment>
                    <Link
                        className="btn btn-sm btn-primary"
                        data-toggle="tooltip"
                        data-placement="bottom"
                        title="Download Transaction Attachment"
                        onClick={() => handleAttachment(row)}
                    ><i className="la la-download"></i>
                    </Link>{" "}

                    <Link
                        className="btn btn-sm btn-success"
                        data-toggle="tooltip"
                        data-placement="bottom"
                        title="Outlets excel"
                        onClick={() => handleOutletReport(row)}
                    ><i className="la la-file-excel"></i>
                    </Link>

                </Fragment>
            );

            row.action = (
                <Fragment>
                    <Link
                        className="btn btn-sm btn-success"
                        data-toggle="tooltip"
                        data-placement="bottom"
                        title="Disburse"
                        onClick={() => handleDisburse(row)}
                    ><i className="la la-check"></i>
                    </Link>
                    {" "}
                    <Link
                        style = {{display:  'none' }}
                        className="btn btn-sm btn-danger"
                        data-toggle="tooltip"
                        data-placement="bottom"
                        title="Reject"
                        onClick={() => handleReject(row)}
                        ><i className="la la-times"></i>
                    </Link>

                </Fragment>
            );
            return row;
        });
        return rows;
    };
    const handleReject = (row) => {
        setDeletedRow(row);
        setOnDetails(false);
        setDisburse(false);
        setReject(true);
        toggle();
    };

    const requestReject = async () => {
        setRejectionReason(document.getElementById('rejection_reason').value);
        const originalDta = {...historyList};
        const newHistory = historyList["rows"].filter(
            (item) => item.id !== deletedRow.id
        );
        setReject(false);
        toggle();
        newHistory.forEach((v, index) => { v.serial = index + 1; });
        setHistoryList((prevState) => {
            return {...prevState, ["rows"]: [...newHistory]};
        });

        try {
            // await deleteAssignment(deletedRow.id);
            await rejectDisbursementRequest(deletedRow.id, rejectionReason);
            toast.success("Rejected successfully");
        } catch (error) {
            toast.error("Something wrong while trying to reject");
            setHistoryList(originalDta);
        }
    };

    const handleDpidChange = (ids) => {
        setDpids(ids);
    };

    const handleDetails = (row) => {
        setId(row.id);
        setDisburse(false);
        setReject(false);
        setOnDetails(true);
        toggle();
    };

    const handleAttachment = (row) => {
        try {
            if (typeof row.attachment !== "string") throw new Error("No file to download");
            FileSaver.saveAs(row.attachment, row.dh_acc_no);
        } catch (error) {
            toast.error(error.message);
        }
    }

    const handleOutletReport = async (row) => {
        var objParameter = {
            id: row.id
        };
        try {
            let getData = await getTransactionDisbursementDetails(objParameter);
            if (getData != 'No data found') {
                if (getData.list && getData.list.length > 0) {
                    let csvHeader = ['Outlet Code', 'Account Number', 'Owner Name', 'Phone', 'Outlet Name', 'Date', 'Credit Amount', 'Approved Limit', 'Total Due', 'Available Limit'];
                    let finalArray = [];
                    finalArray.push(csvHeader);
                    getData.list.forEach((value, index) => {
                        let rawArray = [];
                        rawArray.push(value.retailer_code);
                        rawArray.push(`'${value.acc_no}'`);
                        rawArray.push("\"" + value.owner + "\"");
                        rawArray.push(value.phone);
                        rawArray.push("\"" + value.name + "\"");
                        rawArray.push(value.sys_date);
                        rawArray.push(value.credit_amount);
                        rawArray.push(value.approved_limit);
                        rawArray.push(value.total_due);
                        rawArray.push(value.available_limit);
                        finalArray.push(rawArray);
                    });
                    let file_name = row.dh_acc_no + '.csv';
                    let csvContent = finalArray.join("\n");
                    let link = window.document.createElement("a");
                    link.setAttribute("href", "data:text/csv;charset=utf-8,%EF%BB%BF" + encodeURI(csvContent));
                    link.setAttribute("download", file_name);
                    link.click();
                }else{
                    toast.error("No data found.");
                }
            } else {
                toast.error("No data found.");
            }
        } catch (error) {
            toast.error("Something wrong while trying to download excel report.");
        }
    }

    const handleDisburse = (row) => {
        setOnDetails(false);
        setReject(false);
        setDisburse(true);

        toggle();
        setId(row.id);
        setDeletedRow(row);
        setActionId(row.id);
    }

    const requestDisburse = async () => {
        let formIsValid = true;
        const formData = new FormData();
        formData.append("id", actionId);
        formData.append("transaction_number", formValue.tnxNumber);
        formData.append("file", formValue.filename);
        formData.append("user_id", localStorage.getItem('id'));

        const currentData = {...historyList};
        const newHistory = historyList["rows"].filter(
            (item) => item.id !== deletedRow.id
        );
        newHistory.forEach((v, index) => { v.serial = index + 1; });
        setDisburse(false);
        toggle();
        setHistoryList((prevState) => {
            return {...prevState, ["rows"]: [...newHistory]};
        });
        try {
            await setCreditDisburse(formData);
            toast.success("Disburse successfully");
        } catch (error) {
            toast.error("Something wrong while trying to disburse");
            setHistoryList(currentData);
        }
    }

    const handleDh = (value) => {
        setDh(value.selectedHouse)
    }

    const formValueChange = (name, value) => {
        setFormValue(prevState => ({...prevState, [name]: value}));
    }

    const onHouseChange = (value) => {
        setDh(value)
    };

    const handleDateChange = (value) => {
        setDate(value);
    };

    const handleSearch = async () => {
        const data_v = {
            dh_id: dh,
            date: date
        };

        const searchedData = await getDisbursementHistoryList(data_v);
        if (searchedData.length > 0) {
            searchedData.forEach((v, index) => { v.serial = index + 1; });
            const rows = addButton(searchedData);
            setHistoryList((prevState) => {
                return {...prevState, ["rows"]: [...rows]};
            });
        } else {
            setHistoryList({
                columns: [...columns],
                rows: [],
            });
        }
    };

    async function getDisbursementList() {
        if (dh.length > 0) {
            try {
                let date = dateFormat(new Date(), "yyyy-mm-dd");
                const data_v = {
                    dh_id: dh,
                    date: date
                };
                const rowData = await getDisbursementHistoryList(data_v);
                if (Array.isArray(rowData)) {
                    rowData.forEach((v, index) => { v.serial = index + 1; });
                    const rows = addButton(rowData);
                    setHistoryList((prevState) => {
                        return {...prevState, ["rows"]: [...rows]};
                    });
                    setIsLoading(false);
                } else {
                    setHistoryList((prevState) => {
                        return {...prevState, ["rows"]: []};
                    });
                    setIsLoading(false);
                }
            } catch (error) {
                //  console.log("......... ", error);
            }
        }
    }

    useEffect(() => {
        const user = getCurrentUser();
        if (user?.data) setCurrentUser(user.data.id);
        getDisbursementList();
    }, [dh]);
    return (
        <div
            className="content d-flex flex-column flex-column-fluid"
            id="kt_content"
        >
            {/*  <ToastContainer /> */}
            {/*begin::Entry*/}
            <div className="d-flex flex-column-fluid">
                <div className="container">
                    {/*begin::Dashboard*/}
                    {/*begin::Row*/}
                    <div className="row">
                        <div className="col-lg-12 col-xxl-12">
                            {/*begin::List Widget 9*/}
                            <div className="card card-custom card-stretch gutter-b">
                                <div className="card-header border-0 ">
                                    <h3 className="card-title font-weight-bolder">
                                        Requested disbursement
                                    </h3>
                                </div>
                                {/* <DropdownMenuGroup 
                                    onValueChange={handleDh} 
                                    visible={false}
                                    onDateChange={handleChange}
                                    handleSearch={handleSearch}
                                /> */}

                                <DropdownMenuGroup 
                                    onHouseChange={onHouseChange} 
                                    onDateChange={handleDateChange}
                                    handleSearch={handleSearch}
                                />
                                <div className="card-body">
                                    {isLoading ? (
                                        <div>
                                            <div style={{textAlign: "center"}}>
                                                <Loader
                                                    type="Rings"
                                                    color="#00BFFF"
                                                    height={100}
                                                    width={100}
                                                />
                                            </div>
                                        </div>
                                    ) : (
                                        <Datatable data={historyList}/>
                                    )}

                                    {disburse && (
                                        <ModalForm
                                            modalTitle="Disbursement Confirmation"
                                            toggle={toggle}
                                            modal={modal}
                                            btnName="Confirm"
                                            handleClick={requestDisburse}
                                        >
                                            <div className="card-body">
                                                <form>
                                                    <div className="form-group">
                                                        <label>
                                                            <b>Transaction Number</b>
                                                        </label>
                                                        <input
                                                            type="text"
                                                            className="form-control"
                                                            placeholder="Enter Transaction Number"
                                                            onChange={(e) =>
                                                                formValueChange("tnxNumber", e.target.value)
                                                            }
                                                            value={formValue.tnxNumber}
                                                        />
                                                    </div>

                                                    <div className="form-group">
                                                        <label><b>File Attachment</b></label>
                                                        <input type="file" className="form-control"
                                                               
                                                               onChange={(e) => formValueChange('filename', e.target.files[0])}/>
                                                    </div>
                                                    {/*<input type="text" onChange={(e)=>formValueChange('id', e.target.value)} value={actionId}/>*/}
                                                </form>
                                            </div>

                                        </ModalForm>


                                    )}

                                    {reject && (
                                        <ConfirmationModal
                                            modalTitle="Rejection Confirmation"
                                            toggle={toggle}
                                            modal={modal}
                                            btnName="Confirm"
                                            handleClick={requestReject}
                                            type="reject"
                                            msg="Are you sure, you want to reject this request? "
                                        />
                                    )}
                                    {onDetails && (
                                        <Modal show={modal} 
                                            backdrop="static" 
                                            keyboard={false} 
                                            toggle={toggle}
                                            size="xl"
                                            centered>
                                            <Modal.Header>
                                                <Modal.Title> </Modal.Title>
                                                <Button className="close" variant="secondary" onClick={toggle}>
                                                    <i className="fa fa-times"></i>
                                                </Button>
                                            </Modal.Header>
                                            <Modal.Body>
                                                 <FiDisbursmentModal id={id}/>
                                            </Modal.Body>
                                        </Modal>
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

export default FiDisbursementHistory;
