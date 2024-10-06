import { GoogleLogin } from "@react-oauth/google"; // Import Google Login
import { Button, Checkbox, Flex, Form, Input, message } from "antd";
import React, { useState } from "react"; // Import useState
import { Link, useNavigate } from "react-router-dom"; // Use useNavigate for better navigation
import authApi from "../../../api/authApi";
import WrapperContent from "../../../components/WrapperContent/WrapperContent";
import { TOKEN_STORAGE_KEY } from "../../../constants";
import { ROUTE_PATH } from "../../../constants/routes";

const SignIn = () => {
  const [loading, setLoading] = useState(false); // State for loading
  const navigate = useNavigate(); // Initialize useNavigate

  const onSignIn = async ({ confirm, remember, ...values }) => {
    setLoading(true); // Set loading to true when the sign-in process starts
    try {
      const { data } = await authApi.signIn(values);
      localStorage.setItem(TOKEN_STORAGE_KEY, data.token);
      message.success("Logged in successfully");
      navigate(ROUTE_PATH.HOME); // Use navigate for redirect
    } catch (error) {
      // Improved error handling
      const errorMessage =
        error?.response?.data?.message ||
        "An error occurred during sign-in. Please try again.";
      message.error(errorMessage);
    } finally {
      setLoading(false); // Set loading to false after the sign-in process
    }
  };

  const handleGoogleLoginSuccess = async (response) => {
    setLoading(true); // Set loading to true when the Google sign-in process starts
    try {
      const token = response.credential;
      const res = await authApi.googleSignUp({ token });
      localStorage.setItem(TOKEN_STORAGE_KEY, res.data.token); // Store token
      message.success("Logged in with Google successfully");
      navigate(ROUTE_PATH.HOME); // Use navigate for redirect
    } catch (error) {
      // Improved error handling for Google sign-in
      const errorMessage =
        error?.response?.data?.message ||
        "Google login failed. Please try again.";
      message.error(errorMessage);
    } finally {
      setLoading(false); // Set loading to false after the Google sign-in process
    }
  };

  const handleGoogleLoginFailure = () => {
    message.error("Google login failed. Please try again.");
  };

  return (
    <div className="bg-gray-100 py-11 px-8">
      <WrapperContent className="bg-white py-11 rounded px-4">
        <h1 className="text-center font-semibold text-2xl uppercase mb-6">
          Sign In
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

          <Form.Item>
            <Flex justify="space-between" align="center">
              <Form.Item name="remember" valuePropName="checked" noStyle>
                <Checkbox>Remember me</Checkbox>
              </Form.Item>

              <Link className="text-blue-500" to={ROUTE_PATH.FORGOT_PASSWORD}>
                Forgot password?
              </Link>
            </Flex>
          </Form.Item>

          <Button
            htmlType="submit"
            loading={loading} // Show loading spinner on button
            className="!bg-red-600 hover:!bg-red-600 h-12 rounded w-full mt-2"
          >
            <p className="uppercase text-white text-base font-semibold">
              Sign In
            </p>
          </Button>

          {/* Google Login Button */}
          <div className="my-4 text-center">
            <GoogleLogin
              onSuccess={handleGoogleLoginSuccess}
              onError={handleGoogleLoginFailure}
              useOneTap
            />
          </div>

          <div className="text-center mt-3 text-base">
            <span className="text-[#626579]">Don't have an account? </span>

            <Link to={ROUTE_PATH.SIGN_UP} className="text-blue-500">
              Sign Up
            </Link>
          </div>
        </Form>
      </WrapperContent>
    </div>
  );
};

export default SignIn;
