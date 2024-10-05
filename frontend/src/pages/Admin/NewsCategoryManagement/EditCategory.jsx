import { Button, Form, Input, message } from "antd";
import React, { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import newsCategoryApi from "../../../api/newsCategoryApi";
import { ROUTE_PATH } from "../../../constants/routes";

const EditNewsCategory = () => {
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const params = useParams();
  const categoryId = params.id;

  const [form] = Form.useForm();

  const fetchData = useCallback(
    async (categoryId) => {
      try {
        const { data } = await newsCategoryApi.getCategory(categoryId);
        form.setFieldsValue({
          name: data.name,
        });
      } catch (error) {
        message.error("Failed to fetch", error);
      }
    },
    [form]
  );

  useEffect(() => {
    categoryId && fetchData(categoryId);
  }, [categoryId, fetchData]);

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      await newsCategoryApi.updateCategory({ id: categoryId, ...data });

      message.success("News category updated successfully");
      navigate(ROUTE_PATH.NEWS_CATEGORY_MANAGEMENT);
    } catch (error) {
      message.error("Failed to submit");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <h1 className="font-semibold text-2xl mb-3">Edit News Category</h1>

      <Form layout="vertical" form={form} onFinish={onSubmit}>
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
          Update Category
        </Button>
      </Form>
    </>
  );
};

export default EditNewsCategory;
