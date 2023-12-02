import React, { Fragment, useEffect, useState, useMemo } from "react";
import DataTable from 'react-data-table-component';
import { Card, Table } from 'react-bootstrap';
import axios from 'axios';
import { baseURL } from "../../constants/constants";
import Loader from "react-loader-spinner";
import DropdownMenuGroup from "../helper/top_dropdown_with_date_without_points_for_report";
import 'react-confirm-alert/src/react-confirm-alert.css';
import {useHistory} from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import styles from './billClaim.module.css';

const DATA_TABLE_URL = baseURL + 'get_dh_billing_info';
const DATA_TABLE_DOWNLOAD_URL = baseURL + 'download_dh_billing_history';

const SUBMITTED_TABLE_URL = baseURL + 'submitted_dh_billing_info';

function BillHistory(props) {
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
    const [dpids, setDpids] = useState([]);

    const updateFromDate = (date) => {
        setFromDate(date);
    };

    const updateToDate = (date) => {
        setToDate(date);
    };

    const getReportData = async () => {
        // if(initialCall) {
        //     setInitialCall(false);
        // } else {
            if(dpids.length > 0) {
                setIsLoading(true);
                await axios.post(SUBMITTED_TABLE_URL, 
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
        // }
    };

    const handleDpidChange = (ids, fromDate, toDate) => {
        setDpids(ids);
        setFromDate(fromDate);
        setToDate(toDate);
    };  

    const searchClick = () => {
        getReportData();
    }

    const onDownload = async (data) => {
        var token = localStorage.getItem("token");
        setIsLoading(true);
        await axios
        .post(
            DATA_TABLE_DOWNLOAD_URL,
            {dpids, created_by, billing_id: data.billing_id},
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
                    <h3 className="card-title">Billing History</h3>
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
                                                <th>Invoice ID</th>
                                                <th>DH Name</th>
                                                <th>Date From</th>
                                                <th>Date To</th>
                                                <th>FI Name</th>
                                                <th>Payment to FI</th>
                                                <th>Service Charge Payment</th>
                                                <th>DH Service Charge</th>
                                                <th>Bill Submit Date</th>
                                                <th>Download Report</th>
                                            </tr>
                                        </thead>

                                        <tbody>
                                            {data.map((data) => {
                                                return (
                                                    <tr>
                                                        <td className={styles.valueText}>{data?.invoice_no}</td>
                                                        <td className={styles.valueText}>{data?.dh_name}</td>
                                                        <td className={styles.valueText}>{data?.from_date}</td>
                                                        <td className={styles.valueText}>{data?.to_date}</td>
                                                        <td className={styles.valueText}>{data?.fi_name}</td>
                                                        <td className={styles.valueText}>{formatNumber(data?.total_payment_to_fi)}</td>
                                                        <td className={styles.valueText}>{formatNumber(data?.total_service_charge_amount)}</td>
                                                        <td className={styles.valueText}>{formatNumber(data?.dh_service_charge)}</td>
                                                        <td className={styles.valueText}>{data?.bill_submit_date}</td>
                                                        <td className={styles.valueText}>
                                                            <FontAwesomeIcon
                                                                icon="file-download"
                                                                size="2x"
                                                                className={`${styles.downloadBtn}`}
                                                                onClick={() => onDownload(data)}
                                                            />
                                                        </td>
                                                    </tr>
                                                )
                                            })}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        }
                    </div>
                }
            </Card.Body>
        </Card>
    )
}
export default BillHistory;
