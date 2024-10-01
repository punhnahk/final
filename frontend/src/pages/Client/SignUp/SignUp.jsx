import React from "react";
import WrapperContent from "../../../components/WrapperContent/WrapperContent";
import { Button, Form, Input, message } from "antd";
import { Link, useNavigate } from "react-router-dom";
import { ROUTE_PATH } from "../../../constants/routes";
import { PHONE_REG } from "../../../constants/reg";
import authApi from "../../../api/authApi";

const SignUp = () => {
  const navigate = useNavigate();

  const onSubmit = async ({ confirm, ...values }) => {
    try {
      await authApi.signUp(values);
      message.success("Đăng ký tài khoản thành công");
      navigate(ROUTE_PATH.SIGN_IN);
    } catch (error) {
      message.error(error?.response?.data?.message);
    }
  };

  return (
    <div className="bg-gray-100 px-8 py-11">
      <WrapperContent className="bg-white py-11 rounded px-4">
        <h1 className="text-center font-semibold text-2xl uppercase mb-6">
          Đăng ký
        </h1>

        <Form
          onFinish={onSubmit}
          layout="vertical"
          className="w-[500px] max-w-full mx-auto"
        >
          <Form.Item
            name="name"
            label={<p className="text-[#090d14] font-bold text-base">Họ tên</p>}
            rules={[{ required: true, message: "Vui lòng nhập họ tên" }]}
          >
            <Input placeholder="Nhập họ tên" className="h-12 text-base" />
          </Form.Item>

          <Form.Item
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

          <Form.Item
            name="phone"
            label={
              <p className="text-[#090d14] font-bold text-base">
                Số điện thoại
              </p>
            }
            rules={[
              {
                required: true,
                message: "Vui lòng nhập số điện thoại",
              },
              {
                pattern: PHONE_REG,
                message: "Số điện thoại không đúng định dạng",
              },
            ]}
          >
            <Input
              placeholder="Nhập số điện thoại"
              className="h-12 text-base"
            />
          </Form.Item>

          <Form.Item
            name="password"
            label={
              <p className="text-[#090d14] font-bold text-base">Mật khẩu</p>
            }
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
            className="!bg-red-600 hover:!bg-red-600 h-12 rounded w-full mt-4"
            htmlType="submit"
          >
            <p className="uppercase text-white text-base font-semibold">
              Đăng ký
            </p>
          </Button>

          <div className="text-center mt-3 text-base">
            <span className="text-[#626579]">Bạn đã có tài khoản? </span>

            <Link to={ROUTE_PATH.SIGN_IN} className="text-blue-500">
              Đăng nhập
            </Link>
          </div>
        </Form>
      </WrapperContent>
    </div>
  );
};

export default SignUp;
