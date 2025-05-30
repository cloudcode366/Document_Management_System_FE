import React, { useEffect, useState } from "react";
import { Modal, Descriptions, Spin, Image } from "antd";
import { viewProfileUserAPI } from "@/services/api.service";
import { convertRoleName } from "@/services/helper";

const UserInfo = (props) => {
  const { userId, setUserId, openUserInfoModal, setOpenUserInfoModal } = props;
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchDivision = async () => {
      setLoading(true);
      const res = await viewProfileUserAPI(userId);
      if (res.data.statusCode === 200) {
        const data = res.data.content;
        const mainRole = data?.roles?.find((r) => r.createdDate === null);
        const subRole = data?.roles?.find((r) => r.createdDate !== null);
        setUser({ ...data, mainRole, subRole });
      }
      setLoading(false);
    };

    if (openUserInfoModal) {
      fetchDivision();
    }
  }, [openUserInfoModal, userId]);

  return (
    <Modal
      title="Thông tin người dùng"
      open={openUserInfoModal}
      onCancel={() => {
        setOpenUserInfoModal(false);
        setUserId(null);
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
              src={user?.avatar}
              alt={user?.fullName}
            />
            <div className="user-fullname">{user?.fullName}</div>
          </div>

          {/* Info column */}
          <div className="info-column">
            <Descriptions column={1} bordered size="small">
              <Descriptions.Item
                label="Tên đăng nhập"
                labelStyle={{ fontWeight: "bold", color: "#1d1d1f" }}
              >
                {user?.userName}
              </Descriptions.Item>
              <Descriptions.Item
                label="Vai trò"
                labelStyle={{ fontWeight: "bold", color: "#1d1d1f" }}
              >
                {convertRoleName(user?.mainRole?.roleName)}
              </Descriptions.Item>
              <Descriptions.Item
                label="Email"
                labelStyle={{ fontWeight: "bold", color: "#1d1d1f" }}
              >
                {user?.email}
              </Descriptions.Item>
              <Descriptions.Item
                label="Số điện thoại"
                labelStyle={{ fontWeight: "bold", color: "#1d1d1f" }}
              >
                {user?.phoneNumber}
              </Descriptions.Item>
              <Descriptions.Item
                label="Phòng ban"
                labelStyle={{ fontWeight: "bold", color: "#1d1d1f" }}
              >
                {user?.divisionDto?.divisionName}
              </Descriptions.Item>
              <Descriptions.Item
                label="Chức vụ"
                labelStyle={{ fontWeight: "bold", color: "#1d1d1f" }}
              >
                {user?.position}
              </Descriptions.Item>
            </Descriptions>
          </div>
        </div>
      </Spin>
    </Modal>
  );
};

export default UserInfo;
