import { Avatar, Badge, Descriptions, Drawer, Image, Tag } from "antd";
import dayjs from "dayjs";
import { FORMATE_DATE_VN } from "@/services/helper";

const DetailDigitalSignature = (props) => {
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

  const digitalSignatureURL = `${
    import.meta.env.VITE_BACKEND_URL
  }/images/avatar/${dataViewDetail?.signature_image_url}`;
  return (
    <>
      <Drawer
        title="Thông tin chi tiết"
        width="50vw"
        onClose={onClose}
        open={openViewDetail}
      >
        <Descriptions bordered column={2}>
          <Descriptions.Item
            label="Chữ ký số"
            labelStyle={{ fontWeight: "bold" }}
          >
            {dataViewDetail?.name}
          </Descriptions.Item>
          <Descriptions.Item
            label="Số sê-ri"
            labelStyle={{ fontWeight: "bold" }}
          >
            {dataViewDetail?.serial_number}
          </Descriptions.Item>
          {dataViewDetail?.owner_name ? (
            <Descriptions.Item
              label="Chủ sở hữu"
              labelStyle={{ fontWeight: "bold" }}
            >
              {dataViewDetail?.owner_name}
            </Descriptions.Item>
          ) : (
            <Descriptions.Item
              label="Chủ sở hữu"
              labelStyle={{ fontWeight: "bold" }}
            >
              {dataViewDetail?.fullName}
            </Descriptions.Item>
          )}
          <Descriptions.Item
            label="Được cấp bởi"
            labelStyle={{ fontWeight: "bold" }}
          >
            {dataViewDetail?.issued_by}
          </Descriptions.Item>
          <Descriptions.Item
            label="Ngày bắt đầu có hiệu lực"
            labelStyle={{ fontWeight: "bold" }}
          >
            {dayjs(dataViewDetail?.valid_from).format(FORMATE_DATE_VN)}
          </Descriptions.Item>
          <Descriptions.Item
            label="Created At"
            labelStyle={{ fontWeight: "bold" }}
          >
            {dayjs(dataViewDetail?.valid_to).format(FORMATE_DATE_VN)}
          </Descriptions.Item>
          <Descriptions.Item
            label="Thuật toán băm"
            labelStyle={{ fontWeight: "bold" }}
          >
            {dataViewDetail?.hash_algorithm}
          </Descriptions.Item>
          <Descriptions.Item
            label="Khóa công khai"
            labelStyle={{ fontWeight: "bold" }}
          >
            {dataViewDetail?.public_key}
          </Descriptions.Item>
          <Descriptions.Item
            label="Trạng thái"
            labelStyle={{ fontWeight: "bold" }}
          >
            {dataViewDetail?.is_revoked ? (
              <Tag color="red">Bị thu hồi</Tag>
            ) : (
              <Tag color="green">Hợp lệ</Tag>
            )}
          </Descriptions.Item>
          <Descriptions.Item label="Ảnh" labelStyle={{ fontWeight: "bold" }}>
            <Image
              width={80}
              src={digitalSignatureURL}
              alt="Digital Signature"
              fallback="/images/default-signature.png" // fallback khi ảnh lỗi
            />
          </Descriptions.Item>
        </Descriptions>
      </Drawer>
    </>
  );
};

export default DetailDigitalSignature;
