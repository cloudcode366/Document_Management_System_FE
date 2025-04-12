import { Navigate, useLocation } from "react-router-dom";
import { Result, Button } from "antd";
import { useCurrentApp } from "components/context/app.context";
import { Link } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, user } = useCurrentApp();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  const isAdminRoute = location.pathname.includes("admin");
  const role = user?.role;
  if (isAdminRoute && role === "USER") {
    return (
      <Result
        status="403"
        title="403 - Không có quyền truy cập"
        subTitle="Xin lỗi, bạn không có quyền hạn để sử dụng những tính năng này."
        extra={
          <Button type="primary">
            <Link to="/">Quay lại</Link>
          </Button>
        }
      />
    );
  }

  return <>{children}</>;
};

export default ProtectedRoute;
