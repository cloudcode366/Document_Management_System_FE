import {
  DeleteTwoTone,
  EditTwoTone,
  PlusOutlined,
  UnlockOutlined,
} from "@ant-design/icons";
import { ProTable } from "@ant-design/pro-components";
import { App, Button, Popconfirm, Tag, Tooltip } from "antd";
import { useRef, useState } from "react";
import CreateDivision from "./create.division";
import UpdateDivision from "./update.division";
import DetailDivision from "./detail.division";
import {
  changeStatusDivisionAPI,
  viewAllDivisionsAPI,
} from "@/services/api.service";

const TableDivision = () => {
  const actionRef = useRef();
  const [meta, setMeta] = useState({
    limit: 10,
    total: 1,
    page: 1,
  });

  const [openViewDetail, setOpenViewDetail] = useState(false);
  const [dataViewDetail, setDataViewDetail] = useState(null);

  const [openModalCreate, setOpenModalCreate] = useState(false);

  const [openModalUpdate, setOpenModalUpdate] = useState(false);
  const [dataUpdate, setDataUpdate] = useState(null);

  const [isDeleteDivision, setIsDeleteDivision] = useState(false);
  const { message, notification } = App.useApp();

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
    {
      title: "Thao tác",
      hideInSearch: true,
      width: "20%",
      render(dom, entity, index, action, schema) {
        return (
          <>
            <Tooltip title="Cập nhật phòng ban này">
              <EditTwoTone
                twoToneColor="#f57800"
                style={{ cursor: "pointer", marginRight: 15 }}
                onClick={() => {
                  setDataUpdate(entity);
                  setOpenModalUpdate(true);
                }}
              />
            </Tooltip>
            {!entity.isDeleted ? (
              <Popconfirm
                placement="leftTop"
                title="Xác nhận khóa phòng ban"
                description="Bạn có chắc chắn muốn khóa phòng ban này?"
                onConfirm={() =>
                  handleDeleteDivision(
                    entity.divisionId,
                    entity.divisionName,
                    entity.isDeleted
                  )
                }
                okText="Xác nhận"
                cancelText="Hủy"
                okButtonProps={{ loading: isDeleteDivision }}
              >
                <span style={{ cursor: "pointer", marginLeft: 20 }}>
                  <Tooltip title="Khóa phòng ban này">
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
                title="Xác nhận mở lại phòng ban này"
                description="Bạn có chắc chắn muốn mở lại phòng ban này?"
                onConfirm={() =>
                  handleDeleteDivision(
                    entity.divisionId,
                    entity.divisionName,
                    entity.isDeleted
                  )
                }
                okText="Xác nhận"
                cancelText="Hủy"
                okButtonProps={{ loading: isDeleteDivision }}
              >
                <span style={{ cursor: "pointer", marginLeft: 20 }}>
                  <Tooltip title="Mở lại phòng ban này">
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

  const handleDeleteDivision = async (divisionId, divisionName, isDeleted) => {
    setIsDeleteDivision(true);
    const res = await changeStatusDivisionAPI(divisionId);
    if (res && res.data && res.data.statusCode === 200) {
      console.log(`>>> Check divisionName: `, divisionName);
      if (isDeleted) {
        message.success(`Mở khóa phòng ban ${divisionName} thành công!`);
      } else {
        message.success(`Khóa phòng ban ${divisionName} thành công!`);
      }
      refreshTable();
    } else {
      notification.error({
        message: `Đã có lỗi xảy ra!`,
        description: res.data.content,
      });
    }
    setIsDeleteDivision(false);
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
          <span style={{ fontWeight: "bold" }}>Quản lý phòng ban</span>
        }
        toolBarRender={() => [
          <Button
            key="buttonAddNew"
            icon={<PlusOutlined />}
            onClick={() => {
              setOpenModalCreate(true);
            }}
            type="primary"
          >
            Tạo mới phòng ban
          </Button>,
        ]}
      />
      <CreateDivision
        openModalCreate={openModalCreate}
        setOpenModalCreate={setOpenModalCreate}
        refreshTable={refreshTable}
      />
      <UpdateDivision
        openModalUpdate={openModalUpdate}
        setOpenModalUpdate={setOpenModalUpdate}
        dataUpdate={dataUpdate}
        setDataUpdate={setDataUpdate}
        refreshTable={refreshTable}
      />
      <DetailDivision
        openViewDetail={openViewDetail}
        setOpenViewDetail={setOpenViewDetail}
        dataViewDetail={dataViewDetail}
        setDataViewDetail={setDataViewDetail}
      />
    </div>
  );
};

export default TableDivision;
