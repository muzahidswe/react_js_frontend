import React, { Fragment, useEffect, useState, useMemo } from "react";
import DataTable from 'react-data-table-component';
import { Card, Table } from 'react-bootstrap';
import axios from 'axios';
import { baseURL } from "../../constants/constants";
import Loader from "react-loader-spinner";
import DropdownMenuGroup from "../helper/top_dropdown_bill";
import 'react-confirm-alert/src/react-confirm-alert.css';
import {useHistory} from 'react-router-dom';
import swal from 'sweetalert2';
import styles from './billClaim.module.css';

const DATA_TABLE_URL = baseURL + 'get_dh_billing_info';
const DATA_TABLE_DOWNLOAD_URL = baseURL + 'download_dh_billing_info';

const SUBMIT_TABLE_URL = baseURL + 'submit_dh_billing_info';

function BillClaim(props) {
    const history = useHistory();
    const formatDate = (date) => {
        var d = new Date();
        if (date) {
            d = new Date(date);
        }        
        var month = '' + (d.getMonth() + 1),
            day = '' + d.getDate(),
            year = d.getFullYear();

        if (month.length < 2) 
            month = '0' + month;
        if (day.length < 2) 
            day = '0' + day;

        return [year, month, day].join('-');
    }
    const [from_date, setFromDate] = useState(`${new Date().getFullYear()}-01-01`);
    const [to_date, setToDate] = useState(`${new Date().getFullYear()}-12-31`);
    const [created_by] = useState(localStorage.getItem('id'));
    const [data, setData] = useState([]);
    const [initialCall, setInitialCall] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const [showTable, setShowTable] = useState(false);
    const [dpids, setDpids] = useState(localStorage.getItem("dpids").split(","));

    const updateFromDate = (date) => {
        setFromDate(date);
    };

    const updateToDate = (date) => {
        setToDate(date);
    };

    const getReportData = async () => {
        if(initialCall) {
            setInitialCall(false);
        } else {
            if(dpids.length) {
                setIsLoading(true);
                await axios.post(DATA_TABLE_URL, 
                    {dpids, from_date, to_date, created_by}
                )
                .then(res => {
                    setData(res.data.data);
                    res.data.success ? setShowTable(true) : setShowTable(false);
                }).catch(err => {
                    setData({});
                });
                setIsLoading(false);
            } else {
                setShowTable(false);
                setIsLoading(true);
            }
        }
    };

    const downloadDatas = async () => {
        var token = localStorage.getItem("token");
        setIsLoading(true);
        await axios
        .post(
            DATA_TABLE_DOWNLOAD_URL,
            {dpids, from_date, to_date, created_by},
            {
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                Authorization: "Bearer " + token,
            },
            }
        )
        .then((res) => {
            downloadPDF(res.data.data.blod_data, res.data.data.file_name);
            setIsLoading(false);
        })
        .catch((err) => {
            setIsLoading(false);
        });
    }

    const downloadPDF = (blob, name) => {
        const linkSource = `data:application/pdf;base64,${blob}`;
        const downloadLink = document.createElement("a");
        const fileName = name;
        downloadLink.href = linkSource;
        downloadLink.download = fileName;
        downloadLink.click();
    }

    const handleDpidChange = (ids, fromDate, toDate) => {
        setDpids(ids);
        setFromDate(fromDate);
        setToDate(toDate);
    };  

    const searchClick = () => {
        getReportData();
    }

    const onSubmit = async () => {
        swal.fire({
            title: 'Are you sure?',
            text: 'The report will be submitted',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, submit!',
            cancelButtonText: 'No'
            }).then(async (result) => {
                if (result.value) {
                    if(dpids.length) {
                        setIsLoading(true);
                        await axios.post(SUBMIT_TABLE_URL, 
                            {dpids, from_date, to_date, created_by}
                        )
                        .then(res => {
                            setData(res.data.data);
                            setShowTable(false);

                            if(res.data.success) {
                                swal.fire({
                                    title: "Success",
                                    text: res.data.message,
                                    icon: 'success'
                                })
                            } else {
                                swal.fire({
                                    title: "Error",
                                    text: res.data.message,
                                    icon: 'error'
                                })
                            }
                            
                        }).catch(err => {
                            setData({});
                        });
                        setIsLoading(false);
                    }
                } else if (result.dismiss === swal.DismissReason.cancel) {
                    swal.fire({
                        title: "Cancelled",
                        text: "Report is not submitted",
                        icon: 'error'
                    })
                }
            })
    }

    const onDownload = () => {
        window.open(`${baseURL}download_dh_billing_info`, '_blank');
    }

    const formatNumber = (number) => {
        return parseFloat(number)?.toLocaleString('en-US');
    }

    useEffect(() => {
        getReportData();
    }, [dpids]);

    return (
        <Card className="m-5">
            <Card.Header>
                <div className="row">
                    <h3 className="card-title">Bill Claim</h3>
                </div>
            </Card.Header>

            <Card.Body>
                <DropdownMenuGroup onSearch={handleDpidChange} isSearch={false} updateFromDate={updateFromDate} updateToDate={updateToDate} />

                {isLoading ? 
                    <div>
                        <div style={{ textAlign: "center" }}>
                            <Loader type="Rings" color="#00BFFF" height={100} width={100} />
                        </div>
                    </div>
                    : 
                    <div>
                        {showTable &&
                            <div className={styles.generatedContent}>
                                <div className={`${styles.tableWrapper} table-responsive`}>
                                    <table className="table table-bordered">
                                        <thead>
                                            <tr>
                                                <th>DH Name</th>
                                                <th>From</th>
                                                <th>To</th>
                                                <th>Total Payment to {data?.fi_name}</th>
                                                <th>Total Service Charge Payment</th>
                                                <th>DH Service Charge</th>
                                            </tr>
                                        </thead>

                                        <tbody>
                                            <tr>
                                                <td className={styles.valueText}>{data?.dh_name}</td>
                                                <td className={styles.valueText}>{data?.from_date}</td>
                                                <td className={styles.valueText}>{data?.to_date}</td>
                                                <td className={styles.valueText}>{formatNumber(data?.total_payment_to_fi)}</td>
                                                <td className={styles.valueText}>{formatNumber(data?.total_service_charge)}</td>
                                                <td className={styles.valueText}>{formatNumber(data?.dh_service_charge)}</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>

                                <div className={styles.buttonWrapper}>
                                    <button className={styles.button} onClick={onSubmit}>Submit Report</button>

                                    <button className={styles.button} onClick={downloadDatas}>Download Report</button>
                                </div>
                            </div>
                        }
                    </div>    
                }
            </Card.Body>
        </Card>
    )
}
export default BillClaim;
