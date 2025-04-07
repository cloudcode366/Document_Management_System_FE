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

const CreateSubRole = (props) => {
  const { openModalCreate, setOpenModalCreate } = props;
  const [subRoleName, setSubRoleName] = useState("");
  const { message, notification } = App.useApp();
  const [resources, setResources] = useState([]);
  const [selectedResources, setSelectedResources] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSelectResources = (resourceId) => {
    const resource = resources.find((u) => u.resource_id === resourceId);
    if (resource && !selectedResources.find((u) => u.user_id === resourceId)) {
      setSelectedResources([...selectedResources, resource]);
    }
  };

  const handleRemoveUser = (resourceId) => {
    setSelectedResources(
      selectedResources.filter((u) => u.resource_id !== resourceId)
    );
  };

  const handleClose = () => {
    setSubRoleName("");
    setSelectedResources([]);
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
      title: "Chức năng",
      dataIndex: "name",
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
        title="Tạo mới vai trò phụ"
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
            maxHeight: "80vh",
            overflowY: "auto",
            overflowX: "hidden",
          },
        }}
      >
        <div style={{ marginBottom: "8px", fontWeight: "bold" }}>
          Tên vai trò phụ:
        </div>
        <Input
          placeholder="Vui lòng nhập tên vai trò phụ"
          value={subRoleName}
          onChange={(e) => setSubRoleName(e.target.value)}
          style={{ marginBottom: 10 }}
        />

        <div style={{ marginBottom: "8px", fontWeight: "bold" }}>
          Các chức năng:
        </div>
        <Select
          showSearch
          style={{ width: "100%", marginBottom: "15px" }}
          placeholder="Vui lòng chọn chức năng"
          onSelect={handleSelectResources}
          optionFilterProp="children"
        >
          {resources.map((r) => (
            <Select.Option key={r.resource_id} value={r.name}>
              {r.name}
            </Select.Option>
          ))}
        </Select>

        <Table
          dataSource={selectedResources}
          columns={columns}
          rowKey="resource_id"
          pagination={false}
          scroll={{ y: 400 }}
          style={{
            border: "1px solid #d9d9d9",
            borderRadius: "8px",
          }}
        />
      </Modal>
    </>
  );
};

export default CreateSubRole;
