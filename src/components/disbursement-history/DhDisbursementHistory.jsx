import React, {useEffect, useState, Fragment} from "react";
import Loader from "react-loader-spinner";
import Datatable from "./../common/datatable";
import {useAlert} from "react-alert";
import FileSaver from "file-saver";
import {
    dhDisbursementList,
    getDisbursementHistoryList,
    getSearchedDisbursementHistory,
    setDhIssue,
} from "../../services/disbursementHistroryService";
import {getCurrentUser, getDhId, getDhIdBasedOnFi, getUserId, getUserType} from "../../services/authService";
import {Link} from "react-router-dom";
import ConfirmationModal from "../common/confirmationModal";
import ModalForm from "../common/modalForm";
import dateFormat from "dateformat";
import DhDisbursementModal from "../disbursement-history/DhDisbursementModal";
import {getTransactionDisbursementDetails} from "../../services/disbursement";
import { useSelector } from "react-redux";

const initState = {
    amount: "",
    sys_date: "",
    status: "",
    attachment: "",
    date_to: dateFormat(new Date(), "yyyy-mm-dd"),
    date_from: dateFormat(new Date(), "yyyy-mm-dd")
};
var columns;
if (getUserType() == 'bat'){
    columns = [
        {
            label: "SL.",
            field: "serial"
        },
        {
            label: "House Name",
            field: "dh_name",
        },
        {
            label: "Acc. No.",
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
}else{
    columns = [
        {
            label: "SL.",
            field: "serial"
        },
        {
            label: "House Name",
            field: "dh_name",
        },
        {
            label: "Acc. No.",
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

        }
    ];
}


const init = {
    comment: "",
}

function DhDisbursementHistory(props) {
    const {selected_fi} = useSelector(state => state.fi);

    const [value, setValue] = useState(initState);

    const [isLoading, setIsLoading] = useState(true);
    const [dpids, setDpids] = useState([]);
    const [dhIds, setDhids] = useState([]);
    const toast = useAlert();
    const [currentUser, setCurrentUser] = useState("");

    const [historyList, setHistoryList] = useState({
        columns: [...columns],
        rows: [],
    });

    const [formValue, setFormValue] = useState(init);

    const [onDetails, setOnDetails] = useState(false);
    const [disburse, setDisburse] = useState(false);
    const [reject, setReject] = useState(false);
    const [actionId, setActionId] = useState("");
    const [id, setId] = useState("");
    const [deletedRow, setDeletedRow] = useState();

    const formValueChange = (name, value) => {
        setFormValue((prevState) => ({...prevState, [name]: value}));
    };

    const [modal, setModal] = useState(false);
    const toggle = () => setModal(!modal);

    const handleChange = (name, value) => {
        setValue((prevState) => {
            return {...prevState, [name]: value};
        });
    };

    const addButton = (rowData) => {
        const rows = rowData.map((row) => {
            row.details = (
                <Fragment>
                    <button
                        className="btn btn-sm btn-clean btn-info "
                        data-toggle="tooltip"
                        data-placement="bottom"
                        title="Outlet list"
                        onClick={() => handleDetails(row)}
                    >
                        <i className="la la-user"/>
                    </button>
                </Fragment>
            );

            row.attachments = (
                <Fragment>
                    <Link
                        className="btn btn-sm btn-primary"
                        data-toggle="tooltip"
                        data-placement="bottom"
                        title="Download transaction attachment"
                        onClick={() => handleAttachment(row)}
                    >
                         <i className="la la-download"></i>
                    </Link>{" "}

                    <Link
                        className="btn btn-sm btn-success"
                        data-toggle="tooltip"
                        data-placement="bottom"
                        title="Download outlet list as excel"
                        onClick={() => handleOutletReport(row)}
                    >
                         <i className="far fa-file-excel"></i>
                    </Link>

                </Fragment>
            );

            row.action = (row.status === 'Disbursed' && getUserType() == 'bat') && <Link
                className="btn btn-sm btn-danger"
                data-toggle="tooltip"
                data-placement="bottom"
                title="Raise Issue "
                onClick={() => handleDisburse(row)}
            >
                <i className="la la-question-circle"></i>
            </Link>
            return row;
        });
        return rows;
    };

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
                        rawArray.push("'"+value.acc_no+"'");
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
        setReject(false);
        setOnDetails(false)
        setDisburse(true);

        toggle();
        setActionId(row.id);
        setDeletedRow(row);
    };

    const requestDisburse = async () => {
        const currentData = {...historyList};
        const newHistory = historyList["rows"].filter(
            (item) => item.id !== deletedRow.id
        );
        setDisburse(false);
        toggle();
        newHistory.forEach((v, index) => { v.serial = index + 1; });
        setHistoryList((prevState) => {
            return {...prevState, ["rows"]: [...newHistory]};
        });
        try {
            await setDhIssue(actionId, getUserId(), formValue.comment);
            toast.success("Issue Raised successfully.");
        } catch (error) {
            toast.error("Something wrong while trying to issue raise.");
            setHistoryList(currentData);
        }
    }


    const handleDpidChange = (ids) => {
        setDpids(ids);
    };

    const handleDetails = (row) => {
        //alert(row.id);
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

    async function getDisbursementList(dh_id) {
        try {
            let date_from = dateFormat(new Date(), "yyyy-mm-dd");
            let date_to = dateFormat(new Date(), "yyyy-mm-dd");
            const data_v = {
                dh_id,
                dates: {date_from, date_to}
            };
            const rowData = await dhDisbursementList(data_v);
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
            console.log("......... ", error);
        }
    }

    const handleSearch = async () => {
        let date_from = dateFormat(new Date(), "yyyy-mm-dd");
        let date_to = dateFormat(new Date(), "yyyy-mm-dd");
        if (value.date_from) {
            date_from = dateFormat(value.date_from, "yyyy-mm-dd");
        } 
        if (value.date_to) {
            date_to = dateFormat(value.date_to, "yyyy-mm-dd");
        }
        const data_v = {
            dh_id: dhIds,
            dates: {date_from, date_to},
        };
        const searchedData = await dhDisbursementList(data_v);
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

    useEffect(async () => {
        const user = getCurrentUser();
        if (user?.data) setCurrentUser(user.data.id);
        if (selected_fi) {
            let dh_id = await getDhIdBasedOnFi(selected_fi);
            setDhids(dh_id);
            if (dh_id.length > 0) {
                getDisbursementList(dh_id);
            }
        }
    }, [selected_fi]);

    return (<div
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
                                <h3 className="card-title font-weight-bolder">Disbursement History</h3>
                            </div>

                            <div className="row">
                                <div className="col-12"/>
                                <div className="input-group py-5 col-8">
                                    <span className="input-group-text ml-10">Date From</span>
                                    <input
                                        type="date"
                                        className="form-control  form-control-md form-control-solid "
                                        /*value={value.date}*/
                                        value={dateFormat(value.date_from, "yyyy-mm-dd")}
                                        /*placeholder={dateFormat(new Date(), "yyyy-mm-dd")}*/
                                        onChange={(e) => handleChange("date_from", e.target.value)}
                                    />
                                    <span className="input-group-text ml-10">Date To</span>
                                    <input
                                        type="date"
                                        className="form-control  form-control-md form-control-solid "
                                        /*value={value.date}*/
                                        value={dateFormat(value.date_to, "yyyy-mm-dd")}
                                        /*placeholder={dateFormat(new Date(), "yyyy-mm-dd")}*/
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
                                        modalTitle="Raised Issue confirmation ?"
                                        toggle={toggle}
                                        modal={modal}
                                        btnName="Confirm"
                                        handleClick={requestDisburse}
                                    >
                                        <div className="card-body">
                                            <form>
                                                <div className="form-group">
                                                    <label><b>Comment</b></label>
                                                    <textarea className="form-control"
                                                              placeholder="Enter Comment" rows="4"
                                                              onChange={(e) => formValueChange('comment', e.target.value)}
                                                              value={formValue.comment}/>
                                                </div>
                                            </form>
                                        </div>
                                    </ModalForm>
                                )}

                                {onDetails && (
                                    <ModalForm
                                        modal={modal}
                                        toggle={toggle}
                                        size="xl"
                                        btnName="Ok"
                                        handleClick={toggle}
                                    >
                                        <DhDisbursementModal id={id}/>
                                    </ModalForm>
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
    </div>)

}

export default DhDisbursementHistory;
