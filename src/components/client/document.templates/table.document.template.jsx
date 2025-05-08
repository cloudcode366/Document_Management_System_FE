import {
  CloudDownloadOutlined,
  DeleteTwoTone,
  EyeOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import { ProTable } from "@ant-design/pro-components";
import { App, Button, Popconfirm, Tooltip } from "antd";
import { useEffect, useRef, useState } from "react";
import dayjs from "dayjs";
import CreateDocumentTemplate from "./create.document.template";
import { BeatLoader } from "react-spinners";
import {
  deleteTemplateAPI,
  viewAllDocumentTypesAPI,
  viewAllTemplatesAPI,
} from "@/services/api.service";
import ViewDetailTemplate from "./view.detail.template";
import { useCurrentApp } from "@/components/context/app.context";

const TableDocumentTemplate = () => {
  const actionRef = useRef();
  const [meta, setMeta] = useState({
    limit: 10,
    total: 1,
    page: 1,
  });
  const [openViewDetailModal, setOpenViewDetailModal] = useState(false);
  const [dataDetail, setDataDetail] = useState(null);
  const [openModalCreate, setOpenModalCreate] = useState(false);
  const [documentTypes, setDocumentTypes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isDelete, setIsDelete] = useState(false);
  const { message, notification } = App.useApp();
  const { user } = useCurrentApp();

  const fetchDocumentType = async () => {
    setLoading(true);
    const res = await viewAllDocumentTypesAPI("page=1&limit=100000");
    if (res?.data?.statusCode === 200) {
      const data = res.data.content;
      const active = data.filter(
        (documentType) => documentType.isDeleted === false
      );
      const newDocumentTypeData = active.map((documentType) => ({
        documentTypeId: documentType.documentTypeId,
        documentTypeName: documentType.documentTypeName,
      }));
      setDocumentTypes(newDocumentTypeData);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchDocumentType();
  }, []);

  const columns = [
    {
      title: "Mẫu văn bản",
      dataIndex: "name",
      copyable: true,
      fieldProps: {
        placeholder: "Vui lòng nhập tên mẫu văn bản",
      },
      formItemProps: {
        labelCol: { span: 8 },
        wrapperCol: { span: 18 },
      },
      render(dom, entity) {
        return <div> {entity.name}</div>;
      },
      width: "40%",
    },
    {
      title: "Loại văn bản",
      dataIndex: "documentName",
      hideInTable: true,
      formItemProps: {
        labelCol: { span: 8 },
        wrapperCol: { span: 18 },
      },
      fieldProps: {
        placeholder: "Vui lòng nhập loại văn bản",
      },
      width: "15%",
    },
    {
      title: "Loại văn bản",
      dataIndex: "type",
      valueType: "select",
      hideInSearch: true,
      width: "15%",
    },

    {
      title: "Ngày tạo",
      dataIndex: "createDate",
      valueType: "date",
      // sorter: true,
      hideInSearch: true,
      render(dom, entity, index, action, schema) {
        return <>{dayjs(entity.createDate).format("DD-MM-YYYY HH:mm")}</>;
      },
      width: "15%",
    },

    {
      title: "Người tạo",
      dataIndex: "createBy",
      hideInSearch: true,
      width: "15%",
    },

    {
      title: "Thao tác",
      hideInSearch: true,
      width: "15%",
      render(dom, entity, index, action, schema) {
        return (
          <div
            style={{ display: "flex", justifyContent: "flex-start", gap: 20 }}
          >
            <Tooltip title="Xem mẫu văn bản này">
              <EyeOutlined
                style={{ cursor: "pointer", color: "#52c41a", fontSize: 18 }}
                onClick={() => {
                  setOpenViewDetailModal(true);
                  setDataDetail(entity);
                }}
              />
            </Tooltip>

            <Tooltip title="Tải mẫu văn bản này">
              <CloudDownloadOutlined
                style={{ cursor: "pointer", color: "#1890ff", fontSize: 18 }}
                onClick={async () => {
                  try {
                    const token = localStorage.getItem("access_token");
                    if (!token) {
                      message.error(
                        "Không tìm thấy access token. Vui lòng đăng nhập lại!"
                      );
                      return;
                    }
                    const response = await fetch(entity.url, {
                      method: "GET",
                      headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                      },
                    });
                    if (response.status === 200) {
                      const blob = await response.blob();
                      const url = window.URL.createObjectURL(blob);
                      const link = document.createElement("a");
                      link.href = url;
                      link.download = "template.docx";
                      document.body.appendChild(link);
                      link.click();
                      window.URL.revokeObjectURL(url);
                    } else {
                      message.error("Không thể tải file. Vui lòng thử lại!");
                    }
                  } catch (error) {
                    message.error("Đã xảy ra lỗi khi tải file!");
                  }
                }}
              />
            </Tooltip>
            {(user?.mainRole?.roleName === "Chief" ||
              user?.subRole?.roleName?.endsWith("_Chief")) && (
              <Tooltip title="Xóa mẫu văn bản này">
                <Popconfirm
                  placement="leftTop"
                  title="Xác nhận xóa mẫu"
                  description="Bạn có chắc chắn muốn xóa mẫu văn bản này?"
                  onConfirm={() => handleDeleteUser(entity.id, entity.name)}
                  okText="Xác nhận"
                  cancelText="Hủy"
                  okButtonProps={{ loading: isDelete }}
                >
                  <DeleteTwoTone
                    twoToneColor="#ff4d4f"
                    style={{ cursor: "pointer", fontSize: 18 }}
                  />
                </Popconfirm>
              </Tooltip>
            )}
          </div>
        );
      },
    },
  ];

  const handleDeleteUser = async (id, name) => {
    setIsDelete(true);
    const res = await deleteTemplateAPI(id);
    if (res && res.data && res.data.statusCode === 200) {
      message.success(`Xóa ${name} thành công!`);
      refreshTable();
    } else {
      notification.error({
        message: `Đã có lỗi xảy ra!`,
        description: res.data.content,
      });
    }
    setIsDelete(false);
  };

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
        scroll={{ y: "calc(100vh - 350px)" }}
        columns={columns}
        actionRef={actionRef}
        cardBordered
        request={async (params, sort, filter) => {
          console.log(params);

          let query = "";
          if (params) {
            if (params.documentName) {
              query += `documentName=${params.documentName}&`;
            }
            if (params.name) {
              query += `name=${params.name}&`;
            }
            query += `page=${params.current}&pageSize=${params.pageSize}`;
          }
          const res = await viewAllTemplatesAPI(query);
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
        rowKey={"id"}
        pagination={{
          current: meta.page,
          pageSize: meta.limit,
          showSizeChanger: true,
          total: meta.total,
          showTotal: (total, range) => {
            return (
              <div>
                {range[0]} - {range[1]} trên {total} mẫu văn bản
              </div>
            );
          },
        }}
        headerTitle={
          <span style={{ fontWeight: "bold" }}>Quản lý mẫu văn bản</span>
        }
        toolBarRender={() =>
          user?.mainRole?.roleName === "Chief" ||
          user?.subRole?.roleName?.endsWith("_Chief") ||
          user?.mainRole?.roleName === "Clerical Assistant" ||
          user?.subRole?.roleName?.endsWith("_Clerical Assistant")
            ? [
                <Button
                  key="buttonAddNew"
                  icon={<PlusOutlined />}
                  onClick={() => {
                    setOpenModalCreate(true);
                  }}
                  type="primary"
                >
                  Tạo mới mẫu văn bản
                </Button>,
              ]
            : []
        }
      />
      <CreateDocumentTemplate
        openModalCreate={openModalCreate}
        setOpenModalCreate={setOpenModalCreate}
        refreshTable={refreshTable}
        documentTypes={documentTypes}
      />
      <ViewDetailTemplate
        openViewDetailModal={openViewDetailModal}
        setOpenViewDetailModal={setOpenViewDetailModal}
        dataDetail={dataDetail}
        setDataDetail={setDataDetail}
      />
    </div>
  );
};

export default TableDocumentTemplate;
