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

const DATA_TABLE_URL = baseURL + 'outlet_wise_credit_info'
const DATA_TABLE_DOWNLOAD_URL = baseURL + 'outlet_wise_credit_info_download';

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



function OutletWiseCreditInfo(props) {
    const {selected_fi} = useSelector(state => state.fi);
    const columns = [
        {
            name: "House",
            selector: "dh_name",
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
            name: "Loan Taken",
            selector: "loan_taken",
            sortable: true
        },
        {
            name: "Due Amount",
            selector: "due_amount",
            sortable: true
        },
        {
            name: "Paid Amount",
            selector: "paid_amount",
            sortable: true
        },
        {
            name: "Paid Principle",
            selector: "paid_principle",
            sortable: true
        },
        {
            name: "Paid Interest Amount",
            selector: "paid_interest_amount",
            sortable: true
        },
        {
            name: "Carry Amount",
            selector: "carry_amount",
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
        await axios
        .post(
            DATA_TABLE_DOWNLOAD_URL,
            {fi_id: selected_fi, filterText},
            {
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                Authorization: "Bearer " + token,
            },
            }
        )
        .then((res) => {
            window.open(res?.data?.data, '_blank', 'noopener,noreferrer')
            setIsLoading(false);
        })
        .catch((err) => {
            setIsLoading(false);
        });
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
    }, [selected_fi,,filterText]);

    useEffect(() => {
        getReportData();
    }, [selected_fi, page]);

  return isLoading ?
    (<div>
        <div style={{ textAlign: "center" }}>
            <Loader type="Rings" color="#00BFFF" height={100} width={100} />
        </div>
    </div>) : (
        <Card className="m-5">
            <Card.Header>
                <div className="row">
                    <h3 className="card-title">Outlet Wise Credit Info</h3>
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
export default OutletWiseCreditInfo;
