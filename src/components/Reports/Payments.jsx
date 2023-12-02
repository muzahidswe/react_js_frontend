import React, { Fragment, useEffect, useState, useMemo } from "react";
import DataTable from 'react-data-table-component';
import { Card } from 'react-bootstrap';
import axios from 'axios';
import { baseURL } from "../../constants/constants";
import Loader from "react-loader-spinner";
import DropdownMenuGroup from "../helper/top_dropdown_with_phase";
import Paper from '@material-ui/core/Paper';
import InputBase from '@material-ui/core/InputBase';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import SearchIcon from '@material-ui/icons/Search';
import 'react-confirm-alert/src/react-confirm-alert.css';

const DATA_TABLE_URL = baseURL + 'payments';
const DATA_TABLE_DOWNLOAD_URL = baseURL + 'payments-download';

const FilterComponent = ({ filterText, onFilter, searchClick, dateFrom, dateTo, onDateFromChange, onDateToChange, downloadDatas }) => (
    <>
        <div className="row m-1">
            <div className="col-7">
                <div className="input-group ">
                    <span className="input-group-text ml-10">Date From</span>
                    <input
                        type="date"
                        className="form-control form-control-md form-control-solid"
                        value={dateFrom}
                        onChange={onDateFromChange}
                    />
                    <span className="input-group-text ml-5">Date To</span>
                    <input
                        type="date"
                        className="form-control  form-control-md form-control-solid"
                        value={dateTo}
                        onChange={onDateToChange}
                    />
                </div>
            </div>
            <div className="col-4">
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
            </div>
            <div className="col-1">
                <button
                    id="dl_excel"
                    title="Download as Excel"
                    className="btn btn-success mr-5"
                    onClick={downloadDatas}
                    ><i className="la la-file-excel"></i>
                </button>
            </div>   
        </div>
    </>
);
    


function Payments(props) {
    const columns = [
        {
            name: "House",
            selector: "dh_name",
            sortable: true
        },
        {
            name: "Point",
            selector: "dp_name",
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
            name: "Paid Amount",
            selector: "paid_amount",
            sortable: true
        },
        {
            name: "Paid Principle Amount",
            selector: "paid_principle",
            sortable: true
        },
        {
            name: "Paid Interest Amount",
            selector: "paid_interest_amount",
            sortable: true
        },
        {
            name: "Date",
            selector: "sys_date",
            sortable: true
        }
    ];

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
    const [dateFrom, setDateFrom] = useState();
    const [dateTo, setDateTo] = useState(); 
    const [headers, setHeaders] = useState([]);
    const [filterText, setFilterText] = React.useState("");
    const [data, setData] = useState([]);
    const [page, setPage] = useState(1);
    const countPerPage = 10;

    const [totalRows, setTotalRows] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [isDownloading, setIsDownloading] = useState(false);
    const [dpids, setDpids] = useState(localStorage.getItem("dpids").split(","));
    const [totalAmt, setTotalAmt] = useState("0");
    const [phases, setPhases] = useState([]);

    const getReportData = () => {
        axios.post(`${DATA_TABLE_URL}?page=${page}&per_page=${countPerPage}`, 
            {dpids, phases, filterText, dateFrom, dateTo}
        )
        .then(res => {
            setData(res.data.data);
            setTotalRows(res.data.data.pagination.total);
            setHeaders(columns);
            setTotalAmt(res.data.data.total_amount);
        }).catch(err => {
            setData({});
            setTotalRows(0);
            setHeaders([]);
            setTotalAmt("0")
        });
        setIsLoading(false);
    };

    const downloadDatas = async () => {
        var token = localStorage.getItem("token");
        setIsDownloading(true);
        await axios
        .post(
            DATA_TABLE_DOWNLOAD_URL,
            {dpids, phases, filterText, dateFrom, dateTo},
            {
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                Authorization: "Bearer " + token,
            },
            }
        )
        .then((res) => {
            if (res?.data?.data.length > 0) {
                res?.data?.data.forEach(item => {
                    let link = window.document.createElement("a");
                    link.setAttribute("href", `${item}`);
                    link.setAttribute("download", 'scope_outlet');
                    link.setAttribute("target", '_blank');
                    link.click();
                })
            }
            setIsDownloading(false);
        })
        .catch((err) => {
            setIsDownloading(false);
        });
    }

    const handleDpidChange = (ids) => {
        setDpids(ids);
    };
    
    const handlePhaseChange = (ids) => {
        setPhases(ids);
    };

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
                    dateFrom={dateFrom !== '' ? dateFrom : formatDate()}
                    dateTo={dateTo !== '' ? dateTo : formatDate()}
                    onDateFromChange={(e) => {
                        setDateFrom(e.target.value);
                    }}
                    onDateToChange={(e) => {
                        setDateTo(e.target.value);
                        // getReportData();
                    }}
                    downloadDatas = {()=> downloadDatas()}
                />  
            </Fragment>
            );
    }, [filterText, dpids, phases, dateFrom, dateTo]);

    useEffect(() => {
        getReportData();
    }, [page, dpids, phases, dateTo]);

    return (
        <Card className="m-5">
            <Card.Header>
                <div className="row">
                    <h3 className="card-title">Payments Day Wise</h3>
                </div>
                
            </Card.Header>
                <Card.Body>
                    <DropdownMenuGroup onDpidChange={handleDpidChange} onPhaseChange={handlePhaseChange} isSearch={false} />
                    {isDownloading ? 
                        (<div>
                            <div style={{ textAlign: "center" }}>
                                <Loader type="Rings" color="#00BFFF" height={100} width={100} />
                            </div>
                        </div>
                        ) 
                        :
                        null
                    }

                    {isLoading ? 
                        (<div>
                            <div style={{ textAlign: "center" }}>
                                <Loader type="Rings" color="#00BFFF" height={100} width={100} />
                            </div>
                        </div>
                        ) 
                        : 
                        (
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
                        )}
                </Card.Body>
                <Card.Footer>
                    {isLoading ? 
                        (<div>
                            <div style={{ textAlign: "center" }}>
                                <Loader type="Rings" color="#00BFFF" height={100} width={100} />
                            </div>
                        </div>
                        ) 
                        : 
                        (
                            <span className="font-size-h3 font-weight-boldest ml-5">Total Paid Amount: {totalAmt}</span>
                    )}
                </Card.Footer>
        </Card>
    )
}
export default Payments;
