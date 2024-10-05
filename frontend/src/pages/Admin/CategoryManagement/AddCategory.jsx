import { Button, Form, Input, message } from "antd";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import categoryApi from "../../../api/categoryApi";
import UploadFormItem from "../../../components/UploadFormItem/UploadFormItem";
import { ROUTE_PATH } from "../../../constants/routes";
import uploadImage from "../../../utils/uploadImage";

const AddCategory = () => {
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState(""); // State to store image URL
  const navigate = useNavigate();

  // Handle form submission
  const onSubmit = async ({ image, ...rest }) => {
    setLoading(true);
    try {
      let uploadedImageUrl;

      // If image URL is provided, use it; otherwise, upload the file
      if (imageUrl) {
        uploadedImageUrl = imageUrl;
      } else {
        uploadedImageUrl = await uploadImage(image.file.originFileObj);
      }

      // Add category with the image URL (from file upload or direct URL)
      await categoryApi.addCategory({ ...rest, image: uploadedImageUrl });

      message.success("Successfully added product category");
      navigate(ROUTE_PATH.CATEGORY_MANAGEMENT);
    } catch (error) {
      message.error("Failed to submit");
    } finally {
      setLoading(false); // Stop the loading state after submission
    }
  };

  return (
    <>
      <h1 className="font-semibold text-2xl mb-3">Add Category</h1>

      <Form layout="vertical" onFinish={onSubmit}>
        {/* Category Name */}
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

        {/* Category Image Upload or URL */}
        <Form.Item
          label="Category Image"
          name="image"
          rules={[
            {
              required: !imageUrl, // Require file upload if URL is not provided
              message: "Please select a category image or enter an image URL",
            },
          ]}
        >
          {/* UploadFormItem for local file upload */}
          <UploadFormItem />
          <div className="mt-2">
            <Input
              placeholder="Or enter an image URL"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
            />
          </div>
        </Form.Item>

        {/* Submit Button */}
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
