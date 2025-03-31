import { Avatar, Badge, Descriptions, Drawer } from "antd";
import dayjs from "dayjs";
import { FORMATE_DATE_VN } from "@/services/helper";

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

  const avatarURL = `${import.meta.env.VITE_BACKEND_URL}/images/avatar/${
    dataViewDetail?.avatar
  }`;
  return (
    <>
      <Drawer
        title="Thông tin chi tiết"
        width="50vw"
        onClose={onClose}
        open={openViewDetail}
      >
        <Descriptions bordered column={2}>
          <Descriptions.Item label="Họ và tên">
            {dataViewDetail?.fullName}
          </Descriptions.Item>
          <Descriptions.Item label="Căn cước công dân">
            {dataViewDetail?.identity_card}
          </Descriptions.Item>
          <Descriptions.Item label="Tên đăng nhập">
            {dataViewDetail?.username}
          </Descriptions.Item>
          <Descriptions.Item label="Email">
            {dataViewDetail?.email}
          </Descriptions.Item>
          <Descriptions.Item label="Địa chỉ">
            {dataViewDetail?.address}
          </Descriptions.Item>
          <Descriptions.Item label="Số điện thoại">
            {dataViewDetail?.phone}
          </Descriptions.Item>
          <Descriptions.Item label="Giới tính">
            {dataViewDetail?.gender}
          </Descriptions.Item>
          <Descriptions.Item label="Trạng thái">
            {dataViewDetail?.is_enabled}
          </Descriptions.Item>
          <Descriptions.Item label="Phòng ban">
            {dataViewDetail?.division.name}
          </Descriptions.Item>
          <Descriptions.Item label="Chức vụ">
            {dataViewDetail?.position}
          </Descriptions.Item>
          <Descriptions.Item label="Vai trò">
            <Badge status="processing" text={dataViewDetail?.role} />
          </Descriptions.Item>
          <Descriptions.Item label="Vai trò phụ">
            <Badge status="processing" text={dataViewDetail?.sub_role} />
          </Descriptions.Item>
          <Descriptions.Item label="Ngày sinh">
            {dayjs(dataViewDetail?.DateOfBirth).format(FORMATE_DATE_VN)}
          </Descriptions.Item>
          <Descriptions.Item label="Created At">
            {dayjs(dataViewDetail?.createdAt).format(FORMATE_DATE_VN)}
          </Descriptions.Item>
          <Descriptions.Item label="Avatar">
            <Avatar size={40} src={avatarURL}></Avatar>
          </Descriptions.Item>
          <Descriptions.Item label="Chữ ký nháy">
            <Avatar size={40} src={avatarURL}></Avatar>
          </Descriptions.Item>
        </Descriptions>
      </Drawer>
    </>
  );
};

export default DetailUser;
