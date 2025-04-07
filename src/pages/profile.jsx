import React, { useState } from "react";
import {
  Card,
  Avatar,
  Tag,
  Button,
  Form,
  Input,
  Row,
  Col,
  Typography,
} from "antd";
import { UserOutlined, EditOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import "@/styles/profile.scss";
import { CgPassword } from "react-icons/cg";
import { GiPassport } from "react-icons/gi";
import { TbPasswordUser } from "react-icons/tb";
import UpdateProfile from "@/components/update.profile";
import { useNavigate } from "react-router-dom";

const { Title, Text } = Typography;

const ProfilePage = () => {
  const [openModalUpdate, setOpenModalUpdate] = useState(false);
  const [dataUpdate, setDataUpdate] = useState(null);
  const navigate = useNavigate();

  const user = {
    user_id: "67d28507e4cb13ef8cfe35fd",
    fullName: "Ngô Huỳnh Tấn Lộc",
    username: "locnht1",
    email: "admin@gmail.com",
    avatar: "",
    phone_number: "123456789",
    address: "Thanh pho Ho Chi Minh",
    createdAt: "2025-03-13T07:11:00.943Z",
    updatedAt: "2025-03-13T07:11:00.943Z",
    gender: "NAM",
    identity_card: "0123456789",
    is_enabled: true,
    division: { division_id: 1, name: "Phong Cong Nghe Thong Tin" },
    position: "Chuyên viên phòng Công nghệ thông tin",
    DateOfBirth: "2003-11-23",
    role: "ADMIN",
    subRole: "",
    signature: [{ certificate_id: "", issued_by: "", signature_image_url: "" }],
  };

  const reloadPage = () => {
    window.location.reload();
  };

  return (
    <div className="profile-page">
      <Card className="profile-card">
        <div className="profile-header">
          <div className="profile-avatar-info">
            <Avatar
              size={80}
              icon={<UserOutlined />}
              src={user.avatar || undefined}
            />
            <div>
              <Title level={4} style={{ marginBottom: 0 }}>
                {user.fullName}
              </Title>
              <Text type="secondary">{user.position}</Text>
              <div className="tags">
                <Text>Vai trò chính: </Text>
                <Tag color="orange">{user.role}</Tag>
                <Text>Vai trò phụ: {user.subRole || "—"}</Text>
              </div>
            </div>
          </div>
          <div className="action-buttons">
            <Button
              type="primary"
              icon={<EditOutlined />}
              onClick={() => {
                setOpenModalUpdate(true);
                setDataUpdate(user);
              }}
            >
              Cập nhật hồ sơ
            </Button>
            <Button
              type="primary"
              icon={<TbPasswordUser />}
              style={{
                backgroundColor: "#52c41a",
                borderColor: "#52c41a",
              }}
              onClick={() => {
                navigate("/admin/change-password");
              }}
            >
              Thay đổi mật khẩu
            </Button>
          </div>
        </div>

        <Form layout="vertical" className="profile-form">
          <Row gutter={24}>
            <Col span={12}>
              <Form.Item label="Họ và tên">
                <Input value={user.fullName} readOnly />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Tên đăng nhập">
                <Input value={user.username} readOnly />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Căn cước công dân">
                <Input value={user.identity_card} readOnly />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Email">
                <Input value={user.email} readOnly />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Số điện thoại">
                <Input value={user.phone_number} readOnly />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item label="Địa chỉ">
                <Input value={user.address} readOnly />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Giới tính">
                <Input value={user.gender === "NAM" ? "Nam" : "Nữ"} readOnly />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Ngày sinh">
                <Input
                  value={dayjs(user.DateOfBirth).format("DD-MM-YYYY")}
                  readOnly
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Chữ ký số">
                <div className="signature-box">
                  {user.signature[0]?.signature_image_url ? (
                    <img
                      src={user.signature[0].signature_image_url}
                      alt="Chữ ký"
                    />
                  ) : (
                    <span>Chưa có chữ ký</span>
                  )}
                </div>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Chữ ký nháy">
                <div className="signature-box">
                  {user.signature[0]?.signature_image_url ? (
                    <img
                      src={user.signature[0].signature_image_url}
                      alt="Chữ ký"
                    />
                  ) : (
                    <span>Chưa có chữ ký</span>
                  )}
                </div>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Card>

      <UpdateProfile
        openModalUpdate={openModalUpdate}
        setOpenModalUpdate={setOpenModalUpdate}
        dataUpdate={dataUpdate}
        setDataUpdate={setDataUpdate}
        reloadPage={reloadPage}
      />
    </div>
  );
};

export default ProfilePage;
