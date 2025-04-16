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

const viewAllUserAPI = (page, limit, filters, sort) => {
  const urlBackend = `/api/User/view-all-user`;
  return axios.post(urlBackend, {
    page,
    limit,
    filters,
    sort,
  });
};

const changeStatusUserAPI = (userId) => {
  const urlBackend = `/api/User/delete-user?userId=${userId}`;
  return axios.post(urlBackend);
};

const createUserByFormAPI = (
  fullName,
  userName,
  email,
  phoneNumber,
  identityCard,
  divisionId,
  roleId,
  dateOfBirth,
  position,
  address,
  gender
) => {
  const urlBackend = `/api/User/create-user-by-form`;
  return axios.post(urlBackend, {
    fullName,
    userName,
    email,
    phoneNumber,
    identityCard,
    divisionId,
    roleId,
    dateOfBirth,
    position,
    address,
    gender,
  });
};

const updateUserByAdminAPI = (
  userId,
  fullName,
  email,
  address,
  phoneNumber,
  gender,
  dateOfBirth,
  position,
  divisionId,
  avatar
) => {
  const urlBackend = `/api/User/update-user-by-admin`;
  return axios.post(urlBackend, {
    userId,
    fullName,
    email,
    address,
    phoneNumber,
    gender,
    dateOfBirth,
    position,
    divisionId,
    avatar,
  });
};

const viewAllDivisionsAPI = (query) => {
  const urlBackend = `/api/Division/view-all-division?${query}`;
  return axios.get(urlBackend);
};

const createDivisionAPI = (divisionName) => {
  const urlBackend = `/api/Division/create-division?divisionName=${divisionName}`;
  return axios.post(urlBackend);
};

const updateDivisionAPI = (divisionId, divisionName) => {
  const urlBackend = `/api/Division/update-division`;
  return axios.post(urlBackend, { divisionId, divisionName });
};

const changeStatusDivisionAPI = (divisionId) => {
  const urlBackend = `/api/Division/delete-division?divisionId=${divisionId}`;
  return axios.post(urlBackend);
};

const viewAllWorkflowsAPI = (query) => {
  const urlBackend = `/api/Workflow/view-all-workflow?${query}`;
  return axios.get(urlBackend);
};

const viewWorkflowDetailsWithFlowAndStepAPI = (workflowId) => {
  const urlBackend = `/api/Workflow/view-workflow-details-with-flow-and-step?workflowId=${workflowId}`;
  return axios.get(urlBackend);
};

const updateAvatarAPI = (userId, file) => {
  const URL_BACKEND = `/api/User/update-avatar/${userId}`;
  let config = {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  };

  const bodyFormData = new FormData();
  bodyFormData.append("file", file);
  return axios.post(URL_BACKEND, bodyFormData, config);
};

const updateProfileAPI = (userId, address, dateOfBirth, gender, avatar) => {
  const urlBackend = `/api/User/update-user`;
  return axios.post(urlBackend, {
    userId,
    address,
    dateOfBirth,
    gender,
    avatar,
  });
};

const viewAllDocumentTypesAPI = (query) => {
  const urlBackend = `/api/DocumentType/view-all-document-type?${query}`;
  return axios.get(urlBackend);
};

const createDocumentTypeAPI = (documentTypeName) => {
  const urlBackend = `/api/DocumentType/create-document-type?documentTypeName=${documentTypeName}`;
  return axios.post(urlBackend);
};

const changeStatusDocumentTypeAPI = (documentTypeId) => {
  const urlBackend = `/api/DocumentType/delete-document-type?documentTypeId=${documentTypeId}`;
  return axios.post(urlBackend);
};

const viewAllRoles = () => {
  const urlBackend = `/api/Role/view-all-roles`;
  return axios.get(urlBackend);
};


const getAllTasks = async (userId) => {
  try {
    const urlBackend = await axios.get(`/api/Task/view-all-tasks`, {
      params: {
        userId: userId,
        page: 1,
        limit: 1000,
      },
    });
    return urlBackend.data.content;
  } catch (error) {
    console.error("Lỗi khi gọi API getAllTasks:", error);
    return [];
  }
};



const getTaskById = async (taskId) => {
  try {
    const response = await axios.get(`/api/Task/view-task-by-id?id=${taskId}`);
    return response.data.content;
  } catch (error) {
    console.error('Error fetching task:', error);
    throw error;
  }
};


export {
  loginAPI,
  viewProfileUserAPI,
  createSendOtpAPI,
  createVerifyOtpAPI,
  createChangePasswordAPI,
  createForgotPasswordAPI,
  viewAllUserAPI,
  viewAllWorkflowsAPI,
  viewWorkflowDetailsWithFlowAndStepAPI,
  viewAllDivisionsAPI,
  updateAvatarAPI,
  updateProfileAPI,
  viewAllDocumentTypesAPI,
  createDocumentTypeAPI,
  changeStatusDocumentTypeAPI,
  changeStatusUserAPI,
  viewAllRoles,
  createUserByFormAPI,
  updateUserByAdminAPI,
  createDivisionAPI,
  updateDivisionAPI,
  changeStatusDivisionAPI,
  getAllTasks,
  getTaskById
};
