import { Button, Form, Input, message } from "antd";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import sliderApi from "../../../api/sliderApi";
import UploadFormItem from "../../../components/UploadFormItem/UploadFormItem";
import { URL_REG } from "../../../constants/reg";
import { ROUTE_PATH } from "../../../constants/routes";
import uploadImage from "../../../utils/uploadImage";

const AddSlider = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onSubmit = async ({ image, ...rest }) => {
    setLoading(true);
    try {
      const imageUrl = await uploadImage(image.file.originFileObj);
      await sliderApi.addSlider({ ...rest, image: imageUrl });

      message.success("Slider added successfully");
      navigate(ROUTE_PATH.SLIDER_MANAGEMENT);
    } catch (error) {
      message.error("Failed to submit");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <h1 className="font-semibold text-2xl mb-3">Add Slider</h1>

      <Form layout="vertical" onFinish={onSubmit}>
        <Form.Item
          name="title"
          label="Slider Name"
          rules={[
            {
              required: true,
              message: "Please enter the slider name",
            },
          ]}
        >
          <Input placeholder="Enter slider name" />
        </Form.Item>

        <Form.Item
          name="url"
          label="URL"
          rules={[
            {
              required: true,
              message: "Please enter a URL",
            },
            {
              pattern: URL_REG,
              message: "Invalid URL format",
            },
          ]}
        >
          <Input placeholder="Enter the URL to be opened when clicking the slider" />
        </Form.Item>

        <Form.Item
          label="Image"
          name="image"
          rules={[
            {
              required: true,
              message: "Please select an image",
            },
          ]}
        >
          <UploadFormItem previewClassName="w-72" />
        </Form.Item>

        <Button
          className="mt-2"
          type="primary"
          htmlType="submit"
          loading={loading}
          disabled={loading}
        >
          Add Slider
        </Button>
      </Form>
    </>
  );
};

export default AddSlider;
