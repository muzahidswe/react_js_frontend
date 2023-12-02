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

const DATA_TABLE_URL = baseURL + 'get-nid-master-data-report';
const DATA_TABLE_DOWNLOAD_URL = baseURL + 'get-nid-master-data'

const FilterComponent = ({ filterText, onFilter, searchClick, handleDownloadExcel }) => (
    <>
        <button
            className="btn btn-primary"
            // style={{ backgroundColor: "green" }}
            onClick={() => handleDownloadExcel()}
            data-toggle="tooltip"
            data-placement="bottom"
            title="Download report as excel"
            >

            <i className="far fa-file-excel" /> Download Report
        </button>
    </>
);

export default function EkycReport(props) {
  const alert = useAlert();

  const columns = [
    {
        name: 'House',
        selector: 'dh_name',
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
      name: 'Address',
      selector: 'address',
      sortable: true
    },
    {
      name: 'Action',
      cell: row =>
        <button
          onClick={()=>{downloadPDF(row.outlet_code)}}
          className="btn btn-primary btn-sm"
        >
          <i className="fa fa-download"></i>
        </button>
    }
  ]

  const [headers, setHeaders] = useState([]);
  const [filterText, setFilterText] = React.useState("");
  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const countPerPage = 10;

  const [totalRows, setTotalRows] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [dpids, setDpids] = useState([]);

  const getReportDatas = () => {
    if(dpids.length > 0) {
      axios.post(`${DATA_TABLE_URL}?page=${page}&per_page=${countPerPage}`, {dpids, per_page: countPerPage, page: page})
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
    }
  };

  const downloadPDF = (fileName) => {
    // swal({
    //     icon: "load.gif",
    //     buttons: false,
    // });
    let link = window.document.createElement("a");
    link.setAttribute("href", `https://prism360.net/nid_pdf_unnoti/${fileName}.pdf`);
    link.setAttribute("download", `${fileName}`);
    link.setAttribute("target", '_blank');
    link.click();
    // swal.close();
  }

  const handleDownloadExcel = () => {
    swal({
      icon: "load.gif",
      buttons: false,
    });
    axios.post(`${DATA_TABLE_DOWNLOAD_URL}`,
      {dpids}
    )
    .then(res => {
      swal.close();
      if (res.data.success) {
          alert.success(res.data.message);
          window.open(res?.data?.data, "_blank");
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

  useEffect(() => {
    getReportDatas();
  }, [dpids, page]);

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

  return (
    <Card className="m-5">
      <Card.Header>
        <div className="row">
          <h3 className="card-title">eKYC Report</h3>
        </div>
      </Card.Header>

      <Card.Body>
        <DropdownMenuGroup onDpidChange={handleDpidChange} isSearch={false} />
        {isLoading ? (
          <div>
            <div style={{ textAlign: "center" }}>
              <Loader type="Rings" color="#00BFFF" height={100} width={100} />
            </div>
          </div>
        ) :
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
    </Card>
  );
}
