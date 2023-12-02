import React from "react";
import { useState } from "react";

function Modal(props) {
  const [modalTitle] = useState(props.modalTitle);
  const [modalId] = useState(props.id);
  const [modalForm] = useState(props.form);
  const [close] = useState(props.closeModal);

  return (
    <div
      className="modal fade"
      id={modalId}
      tabIndex={-1}
      aria-labelledby="staticBackdrop"
      style={{ display: "none" }}
      aria-hidden="true"
    >
      <div
        className="modal-dialog modal-dialog-scrollable modal-dialog-centered modal-xl"
        role="document"
      >
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title" id="exampleModalLabel">
              {modalTitle}
            </h5>
            <button
              type="button"
              className="close"
              data-dismiss="modal"
              aria-label="Close"
            >
              <i aria-hidden="true" className="ki ki-close" />
            </button>
          </div>
          <div className="modal-body">
            <div
              data-scroll="true"
              data-height={600}
              className="scroll ps"
              style={{ height: 600, overflow: "hidden" }}
            >
              {props.children}
            </div>
          </div>
          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-light-primary font-weight-bold"
              data-dismiss="modal"
            >
              Cancel
            </button>
            <button
              form={modalForm}
              type="submit"
              className="btn btn-primary font-weight-bold"
              data-dismiss="modal"
            >
              Submit
            </button>
          </div>
        </div>
      </div>
    </div>
  );
  {
    /*end::Modal Content*/
  }
}

export default Modal;
