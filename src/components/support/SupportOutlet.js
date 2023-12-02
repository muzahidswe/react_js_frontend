import React, { Fragment, useEffect, useState, useMemo } from "react";
import { Card, Modal, Button } from 'react-bootstrap';
import axios from 'axios';
import { baseURL } from "../../constants/constants";
import Loader from "react-loader-spinner";
import 'react-confirm-alert/src/react-confirm-alert.css';
import {useHistory} from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import styles from './supportOutlet.module.css';
import ModalForm from "../common/modalForm";
import Datatable from "./../common/datatable";
import { useFormik } from "formik";
import * as Yup from "yup";
import EditSupportModal from './EditSupportModal';
import swal from 'sweetalert2';

const SUPPORT_OUTLET_LIST = baseURL + 'support-outlet-list';
const DELETE_OUTLET_DISBURSEMENT = baseURL + 'delete-outlet-disbursement';
const DELETE_OUTLET_PAYMENT = baseURL + 'delete-outlet-payment';

const columns = [
    {
        label: "Sr.",
        field: "serial",
    },
    {
        label: "Outlet Code",
        field: "outlet_code",
    },
    {
        label: "Outlet Name",
        field: "outlet_name",
    },
    {
        label: "Phone",
        field: "phone",
    },
    {
        label: "Credit Amount",
        field: "credit_amount",
    },
	{
        label: 'Minimum Due',
        field: 'minimum_due'
    },
    {
        label: 'Total Due',
        field: 'total_due'
    },
    {
        label: "KYC Status",
        field: "kyc_status",
    },
	{
        label: "Status",
        field: "status",
    },
    {
        label: "Actions",
        field: "actions",
    },
];

function SupportOutlet(props) {
    const history = useHistory();

    const [outletCode, setOutletCode] = useState();
    const [outletName, setOutletName] = useState();
    const [phone, setPhone] = useState();
    const [minimumDue, setMinimumDue] = useState(0);
    const [totalDue, setTotalDue] = useState(0);
    const [kyc_status, setKycStatus] = useState();
    const [status, setStatus] = useState();
    const [id, setId] = useState(0);

    const [created_by] = useState(localStorage.getItem('id'));
    const [isLoading, setIsLoading] = useState(false);
    const [showTable, setShowTable] = useState(false);
    const [dpids, setDpids] = useState(localStorage.getItem("dpids").split(","));

    const [tableData, setTableData] = useState({
        columns: [...columns],
        rows: [],
    });

    const [show, setShow] = useState(false);

    const getOutletList = async () => {
			setIsLoading(true);
            try {
                const rowData = await axios.get(SUPPORT_OUTLET_LIST);
                const rows = addButton(rowData.data.data);
                setTableData((prevState) => ({ ...prevState, ["rows"]: [...rows] }));
            } catch (e) {
                console.log("......... ", e);
            }
			setIsLoading(false);
    };

    const onDelete = async (URL, data, title) => {
        swal.fire({
            title: 'Are you sure?',
            text: 'Do you want to Delete ' + title,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, delete!',
            cancelButtonText: 'No'
        }).then(async (result) => {
            if (result.value) {
                var token = localStorage.getItem("token");
                setIsLoading(true);
                await axios.post(URL,{id_outlet: data.id_outlet},
                    {
                    headers: {
                        Accept: "application/json",
                        "Content-Type": "application/json",
                        Authorization: "Bearer " + token,
                    },
                    }
                )
                .then((res) => {
                    setIsLoading(false);

                    swal.fire({
                        title: "Response",
                        text: res.data.message
                    })
                })
                .catch((err) => {
                    setIsLoading(false);
                });
            } else if (result.dismiss === swal.DismissReason.cancel) {
                swal.fire({
                    title: "Cancelled",
                    text: title + " is not deleted",
                    icon: 'error'
                })
            }
        })
    }

    const formatNumber = (number) => {
        return parseFloat(number)?.toLocaleString('en-US');
    }

    const addButton = (rowData) => {
        const rows = rowData.map((row, index) => {
            row.actions = (
                <Fragment>
                    <span className={styles.actionButtonWrapper}>
                        <button
                            className="btn btn-sm btn-info"
                            color='primary'
                            onClick={() => onUpdate(DELETE_OUTLET_DISBURSEMENT,row)}
                        >
                            <i className="fa fa-edit"></i>
                        </button>
                    </span>

                    <span className={styles.actionButtonWrapper}>
                        <button
                            className="btn btn-sm btn-danger"
                            title="Delete Outlet Disbursement"
                            onClick={() => onDelete(DELETE_OUTLET_DISBURSEMENT,row, 'Outlet Disbursement')}
                        >
                            <i className="fa fa-trash" />
                        </button>
                    </span>

                    <span className={styles.actionButtonWrapper}>
                        <button
                            className="btn btn-sm btn-danger"
                            title="Delete Outlet Payment"
                            onClick={() => onDelete(DELETE_OUTLET_PAYMENT,row, 'Outlet Payment')}
                        >
                            <i className="fa fa-trash" />
                        </button>
                    </span>
                </Fragment>
            );

            row.serial = (index + 1)+' .';
            return row;
        });
        return rows;
    };

    const onUpdate = async (URL, data) => {
        setOutletCode(data.outlet_code);
        setOutletName(data.outlet_name);
        setPhone(data.phone);
        setMinimumDue(data.minimum_due);
        setTotalDue(data.total_due);
        setKycStatus(data.kyc_status);
        setStatus(data.status);
        setId(data.id_outlet);
        setShow(true);
    }

    const handleClose = () => {
        setShow(false);
        getOutletList();
    };

    useEffect(() => {
        getOutletList();
    }, [dpids]);

    return (
        <div>
            <Card className="m-5">
                <Card.Header>
                    <div className="row">
                        <h3 className="card-title">Support Outlet List</h3>
                    </div>
                </Card.Header>

                <Card.Body>
                    {isLoading ? 
                        <div>
                            <div style={{ textAlign: "center" }}>
                                <Loader type="Rings" color="#00BFFF" height={100} width={100} />
                            </div>
                        </div>
                        : 
                        <div>
                            <Datatable data={tableData} topSearch={true} rowsToShow={25} />
                        </div>
                    }
                </Card.Body>
            </Card>

            <Modal show={show} 
                onHide={handleClose} 
                backdrop="static" 
                keyboard={false} 
                size="lg"
                centered>
                <Modal.Header>
                    <Modal.Title>Edit Support Outlet Details</Modal.Title>
                    <Button className="close" variant="secondary" onClick={handleClose}>
                        <i className="fa fa-times"></i>
                    </Button>
                </Modal.Header>
                <Modal.Body>
                    <EditSupportModal
                        handleClose = {handleClose}
                        outletCode={outletCode}
                        outletName={outletName}
                        phone={phone}
                        minimumDue={minimumDue}
                        totalDue={totalDue}
                        kyc_status={kyc_status}
                        status={status}
                        id={id}
                    />
                </Modal.Body>
            </Modal>
        </div>
    )
}
export default SupportOutlet;
