import React, { useState, useEffect, Fragment } from "react";
import Loader from "react-loader-spinner";
import { useAlert } from "react-alert";
import dateFormat from "dateformat";

import Datatable from "./../common/datatable";
import { getTransactionDisbursementDetails } from "../../services/disbursement";

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
    label: "Phone",
    field: "phone",
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

  /* {
    label: "Actions",
    field: "actions",
    sort: "disabled",
  }, */
];

function FiDisbursmentModal(props) {
  const [isLoading, setIsLoading] = useState(false);
  const [totalAmount, setTotalAmount] = useState("");
  const [tableData, setTableData] = useState({
    columns: [...columns],
    rows: [],
  });

  async function transactionDisbursementDetails(id) {
    try {
      const { list, total_amount } = await getTransactionDisbursementDetails({
        id,
      });
      setTotalAmount(total_amount);
      if (Array.isArray(list)) {
        setTableData((prevState) => ({ ...prevState, ["rows"]: list }));
        // if (!tableDataCopy.length) setTableDataCopy([...list]);
      } else setTableData((prevState) => ({ ...prevState, ["rows"]: [] }));
    } catch (error) {
      console.log(error);
    }
  }
  useEffect(() => {
    transactionDisbursementDetails(props.id);
  }, []);

  return (
    <div className="card p-5" style={{ minHeight: "78vh" }}>
      <br />
      <h2 className="d-flex justify-content-center">
        Disbursement Details
      </h2>
      <br />

      {isLoading ? (
        <div>
          <div style={{ textAlign: "center" }}>
            <Loader type="Rings" color="#00BFFF" height={100} width={100} />
          </div>
        </div>
      ) : (
        <Fragment>
          <div className="row">
            <div className="col-3 mt-5 ml-2">
                <h4>
                    <span className="">
                        <strong>Total Amount: </strong>
                        {totalAmount}
                    </span>
                </h4>
            </div>
          </div>
          <Datatable data={tableData} topSearch={true} />
        </Fragment>
      )}
    </div>
  );
}

export default FiDisbursmentModal;
