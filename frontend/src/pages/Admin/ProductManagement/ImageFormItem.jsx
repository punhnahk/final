import { UploadOutlined } from "@ant-design/icons";
import { Button, Upload } from "antd";
import React from "react";
import { FaRegTrashAlt } from "react-icons/fa";

const ImageFormItem = ({ value = [], onChange }) => {
  const onFileChange = ({ fileList }) => {
    const newFileList = fileList.map((it) => {
      return {
        file: it,
        previewUrl: URL.createObjectURL(it.originFileObj),
      };
    });

    onChange([...value, ...newFileList]);
  };

  const onRemove = (idx) => {
    const fileList = [...value];
    fileList.splice(idx, 1);
    onChange(fileList);
  };

  return (
    <>
      <Upload
        accept="image/*"
        fileList={[]}
        customRequest={() => 0}
        multiple
        onChange={onFileChange}
      >
        <Button icon={<UploadOutlined />}>Upload</Button>
      </Upload>

      {value.length > 0 && (
        <div className="mt-4 flex gap-2 overflow-x-auto">
          {value.map((it, idx) => (
            <div
              key={`preview-image-${idx}`}
              className="relative w-36 h-36 group flex-shrink-0"
            >
              <FaRegTrashAlt
                onClick={() => onRemove(idx)}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 cursor-pointer text-red-500 text-xl opacity-0 group-hover:opacity-100 transition-all duration-300"
              />

              <div className="w-full h-full absolute bg-[rgba(0,0,0,0.25)] z-[1] top-0 right-0 bottom-0 left-0 transition-all opacity-0 group-hover:opacity-100 duration-300"></div>

              <img
                src={it.previewUrl}
                alt="Preview"
                className="w-full h-full object-cover rounded absolute top-0 right-0 bottom-0 left-0"
              />
            </div>
          ))}
        </div>
      )}
    </>
  );
};

export default ImageFormItem;
