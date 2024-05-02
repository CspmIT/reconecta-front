import React, { useState } from "react";
import CardCustom from "../../../../components/CardCustom";
import { FaChartArea, FaPowerOff, FaTachometerAlt } from "react-icons/fa";
import { BsFiles } from "react-icons/bs";

const CardBoard = ({ onCardSelect }) => {
  const [selectedCardId, setSelectedCardId] = useState(null);
  const boardCards = [
    { id: 1, name: "METROLOGÍA", icon: <FaTachometerAlt /> },
    { id: 2, name: "EVENTOS", icon: <BsFiles /> },
    { id: 3, name: "ANALITICAS", icon: <FaChartArea /> },
    { id: 4, name: "MANIOBRAS", icon: <FaPowerOff /> },
  ];
  const handleCard = (id) => {
    const newSelectedCardId = id === selectedCardId ? null : id;
    setSelectedCardId(newSelectedCardId);
    onCardSelect(newSelectedCardId);
  };

  return (
    <div className="flex flex-row justify-between select-none">
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
  );
};

export default CardBoard;
