import { Button, Form, Input, message } from "antd";
import React, { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import categoryApi from "../../../api/categoryApi";
import UploadFormItem from "../../../components/UploadFormItem/UploadFormItem";
import { ROUTE_PATH } from "../../../constants/routes";
import uploadImage from "../../../utils/uploadImage";

const EditCategory = () => {
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const params = useParams();
  const categoryId = params.id;

  const [form] = Form.useForm();

  const fetchData = useCallback(
    async (categoryId) => {
      try {
        const { data } = await categoryApi.getCategory(categoryId);
        form.setFieldsValue({
          name: data.name,
          image: {
            previewUrl: data.image,
          },
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

  const onSubmit = async ({ image, ...rest }) => {
    setLoading(true);
    try {
      const payload = {
        ...rest,
      };

      if (image?.file) {
        const imageUrl = await uploadImage(image.file.originFileObj);
        payload.image = imageUrl;
      }
      await categoryApi.updateCategory({ id: categoryId, ...payload });

      message.success("Successfully updated product category");
      navigate(ROUTE_PATH.CATEGORY_MANAGEMENT);
    } catch (error) {
      message.error("Failed to submit");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <h1 className="font-semibold text-2xl mb-3">Edit Category</h1>

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

        <Form.Item label="Category Image" name="image">
          <UploadFormItem />
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

export default EditCategory;
