import React, { useState, useEffect } from "react";
import { Button, Table, Tabs } from "antd";
import {
  CheckOutlined,
  CloseOutlined,
  PlusOutlined,
  ReloadOutlined,
} from "@ant-design/icons";
import UpdateResource from "./update.resource";
import CreateSubRole from "./create.sub.role";

const { TabPane } = Tabs;

const data = [
  {
    roleId: "r1",
    roleName: "Admin",
    permissions: [
      {
        permissionId: "p1",
        permissionName: "Create",
        resources: [
          {
            resourceId: "re1",
            resourceName: "Create user",
            isDeleted: "false",
          },
          {
            resourceId: "re2",
            resourceName: "Create division",
            isDeleted: "false",
          },
        ],
      },
      {
        permissionId: "p2",
        permissionName: "Update",
        resources: [
          { resourceId: "re3", resourceName: "Update User", isDeleted: "true" },
          {
            resourceId: "re4",
            resourceName: "Update division",
            isDeleted: "true",
          },
        ],
      },
    ],
  },
  {
    roleId: "r2",
    roleName: "Leader",
    permissions: [
      {
        permissionId: "p5",
        permissionName: "Create",
        resources: [
          {
            resourceId: "leader1",
            resourceName: "Create user",
            isDeleted: "false",
          },
          {
            resourceId: "leader2",
            resourceName: "Create division",
            isDeleted: "false",
          },
        ],
      },
      {
        permissionId: "p6",
        permissionName: "Update",
        resources: [
          {
            resourceId: "leader3",
            resourceName: "Update User",
            isDeleted: "false",
          },
          {
            resourceId: "leader4",
            resourceName: "Update division",
            isDeleted: "false",
          },
        ],
      },
    ],
  },
  {
    roleId: "r3",
    roleName: "Chief",
    permissions: [
      {
        permissionId: "cp1",
        permissionName: "Create",
        resources: [
          {
            resourceId: "cre1",
            resourceName: "Create user",
            isDeleted: "true",
          },
          {
            resourceId: "cre2",
            resourceName: "Create division",
            isDeleted: "false",
          },
        ],
      },
      {
        permissionId: "cp2",
        permissionName: "Update",
        resources: [
          {
            resourceId: "cre3",
            resourceName: "Update User",
            isDeleted: "true",
          },
          {
            resourceId: "cre4",
            resourceName: "Update division",
            isDeleted: "true",
          },
        ],
      },
    ],
  },
];

const subRoleData = [
  {
    roleId: "sr1",
    roleName: "Sub-Admin",
    permissions: [
      {
        permissionId: "sp1",
        permissionName: "Create",
        resources: [
          {
            resourceId: "sre1",
            resourceName: "Create user",
            isDeleted: "true",
          },
          {
            resourceId: "sre2",
            resourceName: "Create division",
            isDeleted: "false",
          },
        ],
      },
      {
        permissionId: "sp2",
        permissionName: "Update",
        resources: [
          {
            resourceId: "sre3",
            resourceName: "Update User",
            isDeleted: "true",
          },
          {
            resourceId: "sre4",
            resourceName: "Update division",
            isDeleted: "true",
          },
        ],
      },
    ],
  },
  {
    roleId: "sr2",
    roleName: "Sub Leader",
    permissions: [
      {
        permissionId: "sp5",
        permissionName: "Create",
        resources: [
          {
            resourceId: "sleader1",
            resourceName: "Create user",
            isDeleted: "false",
          },
          {
            resourceId: "sleader2",
            resourceName: "Create division",
            isDeleted: "false",
          },
        ],
      },
      {
        permissionId: "sp6",
        permissionName: "Update",
        resources: [
          {
            resourceId: "sleader3",
            resourceName: "Update User",
            isDeleted: "false",
          },
          {
            resourceId: "sleader4",
            resourceName: "Update division",
            isDeleted: "false",
          },
        ],
      },
    ],
  },
];

const processPermissions = (roles) => {
  const formattedPermissions = {};
  const permNames = new Set();

  roles.forEach((role) => {
    formattedPermissions[role.roleName] = {};
    role.permissions.forEach((perm) => {
      permNames.add(perm.permissionName);
      const hasActiveResource = perm.resources.some(
        (res) => res.isDeleted === "false"
      );
      formattedPermissions[role.roleName][perm.permissionName] =
        hasActiveResource;
    });
  });

  return { formattedPermissions, permissionNames: [...permNames] };
};

