import { Button, DatePicker, Form, Input, message, Radio } from "antd";
import dayjs from "dayjs";
import React, { useEffect } from "react";
import userApi from "../../../../api/userApi";
import UploadFormItem from "../../../../components/UploadFormItem/UploadFormItem";
import { DEFAULT_AVATAR_PATH } from "../../../../constants";
import useProfile from "../../../../hooks/useProfile";
import useProfileInitial from "../../../../hooks/useProfileInitial";
import uploadImage from "../../../../utils/uploadImage";

const UpdateInformation = () => {
  const { fetchProfile } = useProfileInitial();
  const { profile } = useProfile();

  const [form] = Form.useForm();

  useEffect(() => {
    if (!profile) return;

    form.setFieldsValue({
      avatar: {
        previewUrl: profile.avatar || DEFAULT_AVATAR_PATH,
      },
      name: profile.name,
      phone: profile.phone,
      email: profile.email,
      address: profile.address,
      gender: profile.gender,
      birthday: profile.birthday ? dayjs(profile.birthday) : "",
    });
  }, [profile]);

  const onSubmit = async ({ avatar, birthday, ...values }) => {
    try {
      const payload = {
        ...values,
        birthday: birthday ? dayjs(birthday).format("YYYY-MM-DD") : null,
      };
      if (avatar?.file) {
        const imageUrl = await uploadImage(avatar.file.originFileObj);
        payload.avatar = imageUrl;
      }

      await userApi.updateProfile(payload);
      await fetchProfile();
      message.success("Profile updated successfully");
    } catch (error) {
      message.error("Failed to update profile");
    }
  };

  return (
    <>
      <h2 className="text-[24px] font-semibold px-6 py-4 text-[#333] leading-tight">
        Account Information
      </h2>

      <Form
        onFinish={onSubmit}
        form={form}
        className="px-6 py-4 max-w-[580px] mx-auto"
        labelCol={{ span: 8 }}
        size="large"
        layout="vertical"
      >
        <Form.Item name="avatar" className="mb-12 flex justify-center">
          <UploadFormItem
            previewClassName="mx-auto rounded-full overflow-hidden border"
            uploadTxt="Upload Avatar"
          />
        </Form.Item>

        <Form.Item
          name="email"
          label={<p className="text-[16px]">Email</p>}
          className="mb-6"
        >
          <Input placeholder="Email" className="rounded" disabled />
        </Form.Item>

        <Form.Item
          name="phone"
          label={<p className="text-[16px]">Phone Number</p>}
          className="mb-6"
        >
          <Input placeholder="Phone Number" className="rounded" disabled />
        </Form.Item>

        <Form.Item
          name="name"
          label={<p className="text-[16px]">Full Name</p>}
          className="mb-6"
          rules={[{ required: true, message: "Please enter your name" }]}
        >
          <Input placeholder="Full Name" className="rounded" />
        </Form.Item>

        <Form.Item
          name="address"
          label={<p className="text-[16px]">Address</p>}
          className="mb-6"
          rules={[{ required: true, message: "Please enter your address" }]}
        >
          <Input placeholder="Enter Address" className="rounded" />
        </Form.Item>

        <Form.Item
          name="gender"
          label={<p className="text-[16px]">Gender</p>}
          className="mb-3"
          rules={[{ required: true, message: "Please select your gender" }]}
        >
          <Radio.Group>
            <Radio value="MALE">Male</Radio>
            <Radio value="FEMALE">Female</Radio>
          </Radio.Group>
        </Form.Item>

        <Form.Item
          name="birthday"
          label={<p className="text-[16px]">Birthday</p>}
          rules={[
            {
              required: true,
              message: "Please select your birthday",
            },
            {
              validator: (_, value) =>
                value && value.isAfter(new Date())
                  ? Promise.reject("The birthday cannot be in the future")
                  : Promise.resolve(),
            },
          ]}
        >
          <DatePicker
            placeholder="Select Birthday"
            format="DD/MM/YYYY"
            className="w-full"
            disabledDate={(current) => current && current > new Date()}
          />
        </Form.Item>

        <Form.Item wrapperCol={{ offset: 8 }}>
          <Button
            htmlType="submit"
            className="uppercase rounded text-[14px] !bg-red-600 !text-white"
          >
            Save Changes
          </Button>
        </Form.Item>
      </Form>
    </>
  );
};

export default UpdateInformation;
