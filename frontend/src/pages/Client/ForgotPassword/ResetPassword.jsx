import { Button, Form, Input, message } from "antd";
import React from "react";
import authApi from "../../../api/authApi";
import { STEP } from "./ForgotPassword";
import { useNavigate } from "react-router-dom";
import { ROUTE_PATH } from "../../../constants/routes";

const ResetPassword = ({ onStepChange, valuesRef }) => {
  const navigate = useNavigate();

  const onSubmit = async ({ password }) => {
    try {
      await authApi.resetPassword({
        newPassword: password,
        email: valuesRef.current.email,
        otp: valuesRef.current.otp,
      });

      message.success("Đổi mật khẩu thành công");

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
        label={<p className="text-[#090d14] font-bold text-base">Mật khẩu</p>}
        rules={[
          {
            required: true,
            message: "Vui lòng nhập mật khẩu",
          },
        ]}
      >
        <Input.Password
          placeholder="Nhập mật khẩu"
          className="h-12 text-base"
        />
      </Form.Item>

      <Form.Item
        name="confirm"
        dependencies={["password"]}
        label={
          <p className="text-[#090d14] font-bold text-base">
            Nhập lại mật khẩu
          </p>
        }
        rules={[
          {
            required: true,
            message: "Vui lòng xác nhận mật khẩu",
          },
          ({ getFieldValue }) => ({
            validator: (_, value) => {
              const password = getFieldValue("password");

              if (value && password !== value) {
                return Promise.reject("Mật khẩu không trùng khớp");
              }

              return Promise.resolve();
            },
          }),
        ]}
      >
        <Input.Password
          placeholder="Nhập lại mật khẩu"
          className="h-12 text-base"
        />
      </Form.Item>

      <Button
        htmlType="submit"
        className="!bg-red-600 hover:!bg-red-600 h-12 rounded w-full mt-2"
      >
        <p className="uppercase text-white text-base font-semibold">
          Đổi mật khẩu
        </p>
      </Button>

      <p
        className="text-center mt-3 text-base text-blue-500 cursor-pointer"
        onClick={() => onStepChange(STEP.ENTER_OTP)}
      >
        Quay lại
      </p>
    </Form>
  );
};

export default ResetPassword;
