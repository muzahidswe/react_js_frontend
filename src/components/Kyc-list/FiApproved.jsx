import React, { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import { Card } from "react-bootstrap";
import axios from "axios";
import { baseURL } from "../../constants/constants";
import Loader from "react-loader-spinner";
import DropdownMenuGroup from "../helper/top_dropdown";
import styled from "styled-components";
const DATA_TABLE_URL = baseURL + "get-kye-fi-approved";
const DATA_TABLE_DOWNLOAD_URL = baseURL + "get-kye-fi-approved-download";

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

function FiApproved(props) {
  const columns = [
    {
      name: "Region",
      selector: "region",
      sortable: true,
    },
    {
      name: "Area",
      selector: "area",
      sortable: true,
    },
    {
      name: "House",
      selector: "house",
      sortable: true,
     wrap:false,
     grow:2
     
    },
    {
      name: "Territory",
      selector: "territory",
      sortable: true,
    },
    {
      name: "Point",
      selector: "point",
      sortable: true,
    },
    {
      name: "Outlet Code",
      selector: "outlet_code",
      sortable: true,
      grow:1.5
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
    },
    {
      name: "Phone",
      selector: "phone",
      sortable: true,
    },
    {
      name: "Address",
      selector: "address",
      sortable: true,
    },
    {
      name: "Last Updated",
      selector: "updated_at",
      sortable: true,
      grow: 3
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
  const [dpids, setDpids] = useState([]);

  const getDatas = () => {
    var token = localStorage.getItem("token");

    if (dpids.length > 0) {
      axios
        .post(
          DATA_TABLE_URL,
          { dpids, per_page: countPerPage, current_page: page },
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
        { dpids},
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
  }, [dpids, filterText]);
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
    <Card className="m-5">
      <Card.Header>
        <h3 className="card-title">Doc Uploaded FI</h3>
      </Card.Header>

      <Card.Body>
        <DropdownMenuGroup onDpidChange={handleDpidChange} isSearch={true} />
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
      </Card.Body>
    </Card>
  );
}

export default FiApproved;
