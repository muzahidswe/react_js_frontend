import React, { useState, useEffect, Fragment } from "react";
import Loader from "react-loader-spinner";
import { useAlert } from "react-alert";
import dateFormat from "dateformat";
import DropdownMenuGroup from "../helper/top_dropdown";
import DropdownGroup from "../common/TopDropdownTwo";
import Datatable from "./../common/datatable";
import {
  getCollectionSettlementListForDh,
  postCollectionSettlementRequestByDh,
} from "../../services/collectionSettlementRequest";
import { getDhId, getDhIdBasedOnFi, getUserId } from "../../services/authService";
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
    label: "Paid Amount",
    field: "paid_amount",
  },

  /* {
    label: "Actions",
    field: "actions",
    sort: "disabled",
  }, */
];

const initState = {
  date: dateFormat(new Date(), "yyyy-mm-dd"),
  transaction_id: "",
  image: "",
};

function CollectionSettlementRequest(props) {
  const {selected_fi} = useSelector(state => state.fi);

  const [value, setValue] = useState(initState);
  const toast = useAlert();
  const [dpids, setDpids] = useState([]);
  const [dhIds, setDhids] = useState([]);
  const [onSearch, setOnSearch] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [totalAmount, setTotalAmount] = useState(0);
  const [drowpDownValue, setDropdownValue] = useState();
  const [tableData, setTableData] = useState({
    columns: [...columns],
    rows: [],
  });

  const handleValidation = () => {
    if (value.transaction_id || value.image) {
      toast.error("Field can't be empty");
      return false;
    }
    return true;
  };

  const handleChange = (name, value) => {
    setValue((prevState) => {
      return { ...prevState, [name]: value };
    });
  };

  /*   const handleDropdownValueChange = (value) => {
    setDropdownValue(value);
  }; */

  const handleSubmit = async () => {
    let date;
    if (value.date) {
      date = dateFormat(value.date, "yyyy-mm-dd");
    } else {
      date = dateFormat(new Date(), "yyyy-mm-dd");
    }

    let formData = new FormData();
    formData.append("date", date);
    formData.append("user_id", getUserId());
    formData.append("dh_id", getDhId());
    formData.append("trasaction_number", value.transaction_id);
    formData.append("total_amount", totalAmount);
    formData.append("file", value.image);

    // alert(JSON.stringify(requestObject));
    const status = await postCollectionSettlementRequestByDh(formData);
    toast.info(status);
  };
  const handleSearch = async () => {
    let date;
    if (value.date) {
      date = dateFormat(value.date, "yyyy-mm-dd");
    } else {
      date = dateFormat(new Date(), "yyyy-mm-dd");
    }
    await collectionSettlementListForDh(dhIds, date);
  };

  async function collectionSettlementListForDh(dh_id, date) {
    try {
      setIsLoading(true);
      const requObj = {
        dh_id,
        date,
      };

      const { list, total_amount } = await getCollectionSettlementListForDh(
        requObj
      );
      setTotalAmount(total_amount ? total_amount : 0);
      if (Array.isArray(list)) {
        setTableData((prevState) => ({ ...prevState, ["rows"]: list }));
      } else setTableData((prevState) => ({ ...prevState, ["rows"]: [] }));
      setIsLoading(false);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(async () => {
    const date = dateFormat(new Date(), "yyyy-mm-dd");
    if (selected_fi) {
      let dh_id = await getDhIdBasedOnFi(selected_fi);
      if (dh_id.length > 0) {
        setDhids(dh_id)
        collectionSettlementListForDh(dh_id, date);
      }
    }
  }, [selected_fi]);
  return (
    <div className="card p-5 m-5" style={{ minHeight: "78vh" }}>
      <br />
      <h3 className="d-flex justify-content">
        Collection Settlement Request
      </h3>
      <br />
      {/*  <DropdownGroup onValueChange={handleDropdownValueChange} visible={true} /> */}
      <div className="row">
        <div className="col-3 mt-5 ml-2">
            <h4>
                <span className="">
                    <strong>Total Amount: </strong>
                    {totalAmount}
                </span>
            </h4>
        </div>
        <div className="col-5"/>
        <div className="input-group py-5 col-4 row p-1">
          <span className="input-group-text">Date</span>
          <input
            type="date"
            className="form-control"
            value={value.date}
            style={{"width":"50%"}}
            onChange={(e) => handleChange("date", e.target.value)}
          />
          <button className="btn btn-primary ml-2" onClick={handleSearch}>
            {" "}
            Search
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
        <Fragment>
          <Datatable data={tableData} topSearch={true} />
          <div className="row input-group d-flex justify-content-end form-control" style={{"height": "20%"}}>
            <div className="col-4">
              <strong className="">Transaction ID</strong>
              <input
                type="number"
                className="form-control"
                value={value.transaction_id}
                onChange={(e) => handleChange("transaction_id", e.target.value)}
              />
            </div>
            <div className="col-4">
              <strong className="">Attachment</strong>
              <input
                type="file"
                className="form-control"
                value={value.file}
                onChange={(e) => handleChange("image", e.target.files[0])}
              />
            </div>
            <div className="col-4 mt-6">
              <button className="btn btn-success btn-md" onClick={handleSubmit}>
                Submit
              </button>
            </div>
          </div>
        </Fragment>
      )}
    </div>
  );
}

export default CollectionSettlementRequest;
