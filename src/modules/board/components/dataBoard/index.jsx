import React, { useState } from "react";
import HeaderBoard from "../headerBoard";
import { Button } from "@mui/material";
import { FaRedo } from "react-icons/fa";
import ControlsBoard from "../controlsBoard";
import { FaChartArea, FaPowerOff, FaTachometerAlt } from "react-icons/fa";
import { BsFiles } from "react-icons/bs";
import CardCustom from "../../../../components/CardCustom";
import MetrologyBoard from "../metrologyBoard";

const DataBoard = ({ ...props }) => {
  const [selectedCardId, setSelectedCardId] = useState(null);
  const boardCards = [
    { id: 1, name: "METROLOGÍA", icon: <FaTachometerAlt /> },
    { id: 2, name: "EVENTOS", icon: <BsFiles /> },
    { id: 3, name: "ANALITICAS", icon: <FaChartArea /> },
    { id: 4, name: "MANIOBRAS", icon: <FaPowerOff /> },
  ];
  const handleCard = (id) => {
    setSelectedCardId(id);
  };
  return (
    <div className="w-full md:w-10/12 items-center rounded-xl p-3 bg-gray-300 dark:bg-gray-600">
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
      <div className="flex flex-row justify-between">
        {boardCards.map((card, i) => (
          <div className="w-1/4 py-5 flex flex-row justify-center" key={i}>
            <CardCustom className={`w-5/6 h-full py-5 hover:border-blue-500 hover:border-4 cursor-pointer ${selectedCardId === card.id ? "border-blue-500 border-4" : ""}`}>
              <div onClick={() => handleCard(card.id)} className="w-full flex flex-col items-center font-bold">
                <div className="text-2xl text-blue-600">{card.icon}</div>
                <div className="text-xl mt-3 font-sans">{card.name}</div>
              </div>
            </CardCustom>
          </div>
        ))}
      </div>
      <div className="w-full my-3">
        <hr />
      </div>
      {/* Si selectedCardId === 1 muestro el componente metrologyBoard */}
      {selectedCardId == 1 ? <MetrologyBoard /> : null}
      {selectedCardId == 2 ? <MetrologyBoard /> : null}
      {selectedCardId == 3 ? <MetrologyBoard /> : null}
      {selectedCardId == 4 ? <MetrologyBoard /> : null}
    </div>
  );
};

export default DataBoard;
