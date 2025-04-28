import { Button, Descriptions, Divider, Drawer, Image, Tag } from "antd";
import dayjs from "dayjs";
import img from "assets/files/document-blur.png";
import { useNavigate } from "react-router-dom";
import {
  convertArchivedStatus,
  convertColorArchivedStatus,
} from "@/services/helper";

const DrawerArchivedDocument = (props) => {
  const {
    openViewDetail,
    setOpenViewDetail,
    selectedRecord,
    setSelectedRecord,
  } = props;
  const navigate = useNavigate();

  const onClose = () => {
    setOpenViewDetail(false);
    setSelectedRecord(null);
  };

  return (
    <>
      <Drawer
        title={null}
        placement="right"
        onClose={onClose}
        open={openViewDetail}
        width={400}
        closeIcon={<span style={{ fontSize: 20, color: "#f5222d" }}>✕</span>}
      >
        <div style={{ padding: "0 8px" }}>
          <div
            style={{
              display: "flex",
              alignItems: "stretch",
              marginBottom: 50,
              gap: 20,
            }}
          >
            <img
              src={img}
              alt="preview"
              style={{
                width: 113,
                height: 140,
                objectFit: "cover",
                marginRight: 12,
                borderRadius: 4,
                border: "1px solid #ccc",
                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.2)",
              }}
            />
            <div
              style={{
                flex: 1,
                maxWidth: "60%",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
              }}
            >
              <div>
                <p
                  style={{
                    fontSize: 16,
                    fontWeight: 600,
                    marginBottom: 10,
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    cursor: "pointer",
                  }}
                  title={selectedRecord?.name}
                >
                  {selectedRecord?.name}
                </p>
                <Tag color={convertColorArchivedStatus(selectedRecord?.status)}>
                  {convertArchivedStatus(selectedRecord?.status)}
                </Tag>
              </div>

              <div style={{ marginTop: 8 }}>
                <Button
                  type="primary"
                  size="middle"
                  style={{
                    width: "70%",
                    backgroundColor: "#18B0FF",
                    height: 40,
                  }}
                  onClick={() =>
                    navigate("/detail-archived-document", {
                      state: {
                        documentId: selectedRecord?.id,
                      },
                    })
                  }
                >
                  <p style={{ fontWeight: "bold" }}>Mở</p>
                </Button>
              </div>
            </div>
          </div>

          <div style={{ lineHeight: "24px" }}>
            <div style={{ marginBottom: "20px" }}>
              <strong style={{ marginLeft: "10px" }}>Chi tiết</strong>
              <br />
              <hr style={{ color: "#DADADA" }} />
            </div>
            <div style={{ marginBottom: "20px" }}>
              <strong style={{ marginLeft: "10px" }}>Phạm vi ban hành</strong>
              <br />
              <p style={{ marginLeft: "10px" }}>{selectedRecord?.scope}</p>
            </div>
            <div style={{ marginBottom: "20px" }}>
              <strong style={{ marginLeft: "10px" }}>Số hiệu văn bản</strong>
              <br />
              <p style={{ marginLeft: "10px" }}>
                {selectedRecord?.numberOfDocument}
              </p>
            </div>
            <div style={{ marginBottom: "20px" }}>
              <strong style={{ marginLeft: "10px" }}>Loại văn bản</strong>
              <br />
              <p style={{ marginLeft: "10px" }}>{selectedRecord?.type}</p>
            </div>
            {selectedRecord?.scope === "InComing" && (
              <>
                <div style={{ marginBottom: "20px" }}>
                  <strong style={{ marginLeft: "10px" }}>Người gửi</strong>
                  <br />
                  <p style={{ marginLeft: "10px" }}>{selectedRecord?.sender}</p>
                </div>
                <div style={{ marginBottom: "20px" }}>
                  <strong style={{ marginLeft: "10px" }}>Ngày nhận</strong>
                  <br />
                  <p style={{ marginLeft: "10px" }}>
                    {dayjs(selectedRecord?.dateReceived).format(
                      "DD-MM-YYYY HH:mm"
                    )}
                  </p>
                </div>
                <div style={{ marginBottom: "20px" }}>
                  <strong style={{ marginLeft: "10px" }}>Người nhận</strong>
                  <br />
                  <p style={{ marginLeft: "10px" }}>
                    {selectedRecord?.createBy}
                  </p>
                </div>
                <div style={{ marginBottom: "20px" }}>
                  <strong style={{ marginLeft: "10px" }}>Ngày lưu</strong>
                  <br />
                  <p style={{ marginLeft: "10px" }}>
                    {dayjs(selectedRecord?.createDate).format(
                      "DD-MM-YYYY HH:mm"
                    )}
                  </p>
                </div>
              </>
            )}

            {selectedRecord?.scope === "OutGoing" && (
              <>
                <div style={{ marginBottom: "20px" }}>
                  <strong style={{ marginLeft: "10px" }}>Người lưu</strong>
                  <br />
                  <p style={{ marginLeft: "10px" }}>
                    {selectedRecord?.createBy}
                  </p>
                </div>
                <div style={{ marginBottom: "20px" }}>
                  <strong style={{ marginLeft: "10px" }}>Ngày lưu</strong>
                  <br />
                  <p style={{ marginLeft: "10px" }}>
                    {dayjs(selectedRecord?.createDate).format(
                      "DD-MM-YYYY HH:mm"
                    )}
                  </p>
                </div>
                <div style={{ marginBottom: "20px" }}>
                  <strong style={{ marginLeft: "10px" }}>
                    Đối tác bên ngoài
                  </strong>
                  <br />
                  <p style={{ marginLeft: "10px" }}>
                    {selectedRecord?.externalPartner}
                  </p>
                </div>
                <div style={{ marginBottom: "20px" }}>
                  <strong style={{ marginLeft: "10px" }}>Ngày gửi</strong>
                  <br />
                  <p style={{ marginLeft: "10px" }}>
                    {dayjs(selectedRecord?.dateSented).format(
                      "DD-MM-YYYY HH:mm"
                    )}
                  </p>
                </div>
              </>
            )}
            {selectedRecord?.scope === "Division" ||
              (selectedRecord?.scope === "School" && (
                <>
                  <div style={{ marginBottom: "20px" }}>
                    <strong style={{ marginLeft: "10px" }}>Người lưu</strong>
                    <br />
                    <p style={{ marginLeft: "10px" }}>
                      {selectedRecord?.createBy}
                    </p>
                  </div>
                  <div style={{ marginBottom: "20px" }}>
                    <strong style={{ marginLeft: "10px" }}>Ngày lưu</strong>
                    <br />
                    <p style={{ marginLeft: "10px" }}>
                      {dayjs(selectedRecord?.createDate).format(
                        "DD-MM-YYYY HH:mm"
                      )}
                    </p>
                  </div>
                </>
              ))}
          </div>
        </div>
      </Drawer>
    </>
  );
};

export default DrawerArchivedDocument;
