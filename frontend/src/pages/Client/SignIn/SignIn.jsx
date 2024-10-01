import { Button, Checkbox, Flex, Form, Input, message } from "antd";
import React from "react";
import { TOKEN_STORAGE_KEY } from "../../../constants";
import WrapperContent from "../../../components/WrapperContent/WrapperContent";
import { Link } from "react-router-dom";
import { ROUTE_PATH } from "../../../constants/routes";
import authApi from "../../../api/authApi";

const SignIn = () => {
  const onSignIn = async ({ confirm, remember, ...values }) => {
    try {
      const { data } = await authApi.signIn(values);
      localStorage.setItem(TOKEN_STORAGE_KEY, data.token);
      window.location.href = ROUTE_PATH.HOME;
    } catch (error) {
      message.error(error?.response?.data?.message);
    }
  };

  return (
    <div className="bg-gray-100 py-11 px-8">
      <WrapperContent className="bg-white py-11 rounded px-4">
        <h1 className="text-center font-semibold text-2xl uppercase mb-6">
          Đăng nhập
        </h1>

        <Form
          onFinish={onSignIn}
          layout="vertical"
          className="w-[500px] max-w-full mx-auto"
        >
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

          <Form.Item>
            <Flex justify="space-between" align="center">
              <Form.Item name="remember" valuePropName="checked" noStyle>
                <Checkbox>Ghi nhớ tài khoản</Checkbox>
              </Form.Item>

              <Link className="text-blue-500" to={ROUTE_PATH.FORGOT_PASSWORD}>
                Quên mật khẩu?
              </Link>
            </Flex>
          </Form.Item>

          <Button
            htmlType="submit"
            className="!bg-red-600 hover:!bg-red-600 h-12 rounded w-full mt-2"
          >
            <p className="uppercase text-white text-base font-semibold">
              Đăng nhập
            </p>
          </Button>

          <div className="text-center mt-3 text-base">
            <span className="text-[#626579]">Bạn chưa có tài khoản? </span>

            <Link to={ROUTE_PATH.SIGN_UP} className="text-blue-500">
              Đăng ký
            </Link>
          </div>
        </Form>
      </WrapperContent>
    </div>
  );
};

export default SignIn;
