import React, {Fragment, useEffect, useState } from "react";
import DataTable from 'react-data-table-component';
import { Card, Modal, Button } from 'react-bootstrap';
import axios from 'axios';
import { baseURL } from "../../constants/constants";
import Loader from "react-loader-spinner";
import DropdownMenuGroup from "../helper/top_dropdown";
import styled from "styled-components";
import { fileSubmitScopeoutlet } from '../../services/fileUploadServices';
import { useAlert } from 'react-alert';
import Paper from '@material-ui/core/Paper';
import InputBase from '@material-ui/core/InputBase';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import SearchIcon from '@material-ui/icons/Search';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import Datatable from "../common/datatable";
import swal from 'sweetalert2';
import styles from './loanAccount.module.css';
import { useSelector } from "react-redux";

const DATA_TABLE_URL = baseURL+'pending-loan-customer-id';
const ADJUSTMENT_URL = baseURL+'loan-customer-id-adjustment';
const DELETE_URL = baseURL+'delete-scope-outlet';

const FilterComponent = ({ filterText, onFilter, searchClick }) => (
  <>
    {/* <TextField
      id="search"
      type="text"
      placeholder="Search"
      aria-label="Search Input"
      value={filterText}
      onChange={onFilter}
    /> */}

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
        inputProps={{ 'aria-label': 'Search By Outlet Code' }}
        value={filterText}
        onChange={onFilter}
      />
      <Divider style={{
        width: 1,
        height: 28,
        margin: 4,
      }} />
      <IconButton style={{ padding: 10, }} aria-label="Search" onClick={searchClick}>
        <SearchIcon />
      </IconButton>

    </Paper>
  </>
);


