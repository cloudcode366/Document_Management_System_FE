import { ProTable } from "@ant-design/pro-components";
import { Tag, Tooltip } from "antd";
import { useRef, useState } from "react";
import { viewAllDivisionsAPI } from "@/services/api.service";
import ClientDetailDivision from "./client.detail.division";

const ListDivisions = () => {
  const actionRef = useRef();
  const [meta, setMeta] = useState({
    limit: 10,
    total: 1,
    page: 1,
  });

  const [openViewDetail, setOpenViewDetail] = useState(false);
  const [dataViewDetail, setDataViewDetail] = useState(null);

  const columns = [
    {
      title: "Phòng ban",
      dataIndex: "divisionName",
      copyable: true,
      width: "60%",
      fieldProps: {
        placeholder: "Vui lòng nhập tên phòng ban",
      },
      formItemProps: {
        labelCol: { span: 6 },
        wrapperCol: { span: 18 },
      },
      render(dom, entity) {
        return (
          <Tooltip title="Xem chi tiết">
            <a
              onClick={() => {
                setDataViewDetail(entity);
                setOpenViewDetail(true);
              }}
              style={{ cursor: "pointer" }}
            >
              {entity.divisionName}
            </a>
          </Tooltip>
        );
      },
    },
    // {
    //   title: "Lãnh đạo",
    //   dataIndex: "list_users",
    //   hideInSearch: true,
    //   width: "40%",
    //   render: (list_users) => {
    //     const leaders = list_users
    //       .filter((user) => user.role === "DIVISION_HEAD")
    //       .map((user) => user.fullName)
    //       .join(", ");

    //     return leaders || "Chưa có lãnh đạo";
    //   },
    // },
    {
      title: "Trạng thái",
      dataIndex: "isDeleted",
      hideInSearch: true,
      width: "20%",
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
    },
  ];

  const refreshTable = () => {
    actionRef.current?.reload();
  };

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
        search={{
          labelWidth: "auto",
          span: 8,
        }}
        scroll={{ y: "calc(100vh - 350px)" }}
        columns={columns}
        actionRef={actionRef}
        cardBordered
        request={async (params, sort, filter) => {
          let query = "";
          if (params) {
            if (params.divisionName) {
              query += `divisionName=${params.divisionName}`;
            }
            query += `&page=${params.current}&limit=${params.pageSize}`;
          }

          const res = await viewAllDivisionsAPI(query);
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
        }}
        rowKey="divisionId"
        pagination={{
          current: meta.page,
          pageSize: meta.limit,
          showSizeChanger: true,
          total: meta.total,
          showTotal: (total, range) => {
            return (
              <div>
                {range[0]} - {range[1]} trên {total} phòng ban
              </div>
            );
          },
        }}
        headerTitle={
          <span style={{ fontWeight: "bold" }}>Danh sách phòng ban</span>
        }
      />
      <ClientDetailDivision
        openViewDetail={openViewDetail}
        setOpenViewDetail={setOpenViewDetail}
        dataViewDetail={dataViewDetail}
        setDataViewDetail={setDataViewDetail}
      />
    </div>
  );
};

export default ListDivisions;
