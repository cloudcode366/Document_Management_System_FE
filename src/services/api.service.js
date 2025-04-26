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

const createImportUsersFromExcelAPI = (divisionId, payload) => {
  const URL_BACKEND = `/api/User/create-import-users-from-excel?divisionId=${divisionId}`;
  return axios.post(URL_BACKEND, payload);
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
  avatar,
  subRoleId
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
    subRoleId,
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

const createDocumentTypeAPI = (documentTypeName, acronym) => {
  const urlBackend = `/api/DocumentType/create-document-type`;
  return axios.post(urlBackend, { documentTypeName, acronym });
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
    console.error("Error fetching task:", error);
    throw error;
  }
};

const viewRoleResourcesAPI = (roleFillter) => {
  const urlBackend = `/api/RoleResource/view-role-resources?roleFillter=${roleFillter}`;
  return axios.get(urlBackend);
};

const updateResourcesAPI = (roleId, resourceIds) => {
  const urlBackend = `/api/RoleResource/create-role-with-resources`;
  return axios.post(urlBackend, [{ roleId, resourceIds }]);
};

const createSubRoleAPI = (roleName) => {
  const urlBackend = `/api/Role/create-role`;
  return axios.post(urlBackend, { roleName });
};

const viewAllFlowsAPI = () => {
  const urlBackend = `/api/Flow/view-all-flow`;
  return axios.get(urlBackend);
};

const createWorkflowAPI = (data) => {
  const urlBackend = `/api/Workflow/create-workflow`;
  return axios.post(urlBackend, data);
};

const viewDocumentTypeNameByWorkflowId = (workflowId) => {
  const urlBackend = `/api/DocumentType/view-document-type-name-by-workflow-id?workflowId=${workflowId}`;
  return axios.get(urlBackend);
};

const changeStatusWorkflowAPI = (workflowId) => {
  const urlBackend = `/api/Workflow/delete-workflow?workflowId=${workflowId}`;
  return axios.post(urlBackend);
};

const viewNotificationsByUserId = (userId, page, limit) => {
  const urlBackend = `/api/Notification/view-notifications-by-user-id?userId=${userId}&page=${page}&limit=${limit}`;
  return axios.get(urlBackend);
};

const updateMarkNotificationAsRead = (notiticationId) => {
  const urlBackend = `/api/Notification/update-mark-notification-as-read?notificationId=${notiticationId}`;
  return axios.post(urlBackend);
};

const viewDocumentsByTabForUserAPI = (query) => {
  const urlBackend = `/api/Task/view-documents-by-tab-for-user?${query}`;
  return axios.get(urlBackend);
};

const viewDetailDocumentAPI = (documentId) => {
  const urlBackend = `/api/Document/view-detail-document?documentId=${documentId}`;
  return axios.get(urlBackend);
};

const viewWorkflowByScopeAPI = (scope) => {
  const urlBackend = `/api/Workflow/view-workflow-by-scope?scope=${scope}`;
  return axios.get(urlBackend);
};

const createUploadDocumentAPI = (file) => {
  const URL_BACKEND = `/api/Document/create-upload-document`;
  let config = {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  };

  const bodyFormData = new FormData();
  bodyFormData.append("file", file);
  return axios.post(URL_BACKEND, bodyFormData, config);
};

const viewUsersFromExcelAPI = (file) => {
  const URL_BACKEND = `/api/User/view-users-from-excel`;
  let config = {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  };

  const bodyFormData = new FormData();
  bodyFormData.append("file", file);
  return axios.post(URL_BACKEND, bodyFormData, config);
};

const createInComingDocumentAPI = (req) => {
  const urlBackend = `/api/Document/create-incoming-document`;
  return axios.post(urlBackend, req);
};

const viewMySelfDocumentAPI = (query) => {
  const urlBackend = `/api/Document/view-my-self-document?${query}`;
  return axios.get(urlBackend);
};

const getAllArchivedDocuments = (query) => {
  const urlBackend = `/api/ArchiveDocument/view-all-documents?${query}`;
  return axios.get(urlBackend);
};

const viewProcessDocumentDetailAPI = (documentId) => {
  const urlBackend = `/api/Document/view-process-document-detail?documentId=${documentId}`;
  return axios.get(urlBackend);
};

const viewArchivedDocumentDetailAPI = (documentId) => {
  const urlBackend = `/api/ArchiveDocument/view-archive-document-detail?documentId=${documentId}`;
  return axios.get(urlBackend);
};

const createConvertDocToPdfAPI = (file) => {
  const URL_BACKEND = `/api/Document/create-convert-doc-to-pdf`;

  let config = {
    headers: {
      "Content-Type": "multipart/form-data",
    },
    responseType: "blob",
  };

  const bodyFormData = new FormData();
  bodyFormData.append("file", file);

  return axios.post(URL_BACKEND, bodyFormData, config);
};

const createTemplateAPI = (
  templateName,
  documentTypeId,
  llx,
  lly,
  urx,
  ury,
  page,
  template
) => {
  const URL_BACKEND = `/api/ArchiveDocument/create-template`;

  let config = {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  };

  const bodyFormData = new FormData();
  bodyFormData.append("TemplateName", templateName);
  bodyFormData.append("DocumentTypeId", documentTypeId);
  bodyFormData.append("Llx", llx);
  bodyFormData.append("Lly", lly);
  bodyFormData.append("Urx", urx);
  bodyFormData.append("Ury", ury);
  bodyFormData.append("Page", page);
  bodyFormData.append("Template", template);

  return axios.post(URL_BACKEND, bodyFormData, config);
};

