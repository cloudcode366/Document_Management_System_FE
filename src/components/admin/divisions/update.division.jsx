import { useEffect, useState } from "react";
import {
  Modal,
  Input,
  Select,
  Table,
  Button,
  Avatar,
  Tag,
  Divider,
} from "antd";
import { MinusCircleOutlined } from "@ant-design/icons";
import axios from "axios";

const UpdateDivision = (props) => {
  const {
    openModalUpdate,
    setOpenModalUpdate,
    dataUpdate,
    setDataUpdate,
    refreshTable,
  } = props;
  const [departmentName, setDepartmentName] = useState("");
  const [users, setUsers] = useState([]); // Danh sách người dùng có thể chọn
  const [selectedUsers, setSelectedUsers] = useState([]); // Danh sách user trong phòng ban
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (dataUpdate) {
      setDepartmentName(dataUpdate.name || "");
      setSelectedUsers(dataUpdate.list_users || []);
    }
  }, [dataUpdate]);

  // Gọi API lấy danh sách user khi mở modal
  //   useEffect(() => {
  //     axios
  //       .get("/api/users") // Thay URL API phù hợp
  //       .then((res) => setUsers(res.data))
  //       .catch((err) => console.error("Lỗi khi lấy danh sách user", err));
  //   }, []);

  const handleSelectUser = (userId) => {
    const user = users.find((u) => u.user_id === userId);
    if (user && !selectedUsers.some((u) => u.user_id === userId)) {
      setSelectedUsers([...selectedUsers, user]);
    }
  };

  const handleRemoveUser = (userId) => {
    setSelectedUsers(selectedUsers.filter((user) => user.user_id !== userId));
  };

  const handleClose = () => {
    setDepartmentName("");
    setSelectedUsers([]);
    setOpenModalUpdate(false);
    setDataUpdate(null);
  };

  const handleUpdateDepartment = () => {
    // if (!departmentName.trim() || selectedUsers.length === 0) {
    //   message.warning(
    //     "Vui lòng nhập tên phòng ban và chọn ít nhất một người dùng!"
    //   );
    //   return;
    // }
    // setLoading(true);
    // const updatedDepartment = {
    //   id: dataUpdate?.id, // Giữ nguyên ID
    //   name: departmentName,
    //   list_users: selectedUsers.map((user) => ({
    //     user_id: user.user_id,
    //     fullName: user.fullName,
    //     username: user.username,
    //     email: user.email,
    //     avatar: user.avatar,
    //     role: user.role,
    //   })),
    // };
    // axios
    //   .put(`/api/departments/${dataUpdate.id}`, updatedDepartment)
    //   .then(() => {
    //     message.success("Cập nhật phòng ban thành công!");
    //     refreshTable(); // Cập nhật bảng sau khi chỉnh sửa
    //     handleClose(); // Đóng modal
    //   })
    //   .catch((error) => {
    //     console.error("Lỗi khi cập nhật phòng ban", error);
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
    <Modal
      title="Cập nhật phòng ban"
      width={"80vw"}
      open={openModalUpdate}
      onCancel={handleClose}
      okText={"Cập nhật"}
      cancelText={"Hủy"}
      maskClosable={false}
      centered={true}
      footer={[
        <Button key="cancel" onClick={handleClose}>
          Hủy
        </Button>,
        <Button
          key="update"
          type="primary"
          loading={loading}
          onClick={handleUpdateDepartment}
        >
          Cập nhật
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
  );
};

export default UpdateDivision;
