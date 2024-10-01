import { useDispatch, useSelector } from "react-redux";
import { setProfile as setProfileAction } from "../store/profileSlice";

const useProfile = () => {
  const { profile } = useSelector((state) => state.profile);
  const dispatch = useDispatch();

  const setProfile = (profile) => {
    dispatch(setProfileAction(profile));
  };

  return {
    profile,
    setProfile,
  };
};

export default useProfile;
