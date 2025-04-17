import { convertRoleName, dateRangeValidate } from "@/services/helper";
import {
  CloudUploadOutlined,
  DeleteTwoTone,
  EditTwoTone,
  PlusOutlined,
  UnlockOutlined,
} from "@ant-design/icons";
import { ProTable } from "@ant-design/pro-components";
import { App, Button, Image, Popconfirm, Tag, Tooltip } from "antd";
import { useEffect, useRef, useState } from "react";
import dayjs from "dayjs";
import ImportUser from "./import.user";
import CreateUser from "./create.user";
import UpdateUser from "./update.user";
import DetailUser from "./detail.user";
import {
  changeStatusUserAPI,
  viewAllDivisionsAPI,
  viewAllRoles,
  viewAllUserAPI,
} from "@/services/api.service";
import { BeatLoader } from "react-spinners";
import "styles/loading.scss";

const TableUser = () => {
  const actionRef = useRef();
  const [meta, setMeta] = useState({
    limit: 10,
    total: 1,
    page: 1,
  });
  const [openViewDetail, setOpenViewDetail] = useState(false);
  const [dataViewDetail, setDataViewDetail] = useState(null);

  const [openModalCreate, setOpenModalCreate] = useState(false);
  const [openModalImport, setOpenModalImport] = useState(false);

  const [openModalUpdate, setOpenModalUpdate] = useState(false);
  const [dataUpdate, setDataUpdate] = useState(null);

  const [isDeleteUser, setIsDeleteUser] = useState(false);
  const { message, notification } = App.useApp();
  const [divisions, setDivisions] = useState([]);
  const [divisionNames, setDivisionNames] = useState([]);
  const [roles, setRoles] = useState([]);
  const [subRoles, setSubRoles] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchDivisions = async () => {
    setLoading(true);
    const res = await viewAllDivisionsAPI("page=1&limit=1000");
    if (res?.data?.statusCode === 200) {
      const data = res.data.content;
      const newDivisionsData = data.map((division) => ({
        divisionId: division.divisionId,
        divisionName: division.divisionName,
      }));
      setDivisions(newDivisionsData);
      const newDivisionNames = newDivisionsData.map((division) => ({
        value: division.divisionName,
        label: division.divisionName,
      }));
      setDivisionNames(newDivisionNames);
    }
    setLoading(false);
  };

  const fetchRoles = async () => {
    setLoading(true);
    const res = await viewAllRoles();
    if (res?.data?.statusCode === 200) {
      const newRolesData = res.data.content
        .filter(
          (role) => role.roleName !== "Admin" && role.createdDate === null
        )
        .map((role) => ({
          roleId: role.roleId,
          roleName: convertRoleName(role.roleName),
        }));
      setRoles(newRolesData);
      const newSubRolesData = res.data.content
        .filter((r) => r.createdDate !== null)
        .map((role) => ({
          roleId: role.roleId,
          roleName: role.roleName,
        }));
      setSubRoles(newSubRolesData);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchDivisions();
    fetchRoles();
  }, []);

  const columns = [
    {
      title: "Ảnh",
      dataIndex: "avatar",
      hideInSearch: true,
      render(dom, entity) {
        return (
          <Image
            width={40}
            height={40}
            src={entity?.avatar || undefined}
            fallback="/default-avatar.png"
            style={{
              objectFit: "cover",
              borderRadius: "50%",
            }}
          />
        );
      },
      width: "5%",
    },
    {
      title: "Họ và tên",
      dataIndex: "fullName",
      copyable: true,
      fieldProps: {
        placeholder: "Vui lòng nhập họ và tên",
      },
      formItemProps: {
        labelCol: { span: 7 },
        wrapperCol: { span: 24 },
      },
      render(dom, entity) {
        return (
          <Tooltip title="Xem chi tiết">
            <a
              onClick={() => {
                const mainRole = entity.roles?.find(
                  (r) => r.createdDate === null
                );
                const subRoles = entity.roles?.filter(
                  (r) => r.createdDate !== null
                );
                setDataViewDetail({ ...entity, mainRole, subRoles });
                setOpenViewDetail(true);
              }}
              style={{ cursor: "pointer" }}
            >
              {entity.fullName}
            </a>
          </Tooltip>
        );
      },
      width: "10%",
    },
    {
      title: "Tên đăng nhập",
      dataIndex: "userName",
      hideInSearch: true,
      width: "10%",
    },
    {
      title: "Email",
      dataIndex: "email",
      copyable: true,
      fieldProps: {
        placeholder: "Vui lòng nhập email",
      },
      formItemProps: {
        labelCol: { span: 7 },
        wrapperCol: { span: 24 },
      },
      width: "10%",
    },
    {
      title: "Vai trò chính",
      dataIndex: "roles",
      hideInSearch: true,
      render: (_, record) => {
        const mainRole = record.roles?.find(
          (role) => role.createdDate === null
        );
        return (
          <Tag color="geekblue" style={{ fontSize: "14px" }}>
            {convertRoleName(mainRole?.roleName) || "-"}
          </Tag>
        );
      },
      width: "15%",
    },
    {
      title: "Vai trò chính",
      dataIndex: "role",
      hideInTable: true,
      render: (_, record) => {
        const mainRole = record.roles?.find(
          (role) => role.createdDate === null
        );
        return mainRole?.roleName || "-";
      },
      valueType: "select",
      request: async () => {
        return [
          { label: "Quản trị viên", value: "Admin" },
          { label: "Lãnh đạo trường", value: "Leader" },
          { label: "Chánh văn phòng", value: "Chief" },
          { label: "Nhân viên văn thư", value: "Clerical Assistant" },
          { label: "Lãnh đạo phòng ban", value: "Division Head" },
          { label: "Chuyên viên", value: "Specialist" },
        ];
      },
      fieldProps: {
        placeholder: "Vui lòng chọn vai trò",
        showSearch: true,
      },
      formItemProps: {
        labelCol: { span: 7 },
        wrapperCol: { span: 24 },
      },
    },
    {
      title: "Phòng ban",
      dataIndex: ["divisionDto", "divisionName"],
      hideInSearch: true,
      render: (_, entity) => entity?.divisionDto?.divisionName || "-",
      width: "15%",
    },
    {
      title: "Phòng ban",
      dataIndex: "division",
      valueType: "select",
      hideInTable: true,
      fieldProps: {
        options: divisionNames,
        placeholder: "Vui lòng chọn phòng ban",
        showSearch: true,
      },
      formItemProps: {
        labelCol: { span: 7 },
        wrapperCol: { span: 24 },
      },
    },

    {
      title: "Chức vụ",
      dataIndex: "position",
      copyable: true,
      fieldProps: {
        placeholder: "Vui lòng nhập chức vụ",
      },
      formItemProps: {
        labelCol: { span: 7 },
        wrapperCol: { span: 24 },
      },
      width: "15%",
    },
    {
      title: "Ngày tạo",
      dataIndex: "createdAt",
      valueType: "date",
      sorter: true,
      hideInSearch: true,
      render(dom, entity, index, action, schema) {
        return <>{dayjs(entity.createdAt).format("DD-MM-YYYY")}</>;
      },
      width: "10%",
    },
    {
      title: "Trạng thái",
      dataIndex: "isDeleted",
      hideInSearch: true,
      render: (isDeleted) =>
        isDeleted ? (
          <Tag color="red" style={{ fontSize: "14px" }}>
            Bị khóa
          </Tag>
        ) : (
          <Tag color="green" style={{ fontSize: "14px" }}>
            Hoạt động
          </Tag>
        ),
      width: "10%",
    },
    {
      title: "Hành động",
      hideInSearch: true,
      width: "10%",
      render(dom, entity, index, action, schema) {
        return (
          <>
            <Tooltip title="Cập nhật tài khoản này">
              <EditTwoTone
                twoToneColor="#f57800"
                style={{ cursor: "pointer", marginRight: 15 }}
                onClick={() => {
                  const mainRole = entity.roles?.find(
                    (r) => r.createdDate === null
                  );
                  const subRoles = entity.roles?.filter(
                    (r) => r.createdDate !== null
                  );
                  setDataUpdate({ ...entity, mainRole, subRoles });
                  setOpenModalUpdate(true);
                }}
              />
            </Tooltip>
            {!entity.isDeleted ? (
              <Popconfirm
                placement="leftTop"
                title="Xác nhận khóa tài khoản"
                description="Bạn có chắc chắn muốn khóa tài khoản này?"
                onConfirm={() =>
                  handleDeleteUser(
                    entity.userId,
                    entity.userName,
                    entity.isDeleted
                  )
                }
                okText="Xác nhận"
                cancelText="Hủy"
                okButtonProps={{ loading: isDeleteUser }}
              >
                <span style={{ cursor: "pointer", marginLeft: 20 }}>
                  <Tooltip title="Khóa tài khoản này">
                    <DeleteTwoTone
                      twoToneColor="#ff4d4f"
                      style={{ cursor: "pointer" }}
                    />
                  </Tooltip>
                </span>
              </Popconfirm>
            ) : (
              <Popconfirm
                placement="leftTop"
                title="Xác nhận mở lại tài khoản này"
                description="Bạn có chắc chắn muốn mở lại tài khoản này?"
                onConfirm={() =>
                  handleDeleteUser(
                    entity.userId,
                    entity.userName,
                    entity.isDeleted
                  )
                }
                okText="Xác nhận"
                cancelText="Hủy"
                okButtonProps={{ loading: isDeleteUser }}
              >
                <span style={{ cursor: "pointer", marginLeft: 20 }}>
                  <Tooltip title="Mở lại tài khoản này">
                    <UnlockOutlined
                      style={{
                        color: "green",
                        fontSize: 18,
                        cursor: "pointer",
                      }}
                    />
                  </Tooltip>
                </span>
              </Popconfirm>
            )}
          </>
        );
      },
    },
  ];

  const refreshTable = () => {
    actionRef.current?.reload();
  };

  const handleDeleteUser = async (userId, userName, isDeleted) => {
    setIsDeleteUser(true);
    const res = await changeStatusUserAPI(userId);
    if (res && res.data && res.data.statusCode === 200) {
      if (isDeleted) {
        message.success(`Mở khóa tài khoản ${userName} thành công!`);
      } else {
        message.success(`Khóa tài khoản ${userName} thành công!`);
      }
      refreshTable();
    } else {
      notification.error({
        message: `Đã có lỗi xảy ra!`,
        description: res.data.content,
      });
    }
    setIsDeleteUser(false);
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
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-end",
        backgroundColor: "#e8edfa",
        padding: "20px 0",
        width: "100%",
        height: "100vh",
      }}
    >
      <ProTable
        style={{
          width: "100%",
          flex: 1,
          display: "flex",
          flexDirection: "column",
        }}
        scroll={{ y: "calc(100vh - 400px)" }}
        columns={columns}
        actionRef={actionRef}
        cardBordered
        request={async (params, sort, filter) => {
          const filters = Object.fromEntries(
            Object.entries(params).filter(
              ([key, value]) =>
                value !== undefined &&
                value !== null &&
                value !== "" &&
                !["current", "pageSize"].includes(key)
            )
          );

          const sortParams = Object.keys(sort).length
            ? {
                sortBy: Object.keys(sort)[0],
                sortDirection:
                  sort[Object.keys(sort)[0]] === "ascend" ? "asc" : "desc",
              }
            : {
                sortBy: "createdAt",
                sortDirection: "desc",
              };

          const page = params?.current ?? 1;
          const limit = params?.pageSize ?? 10;
          const res = await viewAllUserAPI(page, limit, filters, sortParams);
          if (res.data) {
            setMeta(res.data.meatadataDto);
          }
          return {
            data: res.data?.content,
            page: 1,
            success: true,
            total: res.data?.meatadataDto.total,
          };
        }}
        rowKey="userId"
        pagination={{
          current: meta.page,
          pageSize: meta.limit,
          showSizeChanger: true,
          total: meta.total,
          showTotal: (total, range) => {
            return <div>{/* {range[0]} - {range[1]} trên {total} dòng */}</div>;
          },
        }}
        headerTitle={
          <span style={{ fontWeight: "bold" }}>Quản lý tài khoản</span>
        }
        toolBarRender={() => [
          <Button
            key="buttonImport"
            icon={<CloudUploadOutlined />}
            type="primary"
            onClick={() => {
              setOpenModalImport(true);
            }}
          >
            Tạo người dùng theo XLS hoặc XLSX file
          </Button>,
          <Button
            key="buttonAddNew"
            icon={<PlusOutlined />}
            onClick={() => {
              setOpenModalCreate(true);
            }}
            type="primary"
          >
            Tạo người dùng theo mẫu
          </Button>,
        ]}
      />
      <ImportUser
        openModalImport={openModalImport}
        setOpenModalImport={setOpenModalImport}
        refreshTable={refreshTable}
        divisions={divisions}
      />
      <CreateUser
        openModalCreate={openModalCreate}
        setOpenModalCreate={setOpenModalCreate}
        refreshTable={refreshTable}
        divisions={divisions}
        roles={roles}
      />
      <UpdateUser
        openModalUpdate={openModalUpdate}
        setOpenModalUpdate={setOpenModalUpdate}
        dataUpdate={dataUpdate}
        setDataUpdate={setDataUpdate}
        refreshTable={refreshTable}
        divisions={divisions}
        subRoles={subRoles}
      />
      <DetailUser
        openViewDetail={openViewDetail}
        setOpenViewDetail={setOpenViewDetail}
        dataViewDetail={dataViewDetail}
        setDataViewDetail={setDataViewDetail}
      />
    </div>
  );
};

export default TableUser;
