import { Button, Form, Input, message } from "antd";
import React from "react";
import { useNavigate } from "react-router-dom";
import authApi from "../../../api/authApi";
import { ROUTE_PATH } from "../../../constants/routes";
import { STEP } from "./ForgotPassword";

const ResetPassword = ({ onStepChange, valuesRef }) => {
  const navigate = useNavigate();

  const onSubmit = async ({ password }) => {
    try {
      await authApi.resetPassword({
        newPassword: password,
        email: valuesRef.current.email,
        otp: valuesRef.current.otp,
      });

      message.success("Password changed successfully");

      navigate(ROUTE_PATH.SIGN_IN);
    } catch (error) {
      message.error(error?.response?.data?.message);
    }
  };

  return (
    <Form
      onFinish={onSubmit}
      layout="vertical"
      className="w-[500px] max-w-full mx-auto"
    >
      <Form.Item
        name="password"
        label={<p className="text-[#090d14] font-bold text-base">Password</p>}
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
          <p className="text-[#090d14] font-bold text-base">Confirm Password</p>
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
          placeholder="Re-enter password"
          className="h-12 text-base"
        />
      </Form.Item>

      <Button
        htmlType="submit"
        className="!bg-red-600 hover:!bg-red-600 h-12 rounded w-full mt-2"
      >
        <p className="uppercase text-white text-base font-semibold">
          Change Password
        </p>
      </Button>

      <p
        className="text-center mt-3 text-base text-blue-500 cursor-pointer"
        onClick={() => onStepChange(STEP.ENTER_OTP)}
      >
        Go back
      </p>
    </Form>
  );
};

export default ResetPassword;
