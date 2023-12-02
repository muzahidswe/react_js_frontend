import React, {useEffect, useState, Fragment} from "react";
import Loader from "react-loader-spinner";
import Datatable from "./../common/datatable";
import {useAlert} from "react-alert";
import {
    getDisbursementHistoryList,
    requestedCollectionsByDh,
    rejectDisbursementRequest, setCreditDisburse
} from "../../services/disbursementHistroryService";

import {
    getCollectionSettlementDetailsForFi
} from "../../services/settlement";
import {
  getCollectionSettlementRequest,
  postCollectionSettlementConfirm,
} from "../../services/settlement";
import CollectionSettlementDetailsModal from "./CollectionSettlementDetailsModal";
import { getCollectionSettlementDetails } from "../../services/settlement";
import exportToExcel from "../exportToExcel";


import {getTransactionDisbursementDetails} from "../../services/disbursement";

import {getCurrentUser, getDhId} from "../../services/authService";
import {Link} from "react-router-dom";
// import DropdownMenuGroup from "../common/TopDropdownTwo";
import DropdownMenuGroup from "../helper/top_dropdown_without_territory_point";
import ConfirmationModal from "../common/confirmationModal";
import FiDisbursmentModal from "../disbursement-history/FiDisbursmentModal";

import FileSaver from "file-saver";

import dateFormat from "dateformat";
import Details from "../disbursement/Details";
import ModalForm from "../common/modalForm";
import {baseURL} from "../../constants/constants";
import {getLocationsForDropDownTwo} from "../../services/helperService";

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
    {
        label: "Date",
        field: "sys_date",
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
    const [onConfirm, setOnConfirm] = useState(false);
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

    /* start */
    const [formValue, setFormValue] = useState(init);
    const [modal, setModal] = useState(false);
    const [disburse, setDisburse] = useState(false);
    const [reject, setReject] = useState(false);
    const [actionId, setActionId] = useState("");
    const [deletedRow, setDeletedRow] = useState();
    const [mapping, setMapping] = useState("");
    /* end */

    const toggle = () => setModal(!modal);
    const handleChange = (name, value) => {
        setValue((prevState) => {
            return {...prevState, [name]: value};
        });
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
            exportToExcel(newList);
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
        toggle();
    }
    function handleConfirm(row) {
        setId(row.id);
        setOnDetails(false);
        setOnConfirm(true);
        toggle();
    }

    const addButton = (rowData) => {
        const rows = rowData.map((row) => {
            row.action = (
                <Fragment>
                   <button
                        className="btn btn-sm btn-clean btn-primary"
                        onClick={() => handleDownloadAttachment(row)}
                        data-toggle="tooltip"
                        data-placement="bottom"
                        title="Download Transaction File"
                    >
                        <i className=" flaticon-download" />
                    </button>{" "}
                    <button
                        className="btn btn-sm btn-clean btn-success"
                        style={{ backgroundColor: "green" }}
                        onClick={() => handleDownloadExcel(row)}
                        data-toggle="tooltip"
                        data-placement="bottom"
                        title="Download excel"
                    >
                        <i className="la la-file-excel" />
                    </button>{" "}
                    <button
                        className="btn btn-sm btn-clean btn-info"
                        onClick={() => handleDetails(row)}
                        data-toggle="tooltip"
                        data-placement="bottom"
                        title="Outlets"
                    >
                        <i className="la la-user" />
                    </button>{" "}
                    {(row.status == 'Requested') &&
                    (<><button
                        className="btn btn-sm btn-clean btn-success"
                        onClick={() => handleConfirm(row)}
                        data-toggle="tooltip"
                        data-placement="bottom"
                        title="Confirm"
                        >
                        <i className="fas fa-check"></i>
                    </button>{" "}
                    <button
                        className="btn btn-sm btn-clean btn-danger"
                        onClick={() => handleReject(row)}
                        data-toggle="tooltip"
                        data-placement="bottom"
                        title="Reject"
                        >
                        <i className="fas fa-times btn-danger"></i>
                    </button></>)
                    }

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
            await rejectDisbursementRequest(deletedRow.id);
            toast.success("Rejected successfully");
            getDisbursementList();
        } catch (error) {
            toast.error("Something wrong while trying to reject");
            setHistoryList(originalDta);
        }
    };

    const handleConfirmation = async () => {
        try {
            const status = await postCollectionSettlementConfirm(id);
            //alert(status);
            toast.success(status);
            toggle();
            getDisbursementList();
        } catch (error) {
            toast.error(error.message);
        }
    };

    const handleDisburse = (row) => {
        setOnDetails(false);
        setReject(false);
        setDisburse(true);

        toggle();
        setId(row.id);
        setDeletedRow(row);
    }

    const requestDisburse = async () => {

        let formIsValid = true;
        const formData = new FormData();
        formData.append("id", actionId);
        formData.append("transaction_number", formValue.tnxNumber);
        formData.append("file", formValue.filename);

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

    async function getHouseWiseMapping() {
        try {
            if (dh.length > 0) {
                let date = dateFormat(new Date(), "yyyy-mm-dd");
                const objectC = await getCollectionSettlementRequest({dh_id: dh, date})
            }
        } catch (error) {
            console.log('error', error);
        }
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
        const searchedData = await requestedCollectionsByDh(data_v);
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
        try {
            if (dh.length > 0) {
                setIsLoading(true);
                let date = dateFormat(new Date(), "yyyy-mm-dd");
                const data_v = {
                    dh_id: dh,
                    date: date
                };
                const searchedData = await requestedCollectionsByDh(data_v);
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
                setIsLoading(false);
            }
        } catch (error) {
            //  console.log("......... ", error);
        }
    }

    useEffect(() => {
        const user = getCurrentUser();
        if (user?.data) setCurrentUser(user.data.id);
        getDisbursementList();
        // getHouseWiseMapping();
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
                                       Settlement Requests
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
                                            modalTitle="Raised Issue Resolve confirmation ?"
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
                                                        <span>Error</span>
                                                    </div>

                                                    <div className="form-group">
                                                        <label><b>File Attachment</b></label>
                                                        <input type="file" className="form-control"
                                                               required
                                                               onChange={(e) => formValueChange('filename', e.target.files[0])}/>
                                                    </div>
                                                    {/*<input type="text" onChange={(e)=>formValueChange('id', e.target.value)} value={actionId}/>*/}
                                                </form>
                                            </div>

                                        </ModalForm>


                                    )}

                                    {reject && (
                                        <ConfirmationModal
                                            modalTitle="Raised Issue Resolve confirmation ?"
                                            toggle={toggle}
                                            modal={modal}
                                            btnName="Confirm"
                                            handleClick={requestReject}
                                            msg="Are you sure, you want to reject this request? "
                                        />
                                    )}

                                </div>
                            </div>

                            {/*end: List Widget 9*/}
                        </div>
                    </div>
                </div>
                {/*end::Container*/}
            </div>
            {onDetails && (
                <ModalForm
                modal={modal}
                noCancelBtn={true}
                toggle={toggle}
                size="xl"
                btnName="Close"
                handleClick={toggle}
                >
                <CollectionSettlementDetailsModal id={id} />
                </ModalForm>
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
            {/*end::Entry*/}
        </div>
    );
}

export default FiDisbursementHistory;
