import { Button, Form, Input, message } from "antd";
import React, { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import sliderApi from "../../../api/sliderApi";
import UploadFormItem from "../../../components/UploadFormItem/UploadFormItem";
import { URL_REG } from "../../../constants/reg";
import { ROUTE_PATH } from "../../../constants/routes";
import uploadImage from "../../../utils/uploadImage";

const EditSlider = () => {
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const params = useParams();
  const sliderId = params.id;

  const [form] = Form.useForm();

  const fetchData = useCallback(
    async (sliderId) => {
      try {
        const { data } = await sliderApi.getSlider(sliderId);
        form.setFieldsValue({
          title: data.title,
          url: data.url,
          image: {
            previewUrl: data.image,
          },
        });
      } catch (error) {
        message.error("Failed to fetch data", error);
      }
    },
    [form]
  );

  useEffect(() => {
    sliderId && fetchData(sliderId);
  }, [sliderId, fetchData]);

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
      await sliderApi.updateSlider({ id: sliderId, ...payload });

      message.success("Slider updated successfully");
      navigate(ROUTE_PATH.SLIDER_MANAGEMENT);
    } catch (error) {
      message.error("Failed to submit");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <h1 className="font-semibold text-2xl mb-3">Edit Slider</h1>

      <Form layout="vertical" form={form} onFinish={onSubmit}>
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
              message: "Please enter the URL",
            },
            {
              pattern: URL_REG,
              message: "Invalid URL format",
            },
          ]}
        >
          <Input placeholder="Enter the URL to be opened when clicking the slider" />
        </Form.Item>

        <Form.Item label="Slider Image" name="image">
          <UploadFormItem />
        </Form.Item>

        <Button
          className="mt-2"
          type="primary"
          htmlType="submit"
          loading={loading}
          disabled={loading}
        >
          Update Slider
        </Button>
      </Form>
    </>
  );
};

export default EditSlider;
