import React, { useEffect, useState, Fragment } from "react";
import Loader from "react-loader-spinner";
import Datatable from "./../common/datatable";
import { useAlert } from "react-alert";
import FileSaver from "file-saver";
import {
    getIssueList, issueDisburse
} from "../../services/issueServices";
import {getCurrentUser, getDhId, getDhIdBasedOnFi, getUserType} from "../../services/authService";
import {Link} from "react-router-dom";
import ConfirmationModal from "../common/confirmationModal";
import {baseURL} from "../../constants/constants";
import {downLoadNidOutlet} from "../../services/kyc-list-service";
import DhDisbursementModal from "../disbursement-history/DhDisbursementModal";
import ModalForm from "../common/modalForm";
import 'react-tippy/dist/tippy.css';
import {
  Tooltip,
} from 'react-tippy';
import { useSelector } from "react-redux";

const initState = {
    amount: "",
    sys_date: "",
    status: "",
    attachment: ""
};
const columns = [
    {
        label: "SL.",
        field: "serial",
    },
    {
        label: "DH Name",
        field: "dh_name",
    },
    {
        label: "Account Number",
        field: 'dh_acc_no'

    },
    {
        label: "Amount",
        field: 'amount'

    },
    {
        label: "Date",
        field: 'sys_date'

    },
    {
        label: "Comment",
        field: 'issue_comments'

    },
    {
        label: "Download",
        field: 'attachments'

    },
    {
        label: "Action",
        field: 'action'
    }
];

const init = {
    comment: "",
}

function RaisedIssue(props) {
    const {selected_fi} = useSelector(state => state.fi);

    const [value, setValue] = useState(initState);

    const [isLoading, setIsLoading] = useState(true);
    const [dpids, setDpids] = useState(localStorage.getItem("dpids").split(","));
    const toast = useAlert();
    const [currentUser, setCurrentUser] = useState("");
    const [issueList, setIssueList] = useState({
        columns: [...columns],
        rows: [],
    });
    const [formValue,setFormValue] = useState(init);

    const [modal, setModal] = useState(false);
    const [resolve, setResolve] = useState(false);
    const [actionId, setId] = useState("");
    const [deletedRow,setDeletedRow] = useState();

    const formValueChange = (name, value) =>{
        setFormValue(prevState => ({...prevState,[name]:value}));
    }

    const toggle = () => setModal(!modal);
    const handleChange = (name, value) => {
        setValue((prevState) => {
            return { ...prevState, [name]: value };
        });
    };
    const [onDetails, setOnDetails] = useState(false);
    // const [modal, setModal] = useState(false);
    // const toggle = () => setModal(!modal);
    // const [id, setId] = useState("");
    const handleDetails = (row) => {
        setId(row.id);
        setOnDetails(true);
        toggle();
    };

    const addButton = (rowData) => {
        const rows = rowData.map((row) => {
            row.issue_comments = (
                <Tooltip
                    title={row.issue_comments}
                    position="top"
                    trigger="mouseenter"
                    interactive={true}
                    arrow={true}
                    >
                    
                        {(row.issue_comments && row.issue_comments.length > 30) ? row.issue_comments.substring(0,30) + '...' : row.issue_comments}
                    
                </Tooltip>
            );
            row.attachments = (
                <Fragment>
                    <Link
                        className="btn btn-sm btn-primary"
                        data-toggle="tooltip"
                        data-placement="bottom"
                        title="Preview"
                        onClick={() => handleDownload(row)}
                    >

                         Download <i className="la la-download"></i>
                    </Link>

                </Fragment>
            );

            row.action = (
                <Fragment>
                   {getUserType() == 'bat' && 
                    (<Link
                        className="btn btn-sm btn-success"
                        data-toggle="tooltip"
                        data-placement="bottom"
                        title="Issue Resolve"
                        onClick={() => handleReject(row)}
                    >
                        Issue Resolve <i className="la la-check-circle-o"></i>
                    </Link>)}{" "}
                    <Link
                        className="btn btn-sm btn-info"
                        data-toggle="tooltip"
                        data-placement="bottom"
                        title="Outlet List"
                        onClick={() => handleDetails(row)}
                    >
                        <i className="la la-user"></i>
                    </Link>
                </Fragment>
            );
            return row;
        });
        return rows;
    };

    const handleDownload = (row) =>{
        try {
            if (typeof row.attachment !== "string") throw new Error("No file to download");
            FileSaver.saveAs(row.attachment, row.dh_acc_no);
        } catch (error) {
            toast.error(error.message);
        }
    };

    const handleIssueResolve = (row)=>  {
        setResolve(true);
        setId(row.id);
        setDeletedRow(row);
        toggle();
    }

    const handleReject = (row) => {
        setResolve(true);
        setDeletedRow(row);
        toggle();
    };

    const resolveIssue = async () => {

        const originalData = { ...issueList };
        const newList = issueList["rows"].filter(
            (item) => item.id !== deletedRow.id
        );
        setResolve(true);
        toggle();
        setIssueList((prevState) => {
            return { ...prevState, ["rows"]: [...newList] };
        });

        try {
            // await deleteAssignment(deletedRow.id);
            await issueDisburse(deletedRow.id);
            toast.success("Issue Resolved successfully");
        } catch (error) {
            toast.error("Something wrong while trying to resolve");
            setIssueList(originalData);
        }
    };

    async function getRaisedIssueList(dh_id) {
        try {
            const queryObj = {dh_id};
            const rowData = await getIssueList(queryObj);

            if (Array.isArray(rowData)) {
                rowData.forEach((v, index) => { v.serial = index + 1; });
                const rows = addButton(rowData);
                setIssueList((prevState) => {
                    return { ...prevState, ["rows"]: [...rows] };
                });
                setIsLoading(false);
            }else{
                setIssueList((prevState) => {
                    return { ...prevState, ["rows"]: [] };
                });
                setIsLoading(false);
            }
        } catch (error) {
            console.log("......... ", error);
        }
    }

    useEffect(async () => {
        const user = getCurrentUser();
        if (user?.data) setCurrentUser(user.data.id);
        if (selected_fi) {
            let dh_id = await getDhIdBasedOnFi(selected_fi);
            if (dh_id.length > 0) {
                getRaisedIssueList(dh_id);
            }
        }
    }, [selected_fi]);
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
                                    <h3 className="card-title font-weight-bolder">Raised Issue List</h3>
                                </div>



                                <div className="card-body">
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
                                        <Datatable  data={issueList} />
                                    )}


                                    {resolve && (
                                        <ConfirmationModal
                                            modalTitle="Issue Resolve confirmation ?"
                                            toggle={toggle}
                                            modal={modal}
                                            btnName="Confirm"
                                            handleClick={resolveIssue}
                                            msg="Are you sure, you want to resolve this issue? "
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
            {/*end::Entry*/}
            {onDetails && (
                <ModalForm
                    modal={modal}
                    toggle={toggle}
                    size="xl"
                    btnName="Close"
                    handleClick={toggle}
                    noCancelBtn={true}
                >
                    <DhDisbursementModal id={actionId}/>
                </ModalForm>
            )}
        </div>
    );
}

export default RaisedIssue;
