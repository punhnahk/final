import { Button, Form, Input, message } from "antd";
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import authApi from "../../../api/authApi";
import WrapperContent from "../../../components/WrapperContent/WrapperContent";
import { PHONE_REG } from "../../../constants/reg";
import { ROUTE_PATH } from "../../../constants/routes";

const SignUp = () => {
  const navigate = useNavigate();

  const onSubmit = async ({ confirm, ...values }) => {
    try {
      await authApi.signUp(values);
      message.success("Account registered successfully");
      navigate(ROUTE_PATH.SIGN_IN);
    } catch (error) {
      message.error(error?.response?.data?.message);
    }
  };

  return (
    <div className="bg-gray-100 px-8 py-11">
      <WrapperContent className="bg-white py-11 rounded px-4">
        <h1 className="text-center font-semibold text-2xl uppercase mb-6">
          Sign Up
        </h1>

        <Form
          onFinish={onSubmit}
          layout="vertical"
          className="w-[500px] max-w-full mx-auto"
        >
          <Form.Item
            name="name"
            label={
              <p className="text-[#090d14] font-bold text-base">Full Name</p>
            }
            rules={[{ required: true, message: "Please enter your full name" }]}
          >
            <Input placeholder="Enter full name" className="h-12 text-base" />
          </Form.Item>

          <Form.Item
            name="email"
            label={<p className="text-[#090d14] font-bold text-base">Email</p>}
            rules={[
              {
                required: true,
                message: "Please enter your email",
              },
              {
                type: "email",
                message: "Invalid email format",
              },
            ]}
          >
            <Input placeholder="Enter email" className="h-12 text-base" />
          </Form.Item>

          <Form.Item
            name="phone"
            label={
              <p className="text-[#090d14] font-bold text-base">Phone Number</p>
            }
            rules={[
              {
                required: true,
                message: "Please enter your phone number",
              },
              {
                pattern: PHONE_REG,
                message: "Invalid phone number format",
              },
            ]}
          >
            <Input
              placeholder="Enter phone number"
              className="h-12 text-base"
            />
          </Form.Item>

          <Form.Item
            name="password"
            label={
              <p className="text-[#090d14] font-bold text-base">Password</p>
            }
            rules={[
              {
                required: true,
                message: "Please enter your password",
              },
            ]}
          >
            <Input.Password
              placeholder="Enter password"
              className="h-12 text-base"
            />
          </Form.Item>

          <Form.Item
            name="confirm"
            dependencies={["password"]}
            label={
              <p className="text-[#090d14] font-bold text-base">
                Confirm Password
              </p>
            }
            rules={[
              {
                required: true,
                message: "Please confirm your password",
              },
              ({ getFieldValue }) => ({
                validator: (_, value) => {
                  const password = getFieldValue("password");

                  if (value && password !== value) {
                    return Promise.reject("Passwords do not match");
                  }

                  return Promise.resolve();
                },
              }),
            ]}
          >
            <Input.Password
              placeholder="Confirm password"
              className="h-12 text-base"
            />
          </Form.Item>

          <Button
            className="!bg-red-600 hover:!bg-red-600 h-12 rounded w-full mt-4"
            htmlType="submit"
          >
            <p className="uppercase text-white text-base font-semibold">
              Sign Up
            </p>
          </Button>

          <div className="text-center mt-3 text-base">
            <span className="text-[#626579]">Already have an account? </span>

            <Link to={ROUTE_PATH.SIGN_IN} className="text-blue-500">
              Sign In
            </Link>
          </div>
        </Form>
      </WrapperContent>
    </div>
  );
};

export default SignUp;
