import { Button, Form, Input, message, Progress } from "antd";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import zxcvbn from "zxcvbn";
import authApi from "../../../api/authApi";
import WrapperContent from "../../../components/WrapperContent/WrapperContent";
import { PHONE_REG } from "../../../constants/reg";
import { ROUTE_PATH } from "../../../constants/routes";

const SignUp = () => {
  const navigate = useNavigate();
  const [passwordStrength, setPasswordStrength] = useState(null);
  const [password, setPassword] = useState("");

  const handlePasswordChange = (e) => {
    const value = e.target.value;
    setPassword(value);

    const result = zxcvbn(value);
    setPasswordStrength(result);
  };

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
    <div className="min-h-screen flex items-center justify-center bg-gray-100 py-6 px-4 sm:px-6 lg:px-8">
      <WrapperContent className="w-full max-w-md bg-white rounded-lg shadow-md p-8 space-y-6">
        <h1 className="text-center font-bold text-2xl uppercase text-gray-800">
          Sign Up
        </h1>

        <Form onFinish={onSubmit} layout="vertical" className="space-y-4">
          <Form.Item
            name="name"
            label={
              <span className="text-gray-700 font-semibold">Full Name</span>
            }
            rules={[{ required: true, message: "Please enter your full name" }]}
          >
            <Input placeholder="Enter full name" className="h-12 rounded-md" />
          </Form.Item>

          <Form.Item
            name="email"
            label={<span className="text-gray-700 font-semibold">Email</span>}
            rules={[
              { required: true, message: "Please enter your email" },
              { type: "email", message: "Invalid email format" },
            ]}
          >
            <Input placeholder="Enter email" className="h-12 rounded-md" />
          </Form.Item>

          <Form.Item
            name="phone"
            label={
              <span className="text-gray-700 font-semibold">Phone Number</span>
            }
            rules={[
              { required: true, message: "Please enter your phone number" },
              { pattern: PHONE_REG, message: "Invalid phone number format" },
            ]}
          >
            <Input
              placeholder="Enter phone number"
              className="h-12 rounded-md"
            />
          </Form.Item>

          <Form.Item
            name="password"
            label={
              <span className="text-gray-700 font-semibold">Password</span>
            }
            rules={[{ required: true, message: "Please enter your password" }]}
          >
            <Input.Password
              placeholder="Enter password"
              className="h-12 rounded-md"
              value={password}
              onChange={handlePasswordChange}
            />
          </Form.Item>

          {passwordStrength && (
            <Form.Item colon={false}>
              <div className="flex justify-between text-xs text-gray-600">
                <span>Weak</span>
                <span>Strong</span>
              </div>
              <Progress
                percent={passwordStrength.score * 25} // Score from 0 to 4, each score corresponds to 25%
                status={
                  passwordStrength.score >= 3
                    ? "success"
                    : passwordStrength.score === 2
                    ? "active"
                    : "exception"
                }
                strokeColor={
                  passwordStrength.score >= 3
                    ? "green"
                    : passwordStrength.score === 2
                    ? "blue"
                    : "red"
                }
                showInfo={false}
              />
              <div className="mt-2 text-sm text-gray-600">
                {passwordStrength.feedback.suggestions.length > 0
                  ? passwordStrength.feedback.suggestions.join(" ")
                  : ""}
              </div>
            </Form.Item>
          )}

          <Form.Item
            name="confirm"
            dependencies={["password"]}
            label={
              <span className="text-gray-700 font-semibold">
                Confirm Password
              </span>
            }
            rules={[
              { required: true, message: "Please confirm your password" },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  const password = getFieldValue("password");
                  return value && password !== value
                    ? Promise.reject("Passwords do not match")
                    : Promise.resolve();
                },
              }),
            ]}
          >
            <Input.Password
              placeholder="Confirm password"
              className="h-12 rounded-md"
            />
          </Form.Item>

          <Button
            type="primary"
            htmlType="submit"
            className="w-full h-12 rounded-md text-base font-semibold bg-blue-600 hover:bg-blue-700"
          >
            Sign Up
          </Button>

          <div className="text-center text-sm">
            <span className="text-gray-600">Already have an account? </span>
            <Link
              to={ROUTE_PATH.SIGN_IN}
              className="text-blue-500 hover:underline"
            >
              Sign In
            </Link>
          </div>
        </Form>
      </WrapperContent>
    </div>
  );
};

export default SignUp;
