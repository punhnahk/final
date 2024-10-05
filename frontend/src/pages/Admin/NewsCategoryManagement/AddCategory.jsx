import { Button, Form, Input, message } from "antd";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import newsCategoryApi from "../../../api/newsCategoryApi";
import { ROUTE_PATH } from "../../../constants/routes";

const AddNewsCategory = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      await newsCategoryApi.addCategory(data);

      message.success("News category added successfully");
      navigate(ROUTE_PATH.NEWS_CATEGORY_MANAGEMENT);
    } catch (error) {
      message.error("Failed to submit");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <h1 className="font-semibold text-2xl mb-3">Add News Category</h1>

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

export default AddNewsCategory;
