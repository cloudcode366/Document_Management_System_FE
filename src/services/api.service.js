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

const viewAllFlowsAPI = (scope) => {
  const urlBackend = `/api/Flow/view-all-flow?scope=${scope}`;
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

const viewMySelfDocumentAPI = (page, pageSize, filters) => {
  const urlBackend = `/api/Document/view-my-self-document?page=${page}&pageSize=${pageSize}`;
  return axios.post(urlBackend, { ...filters });
};

const getAllArchivedDocuments = (page, pageSize, filters) => {
  const urlBackend = `/api/ArchiveDocument/view-all-documents?page=${page}&pageSize=${pageSize}`;
  return axios.post(urlBackend, { ...filters });
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

const updateSignatureImgAPI = (NormalSignature, DigitalSignature, isUsb) => {
  const URL_BACKEND = `/api/User/update-signature-img`;
  let config = {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  };

  const bodyFormData = new FormData();
  bodyFormData.append("NormalSignature", NormalSignature);
  bodyFormData.append("DigitalSignature", DigitalSignature);
  bodyFormData.append("isUsb", isUsb);
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

const grantPermissionAPI = (payload) => {
  const urlBackend =
    "/api/UserDocPermission/create-grand-permission-for-document";
  return axios.post(urlBackend, payload);
};

const createSendEmailAPI = ({
  receiverEmail,
  ccEmails,
  bccEmails,
  subject,
  body,
  accessToken,
  documentId,
}) => {
  const urlBackend = `/api/ArchiveDocument/create-send-email`;
  return axios.post(urlBackend, {
    receiverEmail,
    ccEmails,
    bccEmails,
    subject,
    body,
    accessToken,
    documentId,
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

const createDocumentByTemplateAPI = (
  templateId,
  workFlowId,
  documentTypeId,
  documentName,
  deadline,
  expireDate
) => {
  const urlBackend = `/api/Document/create-document-by-template`;
  return axios.post(urlBackend, {
    templateId,
    workFlowId,
    documentTypeId,
    documentName,
    deadline,
    expireDate,
  });
};

const createWithdrawDocumentAPI = (
  templateId,
  workFlowId,
  documentTypeId,
  documentName,
  deadline,
  expireDate,
  documentId
) => {
  const urlBackend = `/api/ArchiveDocument/create-withdraw-document?archiveDocumentId=${documentId}`;
  return axios.post(urlBackend, {
    templateId,
    workFlowId,
    documentTypeId,
    documentName,
    deadline,
    expireDate,
  });
};

const createReplaceDocumentAPI = (
  templateId,
  workFlowId,
  documentTypeId,
  documentName,
  deadline,
  expireDate,
  documentId
) => {
  const urlBackend = `/api/ArchiveDocument/create-replace-document?archiveDocumentId=${documentId}`;
  return axios.post(urlBackend, {
    templateId,
    workFlowId,
    documentTypeId,
    documentName,
    deadline,
    expireDate,
  });
};

const createUploadDocumentForSubmitAPI = (DocumentId, File) => {
  const URL_BACKEND = `/api/Document/create-upload-document-for-submit`;
  let config = {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  };

  const bodyFormData = new FormData();
  bodyFormData.append("DocumentId", DocumentId);
  bodyFormData.append("File", File);
  return axios.post(URL_BACKEND, bodyFormData, config);
};

const updateConfirmDocumentBySubmit = (
  documentId,
  documentName,
  documentTypeName,
  aiDocumentName,
  aiDocumentType,
  documentContent,
  numberOfDocument,
  isDifferent,
  fileBase64,
  validFrom,
  attachments
) => {
  const urlBackend = `/api/Document/update-confirm-document-by-submit`;
  return axios.post(urlBackend, {
    documentId,
    documentName,
    documentTypeName,
    aiDocumentName,
    aiDocumentType,
    documentContent,
    numberOfDocument,
    isDifferent,
    fileBase64,
    validFrom,
    attachments,
  });
};

const updateEnableSignatureImgAPI = (userId) => {
  const urlBackend = `/api/User/update-enable-signature-img?userId=${userId}`;
  return axios.post(urlBackend);
};

const viewAllLogsAPI = (page, pageSize, filters = {}) => {
  const urlBackend = `/api/Log/view-all-log`;
  const queryParams = new URLSearchParams({});

  // Add filters
  if (filters.query) {
    queryParams.append("query", filters.query);
  }
  if (filters.startTime) {
    queryParams.append("startTime", filters.startTime);
  }
  if (filters.endTime) {
    queryParams.append("endTime", filters.endTime);
  }
  if (page) {
    queryParams.append("page", page);
  }
  if (pageSize) {
    queryParams.append("pageSize", pageSize);
  }

  return axios.get(`${urlBackend}?${queryParams.toString()}`);
};

const deleteTemplateAPI = (templateId) => {
  const urlBackend = `/api/ArchiveDocument/delete-template?templateId=${templateId}`;
  return axios.delete(urlBackend);
};

const createLogDownloadAPI = (documentId) => {
  const urlBackend = `/api/Document/create-log-download?documentId=${documentId}`;
  return axios.get(urlBackend);
};

const viewDivisionDetailsAPI = (divisionId) => {
  const urlBackend = `/api/Division/view-division-details?divisionId=${divisionId}`;
  return axios.get(urlBackend);
};

const createUploadAttachmentAPI = (file) => {
  const URL_BACKEND = `/api/Document/create-upload-attachment`;
  let config = {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  };

  const bodyFormData = new FormData();
  bodyFormData.append("attachmentDocumentRequest", file);
  return axios.post(URL_BACKEND, bodyFormData, config);
};

const updateWithdrawDocumentByIdAPI = (archiveDocumentId) => {
  const URL_BACKEND = `/api/ArchiveDocument/update-withdraw-document-by-id?archiveDocumentId=${archiveDocumentId}`;
  return axios.post(URL_BACKEND);
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
  grantPermissionAPI,
  createSendEmailAPI,
  createSignInSignatureDigitalAPI,
  createSignatureDigitalAPI,
  createDocumentByTemplateAPI,
  createUploadDocumentForSubmitAPI,
  updateConfirmDocumentBySubmit,
  updateEnableSignatureImgAPI,
  createWithdrawDocumentAPI,
  viewAllLogsAPI,
  createReplaceDocumentAPI,
  deleteTemplateAPI,
  createLogDownloadAPI,
  viewDivisionDetailsAPI,
  createUploadAttachmentAPI,
  updateWithdrawDocumentByIdAPI,
};
