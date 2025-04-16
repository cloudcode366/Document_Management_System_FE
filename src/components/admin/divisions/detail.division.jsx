import { Descriptions, Drawer, Image, Table, Tag } from "antd";

const DetailDivision = (props) => {
  const {
    openViewDetail,
    setOpenViewDetail,
    dataViewDetail,
    setDataViewDetail,
  } = props;

  const onClose = () => {
    setOpenViewDetail(false);
    setDataViewDetail(null);
  };

  const columns = [
    {
      title: "Ảnh",
      dataIndex: "avatar",
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
      width: "10%",
    },
    {
      title: "Họ và tên",
      dataIndex: "fullName",
      width: "20%",
    },
    {
      title: "Tên đăng nhập",
      dataIndex: "userName",
      width: "20%",
    },
    {
      title: "Email",
      dataIndex: "email",
      width: "25%",
    },
    {
      title: "Chức vụ",
      dataIndex: "position",
      width: "25%",
    },
  ];

  return (
    <>
      {dataViewDetail && (
        <Drawer
          title={`Chi tiết phòng ban`}
          width={"60vw"}
          open={openViewDetail}
          onClose={onClose}
          styles={{ body: { padding: 0, overflow: "hidden", height: "100vh" } }}
        >
          <Descriptions
            bordered
            column={2}
            style={{
              backgroundColor: "#ffffff",
              padding: "12px",
              borderRadius: 10,
            }}
            labelStyle={{
              fontWeight: "bold",
              fontSize: 15,
              backgroundColor: "#F2F2F2",
              padding: "8px 12px",
              color: "#1d1d1f",
            }}
          >
            <Descriptions.Item label="Tên phòng ban">
              {dataViewDetail?.divisionName}
            </Descriptions.Item>
            <Descriptions.Item label="Trạng thái">
              {dataViewDetail?.isDeleted ? (
                <Tag color="red" style={{ fontSize: "14px" }}>
                  Bị khóa
                </Tag>
              ) : (
                <Tag color="green" style={{ fontSize: "14px" }}>
                  Hoạt động
                </Tag>
              )}
            </Descriptions.Item>
          </Descriptions>
          <Table
            dataSource={dataViewDetail.users || []}
            columns={columns}
            rowKey="userId"
            pagination={false}
            style={{ padding: 10 }}
            scroll={{ y: "100%" }}
          />
        </Drawer>
      )}
    </>
  );
};

export default DetailDivision;
