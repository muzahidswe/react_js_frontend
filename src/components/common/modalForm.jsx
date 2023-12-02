import React from "react";
import { useState, useEffect } from "react";
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
function ModalForm(props) {
  const [modalForm] = useState(props.form);

  const handleClick = () => {
    if (props.handleClick) {
      //  alert("clickd modal form");
      props.handleClick();
    }
  };
  return (
    <div>
      <Modal
        zIndex={9999}
        isOpen={props.modal}
        toggle={props.toggle}
        className={`modal-dialog modal-dialog-scrollable modal-dialog-centered modal-${props.size} `}
        style={{ zIndex: 9999 }}
      >
        <ModalHeader className="modal-header">
          <h2 className="modal-title">{props.modalTitle}</h2>
        </ModalHeader>
        <ModalBody>{props.children}</ModalBody>
        <ModalFooter>
          <Button
            color="primary"
            onClick={handleClick}
            form={modalForm}
            type="submit"
          >
            {props.btnName}
          </Button>{" "}
          {props.noCancelBtn ? <></> : (<Button color="secondary" onClick={props.toggle}>
            Cancel
          </Button>)}
          
        </ModalFooter>
      </Modal>
    </div>
  );
}

export default ModalForm;

export function ModalFormApproveReject(props) {
  const [modalForm] = useState(props.form);

  const handleReject = () => {
    if (props.handleReject) {
      //  alert("clickd modal form");
      props.handleReject();
    }
  };

  const handleApprove = ()=>{
    if (props.handleApprove) {
      //  alert("clickd modal form");
      props.handleApprove();
    }
  }
  return (
    <div>
      <Modal
        isOpen={props.modal}
        toggle={props.toggle}
        className={`modal-dialog modal-dialog-scrollable modal-dialog-centered modal-${props.size} `}
        style={{ zIndex: 9999 }}
      >
        <ModalHeader className="modal-header">
        <h2 className="modal-title">{props.modalTitle}</h2>        
        </ModalHeader>
        <ModalBody className="form-control m-2" style={{"height":"12%", "overflow":"hidden", "width":"98%"}}>
            <div className="row">
                <div className="col-6 row">
                    <label className="col-4 font-weight-bolder form-label">Outlet name:</label>
                    <label className="col-6 form-label">{props.currentHouseRow.outlet_name}</label>
                </div>
                <div className="col-6 row">
                    <label className="col-4 font-weight-bolder form-label">Outlet Code:</label>
                    <label className="col-6 form-label">{props.currentHouseRow.outlet_code}</label>
                </div>
            </div>
        </ModalBody>
        <ModalBody>{props.children}</ModalBody>
        <ModalFooter>
          <Button
            color="danger"
            disabled={!props.rejectButtonAvailable}
            onClick={handleReject}
            form={modalForm}
            type="submit"
          >
            {props.rejectButton}
          </Button>{" "}
          <Button
            color="primary"
            disabled={!props.approveButtonAvailable}
            onClick={handleApprove}
            form={modalForm}
            type="submit"
          >
            {props.approveButton}
          </Button> {" "}
          <Button color="secondary" onClick={()=>{
         //   props.toggle();
            props.handleCancel();
          }}>
            Cancel
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  );
}

