import React, { useEffect, useState } from "react";
import { Modal, Avatar, Descriptions, Spin, Image } from "antd";
import { viewDivisionDetailsAPI } from "@/services/api.service";
import "./user.info.modal.css";

const UserInfoModal = ({
  openUserInfoModal,
  setOpenUserInfoModal,
  currentUser,
  setCurrentUser,
}) => {
  const [divisionName, setDivisionName] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchDivision = async () => {
      if (!currentUser?.divisionId) return;
      setLoading(true);
      try {
        const response = await viewDivisionDetailsAPI(currentUser.divisionId);
        setDivisionName(response.data?.content?.divisionName);
      } catch (error) {
        console.error("Lỗi lấy thông tin phòng ban:", error);
        setDivisionName("Không xác định");
      } finally {
        setLoading(false);
      }
    };

    if (openUserInfoModal) {
      fetchDivision();
    }
  }, [openUserInfoModal, currentUser?.divisionId]);

  return (
    <Modal
      title="Thông tin người dùng"
      open={openUserInfoModal}
      onCancel={() => {
        setOpenUserInfoModal(false);
        setCurrentUser(null);
        setDivisionName("");
        setLoading(false);
      }}
      width={750}
      centered
      footer={null}
    >
      <Spin spinning={loading}>
        <div className="user-info-container">
          {/* Avatar column */}
          <div className="avatar-column">
            <Image
              width={200}
              height={200}
              style={{
                objectFit: "cover",
                borderRadius: "30px",
              }}
              src={currentUser?.avatar}
              alt={currentUser?.fullName}
            />
            <div className="user-fullname">{currentUser?.fullName}</div>
          </div>

          {/* Info column */}
          <div className="info-column">
            <Descriptions column={1} bordered size="small">
              <Descriptions.Item
                label="Tên đăng nhập"
                labelStyle={{ fontWeight: "bold", color: "#1d1d1f" }}
              >
                {currentUser?.userName}
              </Descriptions.Item>
              <Descriptions.Item
                label="Email"
                labelStyle={{ fontWeight: "bold", color: "#1d1d1f" }}
              >
                {currentUser?.email}
              </Descriptions.Item>
              <Descriptions.Item
                label="Số điện thoại"
                labelStyle={{ fontWeight: "bold", color: "#1d1d1f" }}
              >
                {currentUser?.phoneNumber}
              </Descriptions.Item>
              <Descriptions.Item
                label="Chức vụ"
                labelStyle={{ fontWeight: "bold", color: "#1d1d1f" }}
              >
                {currentUser?.position}
              </Descriptions.Item>
              <Descriptions.Item
                label="Phòng ban"
                labelStyle={{ fontWeight: "bold", color: "#1d1d1f" }}
              >
                {divisionName}
              </Descriptions.Item>
              <Descriptions.Item
                label="Địa chỉ "
                labelStyle={{ fontWeight: "bold", color: "#1d1d1f" }}
              >
                {currentUser?.address}
              </Descriptions.Item>
            </Descriptions>
          </div>
        </div>
      </Spin>
    </Modal>
  );
};

export default UserInfoModal;
