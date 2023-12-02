import React, { useState, useEffect } from "react";
import RichTextEditor from "react-rte";
function TextEditor(props) {
  const [inputName] = useState(props.name);
  const [label] = useState(props.label);
  const [value, setValue] = useState(
    RichTextEditor.createValueFromString(props.inputDefaultValue, "html")
  );

  const onChange = (value) => {
    setValue(value);
    if (props.onChange) {
      props.onChange(inputName, value.toString("html"));
    }
  };
  /*  useEffect(() => {
    setValue(
      RichTextEditor.createValueFromString(props.inputDefaultValue, "html")
    );
  }, [props.inputDefaultValue]); */
  return (
    <RichTextEditor
      className="new-post-editor"
      value={value}
      onChange={onChange}
    />
  );
}

export default TextEditor;
