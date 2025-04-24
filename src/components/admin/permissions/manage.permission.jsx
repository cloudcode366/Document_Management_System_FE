// import React, { useEffect, useState, useMemo } from "react";
// import { Tabs, Table, Spin, Tag, Typography, Empty, Button } from "antd";
// import { viewAllRoles, viewRoleResourcesAPI } from "@/services/api.service";
// import { PlusOutlined } from "@ant-design/icons";
// import UpdateResource from "components/admin/permissions/update.resource";
// import { convertPermissionName, convertRoleName } from "@/services/helper";
// import CreateSubRole from "./create.sub.role";
// import { BeatLoader } from "react-spinners";

// const { Title } = Typography;

// const transformMatrix = (data) => {
//   if (!Array.isArray(data)) return { matrix: {}, roles: [], permissions: [] };

//   const permissions = new Set();
//   const matrix = {};
//   const roles = [];

//   data.forEach((role) => {
//     const roleName = role.roleName;
//     roles.push(roleName);
//     matrix[roleName] = {};

//     role.permissionDtos.forEach((perm) => {
//       const permission = perm.permissionName;
//       permissions.add(permission);

//       const allDeleted =
//         perm.resourceResponses.length > 0 &&
//         perm.resourceResponses.every((res) => res.isDeleted);
//       const atLeastOneActive = perm.resourceResponses.some(
//         (res) => !res.isDeleted
//       );

//       matrix[roleName][permission] = allDeleted
//         ? "X"
//         : atLeastOneActive
//         ? "✓"
//         : "";
//     });
//   });

//   return {
//     matrix,
//     roles,
//     permissions: Array.from(permissions),
//   };
// };

// const RolePermissionMatrix = () => {
//   const [roleType, setRoleType] = useState("MAIN");
//   const [loading, setLoading] = useState(false);
//   const [rawData, setRawData] = useState([]);
//   const [openModalCreate, setOpenModalCreate] = useState(false);
//   const [openModalUpdate, setOpenModalUpdate] = useState(false);
//   const [dataUpdate, setDataUpdate] = useState(null);
//   const [mainRoles, setMainRoles] = useState(null);

//   const fetchData = async (type) => {
//     setLoading(true);
//     try {
//       const res = await viewRoleResourcesAPI(type === "MAIN" ? "Main" : "Sub");
//       const extracted = Array.isArray(res.data.content)
//         ? res.data.content
//         : res?.data.content || [];
//       setRawData(extracted);
//       console.log(`>>> Check raw data: `, extracted);
//     } catch (err) {
//       console.error("Failed to fetch role-permission data", err);
//       setRawData([]);
//     }
//     setLoading(false);
//   };

//   const fetchRoles = async () => {
//     setLoading(true);
//     const res = await viewAllRoles();
//     if (res?.data?.statusCode === 200) {
//       const mainRole = res.data.content.filter((r) => r.createdDate === null);
//       const newRolesData = mainRole
//         .filter((role) => role.roleName !== "Admin")
//         .map((role) => ({
//           roleId: role.roleId,
//           roleName: role.roleName,
//         }));
//       console.log(`>>> newRolesData: `, newRolesData);
//       setMainRoles(newRolesData);
//     }
//     setLoading(false);
//   };
//   useEffect(() => {
//     fetchData(roleType);
//     fetchRoles();
//   }, [roleType]);

//   const reloadPage = () => {
//     fetchData(roleType);
//   };

//   const { matrix, roles, permissions } = useMemo(
//     () => transformMatrix(rawData),
//     [rawData]
//   );

//   const columns = useMemo(
//     () => [
//       {
//         title: "Vai trò",
//         dataIndex: "role",
//         fixed: "left",
//         width: 200,
//         render: (text) => <strong>{convertRoleName(text)}</strong>,
//       },
//       ...permissions.map((perm) => ({
//         title: convertPermissionName(perm),
//         dataIndex: perm,
//         align: "center",
//         width: 100,
//         render: (value, record) => {
//           const roleName = record.role;
//           const permissionName = perm;
//           const roleData = rawData.find((r) => r.roleName === roleName);
//           const permissionData = roleData?.permissionDtos?.find(
//             (p) => p.permissionName === permissionName
//           );

//           return (
//             <div
//               onClick={() => {
//                 if (!permissionData) return;
//                 setDataUpdate({
//                   roleId: roleData?.roleId,
//                   roleName,
//                   permissionName,
//                   resources: permissionData.resourceResponses || [],
//                 });
//                 setOpenModalUpdate(true);
//               }}
//               style={{ cursor: "pointer" }}
//             >
//               {value === "✓" ? (
//                 <Tag color="green">✓</Tag>
//               ) : value === "X" ? (
//                 <Tag color="red">✗</Tag>
//               ) : (
//                 <span style={{ color: "#ccc" }}>—</span>
//               )}
//             </div>
//           );
//         },
//       })),
//     ],
//     [permissions]
//   );

