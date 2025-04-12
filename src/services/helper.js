import dayjs from "dayjs";

export const FORMATE_DATE_DEFAULT = "YYYY-MM-DD";
export const FORMATE_DATE_VN = "DD-MM-YYYY";

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
