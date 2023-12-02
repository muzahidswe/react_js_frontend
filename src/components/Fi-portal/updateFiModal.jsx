import React from "react";
import { useState } from "react";
import { useEffect } from "react";

import ModalForm from "../common/modalForm";

import FiInformationForm from "../Fi-portal/fiInformationForm";
import FiInformationUpdateForm from "../Fi-portal/fiInformationUpdateForm";

function UpdateFiModal(props) {
  const [defaultValue, setDefaultValue] = useState(props.defaultValue);
  const handleUpdate = () => {
    if (props.handleUpdate) {
      props.handleUpdate();
    }
  };
  const handleChange = (name, value) => {
    if (props.handleChange) {
      props.handleChange(name, value);
    }
  };

  useEffect(() => {
    setDefaultValue(props.defaultValue);
  }, [props.defaultValue]);
  return (
    <ModalForm
      modalTitle={props.modalTitle}
      form="fi-information-update-form"
      toggle={props.toggle}
      modal={props.modal}
      btnName={props.btnName}
      handleClick={props.toggle}
      size="md"
    >
      <FiInformationUpdateForm
        onSubmit={handleUpdate}
        onChange={handleChange}
        defaultValue={defaultValue}
      />
    </ModalForm>
  );
}

export default UpdateFiModal;
