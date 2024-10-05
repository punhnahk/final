import { Button, Form, Input, message, Select } from "antd";
import React, { useCallback, useEffect, useState } from "react";
import UploadFormItem from "../../../components/UploadFormItem/UploadFormItem";
import uploadImage from "../../../utils/uploadImage";
import { useNavigate, useParams } from "react-router-dom";
import { ROUTE_PATH } from "../../../constants/routes";
import SunEditorFormItem from "../../../components/SunEditorFormItem/SunEditorFormItem";
import TextArea from "antd/es/input/TextArea";
import newsCategoryApi from "../../../api/newsCategoryApi";
import newsApi from "../../../api/newsApi";

const EditNews = () => {
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);

  const navigate = useNavigate();

  const params = useParams();
  const newsId = params.id;

  const [form] = Form.useForm();

  const fetchData = useCallback(
    async (newsId) => {
      try {
        const { data } = await newsApi.getNews(newsId);
        form.setFieldsValue({
          title: data.title,
          category: data.category._id,
          description: data.description,
          content: data.content,
          image: {
            previewUrl: data.thumbnail,
          },
        });
      } catch (error) {
        message.error("Failed to fetch news");
      }
    },
    [form]
  );

  const fetchCategories = async () => {
    try {
      const res = await newsCategoryApi.getCategories();
      setCategories(res.data);
    } catch (error) {
      message.error("Failed to fetch categories");
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    newsId && fetchData(newsId);
  }, [newsId, fetchData]);

  const onSubmit = async ({ image, ...rest }) => {
    setLoading(true);
    try {
      const payload = {
        ...rest,
      };

      if (image?.file) {
        const imageUrl = await uploadImage(image.file.originFileObj);
        payload.thumbnail = imageUrl;
      }
      await newsApi.updateNews({ id: newsId, ...payload });

      message.success("News updated successfully");
      navigate(ROUTE_PATH.NEWS_MANAGEMENT);
    } catch (error) {
      message.error("Failed to submit");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <h1 className="font-semibold text-2xl mb-3">Edit News</h1>

      <Form form={form} layout="vertical" onFinish={onSubmit}>
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

        <Form.Item label="Cover Image" name="image">
          <UploadFormItem />
        </Form.Item>

        <Button
          className="mt-2"
          type="primary"
          htmlType="submit"
          loading={loading}
          disabled={loading}
        >
          Update News
        </Button>
      </Form>
    </>
  );
};

export default EditNews;
