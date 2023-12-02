import React, { useState } from "react";

import Datatable from "../common/datatable";
import { Link } from "react-router-dom";

import ModalForm from "./../common/modalForm";
import CreditDisburseRequest from "../credit/CreditDisburseRequest";
import Details from "./Details";
function Disbursement(props) {
  const [modal, setModal] = useState(false);

  const toggle = () => setModal(!modal);
  const data = {
    columns: [
      {
        label: "ID",
        field: "id",
      },
      {
        label: "Account Number",
        field: "acc_no",
      },
      {
        label: "Details",
        field: "details",
      },
    ],
    rows: [
      {
        id: 1,
        acc_no: 125,
        details: (
          <Link
            className="btn btn-sm btn-clean btn-icon"
            title="Preview"
            onClick={handleDetails}
          >
            <i className="la la-desktop"></i>
          </Link>
        ),
      },
    ],
  };
  function handleDetails() {
    toggle();
  }
  return (
    <div>
      <Datatable data={data} />
      <ModalForm
        modal={modal}
        toggle={toggle}
        size="xl"
        btnName="Ok"
        handleClick={toggle}
      >
        <Details id={3} />
      </ModalForm>
    </div>
  );
}

export default Disbursement;
