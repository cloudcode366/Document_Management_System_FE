import React, { useState, useEffect } from "react";
import { Modal, Table, Checkbox, Descriptions, Button, message } from "antd";
import { convertPermissionName, convertRoleName } from "@/services/helper";
import { updateResourcesAPI } from "@/services/api.service";

const UpdateResource = ({
  openModalUpdate,
  setOpenModalUpdate,
  dataUpdate,
  setDataUpdate,
  reloadPage,
}) => {
  const [loading, setLoading] = useState(false);
  const [editedResources, setEditedResources] = useState([]);
  const [originalResources, setOriginalResources] = useState([]);

  // Clone dữ liệu gốc khi modal mở
  useEffect(() => {
    if (openModalUpdate && dataUpdate?.resources) {
      const original = dataUpdate.resources.map((res) => ({
        resourceId: res.resourceId,
        isDeleted: res.isDeleted,
      }));
      const cloneForEdit = dataUpdate.resources.map((res) => ({ ...res }));

      setOriginalResources(original);
      setEditedResources(cloneForEdit);
    }
  }, [openModalUpdate, dataUpdate]);

  const handleClose = () => {
    setOpenModalUpdate(false);
    setDataUpdate(null);
    setEditedResources([]);
    setOriginalResources([]);
  };

  const handleUpdate = async () => {
    if (!dataUpdate?.roleId) return;

    const changedResourceIds = editedResources
      .filter((res) => {
        const original = originalResources.find(
          (o) => o.resourceId === res.resourceId
        );
        return original && original.isDeleted !== res.isDeleted;
      })
      .map((res) => res.resourceId);

    if (changedResourceIds.length === 0) {
      message.info("Không có thay đổi để cập nhật.");
      return;
    }

    try {
      setLoading(true);
      await updateResourcesAPI(dataUpdate.roleId, changedResourceIds);
      message.success("Cập nhật thành công!");
      handleClose();
      reloadPage();
    } catch (err) {
      message.error("Cập nhật thất bại!");
      console.error(err);
    } finally {
      setLoading(false);
    }
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
      render: (isDeleted, record, index) => (
        <Checkbox
          checked={!record.isDeleted}
          onChange={(e) => {
            const updated = [...editedResources];
            updated[index] = {
              ...record,
              isDeleted: !e.target.checked,
            };
            setEditedResources(updated);
          }}
        />
      ),
    },
  ];

  return (
    <Modal
      title={
        <div style={{ borderBottom: "1px solid #80868b", paddingBottom: 8 }}>
          Cập nhật chức năng
        </div>
      }
      width={"80vw"}
      open={openModalUpdate}
      onCancel={handleClose}
      okText="Cập nhật"
      cancelText="Hủy"
      maskClosable={false}
      centered
      footer={[
        <Button key="cancel" onClick={handleClose}>
          Hủy
        </Button>,
        <Button
          key="update"
          type="primary"
          loading={loading}
          onClick={handleUpdate}
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
      <Descriptions bordered column={2}>
        <Descriptions.Item label="Vai trò" labelStyle={{ fontWeight: "bold" }}>
          {convertRoleName(dataUpdate?.roleName)}
        </Descriptions.Item>
        <Descriptions.Item label="Quyền" labelStyle={{ fontWeight: "bold" }}>
          {convertPermissionName(dataUpdate?.permissionName)}
        </Descriptions.Item>
      </Descriptions>

      <Table
        columns={columns}
        dataSource={editedResources}
        rowKey="resourceId"
        pagination={false}
      />
    </Modal>
  );
};

export default UpdateResource;
