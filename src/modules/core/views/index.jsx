import React, { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import style from "../utils/style.module.css";
import NavBarCustom from "../../NavBarCustom/views";
import { MainContext } from "../../../context/MainContext";
import Footer from "../components/Footer";
const MainContent = () => {
  const { user } = useContext(MainContext);
  // const authUser = storage.get('usuario')
  // console.log(authUser)
  if (user) {
    return <Navigate to="/login" />;
  }
  return (
    <div className="pt-16 !min-h-screen relative bg-gray-200 dark:bg-gray-700 ">
      <NavBarCustom />
      <div className={`pl-20 pt-4 pb-32 !min-h-[92vh]  flex relative w-full ${style.boxMain}`}>
        <Outlet />
      </div>
      <Footer />
    </div>
  );
};

export default MainContent;
