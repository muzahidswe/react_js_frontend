import React, { useState, useEffect, Fragment } from "react";
import Loader from "react-loader-spinner";
import { useAlert } from "react-alert";
import DropdownMenuGroup from "../helper/top_dropdown";
import Datatable from "./../common/datatable";
const columns = [
  {
    label: "Outlet Code",
    field: "outlet_code",
  },
  {
    label: "Account Number",
    field: "account_number",
  },
  {
    label: "Owner Name",
    field: "owner_name",
  },
  {
    label: "Outlet Name",
    field: "outlet_name",
  },

  {
    label: "Credit Amount",
    field: "credit_amount",
  },

  /* {
    label: "Actions",
    field: "actions",
    sort: "disabled",
  }, */
];

const initState = {
  date: "",
};

function SettlementConfirmation(props) {
  const [value, setValue] = useState(initState);
  const toast = useAlert();
  const [dpids, setDpids] = useState(localStorage.getItem("dpids").split(","));
  const [onSearch, setOnSearch] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [tableData, setTableData] = useState({
    columns: [...columns],
    rows: [],
  });

  const handleChange = (name, value) => {
    setValue((prevState) => {
      return { ...prevState, [name]: value };
    });
  };

  const handleSearch = () => {
    setOnSearch(true);
    //confirmedLimitList();

    /* setTimeout(() => setIsLoading(false), 2000); */
  };
  return (
    <div className="card " style={{ minHeight: "78vh" }}>
      s
      <br />
      <h2 className="d-flex justify-content-center">Settlement Confirmation</h2>
      <br />
      <div className="row">
        <div className="col-7" />
        <div className="input-group py-5 col-5 ">
          <span className="input-group-text ml-5"> Date</span>
          <input
            type="date"
            className="form-control  form-control-md form-control-solid "
            value={value.date}
            onChange={(e) => handleChange("date", e.target.value)}
          />
          <button
            className="btn btn-primary mr-20 ml-10"
            onClick={handleSearch}
          >
            {" "}
            Search
          </button>
        </div>
      </div>
      {onSearch &&
        (isLoading ? (
          <div>
            <div style={{ textAlign: "center" }}>
              <Loader type="Rings" color="#00BFFF" height={100} width={100} />
            </div>
          </div>
        ) : (
          <Fragment>
            <Datatable data={tableData} />
            <div className="row d-flex justify-content-center">
              <button
                className="btn btn-success btn-md"
                onClick={() => alert("alert")}
              >
                Confirm
              </button>
            </div>
          </Fragment>
        ))}
    </div>
  );
}

export default SettlementConfirmation;
