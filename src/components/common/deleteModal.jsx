import React from "react";
import ModalForm from "./modalForm";
function DeleteModal(props) {
  //const [defaultValue, setDefaultValue] = useState(props.defaultValue);
  //const [data, setData] = useState(props.data);
  const handleClick = () => {
    //console.log("click from delete assignmnet");
    if (props.handleClick) {
      props.handleClick();
    }
  };
  /*  const handleChange = (name, value) => {
    if (props.handleChange) {
      props.handleChange(name, value);
    }
  }; */
  /*  useEffect(() => {
    setData(props.data);
  }, [props.data]); */

  /*   useEffect(() => {
    setDefaultValue(props.defaultValue);
  }, [props.defaultValue]); */
  return (
    <ModalForm
      modalTitle={props.modalTitle}
      toggle={props.toggle}
      modal={props.modal}
      btnName="Delete"
      handleClick={handleClick}
      size="md"
    >
      <div>Are you sure you want to delete this?</div>
    </ModalForm>
  );
}

export default DeleteModal;
