import { Button, Form, Input, message } from "antd";
import React from "react";
import userApi from "../../../../api/userApi";

const ChangePassword = () => {
  const [form] = Form.useForm();

  const onSubmit = async ({ password, newPassword }) => {
    try {
      await userApi.changePassword({ password, newPassword });
      message.success("Password changed successfully");
      form.resetFields();
    } catch (error) {
      message.error(error.response.data.message);
    }
  };

  return (
    <>
      <h2 className="text-[24px] font-semibold px-6 py-4 text-[#333] leading-tight">
        Change Password
      </h2>

      <Form
        onFinish={onSubmit}
        className="px-6 py-4 max-w-[580px] mx-auto"
        labelCol={{ span: 8 }}
        size="large"
        layout="vertical"
        form={form}
      >
        <Form.Item
          name="password"
          label={<p className="text-[16px]">Current Password</p>}
          className="mb-6"
          rules={[
            {
              required: true,
              message: "Please enter your current password",
            },
          ]}
        >
          <Input.Password
            placeholder="Enter current password"
            className="rounded"
          />
        </Form.Item>

        <Form.Item
          name="newPassword"
          label={<p className="text-base">New Password</p>}
          rules={[
            {
              required: true,
              message: "Please enter your new password",
            },
          ]}
        >
          <Input.Password
            placeholder="Enter new password"
            className="h-12 text-base"
          />
        </Form.Item>

        <Form.Item
          name="confirm"
          dependencies={["newPassword"]}
          label={<p className="text-base">Confirm New Password</p>}
          rules={[
            {
              required: true,
              message: "Please confirm your password",
            },
            ({ getFieldValue }) => ({
              validator: (_, value) => {
                const password = getFieldValue("newPassword");

                if (value && password !== value) {
                  return Promise.reject("Passwords do not match");
                }

                return Promise.resolve();
              },
            }),
          ]}
        >
          <Input.Password
            placeholder="Confirm new password"
            className="h-12 text-base"
          />
        </Form.Item>

        <Form.Item wrapperCol={{ offset: 8 }}>
          <Button
            htmlType="submit"
            className="uppercase rounded text-[14px] !bg-red-600 !text-white"
          >
            Change Password
          </Button>
        </Form.Item>
      </Form>
    </>
  );
};

export default ChangePassword;
