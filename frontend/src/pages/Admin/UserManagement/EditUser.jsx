import { Button, Col, Form, Input, message, Row, Select } from "antd";
import dayjs from "dayjs";
import React, { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import userApi from "../../../api/userApi";
import UploadFormItem from "../../../components/UploadFormItem/UploadFormItem";
import { DEFAULT_AVATAR_PATH } from "../../../constants";
import { ROUTE_PATH } from "../../../constants/routes";
import uploadImage from "../../../utils/uploadImage";

const EditUser = () => {
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const params = useParams();
  const userId = params.id;

  const [form] = Form.useForm();

  const fetchData = useCallback(
    async (userId) => {
      try {
        const { data } = await userApi.getUser(userId);
        form.setFieldsValue({
          name: data.name,
          email: data.email,
          phone: data.phone,
          address: data.address,
          birthday: data.birthday ? dayjs(data.birthday) : "",
          gender: data.gender,
          role: data.role,
          avatar: {
            previewUrl: data?.avatar || DEFAULT_AVATAR_PATH,
          },
        });
      } catch (error) {
        message.error("Failed to fetch", error);
      }
    },
    [form]
  );

  useEffect(() => {
    userId && fetchData(userId);
  }, [userId, fetchData]);

  const onSubmit = async ({ avatar, ...rest }) => {
    setLoading(true);
    try {
      const payload = {
        ...rest,
      };

      if (avatar?.file) {
        const imageUrl = await uploadImage(avatar.file.originFileObj);
        payload.avatar = imageUrl;
      }
      await userApi.updateUser({ id: userId, ...payload });

      message.success("User account updated successfully");
      navigate(ROUTE_PATH.USER_MANAGEMENT);
    } catch (error) {
      message.error("Failed to submit");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <h1 className="font-semibold text-2xl mb-3">Edit User</h1>

      <Form layout="vertical" form={form} onFinish={onSubmit}>
        <Form.Item name="email" label="Email">
          <Input disabled />
        </Form.Item>

        <Form.Item name="phone" label="Phone Number">
          <Input disabled />
        </Form.Item>

        <Form.Item name="name" label="Account Name">
          <Input disabled />
        </Form.Item>

        <Form.Item name="address" label="Address">
          <Input disabled />
        </Form.Item>

        <Row gutter={[12, 12]}>
          <Col span={8}>
            <Form.Item name="birthday" label="Birthday">
              <Input disabled />
            </Form.Item>
          </Col>

          <Col span={8}>
            <Form.Item name="gender" label="Gender">
              <Input disabled />
            </Form.Item>
          </Col>

          <Col span={8}>
            <Form.Item
              name="role"
              label="Role"
              rules={[
                {
                  required: true,
                  message: "Please select role",
                },
              ]}
            >
              <Select
                options={[
                  { label: "Administrator", value: "ADMIN" },
                  { label: "User", value: "USER" },
                ]}
                placeholder="Select role"
              />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item label="Avatar" name="avatar">
          <UploadFormItem previewClassName="rounded-full overflow-hidden" />
        </Form.Item>

        <Button
          className="mt-2"
          type="primary"
          htmlType="submit"
          loading={loading}
          disabled={loading}
        >
          Update Account
        </Button>
      </Form>
    </>
  );
};

export default EditUser;
