import React, { useState, useEffect, Fragment } from "react";
import Loader from "react-loader-spinner";
import {getUserType} from "../../../services/authService";
import { Link } from "react-router-dom";
import { useAlert } from "react-alert";
import dateFormat from "dateformat";
import http from "../../../services/httpService";
/* import { ToastContainer, toast } from "react-toastify"; */
import Datatable from "../../common/datatable";
import DropdownMenuGroup from "../../helper/top_dropdown";
import { baseURL } from "../../../constants/constants";

import { getConfirmedLimitLists } from "../../../services/confirmedLimitsService";

var columns;
    if (getUserType() == 'fi') {
        columns = [
            {
                label: "Point Name",
                field: "point_name",
            },
            {
                label: "Outlet Code",
                field: "outlet_code",
            },
            {
                label: "Outlet Name",
                field: "outlet_name",
            },
            {
                label: "Owner Name",
                field: "owner_name",
            },
            {
                label: "Phone",
                field: "phone",
            },
            {
                label: "Address",
                field: "address",
            },
            {
                label: "Credit Amount",
                field: "credit_amount",
            },
            {
                label: "Account No.",
                field: "acc_no",
            },
            {
                label: "Bank name",
                field: "fi_name",
            },
            {
                label: "Effective Date",
                field: "effective_date",
            },
            {
                label: "End Date",
                field: "end_date",
            },

            // {
            //   label: "Actions",
            //   field: "actions",
            //   sort: "disabled",
            // },
        ];
}
else{
    columns = [
    {
        label: "Point Name",
        field: "point_name",
    },
    {
        label: "Outlet Code",
        field: "outlet_code",
    },
    {
        label: "Outlet Name",
        field: "outlet_name",
    },
    {
        label: "Owner Name",
        field: "owner_name",
    },
    {
        label: "Phone",
        field: "phone",
    },
    {
        label: "Address",
        field: "address",
    },
    {
        label: "Credit Amount",
        field: "credit_amount",
    },
    {
        label: "Allowed Limit",
        field: "allowed_limit",
    },
    {
        label: "Daily Limit",
        field: "daily_limit",
    },
    {
        label: "Account No.",
        field: "acc_no",
    },
    {
        label: "Bank name",
        field: "fi_name",
    },
    {
        label: "Effective Date",
        field: "effective_date",
    },
    {
        label: "End Date",
        field: "end_date",
    },

    // {
    //   label: "Actions",
    //   field: "actions",
    //   sort: "disabled",
    // },
    ];
}
//const year = new Date().getFullYear();
const initState = {
  date_from: `${new Date().getFullYear()}-01-01`,
  date_to: `${new Date().getFullYear()}-12-31`,
};
function ConfirmedLimits(props) {
  const [value, setValue] = useState(initState);
  const toast = useAlert();
  const [dpids, setDpids] = useState([]);
  const [onSearch, setOnSearch] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const [confirmedLimitsList, setConfirmedLimitsList] = useState({
    columns: [...columns],
    rows: [],
  });
  const addButton = (rowData) => {
    const rows = rowData.map((row) => {
      row.actions = (
        <Fragment>
          <Link
            className="btn btn-sm btn-clean btn-icon"
            onClick={() => handleEdit(row)}
            data-toggle="tooltip"
            data-placement="bottom"
            title="edit"
          >
            <i className="la la-edit"></i>
          </Link>
        </Fragment>
      );
      row.effective_date = dateFormat(row.effective_date, "dd-mmm-yyyy");
      row.end_date = dateFormat(row.end, "dd-mmm-yyyy");
      return row;
    });
    return rows;
  };

  const validation = () => {
    if (!value.date_from || !value.date_to) {
      toast.error("Date Field can't be empty");
      return false;
    }
    return true;
  };
  const handleEdit = () => {};
  const handleChange = (name, value) => {
    setValue((prevState) => {
      return { ...prevState, [name]: value };
    });
  };
  const handleDpidChange = (ids) => {
    setDpids(ids);
  };
  const handleSearch = () => {
    // setOnSearch(true);
    confirmedLimitList();

    /* setTimeout(() => setIsLoading(false), 2000); */
  };
  async function confirmedLimitList() {
    try {
      if (dpids.length > 0) {
        const { date_from, date_to } = value;
        const requestObject = {
          id_point: dpids,
          date_from,
          date_to,
        };
        const data = await getConfirmedLimitLists(requestObject);
        const rows = addButton(data);
        setConfirmedLimitsList((prevState) => {
          return { ...prevState, ["rows"]: rows };
        });
        setIsLoading(false);
      }
    } catch (error) {
      setIsLoading(false);
    }
  }

  async function confirmedLimitListDownload(){
      try {
        const { date_from, date_to } = value;
        const requestObject = {
            id_point: dpids,
            date_from,
            date_to,
            usertype:getUserType()
        };
        setIsLoading(true);
        const { data } = await http.post(baseURL + "limit-confirmed-credits-download", requestObject);

        window.open(data?.data, '_blank', 'noopener,noreferrer')
        setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    //const now = new Date()
    /*  const year = new Date().getFullYear();
    setValue({ ["date_from"]: `${year}-01-01`, ["date_to"]: `${year}-12-31` }); */
    confirmedLimitList();
  }, [dpids]);
  return (
    <div className="card container dash-tabs m-5" style={{ minHeight: "78vh" }}>
      {/* <ToastContainer /> */}
      <br />
      <h2 className="d-flex justify-content">Confirmed Credit Limit</h2>
      <br />
      <DropdownMenuGroup onDpidChange={handleDpidChange} isSearch={false} />
      <div className="row d-flex justify-content-center py-5">
        <div className="input-group ">
          <span className="input-group-text ml-10">From</span>
          <input
            type="date"
            className="form-control form-control-md form-control-solid"
            value={value.date_from}
            onChange={(e) => handleChange("date_from", e.target.value)}
          />
          <span className="input-group-text ml-5">To</span>
          <input
            type="date"
            className="form-control  form-control-md form-control-solid"
            value={value.date_to}
            onChange={(e) => handleChange("date_to", e.target.value)}
          />
          <button
            className="btn btn-primary mr-2 ml-10"
            onClick={handleSearch}
          >
            {" "}
            Search
          </button>
          <button
            id="dl_excel"
            title="Download as Excel"
            className="btn btn-success mr-5"
            onClick={() =>confirmedLimitListDownload()}
            ><i className="la la-file-excel icon-xl"></i>
          </button>
        </div>
      </div>

      {isLoading ? (
        <div>
          <div style={{ textAlign: "center" }}>
            <Loader type="Rings" color="#00BFFF" height={100} width={100} />
          </div>
        </div>
      ) : (
        <Datatable data={confirmedLimitsList} />
      )}
    </div>
  );
}

export default ConfirmedLimits;