const viewAllTemplatesAPI = (query) => {
  const urlBackend = `/api/ArchiveDocument/view-all-templates?${query}`;
  return axios.get(urlBackend);
};

const viewMainWorkflowByScopeAPI = (scope) => {
  const urlBackend = `/api/Workflow/view-main-workflow-by-scope?scope=${scope}`;
  return axios.get(urlBackend);
};

const createTaskAPI = (
  title,
  description,
  startDate,
  endDate,
  taskType,
  stepId,
  documentId,
  userId
) => {
  const urlBackend = `/api/Task/create-task`;
  return axios.post(urlBackend, {
    title,
    description,
    startDate,
    endDate,
    taskType,
    stepId,
    documentId,
    userId,
  });
};

const createFirstTaskAPI = (
  title,
  description,
  startDate,
  endDate,
  taskType,
  documentId,
  userId
) => {
  const urlBackend = `/api/Task/create-first-task`;
  return axios.post(urlBackend, {
    title,
    description,
    startDate,
    endDate,
    taskType,
    documentId,
    userId,
  });
};

const updateConfirmTaskWithDocumentAPI = (documentId) => {
  const urlBackend = `/api/Document/update-confirm-task-with-document?documentId=${documentId}`;
  return axios.post(urlBackend);
};

const createHandleTaskActionAPI = (taskId, userId, action) => {
  const urlBackend = `/api/Task/create-handle-task-action?taskId=${taskId}&userId=${userId}&action=${action}`;
  return axios.post(urlBackend);
};

const deleteTaskAPI = (taskId) => {
  const urlBackend = `/api/Task/delete-task?taskId=${taskId}`;
  return axios.post(urlBackend);
};

const updateTaskAPI = (
  taskId,
  title,
  description,
  startDate,
  endDate,
  userId
) => {
  const urlBackend = `/api/Task/update-task`;
  return axios.post(urlBackend, {
    taskId,
    title,
    description,
    startDate,
    endDate,
    userId,
  });
};

const updateInsertNameSignatureImgAPI = (file, fullName) => {
  const URL_BACKEND = `/api/User/update-insert-name-signature-img`;
  let config = {
    headers: {
      "Content-Type": "multipart/form-data",
    },
    responseType: "blob",
  };

  const bodyFormData = new FormData();
  bodyFormData.append("file", file);
  bodyFormData.append("fullName", fullName);
  return axios.post(URL_BACKEND, bodyFormData, config);
};

const updateSignatureImgAPI = (NormalSignature, DigitalSignature) => {
  const URL_BACKEND = `/api/User/update-signature-img`;
  let config = {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  };

  const bodyFormData = new FormData();
  bodyFormData.append("NormalSignature", NormalSignature);
  bodyFormData.append("DigitalSignature", DigitalSignature);
  return axios.post(URL_BACKEND, bodyFormData, config);
};

const createRejectDocumentActionAPI = (reason, taskId, userId) => {
  const urlBackend = `/api/Task/create-reject-document-action`;
  return axios.post(urlBackend, {
    reason,
    taskId,
    userId,
  });
};

const createSignInSignatureDigitalAPI = (userName, password) => {
  const urlBackend = `/api/SignatureDIgitalApi/create-sign-in-signature-digital`;
  return axios.post(urlBackend, { userName, password });
};

const createSignatureDigitalAPI = (
  otpCode,
  token,
  llx,
  lly,
  urx,
  ury,
  pageNumber,
  documentId
) => {
  const urlBackend = `/api/SignatureDIgitalApi/create-signature-digital`;
  return axios.post(urlBackend, {
    otpCode,
    token,
    llx,
    lly,
    urx,
    ury,
    pageNumber,
    documentId,
  });
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
  getTaskById,
  viewRoleResourcesAPI,
  updateResourcesAPI,
  createSubRoleAPI,
  viewAllFlowsAPI,
  createWorkflowAPI,
  viewDocumentTypeNameByWorkflowId,
  createImportUsersFromExcelAPI,
  changeStatusWorkflowAPI,
  viewNotificationsByUserId,
  updateMarkNotificationAsRead,
  viewDocumentsByTabForUserAPI,
  viewDetailDocumentAPI,
  viewWorkflowByScopeAPI,
  createUploadDocumentAPI,
  createInComingDocumentAPI,
  viewMySelfDocumentAPI,
  getAllArchivedDocuments,
  viewProcessDocumentDetailAPI,
  viewArchivedDocumentDetailAPI,
  viewUsersFromExcelAPI,
  createConvertDocToPdfAPI,
  createTemplateAPI,
  viewAllTemplatesAPI,
  createTaskAPI,
  createFirstTaskAPI,
  updateConfirmTaskWithDocumentAPI,
  createHandleTaskActionAPI,
  deleteTaskAPI,
  updateTaskAPI,
  updateInsertNameSignatureImgAPI,
  updateSignatureImgAPI,
  createRejectDocumentActionAPI,
  viewMainWorkflowByScopeAPI,
  createSignInSignatureDigitalAPI,
  createSignatureDigitalAPI,
};
