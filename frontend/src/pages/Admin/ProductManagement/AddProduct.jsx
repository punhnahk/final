import { Button, Form, Input, InputNumber, message, Select, Space } from "antd";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import categoryApi from "../../../api/categoryApi";
import newsApi from "../../../api/newsApi";
import productApi from "../../../api/productApi";
import SunEditorFormItem from "../../../components/SunEditorFormItem/SunEditorFormItem";
import { ROUTE_PATH } from "../../../constants/routes";
import uploadImage from "../../../utils/uploadImage"; // Keep this for file uploads
import ImageFormItem from "./ImageFormItem";

const AddProduct = () => {
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [posts, setPosts] = useState([]);
  const [imageUrls, setImageUrls] = useState([""]); // State to manage URL inputs

  const navigate = useNavigate();

  useEffect(() => {
    fetchCategories();
    fetchPosts();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await categoryApi.getCategories();
      setCategories(res.data);
    } catch (error) {
      message.error("Failed to fetch categories");
    }
  };

  const fetchPosts = async () => {
    try {
      const res = await newsApi.getAllNews();
      setPosts(res.data);
    } catch (error) {
      message.error("Failed to fetch posts");
    }
  };

  const onSubmit = async ({ image, ...rest }) => {
    setLoading(true);
    try {
      let images = [];

      // Handle image uploads
      if (Array.isArray(image)) {
        const uploadTasks = image.map(
          (it) =>
            it.file ? uploadImage(it.file.originFileObj) : Promise.resolve(it) // If it's not a file, resolve it
        );
        images = await Promise.all(uploadTasks);
      }

      // Handle image URLs input
      images = images.concat(imageUrls.filter((url) => url)); // Add non-empty URLs

      await productApi.addProduct({ ...rest, image: images });

      message.success("Successfully added the product");
      navigate(ROUTE_PATH.PRODUCT_MANAGEMENT);
    } catch (error) {
      message.error("Failed to submit");
    } finally {
      setLoading(false);
    }
  };

  const handleAddUrl = () => {
    setImageUrls([...imageUrls, ""]); // Add a new empty URL input
  };

  const handleUrlChange = (value, index) => {
    const newUrls = [...imageUrls];
    newUrls[index] = value; // Update the URL at the specific index
    setImageUrls(newUrls);
  };

  return (
    <>
      <h1 className="font-semibold text-2xl mb-3">Add Product</h1>

      <Form layout="vertical" onFinish={onSubmit}>
        <Form.Item
          name="name"
          label="Product Name"
          rules={[{ required: true, message: "Please enter the product name" }]}
        >
          <Input placeholder="Enter product name" />
        </Form.Item>

        <div className="grid grid-cols-12 gap-3">
          <Form.Item
            name="price"
            label="Product Price"
            className="col-span-6"
            rules={[
              { required: true, message: "Please enter the product price" },
            ]}
          >
            <InputNumber
              min={0}
              placeholder="Product Price"
              className="w-full"
            />
          </Form.Item>

          <Form.Item name="salePrice" label="Sale Price" className="col-span-6">
            <InputNumber min={0} placeholder="Sale Price" className="w-full" />
          </Form.Item>
        </div>

        <Form.Item
          name="category"
          label="Product Category"
          rules={[
            { required: true, message: "Please select a product category" },
          ]}
        >
          <Select
            options={categories.map((it) => ({
              label: it.name,
              value: it._id,
            }))}
            placeholder="Select a product category"
          />
        </Form.Item>
        <Form.Item
          name="brand"
          label="Brand"
          rules={[{ required: true, message: "Please select a product brand" }]}
        >
          <Input placeholder="Enter product name" />
        </Form.Item>

        <Form.Item name="posts" label="Related Articles">
          <Select
            options={posts.map((it) => ({ label: it.title, value: it._id }))}
            placeholder="Select related articles"
            mode="multiple"
          />
        </Form.Item>

        <Form.Item
          name="description"
          label="Product Description"
          rules={[
            { required: true, message: "Please enter the product description" },
          ]}
        >
          <SunEditorFormItem placeholder="Product description" height={400} />
        </Form.Item>

        <Form.Item label="Product Images" name="image">
          <ImageFormItem />
        </Form.Item>

        <Form.Item label="Or enter multiple image URLs">
          {imageUrls.map((url, index) => (
            <Space
              key={index}
              style={{ display: "flex", marginBottom: 8 }}
              align="baseline"
            >
              <Input
                placeholder="Enter image URL"
                value={url}
                onChange={(e) => handleUrlChange(e.target.value, index)}
              />
              <Button
                type="link"
                onClick={() => handleUrlChange("", index)} // Clear specific URL
              >
                Delete
              </Button>
            </Space>
          ))}
          <Button
            type="dashed"
            onClick={handleAddUrl}
            style={{ width: "100%" }}
          >
            Add Image URL
          </Button>
        </Form.Item>

        <Button
          className="mt-2"
          type="primary"
          htmlType="submit"
          loading={loading}
          disabled={loading}
        >
          Add Product
        </Button>
      </Form>
    </>
  );
};

export default AddProduct;
