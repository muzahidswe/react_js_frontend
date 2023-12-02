import React, { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import { Card } from "react-bootstrap";
import axios from "axios";
import { baseURL } from "../../constants/constants";
import Loader from "react-loader-spinner";
import DropdownMenuGroup from "../helper/top_dropdown_total_report";
import styled from "styled-components";
const DATA_TABLE_URL = baseURL + "payment_made_by_dh_to_fi";
const DATA_TABLE_DOWNLOAD_URL = baseURL + "payment_made_by_dh_to_fi_download";

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
  </>
);

function PaymentMadeByDhToFi(props) {
  const columns = [
    {
      name: "Date",
      selector: "sys_date",
      sortable: true,
    },
    {
      name: "Total Disbursed Amount",
      selector: "disbursed_amount",
      sortable: true,
    },
    {
      name: "Total Paid Amount",
      selector: "paid_amount",
      sortable: true,
    },
    {
      name: "Total Interest Amount",
      selector: "interest_amount",
      sortable: true,     
    },
    {
      name: "Total Principle Amount",
      selector: "principle_amount",
      sortable: true,
    },
    {
      name: "Total Carry Amount",
      selector: "carry_amount",
      sortable: true,
    }
  ];
  const [filterText, setFilterText] = React.useState("");
  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const dataToShow =data;
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
          { dpids, per_page: countPerPage, current_page: page, fromDate, toDate },
          {
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
              Authorization: "Bearer " + token,
            },
          }
        )
        .then((res) => {
          setData(res.data.data.data);

          //setDataToShow(res.data.data.data);
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
          window.open(res?.data?.data, '_blank', 'noopener,noreferrer')
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
        <h3 className="card-title">Payments Made By Dh To Fi</h3>
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

export default PaymentMadeByDhToFi;
