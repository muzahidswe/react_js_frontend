import React, { Fragment, useEffect, useState, useMemo } from "react";
import { Card } from 'react-bootstrap';
import axios from 'axios';
import { baseURL } from "../../constants/constants";
import Loader from "react-loader-spinner";
import DropdownMenuGroup from "../helper/top_dropdown_with_phase";
import 'react-confirm-alert/src/react-confirm-alert.css';

const REPORT_DOWNLOAD_URL = baseURL + 'download_customer_report';

function CustomerReport(props) {
    const [isLoading, setIsLoading] = useState(true);
    const [dpids, setDpids] = useState();
    const [phases, setPhases] = useState([]);
    const currentMonth = (new Date().getMonth() + 1).toString().padStart(2, '0');
    const [tillDate, setTillDate] = useState(`${new Date().getFullYear()}-${currentMonth}-01`);

    const downloadDatas = async () => {
        var token = localStorage.getItem("token");
        setIsLoading(true);
        await axios
        .post(
            REPORT_DOWNLOAD_URL,
            {dpids, till_date: tillDate},
            {
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                Authorization: "Bearer " + token,
            },
            }
        )
        .then((res) => {
            // window.open(res.data.data, '_blank', 'noopener,noreferrer')
            let link = window.document.createElement("a");
            link.setAttribute("href", `${res?.data?.data}`);
            link.setAttribute("target", '_blank');
            link.setAttribute("download", 'customer_report');
            link.click();
            setIsLoading(false);
        })
        .catch((err) => {
            setIsLoading(false);
        });
    }

    const handleDpidChange = (ids) => {
        setDpids(ids);
    };
    
    const handlePhaseChange = (ids) => {
        setPhases(ids);
    };

    return (
        <Card className="m-5">
            <Card.Header>
                <div className="row">
                    <h3 className="card-title">Customer Report</h3>
                </div>
                
            </Card.Header>

            <Card.Body>
                <DropdownMenuGroup onDpidChange={handleDpidChange} onPhaseChange={handlePhaseChange} isSearch={false} />
                <div 
                    style={{
                        marginTop: '1rem',
                        textAlign: 'end'
                    }}
                >
                    <div className="row">
                        <div className="input-group col-md-3">
                            <span className="input-group-text">Till Date</span>
                            <input
                                type="date"
                                className="form-control  form-control-md form-control-solid"
                                defaultValue={tillDate}
                                onChange={(event) => {setTillDate(event.target.value)}}
                            />
                        </div>

                        <div className="col-md-9">
                            <button className="btn btn-success" onClick={downloadDatas}>Download Report</button>
                        </div>
                    </div>
                </div>
                
            </Card.Body>
        </Card>
    )
}
export default CustomerReport;