//   const dataSource = useMemo(
//     () =>
//       roles.map((role) => {
//         const row = { key: role, role };
//         permissions.forEach((perm) => {
//           row[perm] = matrix?.[role]?.[perm] || "";
//         });
//         return row;
//       }),
//     [roles, permissions, matrix]
//   );

//   return (
//     <div style={{ height: "100vh" }}>
//       <div
//         style={{
//           backgroundColor: "#ffffff",
//           padding: "20px",
//           boxShadow: `0px 4px 10px rgba(0, 0, 0, 0.1)`,
//           borderRadius: "10px",
//           marginTop: "20px",
//         }}
//       >
//         <div
//           style={{
//             marginBottom: "10px",
//             display: "flex",
//             flexDirection: "row",
//             width: "100%",
//             justifyContent: "space-between",
//           }}
//         >
//           <Title level={4}>Quản lý phân quyền</Title>
//           <Button
//             key="buttonAddNewSubRole"
//             icon={<PlusOutlined />}
//             onClick={() => {
//               setOpenModalCreate(true);
//             }}
//             type="primary"
//           >
//             Tạo mới vai trò phụ
//           </Button>
//         </div>

//         <Tabs defaultActiveKey="MAIN" onChange={(key) => setRoleType(key)}>
//           <Tabs.TabPane tab="Vai trò chính" key="MAIN" />
//           <Tabs.TabPane tab="Vai trò phụ" key="SUB" />
//         </Tabs>

//         <Spin spinning={loading}>
//           {dataSource.length === 0 ? (
//             <Empty description="Không có dữ liệu vai trò/quyền" />
//           ) : (
//             <Table
//               columns={columns}
//               dataSource={dataSource}
//               scroll={{ x: "max-content" }}
//               pagination={false}
//               bordered
//               size="middle"
//             />
//           )}
//         </Spin>
//       </div>
//       <UpdateResource
//         openModalUpdate={openModalUpdate}
//         setOpenModalUpdate={setOpenModalUpdate}
//         dataUpdate={dataUpdate}
//         setDataUpdate={setDataUpdate}
//         reloadPage={reloadPage}
//       />
//       <CreateSubRole
//         openModalCreate={openModalCreate}
//         setOpenModalCreate={setOpenModalCreate}
//         reloadPage={reloadPage}
//         mainRoles={mainRoles}
//         setMainRoles={setMainRoles}
//       />
//     </div>
//   );
// };

// export default RolePermissionMatrix;

import React, { useEffect, useState, useMemo } from "react";
import { Tabs, Table, Spin, Tag, Typography, Empty, Button } from "antd";
import { viewAllRoles, viewRoleResourcesAPI } from "@/services/api.service";
import { PlusOutlined } from "@ant-design/icons";
import UpdateResource from "components/admin/permissions/update.resource";
import { convertPermissionName, convertRoleName } from "@/services/helper";
import CreateSubRole from "./create.sub.role";
import { BeatLoader } from "react-spinners";

const { Title } = Typography;

const transformMatrix = (data) => {
  if (!Array.isArray(data)) return { matrix: {}, roles: [], permissions: [] };

  const permissions = new Set();
  const matrix = {};
  const roles = [];

  data.forEach((role) => {
    const roleName = role.roleName;
    roles.push(roleName);
    matrix[roleName] = {};

    role.permissionDtos.forEach((perm) => {
      const permission = perm.permissionName;
      permissions.add(permission);

      const allDeleted =
        perm.resourceResponses.length > 0 &&
        perm.resourceResponses.every((res) => res.isDeleted);
      const atLeastOneActive = perm.resourceResponses.some(
        (res) => !res.isDeleted
      );

      matrix[roleName][permission] = allDeleted
        ? "X"
        : atLeastOneActive
        ? "✓"
        : "";
    });
  });

  return {
    matrix,
    roles,
    permissions: Array.from(permissions),
  };
};

