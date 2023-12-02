import React, { useState, useEffect, Fragment } from "react";
import Loader from "react-loader-spinner";
import { useAlert } from "react-alert";
import dateFormat from "dateformat";
import DropdownMenuGroup from "../helper/top_dropdown";
import Datatable from "./../common/datatable";
import {
  getCreditLimitDisbursement,
  postCreditLimitDisbursement,
} from "../../services/creditDisburseRequest";
import { getDhId, getUserId, getDhIdBasedOnFi } from "../../services/authService";
import { useSelector } from "react-redux";

const columns = [
  {
    label: "Outlet Code",
    field: "retailer_code",
  },
  {
    label: "Account Number",
    field: "acc_no",
  },
  {
    label: "Owner Name",
    field: "owner",
  },
  {
    label: "Outlet Name",
    field: "name",
  },
  {
    label: "Date",
    field: "sys_date",
  },

  {
    label: "Credit Amount",
    field: "credit_amount",
  },
];

const initState = {
  date: dateFormat(new Date(), "yyyy-mm-dd"),
};
function CreditDisburseRequest(props) {
  const {selected_fi} = useSelector(state => state.fi);

  const [value, setValue] = useState(initState);
  const toast = useAlert();
  const [dpids, setDpids] = useState([]);
  const [dhIds, setDhids] = useState([]);
  const [onSearch, setOnSearch] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentUser, setCurrentUser] = useState("");
  const [totalAmount, setTotalAmount] = useState("");
  const [tableDataCopy, setTableDataCopy] = useState([]);
  const [tableData, setTableData] = useState({
    columns: [...columns],
    rows: [],
  });

  const handleChange = (name, value) => {
    setValue((prevState) => {
      return { ...prevState, [name]: value };
    });
  };

  const handleSearch = async () => {
    let date;
    if (value.date) {
      date = dateFormat(value.date, "yyyy-mm-dd");
    } else {
      date = dateFormat(new Date(), "yyyy-mm-dd");
    }
    await creditLimitDisburseList(dhIds, date);
  };

  const handleOnSearch = async (e) => {
    const search_param = e.target.value;
    if (search_param.length >= 4) {
      // alert(search_param);
      let date;
      if (value.date) {
        date = dateFormat(value.date, "yyyy-mm-dd");
      } else {
        date = dateFormat(new Date(), "yyyy-mm-dd");
      }
      //alert(search_param);
      await creditLimitDisburseList(dhIds, date, search_param);
      //alert(search_param);
    } else {
      setTableData((prevState) => ({ ...prevState, ["rows"]: tableDataCopy }));
    }
  };

  const handleSubmit = async () => {
    let date;
    if (value.date) {
      date = dateFormat(value.date, "yyyy-mm-dd");
    } else {
      date = dateFormat(new Date(), "yyyy-mm-dd");
    }
    const requestObject = {
      date,
      user_id: getUserId(),
      dh_id: getDhId(),
    };
    // alert(JSON.stringify(requestObject));
    const status = await postCreditLimitDisbursement(requestObject);
    toast.info(status);
  };

  async function creditLimitDisburseList(dh_id, date, search_param = "") {
    try {
      // setIsLoading(true);
      const requObj = {
        dh_id,
        date,
        search_param,
      };

      const { list, total_amount } = await getCreditLimitDisbursement(requObj);
      // setTableData(list)
      setTotalAmount(total_amount);
      if (Array.isArray(list)) {
        setTableData((prevState) => ({ ...prevState, ["rows"]: list }));
        if (!tableDataCopy.length) setTableDataCopy([...list]);
      } else setTableData((prevState) => ({ ...prevState, ["rows"]: [] }));
      //setIsLoading(false);
    } catch (error) {
      console.log(error);
    }
  }
  useEffect(async () => {
    const date = dateFormat(new Date(), "yyyy-mm-dd");
    if (selected_fi) {
      let dh_id = await getDhIdBasedOnFi(selected_fi);
      if (dh_id.length > 0) {
        setDhids(dh_id);
        creditLimitDisburseList(dh_id, date);
      }
    }
  }, [selected_fi]);

  return (
    <div className="card m-5 p-5" style={{ minHeight: "78vh" }}>
      {/* <br /> */}
      <div className="row">
        <div className="col-7">
          <h2 className="d-flex justify-content">
            Send Credit Disbursement Info To FI
          </h2>
        </div>

        <div className="input-group col-5 ">
          <span className="input-group-text ml-5">Date</span>
          <input
            type="date"
            className="form-control  form-control-md form-control-solid "
            value={value.date || ""}
            onChange={(e) => handleChange("date", e.target.value)}
          />
          <button
            className="btn btn-primary mr-10 ml-10"
            onClick={handleSearch}
          >
            {" "}
            Search
          </button>
          <div className="row d-flex justify-content-center">
            <button className="btn btn-success btn-md mr-10" onClick={handleSubmit}>
              Submit
            </button>
          </div>
        </div>
        
        <div className="col-7">&nbsp;</div>

      
        <div className="col-7">
          <b>
            <h3>
              <strong>Total Amount: </strong>
              {totalAmount}
            </h3>
          </b>
        </div>
        
      </div>

      {isLoading ? (
        <div>
          <div style={{ textAlign: "center" }}>
            <Loader type="Rings" color="#00BFFF" height={100} width={100} />
          </div>
        </div>
      ) : (
        <Fragment>
          <div className="d-flex justify-content-end ml-auto">
            <input
              className="form-control"
              type="text"
              placeholder="search here..."
              onChange={handleOnSearch}
            />
          </div>
          <Datatable data={tableData} topSearch={false} />
          
        </Fragment>
      )}
    </div>
  );
}

export default CreditDisburseRequest;
