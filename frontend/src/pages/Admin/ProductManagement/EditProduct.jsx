import { Button, Form, Input, InputNumber, message, Select } from "antd";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import categoryApi from "../../../api/categoryApi";
import newsApi from "../../../api/newsApi";
import productApi from "../../../api/productApi";
import SunEditorFormItem from "../../../components/SunEditorFormItem/SunEditorFormItem";
import { ROUTE_PATH } from "../../../constants/routes";
import uploadImage from "../../../utils/uploadImage";
import ImageFormItem from "./ImageFormItem";

const EditProduct = () => {
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [posts, setPosts] = useState([]);

  const navigate = useNavigate();

  const [form] = Form.useForm();

  const params = useParams();
  const productId = params.id;

  useEffect(() => {
    fetchCategories();
    fetchPosts();
  }, []);

  const fetchProduct = async (productId) => {
    try {
      const { data } = await productApi.getProduct(productId);
      form.setFieldsValue({
        name: data.name,
        price: data.price,
        salePrice: data.salePrice,
        category: data.category._id,
        brand: data.brand,
        posts: data.posts.map((it) => it._id),
        description: data.description,
        image: data.image.map((it) => ({ previewUrl: it })),
      });
    } catch (error) {
      message.error("Failed to fetch");
    }
  };

  useEffect(() => {
    productId && fetchProduct(productId);
  }, [productId]);

  const fetchCategories = async () => {
    try {
      const res = await categoryApi.getCategories();
      setCategories(res.data);
    } catch (error) {
      message.error("Failed to fetch");
    }
  };

  const fetchPosts = async () => {
    try {
      const res = await newsApi.getAllNews();
      setPosts(res.data);
    } catch (error) {
      message.error("Failed to fetch");
    }
  };

  const onSubmit = async ({ image, ...rest }) => {
    setLoading(true);
    try {
      const uploadTask = image.map((it) => {
        if (it?.file) {
          return uploadImage(it.file.originFileObj);
        } else {
          return it.previewUrl;
        }
      });
      const images = await Promise.all(uploadTask);
      await productApi.updateProduct({ id: productId, ...rest, image: images });
      message.success("Successfully updated the product");
      navigate(ROUTE_PATH.PRODUCT_MANAGEMENT);
    } catch (error) {
      message.error("Failed to submit");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <h1 className="font-semibold text-2xl mb-3">Edit Product</h1>

      <Form form={form} layout="vertical" onFinish={onSubmit}>
        <Form.Item
          name="name"
          label="Product Name"
          rules={[{ required: true, message: "Please enter the product name" }]}
        >
          <Input placeholder="Enter product name" />
        </Form.Item>

        <Form.Item
          name="brand" // New brand field
          label="Brand"
          rules={[{ required: true, message: "Please enter the brand" }]}
        >
          <Input placeholder="Enter brand" />
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

        <Form.Item name="posts" label="Related Articles">
          <Select
            options={posts.map((it) => ({
              label: it.title,
              value: it._id,
            }))}
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

        <Form.Item
          label="Product Image"
          name="image"
          rules={[{ required: true, message: "Please select a product image" }]}
        >
          <ImageFormItem />
        </Form.Item>

        <Button
          className="mt-2"
          type="primary"
          htmlType="submit"
          loading={loading}
          disabled={loading}
        >
          Update Product
        </Button>
      </Form>
    </>
  );
};

export default EditProduct;