const RolePermissionMatrix = () => {
  const [roleType, setRoleType] = useState("MAIN");
  const [loading, setLoading] = useState(false);
  const [loadingTab, setLoadingTab] = useState(false); // Trạng thái loading riêng cho mỗi tab
  const [rawData, setRawData] = useState([]);
  const [openModalCreate, setOpenModalCreate] = useState(false);
  const [openModalUpdate, setOpenModalUpdate] = useState(false);
  const [dataUpdate, setDataUpdate] = useState(null);
  const [mainRoles, setMainRoles] = useState(null);

  const fetchData = async (type) => {
    setLoading(true);
    setLoadingTab(true); // Bắt đầu tải dữ liệu mới cho tab
    try {
      const res = await viewRoleResourcesAPI(type === "MAIN" ? "Main" : "Sub");
      const extracted = Array.isArray(res.data.content)
        ? res.data.content
        : res?.data.content || [];
      setRawData(extracted);
      console.log(`>>> Check raw data: `, extracted);
    } catch (err) {
      console.error("Failed to fetch role-permission data", err);
      setRawData([]);
    }
    setLoading(false);
    setLoadingTab(false); // Kết thúc tải dữ liệu cho tab
  };

  const fetchRoles = async () => {
    setLoading(true);
    const res = await viewAllRoles();
    if (res?.data?.statusCode === 200) {
      const mainRole = res.data.content.filter((r) => r.createdDate === null);
      const newRolesData = mainRole
        .filter((role) => role.roleName !== "Admin")
        .map((role) => ({
          roleId: role.roleId,
          roleName: role.roleName,
        }));
      console.log(`>>> newRolesData: `, newRolesData);
      setMainRoles(newRolesData);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData(roleType);
    fetchRoles();
  }, [roleType]);

  const reloadPage = () => {
    fetchData(roleType);
  };

  const { matrix, roles, permissions } = useMemo(
    () => transformMatrix(rawData),
    [rawData]
  );

  const columns = useMemo(
    () => [
      {
        title: "Vai trò",
        dataIndex: "role",
        fixed: "left",
        width: 200,
        render: (text) => <strong>{convertRoleName(text)}</strong>,
      },
      ...permissions.map((perm) => ({
        title: convertPermissionName(perm),
        dataIndex: perm,
        align: "center",
        width: 100,
        render: (value, record) => {
          const roleName = record.role;
          const permissionName = perm;
          const roleData = rawData.find((r) => r.roleName === roleName);
          const permissionData = roleData?.permissionDtos?.find(
            (p) => p.permissionName === permissionName
          );

          return (
            <div
              onClick={() => {
                if (!permissionData) return;
                setDataUpdate({
                  roleId: roleData?.roleId,
                  roleName,
                  permissionName,
                  resources: permissionData.resourceResponses || [],
                });
                setOpenModalUpdate(true);
              }}
              style={{ cursor: "pointer" }}
            >
              {value === "✓" ? (
                <Tag color="green">✓</Tag>
              ) : value === "X" ? (
                <Tag color="red">✗</Tag>
              ) : (
                <span style={{ color: "#ccc" }}>—</span>
              )}
            </div>
          );
        },
      })),
    ],
    [permissions]
  );

  const dataSource = useMemo(
    () =>
      roles.map((role) => {
        const row = { key: role, role };
        permissions.forEach((perm) => {
          row[perm] = matrix?.[role]?.[perm] || "";
        });
        return row;
      }),
    [roles, permissions, matrix]
  );

  return (
    <div style={{ height: "100vh" }}>
      <div
        style={{
          backgroundColor: "#ffffff",
          padding: "20px",
          boxShadow: `0px 4px 10px rgba(0, 0, 0, 0.1)`,
          borderRadius: "10px",
          marginTop: "20px",
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
          <Title level={4}>Quản lý phân quyền</Title>
          <Button
            key="buttonAddNewSubRole"
            icon={<PlusOutlined />}
            onClick={() => {
              setOpenModalCreate(true);
            }}
            type="primary"
          >
            Tạo mới vai trò phụ
          </Button>
        </div>

        <Tabs
          defaultActiveKey="MAIN"
          onChange={(key) => setRoleType(key)}
          activeKey={roleType}
        >
          <Tabs.TabPane tab="Vai trò chính" key="MAIN" />
          <Tabs.TabPane tab="Vai trò phụ" key="SUB" />
        </Tabs>

        <Spin spinning={loading || loadingTab}>
          {/* Chỉ hiển thị spinner khi dữ liệu đang tải */}
          {dataSource.length === 0 ? (
            <Empty description="Không có dữ liệu vai trò/quyền" />
          ) : (
            <Table
              columns={columns}
              dataSource={dataSource}
              scroll={{ x: "max-content", y: "calc(100vh - 250px)" }}
              pagination={false}
              bordered
              size="middle"
            />
          )}
        </Spin>
      </div>
      <UpdateResource
        openModalUpdate={openModalUpdate}
        setOpenModalUpdate={setOpenModalUpdate}
        dataUpdate={dataUpdate}
        setDataUpdate={setDataUpdate}
        reloadPage={reloadPage}
      />
      <CreateSubRole
        openModalCreate={openModalCreate}
        setOpenModalCreate={setOpenModalCreate}
        reloadPage={reloadPage}
        mainRoles={mainRoles}
        setMainRoles={setMainRoles}
      />
    </div>
  );
};

export default RolePermissionMatrix;
