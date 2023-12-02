import React, { Fragment, useEffect, useState, useMemo } from "react";
import DataTable from 'react-data-table-component';
import { Card } from 'react-bootstrap';
import axios from 'axios';
import { baseURL } from "../../constants/constants";
import Loader from "react-loader-spinner";
import Paper from '@material-ui/core/Paper';
import InputBase from '@material-ui/core/InputBase';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import SearchIcon from '@material-ui/icons/Search';
import 'react-confirm-alert/src/react-confirm-alert.css';
import { useSelector } from "react-redux";

const DATA_TABLE_URL = baseURL + 'repayment_day_report';
const DATA_TABLE_DOWNLOAD_URL = baseURL + 'repayment_day_report_download';

const FilterComponent = ({ filterText, onFilter, searchClick, downloadDatas }) => (
    <>
        <Paper style={{
            padding: '2px 4px',
            display: 'flex',
            alignItems: 'center',
            width: 300,
            }}>

            <InputBase
                style={{
                    marginLeft: 8,
                    flex: 1,
                }}
                placeholder="Search By Outlet Code"
                inputProps={{ 'aria-name': 'Search By Outlet Code' }}
                value={filterText}
                onChange={onFilter}
            />
            <Divider style={{
                width: 1,
                height: 28,
                margin: 4,
            }} />
            <IconButton style={{ padding: 10, }} aria-name="Search" onClick={searchClick}>
                <SearchIcon />
            </IconButton>

        </Paper>
        <button
            id="dl_excel"
            title="Download as Excel"
            className="btn btn-success mr-5 ml-2 mt-1"
            onClick={downloadDatas}
            ><i className="la la-file-excel"></i>
        </button>
    </>
);
    


function RepaymentDayReport(props) {
    const {selected_fi} = useSelector(state => state.fi);
    const columns = [
        {
            name: "House",
            selector: "house",
            sortable: true
        },
        {
            name: "Point",
            selector: "point",
            sortable: true
        },
        {
            name: "Outlet Code",
            selector: "outlet_code",
            sortable: true
        },
        {
            name: "Outlet Name",
            selector: "outlet_name",
            sortable: true
        },
        {
            name: "Owner Name",
            selector: "owner_name",
            sortable: true
        },
        {
            name: "Phone",
            selector: "phone",
            sortable: true
        },
        {
            name: "Address",
            selector: "address",
            sortable: true
        },
        {
            name: "Credit Amount",
            selector: "credit_amount",
            sortable: true
        },
        {
            name: "No of days taken to repay/ No of days since loan taken",
            selector: "no_of_days_taken_to_repay",
            sortable: true
        },
        {
            name: "Due Amount",
            selector: "due_amount",
            sortable: true
        },
        {
            name: "Credit Disbursements Date",
            selector: "credit_disbursements_date",
            sortable: true
        }
    ];
    const [headers, setHeaders] = useState([]);
    const [filterText, setFilterText] = React.useState("");
    const [data, setData] = useState([]);
    const [page, setPage] = useState(1);
    const countPerPage = 10;

    const [totalRows, setTotalRows] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const getReportData = () => {
        axios.post(`${DATA_TABLE_URL}`, 
            {fi_id: selected_fi, filterText, per_page: countPerPage, current_page: page}
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

    const downloadDatas = async () => {
        var token = localStorage.getItem("token");
        setIsLoading(true);
        let response = await axios.post(DATA_TABLE_DOWNLOAD_URL,{fi_id: selected_fi, filterText}, {
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                    Authorization: "Bearer " + token,
                },
            }
        );

        if(response.data.success) {
            let fileUrl = response?.data?.data;
            setTimeout(() => {
                window.open(fileUrl, "_blank");
            }, 10000);
            setIsLoading(false)
        } else {
            alert(response.data.message)
            setIsLoading(false)
        }
    }

    const searchClick = () => {
        getReportData();
    }

    const subHeader = useMemo(() => {
        return (
            <Fragment>
                <FilterComponent
                    searchClick={searchClick}
                    onFilter={(e) => {
                        setFilterText(e.target.value)
                    }}
                    filterText={filterText}
                    downloadDatas = {()=> downloadDatas()}
                />  
            </Fragment>
            );
    }, [selected_fi, filterText]);

    useEffect(() => {
        getReportData();
    }, [page, selected_fi]);

  return isLoading ? 
    (<div>
        <div style={{ textAlign: "center" }}>
            <Loader type="Rings" color="#00BFFF" height={100} width={100} />
        </div>
    </div>) : (
        <Card className="m-5">
            <Card.Header>
                <div className="row">
                    <h3 className="card-title">Repayment Day Report</h3>
                </div>
                
            </Card.Header>
                <Card.Body>
                    <DataTable
                        noHeader
                        columns={headers}
                        data={data.data}
                        highlightOnHover
                        pagination
                        paginationServer
                        subHeader
                        subHeaderComponent={subHeader}
                        paginationTotalRows={totalRows}
                        paginationPerPage={countPerPage}
                        paginationComponentOptions={{
                            noRowsPerPage: true
                        }}
                        onChangePage={page => setPage(page)}
                    />
                </Card.Body>
        </Card>
    )
}
export default RepaymentDayReport;