function LoanAccountAndClientId(props) {
    const {selected_fi} = useSelector(state => state.fi)
    const alert = useAlert();
    
    const deleteScopeOutlet = (id) => {
        confirmAlert({
            title: 'Are you sure?',
            message: 'You wont be able to revert this.',
            buttons: [
                {
                    label: 'Yes',
                    onClick: () => confirmDeleteOutlet(id),
                    className: "btn btn-danger"
                },
                {
                    label: 'No',
                    onClick: () => console.log('Click No'),
                    className: "btn btn-success"
                }
            ]
        });        
    }

    const confirmDeleteOutlet = (id) => {
        axios.post(`${DELETE_URL}`,{
            id: id
        }).then(res => {
            alert.success('Successfully deleted.');
            getUploadedDatas();
        }).catch(err => {
            alert.error('Something went wrong.');
            // setData({});
            // setTotalRows(0);
            // setHeaders([]);
        });
    }

    const columns = [
        {
            name: 'Point',
            selector: 'dp_name',
            sortable: true
        },
        {
            name: 'Outlet Code',
            selector: 'outlet_code',
        },
        {
            name: 'Outlet Name',
            selector: 'outlet_name',
            sortable: true
        },
        {
            name: 'Owner Name',
            selector: 'owner_name',
            sortable: true
        },
        {
            name: 'Phone No.',
            selector: 'phone',
            sortable: true
        },
        {
            name: 'KYC Date',
            selector: 'kyc_date',
            sortable: true
        },
        {
            name: 'KYC Status',
            selector: 'kyc_status',
            sortable: true
        },
        {
            name: 'Action(s)',
            cell: row =><button onClick={()=>{deleteScopeOutlet(row.id)}} className="btn btn-danger btn-sm"><i className="fa fa-trash"></i></button>
        }
    ]

    const columns2 = [
        {
            label: 'Point',
            field: 'dp_name',
            sortable: true
        },
        {
            label: 'Outlet Code',
            field: 'outlet_code',
        },
        {
            label: 'Outlet Name',
            field: 'outlet_name',
            sortable: true
        },
        {
            label: 'Owner Name',
            field: 'owner_name',
            sortable: true
        },
        {
            label: 'Phone No.',
            field: 'phone',
            sortable: true
        },
        {
            label: 'KYC Date',
            field: 'kyc_date',
            sortable: true
        },
        {
            label: 'KYC Status',
            field: 'kyc_status',
            sortable: true
        },
        {
            label: 'Action',
            field: 'actions',
        }
    ]

    const [headers, setHeaders] = useState([]);
    const [filterText, setFilterText] = React.useState("");
    const [data, setData] = useState([]);
    const [page, setPage] = useState(1);
    const countPerPage = 10;

    const [totalRows, setTotalRows] = useState();
    const [isLoading, setIsLoading] = useState(true);
    const [dpids, setDpids] = useState([]);

    const [tableData, setTableData] = useState({
        columns: [...columns2],
        rows: [],
    });

    const getUploadedDatas = () => {
        if (selected_fi) {
            axios.get(`${DATA_TABLE_URL}`, {params: {fi_id: selected_fi}}).then(res => {
                setData(res.data.data);
                const rows = addButton(res.data.data);
                setTableData((prevState) => ({ ...prevState, ["rows"]: res.data.data }));
                // setTotalRows(res.data.data.pagination.total);
                setHeaders(columns);
            }).catch(err => {
                setData({});
                setTotalRows(0);
                setHeaders([]);
            });
        }
        setIsLoading(false);
    };

    const searchClick = () => {
        getUploadedDatas();
    }

    const subHeader = React.useMemo(() => {
    return (
        <Fragment>
            <FilterComponent
                searchClick={searchClick}
                onFilter={(e) => {
                setFilterText(e.target.value)

                }}
                filterText={filterText}
            />
        </Fragment>
        );
    }, [dpids, filterText, selected_fi]);

    const handleLoanAdjustment = async () => {
        swal.fire({
            title: 'Are you sure?',
            text: 'Loan Account will be adjusted',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes!',
            cancelButtonText: 'No'
        }).then(async (result) => {
                if (result.value) {
                    setIsLoading(true)
                    let loanAdjustment = await axios.get(ADJUSTMENT_URL, {params: {fi_id: selected_fi}});

                    if (loanAdjustment.data.success == true) {
                        setIsLoading(false)
                        swal.fire({
                            title: 'Success!',
                            text: `${loanAdjustment.data.message}`,
                            icon: 'success',
                        })

                        getUploadedDatas();
                    } else {
                        swal.fire({
                            title: 'Error!',
                            text: `${loanAdjustment.data.message}`,
                            icon: 'error',
                        })
                    }
                } else if (result.dismiss === swal.DismissReason.cancel) {
                    swal.fire({
                        title: "Cancelled",
                        text: "Adjustment not made",
                        icon: 'error'
                    })
                }
            })
            
        setIsLoading(false);
    }

    const addButton = (rowData) => {
        const rows = rowData.map((row) => {
          row.actions = (
            <Fragment>
                <button 
                    onClick={()=>{deleteScopeOutlet(row.id)}} 
                    className="btn btn-danger btn-sm"
                >
                    <i className="fa fa-trash"></i>
                </button>    
            </Fragment>
          );
          return row;
        });
        return rows;
      };

    useEffect(() => {
        getUploadedDatas();
    }, [page, dpids, selected_fi]);

    return isLoading ? 
    <div>
      <div style={{ textAlign: "center" }}>
        <Loader type="Rings" color="#00BFFF" height={100} width={100} />
      </div>
    </div> : (
        <>
            <Card className="m-5">
                <Card.Header>
                    <h3 className="card-title">Loan Account & Client ID</h3>                    
                </Card.Header>
                <Card.Body>
                    <div className={styles.buttonWrapper}>
                        <button className={styles.button} onClick={handleLoanAdjustment}>
                            Adjust Loan Account & Client ID
                        </button>
                    </div>

                    <Datatable topSearch={true} data={tableData} />
                    
                    {/* <DataTable
                        noHeader
                        columns={headers}
                        data={data}
                        highlightOnHover
                        pagination
                        paginationServer
                        subHeader
                        subHeaderComponent={subHeader}
                        // paginationTotalRows={totalRows}
                        paginationPerPage={countPerPage}
                        paginationComponentOptions={{
                            noRowsPerPage: true
                        }}
                        onChangePage={page => setPage(page)}
                    /> */}
                </Card.Body>
            </Card>
        </>
    );
}

export default LoanAccountAndClientId;