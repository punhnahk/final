import { message } from "antd";
import userApi from "../api/userApi";
import useProfile from "./useProfile";

const useProfileInitial = () => {
  const { setProfile } = useProfile();

  const fetchProfile = async () => {
    try {
      const res = await userApi.getProfile();
      setProfile(res.data);
    } catch (error) {
      message.error("Failed to fetch profile");
    }
  };

  return { fetchProfile };
};

export default useProfileInitial;
