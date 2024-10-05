import { Button, Form, Input, message, Select } from "antd";
import TextArea from "antd/es/input/TextArea";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import newsApi from "../../../api/newsApi";
import newsCategoryApi from "../../../api/newsCategoryApi";
import SunEditorFormItem from "../../../components/SunEditorFormItem/SunEditorFormItem";
import UploadFormItem from "../../../components/UploadFormItem/UploadFormItem";
import { ROUTE_PATH } from "../../../constants/routes";
import uploadImage from "../../../utils/uploadImage";

const AddNews = () => {
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await newsCategoryApi.getCategories();
      setCategories(res.data);
    } catch (error) {
      message.error("Failed to fetch categories");
    }
  };

  const onSubmit = async ({ image, ...rest }) => {
    setLoading(true);
    try {
      const imageUrl = await uploadImage(image.file.originFileObj);
      await newsApi.addNews({ ...rest, thumbnail: imageUrl });

      message.success("News added successfully");
      navigate(ROUTE_PATH.NEWS_MANAGEMENT);
    } catch (error) {
      message.error("Failed to submit");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <h1 className="font-semibold text-2xl mb-3">Add News</h1>

      <Form layout="vertical" onFinish={onSubmit}>
        <Form.Item
          name="title"
          label="News Title"
          rules={[
            {
              required: true,
              message: "Please enter the news title",
            },
          ]}
        >
          <Input placeholder="Enter news title" />
        </Form.Item>

        <Form.Item
          name="category"
          label="News Category"
          rules={[
            {
              required: true,
              message: "Please select a news category",
            },
          ]}
        >
          <Select
            options={categories.map((it) => ({
              label: it.name,
              value: it._id,
            }))}
            placeholder="Select news category"
          />
        </Form.Item>

        <Form.Item
          name="description"
          label="Short Description"
          rules={[
            {
              required: true,
              message: "Please enter a short description",
            },
          ]}
        >
          <TextArea placeholder="Enter short description" rows={4} />
        </Form.Item>

        <Form.Item
          name="content"
          label="Content"
          rules={[
            {
              required: true,
              message: "Please enter the content",
            },
          ]}
        >
          <SunEditorFormItem placeholder="Enter news content" height={400} />
        </Form.Item>

        <Form.Item
          label="Cover Image"
          name="image"
          rules={[
            {
              required: true,
              message: "Please upload a cover image",
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
          Add News
        </Button>
      </Form>
    </>
  );
};

export default AddNews;
