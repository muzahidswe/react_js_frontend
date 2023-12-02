import React from "react";
import ModalForm from "./modalForm";
function ConfirmationModal(props) {
  const handleClick = () => {
    if (props.handleClick) {
      props.handleClick();
    }
  };

  return (
    <ModalForm
      modalTitle={props.modalTitle}
      toggle={props.toggle}
      modal={props.modal}
      btnName={props.btnName}
      handleClick={handleClick}
      size="md"
    >
    {(typeof props.type !== 'undefined' && props.type == 'reject') ? (<>
        <label className="form-label font-weight-bolder">Rejection Reason</label>
        <div className="input-group mb-4">
            <textarea
                placeholder="Type Rejection Reason here"
                type="text"
                className={`form-control`}
                id="rejection_reason"
                name="note"
                rows={2}
                
            ></textarea>
        </div></>
    ) : <></>}
    
      <div>{props.msg}</div>
    </ModalForm>
  );
}

export default ConfirmationModal;
