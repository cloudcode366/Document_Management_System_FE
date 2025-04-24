import { Descriptions, Drawer, Image, Tag } from "antd";
import dayjs from "dayjs";
import { convertRoleName, FORMATE_DATE_VN } from "@/services/helper";

const DetailUser = (props) => {
  const {
    openViewDetail,
    setOpenViewDetail,
    dataViewDetail,
    setDataViewDetail,
  } = props;

  const onClose = () => {
    setOpenViewDetail(false);
    setDataViewDetail(null);
  };

  return (
    <>
      <Drawer
        title="Chi tiết tài khoản"
        width="50vw"
        onClose={onClose}
        open={openViewDetail}
        contentStyle={{
          backgroundColor: "#f9fafc ",
          height: "100%",
        }}
      >
        <Descriptions
          bordered
          column={1}
          style={{
            backgroundColor: "#ffffff",
            padding: "6px",
            borderRadius: 10,
          }}
          labelStyle={{
            fontWeight: "bold",
            fontSize: 15,
            backgroundColor: "#F2F2F2",
            padding: "8px 12px",
            color: "#1d1d1f",
          }}
        >
          <Descriptions.Item
            label="Ảnh đại diện"
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              flexDirection: "column",
            }}
          >
            <Image
              width={300}
              height={300}
              src={dataViewDetail?.avatar || undefined}
              fallback="/default-avatar.png"
              style={{
                objectFit: "cover",
                borderRadius: "30px",
              }}
            />
          </Descriptions.Item>
        </Descriptions>

        <Descriptions
          bordered
          column={2}
          style={{
            backgroundColor: "#ffffff",
            padding: "12px",
            borderRadius: 10,
          }}
          labelStyle={{
            fontWeight: "bold",
            fontSize: 15,
            backgroundColor: "#F2F2F2",
            padding: "8px 12px",
            color: "#1d1d1f",
          }}
        >
          <Descriptions.Item
            label="Họ và tên"
            labelStyle={{ fontWeight: "bold" }}
          >
            {dataViewDetail?.fullName}
          </Descriptions.Item>
          <Descriptions.Item
            label="Căn cước công dân"
            labelStyle={{ fontWeight: "bold" }}
          >
            {dataViewDetail?.identityCard}
          </Descriptions.Item>
          <Descriptions.Item
            label="Tên đăng nhập"
            labelStyle={{ fontWeight: "bold" }}
          >
            {dataViewDetail?.userName}
          </Descriptions.Item>
          <Descriptions.Item label="Email" labelStyle={{ fontWeight: "bold" }}>
            {dataViewDetail?.email}
          </Descriptions.Item>
          <Descriptions.Item
            label="Địa chỉ"
            labelStyle={{ fontWeight: "bold" }}
          >
            {dataViewDetail?.address}
          </Descriptions.Item>
          <Descriptions.Item
            label="Số điện thoại"
            labelStyle={{ fontWeight: "bold" }}
          >
            {dataViewDetail?.phoneNumber}
          </Descriptions.Item>
          <Descriptions.Item
            label="Giới tính"
            labelStyle={{ fontWeight: "bold" }}
          >
            {dataViewDetail?.gender}
          </Descriptions.Item>
          <Descriptions.Item
            label="Trạng thái"
            labelStyle={{ fontWeight: "bold" }}
          >
            {dataViewDetail?.isDeleted ? (
              <Tag color="red" style={{ fontSize: "14px" }}>
                Bị khóa
              </Tag>
            ) : (
              <Tag color="green" style={{ fontSize: "14px" }}>
                Hoạt động
              </Tag>
            )}
          </Descriptions.Item>
          <Descriptions.Item
            label="Phòng ban"
            labelStyle={{ fontWeight: "bold" }}
          >
            {dataViewDetail?.divisionDto.divisionName}
          </Descriptions.Item>
          <Descriptions.Item
            label="Chức vụ"
            labelStyle={{ fontWeight: "bold" }}
          >
            {dataViewDetail?.position}
          </Descriptions.Item>
          <Descriptions.Item
            label="Vai trò"
            labelStyle={{ fontWeight: "bold" }}
          >
            <Tag color="geekblue" style={{ fontSize: "14px" }}>
              {convertRoleName(dataViewDetail?.mainRole?.roleName) || "—"}
            </Tag>
          </Descriptions.Item>
          <Descriptions.Item
            label="Vai trò phụ"
            labelStyle={{ fontWeight: "bold" }}
          >
            {dataViewDetail?.subRoles && dataViewDetail.subRoles.length > 0
              ? dataViewDetail.subRoles.map((role) => role.roleName).join(", ")
              : "—"}
          </Descriptions.Item>
          <Descriptions.Item
            label="Ngày sinh"
            labelStyle={{ fontWeight: "bold" }}
          >
            {dayjs(dataViewDetail?.dateOfBirth).format(FORMATE_DATE_VN)}
          </Descriptions.Item>
          <Descriptions.Item
            label="Ngày tạo"
            labelStyle={{ fontWeight: "bold" }}
          >
            {dayjs(dataViewDetail?.createdAt).format(FORMATE_DATE_VN)}
          </Descriptions.Item>
          <Descriptions.Item
            label="Ảnh chữ ký nháy"
            labelStyle={{ fontWeight: "bold" }}
          >
            <Image
              width={200}
              height={200}
              src={
                "https://chukydep.vn/Upload/chuky/loc/chu-ky-ten-loc-sm_fontss_139-otf-sm.png" ||
                undefined
              }
              fallback="/default-avatar.png"
              style={{
                objectFit: "cover",
                borderRadius: "30px",
              }}
            />
          </Descriptions.Item>
          <Descriptions.Item
            label="Ảnh chữ ký điện tử"
            labelStyle={{ fontWeight: "bold" }}
          >
            <Image
              width={200}
              height={200}
              src={
                "https://chukydep.vn/Upload/chuky/loc/chu-ky-ten-loc-sm_fontss_139-otf-sm.png" ||
                undefined
              }
              fallback="/default-avatar.png"
              style={{
                objectFit: "cover",
                borderRadius: "30px",
              }}
            />
          </Descriptions.Item>
        </Descriptions>
      </Drawer>
    </>
  );
};

export default DetailUser;
