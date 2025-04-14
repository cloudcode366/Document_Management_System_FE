import React, { useEffect, useState } from "react";
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
  Image,
} from "antd";
import { UserOutlined, EditOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import "@/styles/profile.scss";
import { TbPasswordUser } from "react-icons/tb";
import UpdateProfile from "@/components/update.profile";
import { useNavigate } from "react-router-dom";
import { useCurrentApp } from "@/components/context/app.context";
import { viewProfileUserAPI } from "@/services/api.service";
import { convertRoleName } from "@/services/helper";
import { BeatLoader } from "react-spinners";
import "styles/loading.scss";

const { Title, Text } = Typography;

const ProfilePage = () => {
  const { user } = useCurrentApp();
  const navigate = useNavigate();

  const [openModalUpdate, setOpenModalUpdate] = useState(false);
  const [dataUpdate, setDataUpdate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const fetchAccount = async () => {
      setLoading(true);
      const userId = localStorage.getItem("user_id");
      const res = await viewProfileUserAPI(userId);
      if (res.data.statusCode === 200) {
        const data = res.data.content;
        const mainRole = data?.roles?.find((r) => r.createdDate === null);
        const subRole = data?.roles?.filter((r) => r.createdDate !== null);
        setProfile({ ...data, mainRole, subRole });
      }
      setLoading(false);
    };

    fetchAccount();
  }, []);

  const reloadPage = () => {
    window.location.reload();
  };

  if (loading) {
    return (
      <div
        className="full-screen-overlay"
        style={{
          position: "fixed",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
        }}
      >
        <BeatLoader size={25} color="#364AD6" />
      </div>
    );
  }

  return (
    <div className="profile-page">
      <Card className="profile-card">
        <div className="profile-header">
          <div className="profile-avatar-info">
            <Image
              width={200}
              height={200}
              src={profile?.avatar || undefined}
              fallback="/default-avatar.png"
              style={{
                objectFit: "cover",
                borderRadius: "30px",
              }}
            />

            <div>
              <Title level={4} style={{ marginBottom: 0 }}>
                {profile?.fullName}
              </Title>
              <Text type="secondary">{profile?.position}</Text>
              <div className="tags">
                <Text style={{ fontWeight: "500" }}>Vai trò chính: </Text>
                <Tag color="geekblue">
                  {convertRoleName(profile?.mainRole?.roleName) || "—"}
                </Tag>

                <Text style={{ fontWeight: "500" }}>Vai trò phụ: </Text>
                {profile?.subRole?.length > 0 ? (
                  profile?.subRole.map((r) => (
                    <Tag key={r.roleId} color="blue">
                      {r.roleName}
                    </Tag>
                  ))
                ) : (
                  <Text>—</Text>
                )}
              </div>
            </div>
          </div>
          <div className="action-buttons">
            <Button
              type="primary"
              icon={<EditOutlined />}
              onClick={() => {
                setOpenModalUpdate(true);
                setDataUpdate(profile);
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
                navigate(
                  user.mainRole.roleName === "Admin"
                    ? "/admin/change-password"
                    : "/change-password"
                );
              }}
            >
              Thay đổi mật khẩu
            </Button>
          </div>
        </div>

        <Form layout="vertical" className="profile-form">
          <Row gutter={24}>
            <Col span={12}>
              <Form.Item label="Email">
                <Input value={profile?.email} readOnly />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Tên đăng nhập">
                <Input value={profile?.userName} readOnly />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Căn cước công dân">
                <Input value={profile?.identityCard} readOnly />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item label="Phòng ban">
                <Input value={profile?.divisionDto?.divisionName} readOnly />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Số điện thoại">
                <Input value={profile?.phoneNumber} readOnly />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item label="Địa chỉ">
                <Input value={profile?.address} readOnly />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Giới tính">
                <Input
                  value={profile?.gender === "MALE" ? "Nam" : "Nữ"}
                  readOnly
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Ngày sinh">
                <Input
                  value={dayjs(profile?.dateOfBirth).format("DD - MM - YYYY")}
                  readOnly
                />
              </Form.Item>
            </Col>
            {/* <Col span={12}>
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
            </Col> */}
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
