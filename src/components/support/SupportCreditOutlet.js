import React, { useEffect, useState } from "react";
import { Card } from 'react-bootstrap';
import axios from 'axios';
import { baseURL } from "../../constants/constants";
import Loader from "react-loader-spinner";
import 'react-confirm-alert/src/react-confirm-alert.css';
import Datatable from "./../common/datatable";

const SUPPORT_CREDIT_OUTLET_LIST = baseURL + 'credit-outlet-list';

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
        label: "Allowed Limit",
        field: "allowed_limit",
    },
    {
        label: "Daily Limit",
        field: "daily_limit",
    },
    {
        label: "Current Balance",
        field: "current_balance",
    },
    {
        label: "Total Due",
        field: "total_due",
    },
    {
        label: "Carry Amount",
        field: "carry_amount",
    },
    {
        label: "KYC Status",
        field: "kyc_status",
    },
    {
        label: "Status",
        field: "status",
    }
];

function SupportCreditOutlet() {
    const [isLoading, setIsLoading] = useState(false);
    const [dpids, setDpids] = useState(localStorage.getItem("dpids").split(","));

    const [tableData, setTableData] = useState({
        columns: [...columns],
        rows: [],
    });

    const getOutletList = async () => {
			setIsLoading(true);
            try {
                const rowData = await axios.get(SUPPORT_CREDIT_OUTLET_LIST);
                const rows = addButton(rowData.data.data);
                setTableData((prevState) => ({ ...prevState, ["rows"]: [...rows] }));
            } catch (e) {
                console.log("......... ", e);
            }
			setIsLoading(false);
    };

    const addButton = (rowData) => {
        const rows = rowData.map((row, index) => {
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
                        <h3 className="card-title">Credit Outlet List</h3>
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
export default SupportCreditOutlet;
