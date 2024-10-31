import { GoogleLogin } from "@react-oauth/google"; // Google Login Import
import { Button, Checkbox, Form, Input, message } from "antd";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import authApi from "../../../api/authApi";
import WrapperContent from "../../../components/WrapperContent/WrapperContent";
import { TOKEN_STORAGE_KEY } from "../../../constants";
import { ROUTE_PATH } from "../../../constants/routes";

const SignIn = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onSignIn = async ({ confirm, remember, ...values }) => {
    setLoading(true);
    try {
      const { data } = await authApi.signIn(values);
      localStorage.setItem(TOKEN_STORAGE_KEY, data.token);
      message.success("Logged in successfully");
      navigate(ROUTE_PATH.HOME);
    } catch (error) {
      const errorMessage =
        error?.response?.data?.message ||
        "An error occurred during sign-in. Please try again.";
      message.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLoginSuccess = async (response) => {
    setLoading(true);
    try {
      const token = response.credential;
      const res = await authApi.googleSignUp({ token });
      localStorage.setItem(TOKEN_STORAGE_KEY, res.data.token);
      message.success("Logged in with Google successfully");
      navigate(ROUTE_PATH.HOME);
    } catch (error) {
      const errorMessage =
        error?.response?.data?.message ||
        "Google login failed. Please try again.";
      message.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLoginFailure = () => {
    message.error("Google login failed. Please try again.");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 py-6 px-4 sm:px-6 lg:px-8">
      <WrapperContent className="w-full max-w-md bg-white rounded-lg shadow-md p-8 space-y-6">
        <h1 className="text-center font-bold text-2xl uppercase text-gray-800">
          Sign In
        </h1>

        <Form onFinish={onSignIn} layout="vertical" className="space-y-4">
          <Form.Item
            name="email"
            label={<p className="text-gray-700 font-semibold">Email</p>}
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
            <Input placeholder="Enter email" className="h-12 rounded-md" />
          </Form.Item>

          <Form.Item
            name="password"
            label={<p className="text-gray-700 font-semibold">Password</p>}
            rules={[
              {
                required: true,
                message: "Please enter your password",
              },
            ]}
          >
            <Input.Password
              placeholder="Enter password"
              className="h-12 rounded-md"
            />
          </Form.Item>

          <Form.Item className="flex justify-between items-center">
            <Checkbox name="remember" valuePropName="checked">
              Remember me
            </Checkbox>
            <Link
              to={ROUTE_PATH.FORGOT_PASSWORD}
              className="text-blue-500 hover:underline"
            >
              Forgot password?
            </Link>
          </Form.Item>

          <Button
            type="primary"
            htmlType="submit"
            loading={loading}
            className="w-full h-12 rounded-md text-base font-semibold bg-blue-600 hover:bg-blue-700"
          >
            Sign In
          </Button>

          <div className="flex items-center justify-center my-4">
            <GoogleLogin
              onSuccess={handleGoogleLoginSuccess}
              onError={handleGoogleLoginFailure}
              useOneTap
              className="w-full"
              ux_mode="popup"
            />
          </div>

          <div className="text-center text-sm">
            <span className="text-gray-600">Don't have an account? </span>
            <Link
              to={ROUTE_PATH.SIGN_UP}
              className="text-blue-500 hover:underline"
            >
              Sign Up
            </Link>
          </div>
        </Form>
      </WrapperContent>
    </div>
  );
};

export default SignIn;
