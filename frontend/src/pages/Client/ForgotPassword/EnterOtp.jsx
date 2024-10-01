import { Button, Form, Input } from "antd";
import React from "react";
import { STEP } from "./ForgotPassword";

const EnterOtp = ({ onStepChange, valuesRef }) => {
  const onSubmit = async ({ otp }) => {
    valuesRef.current = {
      ...valuesRef.current,
      otp,
    };
    onStepChange(STEP.RESET_PASSWORD);
  };

  return (
    <Form
      onFinish={onSubmit}
      layout="vertical"
      className="w-[500px] max-w-full mx-auto"
      initialValues={{
        otp: valuesRef.current?.otp,
      }}
    >
      <Form.Item
        className="mb-2"
        name="otp"
        label={<p className="text-[#090d14] font-bold text-base">OTP</p>}
        rules={[
          {
            required: true,
            message: "Vui lòng nhập OTP",
          },
        ]}
      >
        <Input placeholder="Nhập OTP" className="h-12 text-base" />
      </Form.Item>

      <Button
        htmlType="submit"
        className="!bg-red-600 hover:!bg-red-600 h-12 rounded w-full mt-2"
      >
        <p className="uppercase text-white text-base font-semibold">Tiếp tục</p>
      </Button>

      <p
        className="text-center mt-3 text-base text-blue-500 cursor-pointer"
        onClick={() => onStepChange(STEP.ENTER_EMAIL)}
      >
        Quay lại
      </p>
    </Form>
  );
};

export default EnterOtp;
