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
function CreditDisburse(props) {
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

  const handleDpidChange = (ids) => {
    setDpids(ids);
  };

  const handleSearch = () => {
    setOnSearch(true);
    //confirmedLimitList();

    /* setTimeout(() => setIsLoading(false), 2000); */
  };
  return (
    <div className="card " style={{ minHeight: "78vh" }}>
      <br />
      <h2 className="d-flex justify-content-center">Credit Disburse</h2>
      <br />
      <DropdownMenuGroup onDpidChange={handleDpidChange} isSearch={false} />
      <div className="row">
        <div className="col-7" />
        <div className="input-group py-5 col-5 ">
          <span className="input-group-text ml-5">Deposite Date</span>
          <input
            type="date"
            className="form-control  form-control-md form-control-solid "
            value={value.to_date}
            onChange={(e) => handleChange("deposite_date", e.target.value)}
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
            <div className="row input-group d-flex justify-content-end">
              <div className="row px-2">
                <span className=" mr-5">Transaction ID</span>
                <input
                  type="number"
                  className="form"
                  value={value.transaction_id}
                  onChange={(e) =>
                    handleChange("transaction_id", e.target.value)
                  }
                />
              </div>
              <div className="row  px-2 mx-1">
                <span className="mr-3">Attachment</span>
                <input
                  type="file"
                  className="form  "
                  value={value.file}
                  onChange={(e) => handleChange("file", e.target.files[0])}
                />
              </div>
              <div className="row pr-4">
                <button
                  className="btn btn-success btn-sm"
                  onClick={handleSearch}
                >
                  Submit
                </button>
              </div>
            </div>
          </Fragment>
        ))}
    </div>
  );
}

export default CreditDisburse;
