import React from "react";
import HeaderBoard from "../headerBoard";
import { Button } from "@mui/material";
import { FaRedo } from "react-icons/fa";
import ControlsBoard from "../controlsBoard";
import { FaChartArea, FaPowerOff, FaTachometerAlt } from "react-icons/fa";
import { BsFiles } from "react-icons/bs";

const DataBoard = ({ ...props }) => {
  const boardCards = [
    { id: 1, name: "METROLOGÍA", icon: <FaTachometerAlt /> },
    { id: 2, name: "EVENTOS", icon: <BsFiles /> },
    { id: 3, name: "ANALITICAS", icon: <FaChartArea /> },
    { id: 4, name: "MANIOBRAS", icon: <FaPowerOff /> },
  ];
  return (
    <div className="w-full items-center rounded-xl p-3 bg-gray-300 dark:bg-gray-600">
      <div className="flex flex-row justify-between">
        <div className="flex-grow flex justify-center">
          <h2 className="pl-10 text-2xl">Reconectador</h2>
        </div>
        <div>
          <Button variant="contained">
            <FaRedo />
          </Button>
        </div>
      </div>
      <div className="w-full my-3">
        <hr />
      </div>
      <HeaderBoard />
      <div className="w-full my-3">
        <hr />
      </div>
      <ControlsBoard />
      <div className="w-full my-3">
        <hr />
      </div>
    </div>
  );
};

export default DataBoard;
