import dayjs from "dayjs";

export const FORMATE_DATE_DEFAULT = "YYYY-MM-DD";
export const FORMATE_DATE_VN = "DD-MM-YYYY";

export const dateRangeValidate = (dateRange) => {
  if (!dateRange) return undefined;

  const startDate = dayjs(dateRange[0], FORMATE_DATE_DEFAULT).toDate();
  const endDate = dayjs(dateRange[1], FORMATE_DATE_DEFAULT).toDate();

  return [startDate, endDate];
};
