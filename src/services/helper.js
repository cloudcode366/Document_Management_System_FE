import dayjs from "dayjs";

export const FORMATE_DATE_DEFAULT = "YYYY-MM-DD";
export const FORMATE_DATE_VN = "DD - MM - YYYY";

export const dateRangeValidate = (dateRange) => {
  if (!dateRange) return undefined;

  const startDate = dayjs(dateRange[0], FORMATE_DATE_DEFAULT).toDate();
  const endDate = dayjs(dateRange[1], FORMATE_DATE_DEFAULT).toDate();

  return [startDate, endDate];
};

export const convertRoleName = (roleName) => {
  switch (roleName) {
    case "Leader":
      return "Lãnh đạo trường";
    case "Chief":
      return "Chánh văn phòng";
    case "Clerical Assistant":
      return "Nhân viên văn thư";
    case "Division Head":
      return "Lãnh đạo phòng ban";
    case "Specialist":
      return "Chuyên viên";
    case "Admin":
      return "Quản trị viên";
    default:
      return roleName;
  }
};

export const convertPermissionName = (permissionName) => {
  switch (permissionName) {
    case "Create":
      return "Tạo";
    case "View":
      return "Xem";
    case "Update":
      return "Cập nhật";
    case "Delete":
      return "Xóa";
    default:
      return permissionName;
  }
};

export const convertScopeName = (scope) => {
  switch (scope) {
    case "OutGoing":
      return "Văn bản đi";
    case "InComing":
      return "Văn bản đến";
    case "Division":
      return "Nội bộ phòng ban";
    case "School":
      return "Nội bộ toàn trường";
    default:
      return "-";
  }
};

export const convertStatus = (status) => {
  switch (status) {
    case "Waiting":
      return "Đang chờ xác nhận";
    case "Revised":
      return "Cần chỉnh sửa";
    case "InProgress":
      return "Đang trong quá trình xử lý";
    case "Completed":
      return "Đã hoàn thành";
    default:
      return "Không xác định";
  }
};

export const getStatusColor = (status) => {
  switch (status) {
    case "Pending":
      return "orange";
    case "Revised":
      return "red";
    case "InProgress":
      return "blue";
    case "Completed":
      return "green";
    default:
      return "gray";
  }
};

export const convertProcessingStatus = (status) => {
  switch (status) {
    case "Archived":
      return "Đã lưu";
    case "InProgress":
      return "Đang xử lý";
    case "Completed":
      return "Đã hoàn thành";
    case "Rejected":
      return "Bị từ chối";
    default:
      "Không xác định";
  }
};

export const convertColorProcessingStatus = (status) => {
  switch (status) {
    case "Archived":
      return "green";
    case "InProgress":
      return "blue";
    case "Completed":
      return "geekblue";
    case "Rejected":
      return "red";
    default:
      return "default";
  }
};

export const convertArchivedStatus = (status) => {
  switch (status) {
    case "Archived":
      return "Đã lưu";
    case "Sent":
      return "Đã gửi";
    case "Withdrawn":
      return "Bị thu hồi";
    default:
      status;
  }
};

export const convertColorArchivedStatus = (status) => {
  switch (status) {
    case "Archived":
      return "#82E06E";
    case "Sent":
      return "#2BDBBB";
    case "Withdrawn":
      return "#FF6B6B";
    default:
      return "default";
  }
};



export function convertTaskType(taskType) {
  switch (taskType) {
    case "Create":
      return "Khởi tạo văn bản";
    case "Browse":
      return "Duyệt văn bản";
    case "Sign":
      return "Ký điện tử";
    case "View":
      return "Xem văn bản";
    case "Upload":
      return "Tải văn bản lên";
    case "CreateUpload":
      return "Khởi tạo và tải văn bản lên";
    default:
      return "Không xác định";
  }
}

