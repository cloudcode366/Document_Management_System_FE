import axios from "./axios.customize";

const loginAPI = (email, password) => {
  const urlBackend = "/api/Authentication/view-sign-in";
  const fcmToken = "string";
  return axios.post(urlBackend, { email, password, fcmToken });
};

const viewProfileUserAPI = (userId) => {
  const urlBackend = `/api/User/view-profile-user?userId=${userId}`;
  return axios.get(urlBackend);
};

const createSendOtpAPI = (email) => {
  const urlBackend = `/api/Authentication/create-send-otp?email=${email}`;
  return axios.post(urlBackend);
};

const createVerifyOtpAPI = (email, otpCode) => {
  const urlBackend = `/api/Authentication/create-verify-otp`;
  return axios.post(urlBackend, { email, otpCode });
};

const createChangePasswordAPI = (
  email,
  otpCode,
  oldPassword,
  newPassword,
  confirmPassword
) => {
  const urlBackend = `/api/Authentication/create-change-password`;
  return axios.post(urlBackend, {
    email,
    otpCode,
    oldPassword,
    newPassword,
    confirmPassword,
  });
};

const createForgotPasswordAPI = (
  email,
  otpCode,
  newPassword,
  confirmPassword
) => {
  const urlBackend = `/api/Authentication/create-forgot-password`;
  return axios.post(urlBackend, {
    email,
    otpCode,
    newPassword,
    confirmPassword,
  });
};

export {
  loginAPI,
  viewProfileUserAPI,
  createSendOtpAPI,
  createVerifyOtpAPI,
  createChangePasswordAPI,
  createForgotPasswordAPI,
};
