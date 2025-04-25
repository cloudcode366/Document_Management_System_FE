import { ProTable } from "@ant-design/pro-components";
import { App, Button, Popconfirm, Tag, Tooltip } from "antd";
import { useRef, useState } from "react";
import {
  changeStatusDocumentTypeAPI,
  viewAllDocumentTypesAPI,
} from "@/services/api.service";
import { useCurrentApp } from "@/components/context/app.context";
import { DeleteTwoTone, PlusOutlined, UnlockOutlined } from "@ant-design/icons";
import CreateDocumentType from "./create.document.type";

const ListDocumentType = () => {
  const actionRef = useRef();
  const { user } = useCurrentApp();
  const { message, notification } = App.useApp();
  const [openModalCreate, setOpenModalCreate] = useState(false);

  const [meta, setMeta] = useState({
    limit: 10,
    total: 1,
    page: 1,
  });

  const [isDeleteDocumentType, setIsDeleteDocumentType] = useState(false);

  const handleDeleteDocumentType = async (
    documentTypeId,
    documentTypeName,
    isDeleted
  ) => {
    setIsDeleteDocumentType(true);
    const res = await changeStatusDocumentTypeAPI(documentTypeId);
    if (res && res.data && res.data.statusCode === 200) {
      if (isDeleted) {
        message.success(
          `Mở sử dụng loại văn bản ${documentTypeName} thành công`
        );
      } else {
        message.success(`Khóa loại văn bản ${documentTypeName} thành công`);
      }
      refreshTable();
    } else {
      notification.error({
        message: `Đã có lỗi xảy ra`,
        description: res.data.content,
      });
    }
    setIsDeleteDocumentType(false);
  };

  const columns = [
    {
      title: "Loại văn bản",
      dataIndex: "documentTypeName",
      copyable: true,
      width: "40%",
      fieldProps: {
        placeholder: "Vui lòng nhập tên loại văn bản",
      },
      formItemProps: {
        labelCol: { span: 8 }, // Điều chỉnh label rộng hơn để không bị đè
        wrapperCol: { span: 18 }, // Đảm bảo input không chiếm hết không gian
      },
    },
    {
      title: "Chữ viết tắt",
      dataIndex: "acronym",
      width: "20%",
      hideInSearch: true,
    },
    {
      title: "Trạng thái",
      dataIndex: "isDeleted",
      hideInSearch: true,
      width: "20%",
      render: (isDeleted) =>
        isDeleted ? (
          <Tag color="red">Bị khóa</Tag>
        ) : (
          <Tag color="green">Hoạt động</Tag>
        ),
    },
  ];

  if (
    user?.mainRole.roleName === "Chief" ||
    user?.subRole.roleName === "Chief"
  ) {
    columns.push({
      title: "Thao tác",
      hideInSearch: true,
      width: "20%",
      render(dom, entity, index, action, schema) {
        return !entity.isDeleted ? (
          <Popconfirm
            placement="leftTop"
            title="Xác nhận khóa loại văn bản"
            description="Bạn có chắc chắn muốn khóa loại văn bản này?"
            onConfirm={() =>
              handleDeleteDocumentType(
                entity.documentTypeId,
                entity.documentTypeName,
                entity.isDeleted
              )
            }
            okText="Xác nhận"
            cancelText="Hủy"
            okButtonProps={{ loading: isDeleteDocumentType }}
          >
            <span style={{ cursor: "pointer", marginLeft: 20 }}>
              <Tooltip title="Khóa loại văn bản này">
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
            title="Xác nhận mở lại loại văn bản"
            description="Bạn có chắc chắn muốn mở lại loại văn bản này?"
            onConfirm={() =>
              handleDeleteDocumentType(
                entity.documentTypeId,
                entity.documentTypeName,
                entity.isDeleted
              )
            }
            okText="Xác nhận"
            cancelText="Hủy"
            okButtonProps={{ loading: isDeleteDocumentType }}
          >
            <span style={{ cursor: "pointer", marginLeft: 20 }}>
              <Tooltip title="Mở lại loại văn bản này">
                <UnlockOutlined
                  style={{ color: "green", fontSize: 18, cursor: "pointer" }}
                />
              </Tooltip>
            </span>
          </Popconfirm>
        );
      },
    });
  }

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
            if (params.documentTypeName) {
              query += `documentTypeName=${params.documentTypeName}`;
            }
            query += `&page=${params.current}&limit=${params.pageSize}`;
          }

          const res = await viewAllDocumentTypesAPI(query);
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
        rowKey="documentTypeId"
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
          <span style={{ fontWeight: "bold" }}>Danh sách loại văn bản</span>
        }
        toolBarRender={() =>
          user?.mainRole.roleName === "Chief" ||
          user?.subRole.roleName === "Chief"
            ? [
                <Button
                  key="buttonAddNew"
                  icon={<PlusOutlined />}
                  onClick={() => setOpenModalCreate(true)}
                  type="primary"
                >
                  Tạo mới loại văn bản
                </Button>,
              ]
            : []
        }
      />
      <CreateDocumentType
        openModalCreate={openModalCreate}
        setOpenModalCreate={setOpenModalCreate}
        refreshTable={refreshTable}
      />
    </div>
  );
};

export default ListDocumentType;
