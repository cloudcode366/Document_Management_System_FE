import { ProTable } from "@ant-design/pro-components";
import { Tag } from "antd";
import { useRef, useState } from "react";
import { viewAllWorkflowsAPI } from "@/services/api.service";
import { convertScopeName } from "@/services/helper";
import ClientDetailWorkflow from "./client.detail.workflow";

const ListWorkflow = () => {
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
      title: "Luồng xử lý",
      dataIndex: "workflowName",
      copyable: true,
      fieldProps: {
        placeholder: "Vui lòng nhập tên luồng xử lý",
      },
      formItemProps: {
        labelCol: { span: 7 },
        wrapperCol: { span: 24 },
      },
      width: "40%",
      render(dom, entity) {
        return (
          <a
            onClick={() => {
              setDataViewDetail(entity);
              setOpenViewDetail(true);
            }}
            style={{ cursor: "pointer" }}
          >
            {entity.workflowName}
          </a>
        );
      },
    },
    {
      title: "Phạm vi",
      dataIndex: "scope",
      hideInSearch: true,
      width: "15%",
      render(dom, entity) {
        return convertScopeName(entity.scope);
      },
    },
    {
      title: "Phạm vi",
      dataIndex: "scope",
      hideInTable: true,
      valueType: "select",
      request: async () => {
        return [
          { label: "Văn bản đi", value: "OutGoing" },
          { label: "Văn bản đến", value: "InComing" },
          { label: "Nội bộ phòng ban", value: "Division" },
          { label: "Nội bộ toàn trường", value: "School" },
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
      title: "Trạng thái",
      dataIndex: "isDeleted",
      hideInSearch: true,
      width: "15%",
      render: (isDeleted) =>
        isDeleted ? (
          <Tag color="red">Bị khóa</Tag>
        ) : (
          <Tag color="green">Hoạt động</Tag>
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
        scroll={{ y: "calc(100vh - 350px)" }}
        columns={columns}
        actionRef={actionRef}
        cardBordered
        request={async (params, sort, filter) => {
          let query = "";
          if (params) {
            if (params.workflowName) {
              query += `workflowName=${params.workflowName}`;
            }
            if (params.scope) {
              query += `&scope=${params.scope}`;
            }
            query += `&page=${params.current}&limit=${params.pageSize}`;
          }
          const res = await viewAllWorkflowsAPI(query);

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
        rowKey="workflowId"
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
          <span style={{ fontWeight: "bold" }}>Danh sách luồng xử lý</span>
        }
      />
      <ClientDetailWorkflow
        openViewDetail={openViewDetail}
        setOpenViewDetail={setOpenViewDetail}
        dataViewDetail={dataViewDetail}
        setDataViewDetail={setDataViewDetail}
      />
    </div>
  );
};

export default ListWorkflow;
