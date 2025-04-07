import React, { useState } from "react";
import { Modal, Table, Checkbox, Descriptions, Button } from "antd";

const UpdateResource = (props) => {
  const {
    openUpdateResource,
    setOpenUpdateResource,
    dataUpdateResource,
    setDataUpdateResource,
    finalData,
    setFinalData,
  } = props;
  const [loading, setLoading] = useState(false);

  // Cập nhật trạng thái của resources khi người dùng chọn checkbox
  const handleCheckboxChange = (resourceId, checked) => {
    const updatedResources = dataUpdateResource?.permissions?.resources.map(
      (res) =>
        res.resourceId === resourceId
          ? { ...res, isDeleted: checked ? "false" : "true" }
          : res
    );

    setDataUpdateResource((prev) => ({
      ...prev,
      permissions: {
        ...prev.permissions,
        resources: updatedResources,
      },
    }));
  };

  // Đóng modal
  const handleClose = () => {
    setOpenUpdateResource(false);
    setDataUpdateResource(null);
  };

  // Cập nhật dữ liệu vào finalData
  const handleUpdateResource = () => {
    if (!dataUpdateResource) return;
    setLoading(true);

    const updatedFinalData = finalData.map((role) => {
      if (role.roleId === dataUpdateResource.roleId) {
        return {
          ...role,
          permissions: role.permissions.map((perm) =>
            perm.permissionId === dataUpdateResource.permissions.permissionId
              ? { ...perm, resources: dataUpdateResource.permissions.resources }
              : perm
          ),
        };
      }
      return role;
    });

    setFinalData(updatedFinalData);
    setLoading(false);
    console.log(`>>> Check finalData in UpdateResource: `, finalData);
    handleClose();
  };

  const columns = [
    {
      title: "Chức năng",
      dataIndex: "resourceName",
      key: "resourceName",
    },
    {
      title: "Cấp phép",
      dataIndex: "isDeleted",
      key: "isDeleted",
      render: (isDeleted, record) => (
        <Checkbox
          checked={isDeleted === "false"}
          onChange={(e) =>
            handleCheckboxChange(record.resourceId, e.target.checked)
          }
        />
      ),
    },
  ];

  return (
    <Modal
      title="Cập nhật tài nguyên"
      width={"80vw"}
      open={openUpdateResource}
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
          onClick={handleUpdateResource}
        >
          Xác nhận
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
      <Descriptions bordered column={2}>
        <Descriptions.Item label="Vai trò" labelStyle={{ fontWeight: "bold" }}>
          {dataUpdateResource?.roleName}
        </Descriptions.Item>
        <Descriptions.Item label="Quyền" labelStyle={{ fontWeight: "bold" }}>
          {dataUpdateResource?.permissions?.permissionName}
        </Descriptions.Item>
      </Descriptions>
      <Table
        columns={columns}
        dataSource={dataUpdateResource?.permissions?.resources || []}
        rowKey="resourceId"
        pagination={false}
      />
    </Modal>
  );
};

export default UpdateResource;