const RolePermissionMatrix = () => {
  const [mainPermissions, setMainPermissions] = useState({});
  const [subPermissions, setSubPermissions] = useState({});
  const [permissionNames, setPermissionNames] = useState([]);
  const [openUpdateResource, setOpenUpdateResource] = useState(false);
  const [dataUpdateResource, setDataUpdateResource] = useState(null);
  const [finalData, setFinalData] = useState([]);
  const [openModalCreate, setOpenModalCreate] = useState(false);

  console.log(`>>> Check finalData: `, finalData);

  useEffect(() => {
    setFinalData(data);

    const { formattedPermissions, permissionNames } = processPermissions(data);
    setMainPermissions(formattedPermissions);
    setPermissionNames(permissionNames);

    const { formattedPermissions: subFormattedPermissions } =
      processPermissions(subRoleData);
    setSubPermissions(subFormattedPermissions);
  }, [finalData]);

  const handleIconClick = (roleName, permissionName) => {
    // Tìm role tương ứng
    const roleData = data.find((role) => role.roleName === roleName);
    if (!roleData || !roleData.permissions) return;

    // Tìm permission tương ứng trong role
    const permissionData = roleData.permissions.find(
      (perm) => perm.permissionName === permissionName
    );
    if (!permissionData || !permissionData.resources) return;

    // Tạo object với cấu trúc mong muốn
    const selectedData = {
      roleId: roleData.roleId,
      roleName: roleData.roleName,
      permissions: {
        permissionId: permissionData.permissionId,
        permissionName: permissionData.permissionName,
        resources: permissionData.resources,
      },
    };

    setDataUpdateResource(selectedData);
    setOpenUpdateResource(true);
  };

  const handleUpdateClick = () => {
    console.log("Sending updated data to the backend:", finalData);
  };

  const generateColumns = (permissionNames) => [
    {
      title: "Tên vai trò",
      dataIndex: "role",
      key: "role",
    },
    ...permissionNames.map((perm) => ({
      title: perm,
      dataIndex: perm,
      key: perm,
      render: (value, record) => (
        <span
          onClick={() => handleIconClick(record.role, perm)}
          style={{ cursor: "pointer" }}
        >
          {value ? (
            <CheckOutlined style={{ color: "green" }} />
          ) : (
            <CloseOutlined style={{ color: "red" }} />
          )}
        </span>
      ),
    })),
  ];

  const formatTableData = (permissions) =>
    Object.keys(permissions).map((role) => ({
      key: role,
      role,
      ...permissions[role],
    }));

  return (
    <div
      style={{
        backgroundColor: "#e8edfa",
        width: "100%",
        height: "100vh",
        padding: "20px 0",
        marginRight: "0px",
      }}
    >
      <div
        style={{
          backgroundColor: "#ffffff",
          padding: "20px",
          boxShadow: `0px 4px 10px rgba(0, 0, 0, 0.1)`,
          borderRadius: "10px",
        }}
      >
        <div
          style={{
            marginBottom: "10px",
            display: "flex",
            flexDirection: "row",
            width: "100%",
            justifyContent: "space-between",
          }}
        >
          <h3>Quản lý phân quyền</h3>
          <Button
            key="buttonAddNewSubRole"
            icon={<PlusOutlined />}
            onClick={() => {
              setOpenModalCreate(true);
            }}
            type="primary"
          >
            Tạo mới phòng ban
          </Button>
        </div>
        <Tabs defaultActiveKey="1">
          <TabPane tab="Vai trò chính" key="1">
            <Table
              columns={generateColumns(permissionNames)}
              dataSource={formatTableData(mainPermissions)}
              pagination={false}
              scroll={{ x: "max-content", y: "max-content" }}
            />
          </TabPane>
          <TabPane tab="Vai trò phụ" key="2">
            <Table
              columns={generateColumns(permissionNames)}
              dataSource={formatTableData(subPermissions)}
              pagination={false}
              scroll={{ x: "max-content", y: "max-content" }}
            />
          </TabPane>
        </Tabs>
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            marginTop: "20px",
          }}
        >
          <Button
            type="primary"
            onClick={handleUpdateClick}
            icon={<ReloadOutlined />}
            style={{
              background: "#60BB39",
              color: "white",
              width: "200px",
            }}
          >
            Cập nhật
          </Button>
        </div>
      </div>

      <UpdateResource
        openUpdateResource={openUpdateResource}
        setOpenUpdateResource={setOpenUpdateResource}
        dataUpdateResource={dataUpdateResource}
        setDataUpdateResource={setDataUpdateResource}
        finalData={finalData}
        setFinalData={setFinalData}
      />

      <CreateSubRole
        openModalCreate={openModalCreate}
        setOpenModalCreate={setOpenModalCreate}
      />
    </div>
  );
};

export default RolePermissionMatrix;
