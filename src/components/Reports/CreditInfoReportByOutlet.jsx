import React, { Fragment, useEffect, useState, useMemo } from "react";
import DataTable from 'react-data-table-component';
import { Card } from 'react-bootstrap';
import axios from 'axios';
import { baseURL } from "../../constants/constants";
import Loader from "react-loader-spinner";
import DropdownMenuGroup from "../helper/top_dropdown_with_date_for_report_till_date";
import 'react-confirm-alert/src/react-confirm-alert.css';

const DATA_TABLE_URL = baseURL + 'credit-information-by-outlet'

function CreditInfoReport(props) {
    const columns = [
        {
            name: "Outlet Code",
            selector: "outlet_code",
            sortable: true
        },
        {
            name: "Opening Outstanding Balance",
            selector: "opening_outstanding",
            sortable: true,
            grow:2
        },
        {
            name: "Principle",
            selector: "principle",
            sortable: true
        },
        {
            name: "Interest",
            selector: "interest",
            sortable: true
        },
        {
            name: "New Loan",
            selector: "new_loan",
            sortable: true
        },
        {
            name: "Closing Balance",
            selector: "closing_blnc",
            sortable: true
        },
        {
            name: "Max Loan Limit",
            selector: "max_loan_limit",
            sortable: true
        },
        {
            name: "Utilization rate",
            selector: "utilization_rate",
            sortable: true
        }
    ];

    const [headers, setHeaders] = useState([]);
    const [data, setData] = useState([]);
    const [page, setPage] = useState(1);
    const countPerPage = 10;

    const [totalRows, setTotalRows] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const getData = (dpids, selectedOutlets, tillDate) => {
        axios.post(DATA_TABLE_URL, 
            {dpids, selectedOutlets, tillDate, page, countPerPage}
        )
        .then(res => {
            setData(res.data.data);
            setTotalRows(res.data.data.pagination.total);
            setHeaders(columns);
        }).catch(err => {
            setData({});
            setTotalRows(0);
            setHeaders([]);
        });
        setIsLoading(false);
    };

    useEffect(() => {
        getData(localStorage.getItem("dpids").split(","));
    }, [page]);

  return isLoading ? 
    (<div>
        <div style={{ textAlign: "center" }}>
            <Loader type="Rings" color="#00BFFF" height={100} width={100} />
        </div>
    </div>) : (
        <Card className="m-5">
            <Card.Header>
                <div className="row">
                    <h3 className="card-title">Credit Information by Outlet</h3>
                </div>
                
            </Card.Header>
            <Card.Body style={{padding: "0.25rem"}}>
                <DropdownMenuGroup onSearch={getData} />
            </Card.Body>
            <Card.Footer>
                <DataTable
                    noHeader
                    columns={headers}
                    data={data.data}                    
                    highlightOnHover
                    pagination
                    paginationServer
                    paginationTotalRows={totalRows}
                    paginationPerPage={countPerPage}
                    paginationComponentOptions={{
                        noRowsPerPage: true
                    }}
                    onChangePage={page => setPage(page)}
                />
            </Card.Footer>
        </Card>
    )
}
export default CreditInfoReport;