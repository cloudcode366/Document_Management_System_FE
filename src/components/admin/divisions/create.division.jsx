import { MinusCircleOutlined } from "@ant-design/icons";
import {
  App,
  Avatar,
  Button,
  Col,
  Divider,
  Form,
  Input,
  Modal,
  Row,
  Select,
  Table,
  Tag,
} from "antd";
import { useEffect, useState } from "react";

const CreateDivision = (props) => {
  const { openModalCreate, setOpenModalCreate, refreshTable } = props;
  const [departmentName, setDepartmentName] = useState("");
  const { message, notification } = App.useApp();
  const [users, setUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSelectUser = (userId) => {
    const user = users.find((u) => u.user_id === userId);
    if (user && !selectedUsers.find((u) => u.user_id === userId)) {
      setSelectedUsers([...selectedUsers, user]);
    }
  };

  const handleRemoveUser = (userId) => {
    setSelectedUsers(selectedUsers.filter((user) => user.user_id !== userId));
  };

  const handleClose = () => {
    setDepartmentName("");
    setSelectedUsers([]);
    setOpenModalCreate(false);
  };

  const handleCreateDepartment = () => {
    // if (!departmentName.trim() || selectedUsers.length === 0) {
    //   message.warning("Vui lòng nhập tên phòng ban và chọn ít nhất một người dùng!");
    //   return;
    // }
    // setLoading(true);
    // const newDepartment = {
    //   name: departmentName,
    //   createdAt: new Date().toISOString(),
    //   is_deleted: false,
    //   list_users: selectedUsers.map(user => ({
    //     user_id: user.user_id,
    //     fullName: user.fullName,
    //     username: user.username,
    //     email: user.email,
    //     avatar: user.avatar,
    //     role: user.role,
    //   })),
    // };
    // axios.post("/api/departments", newDepartment) // Đổi URL API theo hệ thống của bạn
    //   .then(() => {
    //     message.success("Phòng ban được tạo thành công!");
    //     setDepartmentName(""); // Reset input
    //     setSelectedUsers([]); // Reset danh sách user
    //     onClose(); // Đóng modal
    //   })
    //   .catch(error => {
    //     console.error("Lỗi khi tạo phòng ban", error);
    //     message.error("Có lỗi xảy ra, vui lòng thử lại!");
    //   })
    //   .finally(() => setLoading(false));
  };

  const columns = [
    {
      title: "Ảnh",
      dataIndex: "avatar",
      render: (avatar) => <Avatar src={avatar} />,
    },
    {
      title: "Họ và tên",
      dataIndex: "fullName",
    },
    {
      title: "Tên đăng nhập",
      dataIndex: "username",
    },
    {
      title: "Email",
      dataIndex: "email",
    },
    {
      title: "Vai trò chính",
      dataIndex: "role",
      render: (role) => (
        <Tag color={role === "DIVISION_HEAD" ? "orange" : "gold"}>
          {role === "DIVISION_HEAD" ? "Lãnh đạo phòng ban" : "Chuyên viên"}
        </Tag>
      ),
    },
    {
      title: "Xóa",
      dataIndex: "user_id",
      render: (user_id) => (
        <Button type="text" danger onClick={() => handleRemoveUser(user_id)}>
          <MinusCircleOutlined />
        </Button>
      ),
    },
  ];

  return (
    <>
      <Modal
        title="Tạo mới phòng ban"
        width={"80vw"}
        open={openModalCreate}
        onCancel={() => {
          handleClose();
        }}
        okText={"Tạo mới"}
        cancelText={"Hủy"}
        maskClosable={false}
        centered={true}
        footer={[
          <Button key="cancel" onClick={handleClose}>
            Hủy
          </Button>,
          <Button
            key="create"
            type="primary"
            loading={loading}
            onClick={handleCreateDepartment}
          >
            Tạo mới
          </Button>,
        ]}
        bodyProps={{
          style: {
            maxHeight: "70vh",
            overflowY: "auto",
            overflowX: "hidden",
          },
        }}
      >
        <Divider />
        <div style={{ marginBottom: "8px", fontWeight: "bold" }}>
          Tên phòng ban:
        </div>
        <Input
          placeholder="Vui lòng nhập tên phòng ban"
          value={departmentName}
          onChange={(e) => setDepartmentName(e.target.value)}
          style={{ marginBottom: 16 }}
        />

        <div style={{ marginBottom: "8px", fontWeight: "bold" }}>
          Thành viên phòng ban:
        </div>
        <Select
          showSearch
          style={{ width: "100%", marginBottom: 16 }}
          placeholder="Vui lòng chọn người dùng"
          onSelect={handleSelectUser}
          optionFilterProp="children"
        >
          {users.map((user) => (
            <Select.Option key={user.user_id} value={user.user_id}>
              {user.fullName} ({user.username})
            </Select.Option>
          ))}
        </Select>

        <Table
          dataSource={selectedUsers}
          columns={columns}
          rowKey="user_id"
          pagination={false}
          scroll={{ y: 400 }}
          style={{ marginTop: "20px" }}
        />
      </Modal>
    </>
  );
};

export default CreateDivision;
