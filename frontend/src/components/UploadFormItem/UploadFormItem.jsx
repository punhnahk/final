import { UploadOutlined } from "@ant-design/icons";
import { Button, Upload } from "antd";
import classNames from "classnames";
import React from "react";
import { FaRegTrashAlt } from "react-icons/fa";

const UploadFormItem = ({ value, onChange, previewClassName, uploadTxt }) => {
  const onFileChange = ({ file }) => {
    onChange({
      file,
      previewUrl: URL.createObjectURL(file.originFileObj),
    });
  };

  return (
    <>
      <Upload
        accept="image/*"
        fileList={[]}
        customRequest={() => 0}
        onChange={onFileChange}
      >
        {!value && (
          <Button icon={<UploadOutlined />}>{uploadTxt || "Upload"}</Button>
        )}
      </Upload>

      {value && (
        <div
          className={classNames("relative w-36 h-36 group", previewClassName)}
        >
          <FaRegTrashAlt
            onClick={() => onChange()}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 cursor-pointer text-red-500 text-xl opacity-0 group-hover:opacity-100 transition-all duration-300"
          />

          <div className="w-full h-full absolute bg-[rgba(0,0,0,0.25)] z-[1] top-0 right-0 bottom-0 left-0 transition-all opacity-0 group-hover:opacity-100 duration-300"></div>

          <img
            src={value.previewUrl}
            alt="Preview"
            className="w-full h-full object-cover rounded absolute top-0 right-0 bottom-0 left-0"
          />
        </div>
      )}
    </>
  );
};

export default UploadFormItem;
