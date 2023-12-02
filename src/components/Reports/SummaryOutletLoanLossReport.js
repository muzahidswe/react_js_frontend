import React, { Fragment, useEffect, useState } from "react";
import DataTable from 'react-data-table-component';
import { Card, Modal, Button } from 'react-bootstrap';
import axios from 'axios';
import { baseURL } from "../../constants/constants";
import Loader from "react-loader-spinner";
import DropdownMenuGroup from "../helper/top_dropdown";
import { useAlert } from 'react-alert';
import Paper from '@material-ui/core/Paper';
import InputBase from '@material-ui/core/InputBase';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import SearchIcon from '@material-ui/icons/Search';
import 'react-confirm-alert/src/react-confirm-alert.css';
import swal from 'sweetalert';
import { useSelector } from "react-redux";

const DATA_TABLE_URL = baseURL + "get-summery-outlet-loan-loss-data";
const DATA_TABLE_DOWNLOAD_URL = baseURL + "get-outlet-loan-loss-report";

const formatNumber = (number) => {
  let value = parseFloat(number).toFixed(2);
  let valueString = parseFloat(value)?.toLocaleString('en-US');
  return valueString;
}

export default function SummaryOutletLoanLoss(props) {
    const [user_type, setUserType] = useState(localStorage.getItem('cr_user_type'));
    const {selected_fi} = useSelector(state => state.fi);

    const alert = useAlert();

    const [columns, setColumns] = useState([
      {
        name: "Stage",
        selector: "name",
        sortable: true,
      },
      {
        name: "Retailer Count",
        selector: "retailer_count",
        sortable: true,
        right: true,
        format: (row, index) => {
          return (
            <div>{formatNumber(row?.retailer_count)}</div>
          )
        }
      },
      {
        name: "Modality",
        selector: "modality",
        sortable: true,
        wrap:false,
        grow:2

      },
      {
        name: "Total Outstanding",
        selector: "outstanding",
        sortable: true,
        right: true,
        format: (row, index) => {
          return (
            <div>{formatNumber(row?.outstanding)}</div>
          )
        }
      },

      {
        name: "Provision (%)",
        selector: "provision_percentage",
        sortable: true,
        right: true,
        format: (row, index) => {
          return (
            <div>{row?.provision_percentage} %</div>
          )
        }
      },
      {
        name: "Provision Outstanding Capital",
        selector: "outstanding_with_provision",
        sortable: true,
        right: true,
        grow: 1.5,
        format: (row, index) => {
          return (
            <div>{formatNumber(row?.outstanding_with_provision)}</div>
          )
        }
      },
    ]);

    const [headers, setHeaders] = useState([]);
    const [filterText, setFilterText] = React.useState("");
    const [data, setData] = useState([]);
    const [page, setPage] = useState(1);
    const countPerPage = 10;

    const [totalRows, setTotalRows] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [dpids, setDpids] = useState(localStorage.getItem("dpids").split(","));
    const [loading, setLoading] = useState(false);

    const getReportDatas = () => {
        axios.post(`${DATA_TABLE_URL}`,
            {fi_id: selected_fi, dpids, current_page: page, per_page: countPerPage}
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

    const handleDownloadExcel = () => {
        swal({
            icon: "load.gif",
            buttons: false,
        });
        axios.post(`${DATA_TABLE_DOWNLOAD_URL}`,
            {dpids, filterText}
        )
        .then(res => {
            swal.close();
            if (res.data.success) {
                alert.success(res.data.message);
                window.open(`${res?.data?.data}`, "_blank", 'noopener,noreferrer');
            }else{
                alert.error(res.data.message);
            }

        }).catch(err => {
            swal.close();
            alert.error(err.message);
        });
    }

    const handleDpidChange = (ids) => {
      setDpids(ids);
    };

    const FilterComponent = ({ filterText, onFilter, searchClick, handleDownloadExcel }) => (
      <>
        <Paper style={{
          padding: '2px 4px',
          display: 'flex',
          alignItems: 'center',
          width: 300,
          }}
        >
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
        </Paper>{" "}

        {(user_type != 'fi') &&
          <button
            className="btn btn-clean btn-success ml-2"
            style={{ backgroundColor: "green" }}
            onClick={() => handleDownloadExcel()}
            data-toggle="tooltip"
            data-placement="bottom"
            title="Download report as excel"
            >
            <i className="far fa-file-excel" />
          </button>
        }
      </>
    );

    useEffect(() => {
        getReportDatas();
    }, [page, dpids, page]);

    const searchClick = () => {
        getReportDatas();
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
                handleDownloadExcel={handleDownloadExcel}
            />
        </Fragment>
        );
    }, [filterText, dpids]);
    return isLoading ?
    <div>
      <div style={{ textAlign: "center" }}>
        <Loader type="Rings" color="#00BFFF" height={100} width={100} />
      </div>
    </div> : (
        <>
            <Card className="m-5">
                <Card.Header>
                    <div className="row">
                        <h3 className="card-title">Summary of Loan Loss Outstanding</h3>
                    </div>

                </Card.Header>
                    <Card.Body>
                        <DropdownMenuGroup onDpidChange={handleDpidChange} isSearch={true} />
                        <DataTable
                            noHeader
                            columns={headers}
                            data={data.data}
                            highlightOnHover
                            pagination
                            paginationServer
                            // subHeader
                            // subHeaderComponent={subHeader}
                            paginationTotalRows={totalRows}
                            paginationPerPage={countPerPage}
                            paginationComponentOptions={{
                                noRowsPerPage: true
                            }}
                            onChangePage={page => setPage(page)}
                        />
                    </Card.Body>
            </Card>
        </>
    );
}
