import { Button, Form, Input, message } from "antd";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import categoryApi from "../../../api/categoryApi";
import UploadFormItem from "../../../components/UploadFormItem/UploadFormItem";
import { ROUTE_PATH } from "../../../constants/routes";
import uploadImage from "../../../utils/uploadImage";

const AddCategory = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onSubmit = async ({ image, ...rest }) => {
    setLoading(true);
    try {
      const imageUrl = await uploadImage(image.file.originFileObj);
      await categoryApi.addCategory({ ...rest, image: imageUrl });

      message.success("Thêm danh mục SP thành công");
      navigate(ROUTE_PATH.CATEGORY_MANAGEMENT);
    } catch (error) {
      message.error("Failed to submit");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <h1 className="font-semibold text-2xl mb-3">Add Category</h1>

      <Form layout="vertical" onFinish={onSubmit}>
        <Form.Item
          name="name"
          label="Category Name"
          rules={[
            {
              required: true,
              message: "Please enter the category name",
            },
          ]}
        >
          <Input placeholder="Enter category name" />
        </Form.Item>

        <Form.Item
          label="Category Image"
          name="image"
          rules={[
            {
              required: true,
              message: "Please select a category image",
            },
          ]}
        >
          <UploadFormItem />
        </Form.Item>

        <Button
          className="mt-2"
          type="primary"
          htmlType="submit"
          loading={loading}
          disabled={loading}
        >
          Add Category
        </Button>
      </Form>
    </>
  );
};

export default AddCategory;
