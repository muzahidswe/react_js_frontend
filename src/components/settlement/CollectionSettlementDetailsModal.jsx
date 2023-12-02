import React, { useState, useEffect, Fragment } from "react";
import Loader from "react-loader-spinner";
import { useAlert } from "react-alert";
import dateFormat from "dateformat";

import Datatable from "../common/datatable";
import { getTransactionDisbursementDetails } from "../../services/disbursement";
import { getCollectionSettlementDetails } from "../../services/settlement";

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
};
function CollectionSettlementDetailsModal(props) {
  const [isLoading, setIsLoading] = useState(false);
  const [totalAmount, setTotalAmount] = useState("");
  const [tableData, setTableData] = useState({
    columns: [...columns],
    rows: [],
  });

  async function collectionSettlementDetails(id) {
    try {
      const { list, total_amount } = await getCollectionSettlementDetails({
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
    collectionSettlementDetails(props.id);
  }, []);

  return (
    <div className="card p-5" style={{ minHeight: "78vh" }}>
      <br />
      <h2 className="d-flex justify-content-center">
        Outlet List
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
          {/*  <div>
            <span>
              <strong>Total Amount: </strong>
              {totalAmount}
            </span>
          </div> */}
          <Datatable data={tableData} topSearch={true} />
        </Fragment>
      )}
    </div>
  );
}

export default CollectionSettlementDetailsModal;
