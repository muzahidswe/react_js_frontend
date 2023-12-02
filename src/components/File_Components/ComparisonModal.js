import React, {Fragment, useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import { Card } from "react-bootstrap";
import axios from "axios";
import { baseURL } from "../../constants/constants";
import Loader from "react-loader-spinner";
import DropdownMenuGroup from "../helper/top_dropdown";
import styled from "styled-components";
const DATA_TABLE_URL = baseURL + "get-comparison";
const DATA_TABLE_DOWNLOAD_URL = baseURL + "get-comparison-download";

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

const FilterComponent = ({ filterText, onFilter }) => (
  <>
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

function Comparison(props) {
  const columns = [
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
      name: "Owner Name",
      selector: "owner_name",
      sortable: true,
      wrap:false,
      grow:2
     
    },
    {
      name: "Pnone",
      selector: "phone",
      sortable: true,
    },
    {
      name: "Address",
      selector: "address",
      sortable: true,
    },
    {
      name: "Acc No.",
      selector: "acc_no",
      sortable: true,
      grow:1.5
    },
    {
      name: "Fi Initial Amount",
      selector: "fi_init_amt",
      sortable: true,
    },
    {
      name: "BAT Modify / Approve Amount",
      selector: "bat_mod_app_amt",
      sortable: true,
    },
    {
      name: "FI Approved Amount",
      selector: "fi_approved_amt",
      sortable: true,
    }
  ];
  const [filterText, setFilterText] = React.useState("");
  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const dataToShow =data.length>0? data.filter(
    (item) =>
      item.outlet_code.toLowerCase().includes(filterText.toLowerCase()) ||
      item.outlet_name.toLowerCase().includes(filterText.toLowerCase())
  ):[];
  //const [dataToShow,setDataToShow] = useState({});
  const [totalRows, setTotalRows] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const countPerPage = 10;
  const [dpids, setDpids] = useState(localStorage.getItem("dpids").split(","));
  const dataTableDownload = () =>{
        var token = localStorage.getItem("token");
        axios.post(`${DATA_TABLE_DOWNLOAD_URL}`,
        { id: props.cr_retail_limit_info_id, status: props.row_status },
        {
            headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
            },
        }).then(res => {
            window.open(res?.data?.data, "_blank");
        }).catch(err => {
        });
  }
  const subHeaderComponentMemo = React.useMemo(() => {
    return (
        <>
            {/*<Fragment>
                <button className="btn btn-success m-2 btn-sm" onClick={dataTableDownload}>
                    Dorwnload As Excel
                </button>
            </Fragment>*/}
            <Fragment>
                <FilterComponent
                    onFilter={(e) => setFilterText(e.target.value)}
                    filterText={filterText}
                />
            </Fragment>
        </>
    );
  }, [filterText]);   
  

  const getDatas = () => {
    var token = localStorage.getItem("token");

    axios
      .post(
        DATA_TABLE_URL,
        { id: props.cr_retail_limit_info_id, status: props.row_status },
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

    setIsLoading(false);
  };

  const handleDpidChange = (ids) => {
    setDpids(ids);
  };

  useEffect(() => {
    getDatas();
  }, [page, dpids]);

  return isLoading ? (
    <div>
      <div style={{ textAlign: "center" }}>
        <Loader type="Rings" color="#00BFFF" height={100} width={100} />
      </div>
    </div>
  ) : (
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
  );
}

export default Comparison;
