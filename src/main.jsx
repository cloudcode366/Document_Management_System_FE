import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "styles/global.scss";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import DashboardPage from "pages/client/dashboard/dashboard";
import ListUserPage from "pages/client/users/list.user";
import ListInComingDocumentPage from "pages/client/documents/incoming.documents/list.incoming.document";
import ListOutgoingDocumentPage from "pages/client/documents/outgoing.documents/list.outgoing.document";
import ListSchoolScopedDocumentPage from "pages/client/documents/school.scoped.documents/list.school.scoped.document";
import ListDivisionScopedDocumentPage from "pages/client/documents/division.scoped.documents/list.division.scoped.document";
import LayoutAdmin from "@/layout.admin";
import NotificationPage from "pages/notification";
import ManageDivisionPage from "pages/admin/divisions/manage.division";
import ManageUserPage from "pages/admin/users/manage.user";
import ManageDocumentTypePage from "pages/admin/document.types/manage.document.type";
import ManageLogPage from "pages/admin/log.list/manage.log";
import ManagePermissionPage from "pages/admin/permissions/manage.permission";
import ManageWorkflowPage from "pages/admin/workflows/manage.workflow";
import LoginPage from "pages/auth/login";
import ForgotPasswordPage from "pages/auth/forgot.password";
import ChangePasswordPage from "pages/auth/change.password";
import ProfilePage from "pages/profile";
import UserGuidePage from "pages/user.guide";
import ListArchivedDocumentPage from "pages/client/archived.documents/list.archived.document";
import ListDocumentTemplatePage from "pages/client/document.templates/list.document.template";
import ListDocumentTypePage from "pages/client/document.types/list.document.type";
import ListProgressPage from "pages/client/progresses/list.progress";
import ListTaskPage from "pages/client/tasks/list.task";
import ListWorkflowPage from "pages/client/workflows/list.workflow";
import viVN from "antd/locale/vi_VN";
import { App, ConfigProvider } from "antd";
import ManageDigitalSignature from "pages/admin/digital.signatures/manage.digital.signature";
import ManageInitialSignature from "pages/admin/initial.signatures/manage.initial.signature";
import ListAllDocumentPage from "pages/client/documents/all.documents/list.all.documents";
import LayoutClient from "@/layout";
import DraftDocument from "pages/client/documents/draft.document";
import ApproveDocument from "components/client/documents/approve.document/approve.document";
import TaskDetailPage from "pages/client/tasks/task.detail";
import DetailDocument from "pages/client/documents/detail.document";
import { AppProvider } from "components/context/app.context";
import ProtectedRoute from "components/auth";
import "nprogress/nprogress.css";

const router = createBrowserRouter([
  {
    path: "/",
    element: <LayoutClient />,
    children: [
      {
        index: true,
        element: (
          <ProtectedRoute>
            <ListAllDocumentPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "/user",
        element: (
          <ProtectedRoute>
            <ListUserPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "/incoming-document",
        element: (
          <ProtectedRoute>
            <ListInComingDocumentPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "/outgoing-document",
        element: (
          <ProtectedRoute>
            <ListOutgoingDocumentPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "/school-scoped-document",
        element: (
          <ProtectedRoute>
            <ListSchoolScopedDocumentPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "/division-scoped-document",
        element: (
          <ProtectedRoute>
            <ListDivisionScopedDocumentPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "/detail-document",
        element: (
          <ProtectedRoute>
            <DetailDocument />
          </ProtectedRoute>
        ),
      },
      {
        path: "/approve-document",
        element: (
          <ProtectedRoute>
            <ApproveDocument />
          </ProtectedRoute>
        ),
      },
      {
        path: "/draft-document",
        element: (
          <ProtectedRoute>
            <DraftDocument />
          </ProtectedRoute>
        ),
      },
      {
        path: "/archived-document",
        element: (
          <ProtectedRoute>
            <ListArchivedDocumentPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "/document-template",
        element: (
          <ProtectedRoute>
            <ListDocumentTemplatePage />
          </ProtectedRoute>
        ),
      },
      {
        path: "/document-type",
        element: (
          <ProtectedRoute>
            <ListDocumentTypePage />
          </ProtectedRoute>
        ),
      },
      {
        path: "/progress",
        element: (
          <ProtectedRoute>
            <ListProgressPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "/task",
        element: (
          <ProtectedRoute>
            <ListTaskPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "/task-detail",
        element: (
          <ProtectedRoute>
            <TaskDetailPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "/workflow",
        element: (
          <ProtectedRoute>
            <ListWorkflowPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "/change-password",
        element: (
          <ProtectedRoute>
            <ChangePasswordPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "/notification",
        element: (
          <ProtectedRoute>
            <NotificationPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "/profile",
        element: (
          <ProtectedRoute>
            <ProfilePage />
          </ProtectedRoute>
        ),
      },
      {
        path: "/user-guide",
        element: (
          <ProtectedRoute>
            <UserGuidePage />
          </ProtectedRoute>
        ),
      },
    ],
  },
  {
    path: "admin",
    element: <LayoutAdmin />,
    children: [
      {
        index: true,
        element: (
          <ProtectedRoute>
            <NotificationPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "user",
        element: (
          <ProtectedRoute>
            <ManageUserPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "division",
        element: (
          <ProtectedRoute>
            <ManageDivisionPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "document-type",
        element: (
          <ProtectedRoute>
            <ManageDocumentTypePage />
          </ProtectedRoute>
        ),
      },
      {
        path: "log",
        element: (
          <ProtectedRoute>
            <ManageLogPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "permission",
        element: (
          <ProtectedRoute>
            <ManagePermissionPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "workflow",
        element: (
          <ProtectedRoute>
            <ManageWorkflowPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "change-password",
        element: (
          <ProtectedRoute>
            <ChangePasswordPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "profile",
        element: (
          <ProtectedRoute>
            <ProfilePage />
          </ProtectedRoute>
        ),
      },
      {
        path: "user-guide",
        element: (
          <ProtectedRoute>
            <UserGuidePage />
          </ProtectedRoute>
        ),
      },
      {
        path: "digital-signature",
        element: (
          <ProtectedRoute>
            <ManageDigitalSignature />
          </ProtectedRoute>
        ),
      },
      {
        path: "initial-signature",
        element: (
          <ProtectedRoute>
            <ManageInitialSignature />
          </ProtectedRoute>
        ),
      },
    ],
  },
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/forgot-password",
    element: <ForgotPasswordPage />,
  },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App>
      <AppProvider>
        <ConfigProvider locale={viVN}>
          <RouterProvider router={router} />
        </ConfigProvider>
      </AppProvider>
    </App>
  </StrictMode>
);
