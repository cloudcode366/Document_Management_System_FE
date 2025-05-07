import { DeleteTwoTone, PlusOutlined, UnlockOutlined } from "@ant-design/icons";
import { ProTable } from "@ant-design/pro-components";
import { App, Button, Popconfirm, Tag, Tooltip, Typography } from "antd";
import { useRef, useState } from "react";
import dayjs from "dayjs";
import CreateWorkflow from "@/components/admin/workflows/create.workflow";
import DetailWorkflow from "@/components/admin/workflows/detail.workflow";
import {
  changeStatusWorkflowAPI,
  viewAllWorkflowsAPI,
} from "@/services/api.service";
import { convertScopeName } from "@/services/helper";

const TableWorkflow = () => {
  const actionRef = useRef();
  const [meta, setMeta] = useState({
    limit: 10,
    total: 1,
    page: 1,
  });

  const [openModalCreate, setOpenModalCreate] = useState(false);

  const [openViewDetail, setOpenViewDetail] = useState(false);
  const [dataViewDetail, setDataViewDetail] = useState(null);

  const [isDeleteWorkflow, setIsDeleteWorkflow] = useState(false);
  const { message, notification } = App.useApp();

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
          <Tooltip title="Xem chi tiết">
            <a
              onClick={() => {
                setDataViewDetail(entity);
                setOpenViewDetail(true);
              }}
              style={{ cursor: "pointer" }}
            >
              {entity.workflowName}
            </a>
          </Tooltip>
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
    {
      title: "Thao tác",
      hideInSearch: true,
      width: "15%",
      render(dom, entity, index, action, schema) {
        return (
          <>
            {!entity.isDeleted ? (
              <Popconfirm
                placement="leftTop"
                title="Xác nhận khóa luồng xử lý"
                description="Bạn có chắc chắn muốn khóa luồng xử lý này?"
                onConfirm={() =>
                  handleDeleteWorkflow(
                    entity.workflowId,
                    entity.workflowName,
                    entity.isDeleted
                  )
                }
                okText="Xác nhận"
                cancelText="Hủy"
                okButtonProps={{ loading: isDeleteWorkflow }}
              >
                <span style={{ cursor: "pointer", marginLeft: 20 }}>
                  <Tooltip title="Khóa luồng xử lý này">
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
                title="Xác nhận mở lại luồng xử lý này"
                description="Bạn có chắc chắn muốn mở lại luồng xử lý này?"
                onConfirm={() =>
                  handleDeleteWorkflow(
                    entity.workflowId,
                    entity.workflowName,
                    entity.isDeleted
                  )
                }
                okText="Xác nhận"
                cancelText="Hủy"
                okButtonProps={{ loading: isDeleteWorkflow }}
              >
                <span style={{ cursor: "pointer", marginLeft: 20 }}>
                  <Tooltip title="Mở lại luồng xử lý này">
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

  const handleDeleteWorkflow = async (workflowId, workflowName, isDeleted) => {
    setIsDeleteWorkflow(true);
    const res = await changeStatusWorkflowAPI(workflowId);
    if (res && res.data && res.data.statusCode === 200) {
      if (isDeleted) {
        message.success(`Mở khóa ${workflowName} thành công!`);
      } else {
        message.success(`Khóa ${workflowName} thành công!`);
      }
      refreshTable();
    } else {
      notification.error({
        message: `Đã có lỗi xảy ra!`,
        description: res.data.content,
      });
    }
    setIsDeleteWorkflow(false);
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
            return (
              <div>
                {range[0]} - {range[1]} trên {total} luồng xử lý
              </div>
            );
          },
        }}
        headerTitle={
          <span style={{ fontWeight: "bold" }}>Quản lý luồng xử lý</span>
        }
        toolBarRender={() => [
          <Button
            key="buttonAddNewWorkflow"
            icon={<PlusOutlined />}
            onClick={() => {
              setOpenModalCreate(true);
            }}
            type="primary"
          >
            Tạo mới luồng xử lý
          </Button>,
        ]}
      />
      <CreateWorkflow
        openModalCreate={openModalCreate}
        setOpenModalCreate={setOpenModalCreate}
        refreshTable={refreshTable}
        setDataViewDetail={setDataViewDetail}
      />
      <DetailWorkflow
        openViewDetail={openViewDetail}
        setOpenViewDetail={setOpenViewDetail}
        dataViewDetail={dataViewDetail}
        setDataViewDetail={setDataViewDetail}
      />
    </div>
  );
};

export default TableWorkflow;
