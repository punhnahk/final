import React from "react";
import SunEditor from "suneditor-react";
import "suneditor/dist/css/suneditor.min.css";

const SunEditorFormItem = ({ placeholder, height, value, onChange }) => {
  const onValueChange = (val) => {
    if (val === "<p><br></p>") {
      onChange("");
    } else {
      onChange(val);
    }
  };

  return (
    <SunEditor
      placeholder={placeholder}
      height={height}
      setContents={value}
      onChange={onValueChange}
      setOptions={{
        buttonList: [
          ["undo", "redo"],
          ["font", "fontSize", "formatBlock"],
          ["paragraphStyle", "blockquote"],
          ["bold", "underline", "italic", "strike", "subscript", "superscript"],
          ["fontColor", "hiliteColor", "textStyle"],
          ["removeFormat"],
          ["outdent", "indent"],
          ["align", "horizontalRule", "list", "lineHeight"],
          ["table", "link", "image", "video", "audio"],
          ["fullScreen", "showBlocks", "codeView"],
          ["preview", "print"],
          ["save", "template"],
        ],
      }}
    />
  );
};

export default SunEditorFormItem;
