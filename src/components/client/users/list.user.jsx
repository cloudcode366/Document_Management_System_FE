import { convertRoleName } from "@/services/helper";
import { ProTable } from "@ant-design/pro-components";
import { Image, Tag, Tooltip } from "antd";
import { useEffect, useRef, useState } from "react";
import dayjs from "dayjs";

import { viewAllDivisionsAPI, viewAllUserAPI } from "@/services/api.service";
import { BeatLoader } from "react-spinners";
import "styles/loading.scss";
import ClientDetailUser from "./client.detail.user";
import { useCurrentApp } from "@/components/context/app.context";

const ListUser = () => {
  const actionRef = useRef();
  const [meta, setMeta] = useState({
    limit: 10,
    total: 1,
    page: 1,
  });
  const [openViewDetail, setOpenViewDetail] = useState(false);
  const [dataViewDetail, setDataViewDetail] = useState(null);
  const [divisionNames, setDivisionNames] = useState([]);
  const [loading, setLoading] = useState(false);
  const { user } = useCurrentApp();

  const fetchDivisions = async () => {
    setLoading(true);
    const res = await viewAllDivisionsAPI("page=1&limit=1000");
    if (res?.data?.statusCode === 200) {
      const data = res.data.content;
      const newDivisionNames = data.map((division) => ({
        value: division.divisionName,
        label: division.divisionName,
      }));
      setDivisionNames(newDivisionNames);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchDivisions();
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
    ...(user?.mainRole?.roleName === "Leader"
      ? [
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
        ]
      : []),

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
  ];

  const refreshTable = () => {
    actionRef.current?.reload();
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
          if (user.mainRole.roleName === "Leader") {
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
              setMeta({
                page: res.data?.meatadataDto.page,
                limit: res.data?.meatadataDto.limit,
                total: res.data?.size,
              });
            }
            return {
              data: res.data?.content,
              page: res.data?.meatadataDto.page,
              success: true,
              total: res.data?.size,
            };
          } else {
            const baseFilters = Object.fromEntries(
              Object.entries(params).filter(
                ([key, value]) =>
                  value !== undefined &&
                  value !== null &&
                  value !== "" &&
                  !["current", "pageSize"].includes(key)
              )
            );

            const filters = {
              ...baseFilters,
              division: user?.divisionDto?.divisionName || "",
            };

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
              setMeta({
                page: res.data?.meatadataDto.page,
                limit: res.data?.meatadataDto.limit,
                total: res.data?.size,
              });
            }
            return {
              data: res.data?.content,
              page: res.data?.meatadataDto.page,
              success: true,
              total: res.data?.size,
            };
          }
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
          <span style={{ fontWeight: "bold" }}>Danh sách thành viên</span>
        }
      />
      <ClientDetailUser
        openViewDetail={openViewDetail}
        setOpenViewDetail={setOpenViewDetail}
        dataViewDetail={dataViewDetail}
        setDataViewDetail={setDataViewDetail}
      />
    </div>
  );
};

export default ListUser;
