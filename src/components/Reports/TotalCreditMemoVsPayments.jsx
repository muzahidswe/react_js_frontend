import React, { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import { Card } from "react-bootstrap";
import axios from "axios";
import { baseURL } from "../../constants/constants";
import Loader from "react-loader-spinner";
import DropdownMenuGroup from "../helper/top_dropdown_total_report";
import styled from "styled-components";
const DATA_TABLE_URL = baseURL + "total_credit_memo_vs_payments";
const DATA_TABLE_DOWNLOAD_URL = baseURL + "total_credit_memo_vs_payments_download";

const TextField = styled.input`
  height: 32px;
  width: 200px;
  border-radius: 3px;
  border-top-left-radius: 5px;
  border-bottom-left-radius: 5px;
  border-top-right-radius: 0;
  border-bottom-right-radius: 0;
  border: 1px solid #e5e5e5;
  padding: 0 32px 0 16px;

  &:hover {
    cursor: pointer;
  }
`;

const FilterComponent = ({ filterText, onFilter, downloadDatas }) => (
  <>
    <button
      id="dl_excel"
      title="Download as Excel"
      className="btn btn-success mr-5"
      onClick={() =>downloadDatas()}
    ><i className="la la-file-excel"></i>
    </button>
    <TextField
      id="search"
      type="text"
      placeholder="Search"
      aria-label="Search Input"
      value={filterText}
      onChange={onFilter}
    />
  </>
);

function TotalCreditMemoVsPayments(props) {
  const columns = [
    {
      name: "House",
      selector: "dh_name",
      sortable: true,
    },
    {
      name: "Outlet Code",
      selector: "outlet_code",
      sortable: true,
    },
    {
      name: "Outlet Name",
      selector: "outlet_name",
      sortable: true,
    },
    {
      name: "Total Credit Memo Transaction",
      selector: "total_credit_memo_transaction",
      sortable: true,
    },
    {
      name: "Total Credit Payment",
      selector: "total_credit_payment",
      sortable: true,     
    }
  ];
  const [filterText, setFilterText] = React.useState("");
  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const [dataToShow, setDataToShow] = useState([])
  //const [dataToShow,setDataToShow] = useState({});
  const [totalRows, setTotalRows] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const countPerPage = 10;
  const [dpids, setDpids] = useState([]);
  const [fromDate, setFromDate] = useState(`${new Date().getFullYear()}-01-01`);
  const [toDate, setToDate] = useState(`${new Date().getFullYear()}-12-31`);

  const getDatas = () => {
    var token = localStorage.getItem("token");

    if (dpids.length > 0) {
      axios
        .post(
          DATA_TABLE_URL,
          { dpids, per_page: countPerPage, current_page: page, fromDate, toDate, filterText },
          {
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
              Authorization: "Bearer " + token,
            },
          }
        )
        .then((res) => {
          let resData = res?.data?.data?.data
          setData(resData);
          let filteredData = resData.length > 0 ? resData.filter((item) =>
              item.outlet_code.toLowerCase().includes(filterText.toLowerCase()) ||
              item.outlet_name.toLowerCase().includes(filterText.toLowerCase())
          ) : [];

          setDataToShow(filteredData);
          setTotalRows(res.data.data.pagination.total);
        })
        .catch((err) => {
          setData({});
          setTotalRows(0);
      });
    }

    setIsLoading(false);
  };

  const downloadDatas = async () => {
    var token = localStorage.getItem("token");
    setIsLoading(true);
    await axios
      .post(
        DATA_TABLE_DOWNLOAD_URL,
        { dpids, fromDate, toDate},
        {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
          },
        }
      )
      .then((res) => {
          // window.open(baseURL + res.data.data, '_blank', 'noopener,noreferrer')
          let link = window.document.createElement("a");
          link.setAttribute("href", `${res?.data?.data}`);
          link.setAttribute("download", 'total_credit');
          link.click();
          setIsLoading(false);
      })
      .catch((err) => {
        setIsLoading(false);
      });
  }
  const subHeaderComponentMemo = React.useMemo(() => {
    return (
      <FilterComponent
        onFilter={(e) => setFilterText(e.target.value)}
        filterText={filterText}
        downloadDatas={downloadDatas}
      />
    );
  }, [filterText, dpids, fromDate, toDate]);
  
  const handleDpidChange = (ids, fromDate, toDate) => {
    setDpids(ids);
    setFromDate(fromDate);
    setToDate(toDate);
  };

  useEffect(() => {
    getDatas();
  }, [page, dpids, fromDate, toDate]);

  return (
    <Card className="m-5">
      <Card.Header>
        <h3 className="card-title">Total Credit Memo vs Payments</h3>
      </Card.Header>

      <Card.Body>
        <DropdownMenuGroup onDpidChange={handleDpidChange} isSearch={true} />
        {isLoading ? (
          <div>
            <div style={{ textAlign: "center" }}>
              <Loader type="Rings" color="#00BFFF" height={100} width={100} />
            </div>
          </div>
        ) 
        : 
        (
          <DataTable
            striped
            noHeader
            columns={columns}
            data={dataToShow}
            highlightOnHover
            pagination
            paginationServer
            subHeader
            subHeaderComponent={subHeaderComponentMemo}
            paginationTotalRows={totalRows}
            paginationPerPage={countPerPage}
            paginationComponentOptions={{
              noRowsPerPage: true,
            }}
            
            onChangePage={(page) => setPage(page)}
          />
        )}
      </Card.Body>
    </Card>
  );
}

export default TotalCreditMemoVsPayments;
