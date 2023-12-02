import React, { Fragment, useEffect, useState } from "react";
import { Card } from 'react-bootstrap';
import axios from 'axios';
import { baseURL } from "../../constants/constants";
import Loader from "react-loader-spinner";
import 'react-confirm-alert/src/react-confirm-alert.css';
import Datatable from "./../common/datatable";
import { Tooltip } from 'react-tippy';

const OTP_LIST = baseURL + 'otp-check-log';

const columns = [
    {
        label: "Sr.",
        field: "serial",
    },
	{
        label: "Point Name",
        field: "dp_name",
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
        field: "mobile_no",
    },
    {
        label: "OTP",
        field: "otp",
    },
    {
        label: "Request Time",
        field: "request_time",
    },
    {
        label: "Send Time",
        field: "send_time",
    },
    {
        label: "Task",
        field: "task",
    },
    {
        label: "User ID",
        field: "user_id",
    },
    {
        label: "OTP Status",
        field: "otp_status",
    }
];

function SupportOtpLog(props) {
    const [isLoading, setIsLoading] = useState(false);
    const [dpids, setDpids] = useState(localStorage.getItem("dpids").split(","));

    const [tableData, setTableData] = useState({
        columns: [...columns],
        rows: [],
    });

    const getOutletList = async () => {
			setIsLoading(true);
            try {
                const rowData = await axios.get(OTP_LIST);
                const rows = addButton(rowData.data.data);
                setTableData((prevState) => ({ ...prevState, ["rows"]: [...rows] }));
            } catch (e) {
                console.log("......... ", e);
            }
			setIsLoading(false);
    };

    const addButton = (rowData) => {
        const rows = rowData.map((row, index) => {
            row.otp = (
                <Fragment>
                    <Tooltip
                        title={row.msg_body}
                        position="top"
                        trigger="mouseenter"
                        arrow={true}
                    >
                        
                        {row.otp}
                    </Tooltip>
                </Fragment>
            );
            row.serial = index + 1;
            return row;
        });
        return rows;
    };

    useEffect(() => {
        getOutletList();
    }, [dpids]);

    return (
        <div>
            <Card className="m-5">
                <Card.Header>
                    <div className="row">
                        <h3 className="card-title">OTP Log List</h3>
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
                            <Datatable data={tableData} topSearch={true} />
                        </div>
                    }
                </Card.Body>
            </Card>
        </div>
    )
}
export default SupportOtpLog;
