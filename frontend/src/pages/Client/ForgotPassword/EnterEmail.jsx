import { Button, Form, Input, message } from "antd";
import React from "react";
import authApi from "../../../api/authApi";
import { STEP } from "./ForgotPassword";

const EnterEmail = ({ onStepChange, onBack, valuesRef }) => {
  const onSubmit = async ({ email }) => {
    try {
      await authApi.forgotPassword(email);
      onStepChange(STEP.ENTER_OTP);
      valuesRef.current = {
        ...valuesRef.current,
        email,
        otp: "",
      };
    } catch (error) {
      message.error(error?.response?.data?.message);
    }
  };

  return (
    <Form
      onFinish={onSubmit}
      layout="vertical"
      className="w-[500px] max-w-full mx-auto"
      initialValues={{
        email: valuesRef.current?.email,
      }}
    >
      <Form.Item
        className="mb-2"
        name="email"
        label={<p className="text-[#090d14] font-bold text-base">Email</p>}
        rules={[
          {
            required: true,
            message: "Vui lòng nhập email",
          },
          {
            type: "email",
            message: "Email không đúng định dạng",
          },
        ]}
      >
        <Input placeholder="Nhập email" className="h-12 text-base" />
      </Form.Item>

      <p className="mb-6">
        Vui lòng sử dụng email đã đăng ký với FPT Shop để nhận OTP
      </p>

      <Button
        htmlType="submit"
        className="!bg-red-600 hover:!bg-red-600 h-12 rounded w-full mt-2"
      >
        <p className="uppercase text-white text-base font-semibold">Tiếp tục</p>
      </Button>

      <p
        className="text-center mt-3 text-base text-blue-500 cursor-pointer"
        onClick={onBack}
      >
        Quay lại đăng nhập
      </p>
    </Form>
  );
};

export default EnterEmail;
