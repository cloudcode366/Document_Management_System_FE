// import { fetchAccountAPI } from "@/services/api";
import { viewProfileUserAPI } from "@/services/api.service";
import React, { createContext, useContext, useEffect, useState } from "react";
import { BeatLoader } from "react-spinners";

// Tạo context ban đầu với giá trị null
const CurrentAppContext = createContext(null);

// AppProvider nhận prop.children
export const AppProvider = (props) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [isAppLoading, setIsAppLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    const userId = localStorage.getItem("user_id");

    if (!token || !userId) {
      setIsAppLoading(false);
      setIsAuthenticated(false);
      return;
    }

    const fetchAccount = async () => {
      try {
        const res = await viewProfileUserAPI(userId);

        if (res.data.statusCode === 200) {
          const data = res.data.content;
          const mainRole = data?.roles?.find((r) => r.createdDate === null);
          const subRole = data?.roles?.filter((r) => r.createdDate !== null);
          setUser({ ...data, mainRole, subRole });
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
        }
      } catch (err) {
        console.error("Lỗi khi gọi API viewProfileUserAPI:", err);
        setIsAuthenticated(false);
      } finally {
        setIsAppLoading(false);
      }
    };

    fetchAccount();
  }, []);

  return (
    <>
      {isAppLoading === false ? (
        <CurrentAppContext.Provider
          value={{
            isAuthenticated,
            user,
            setIsAuthenticated,
            setUser,
            isAppLoading,
            setIsAppLoading,
          }}
        >
          {props.children}
        </CurrentAppContext.Provider>
      ) : (
        <div
          style={{
            position: "fixed",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
          }}
        >
          <BeatLoader size={25} color="#364AD6" />
        </div>
      )}
    </>
  );
};

export const useCurrentApp = () => {
  const currentAppContext = useContext(CurrentAppContext);

  if (!currentAppContext) {
    throw new Error(
      "useCurrentApp has to be used within <CurrentAppContext.Provider>"
    );
  }

  return currentAppContext;
};
