const backendDomain = "http://localhost:4000";
const SummaryApi = {
  signUp: {
    url: `${backendDomain}/api/signup`,
    method: "POST",
  },
  signIn: {
    url: `${backendDomain}/api/signin`,
    method: "POST",
  },
  current_user: {
    url: `${backendDomain}/api/user-details`,
    method: "GET",
  },
  userLogout: {
    url: `${backendDomain}/api/userLogout`,
    method: "GET",
  },
  allUser: {
    url: `${backendDomain}/api/all-user`,
    method: "GET",
  },
  updateUser: {
    url: `${backendDomain}/api/update-user`,
    method: "POST",
  },
};
export default SummaryApi;
