import React, { useState } from "react";
import HeaderBoard from "../headerBoard";
import { Button } from "@mui/material";
import { FaRedo } from "react-icons/fa";
import ControlsBoard from "../controlsBoard";
import MetrologyBoard from "../metrologyBoard";
import EventBoard from "../eventBoard";
import CardBoard from "../cardBoard";
import AnalyticsBoard from "../analyticsBoard";
import ManeuverBoard from "../maneuverBoard";

const DataBoard = ({ ...props }) => {
  const [selectedCardId, setSelectedCardId] = useState(null);
  const handleCardSelect = (id) => {
    setSelectedCardId(id);
  };
  return (
    <div className="w-full md:w-10/12 items-center rounded-xl p-3 bg-gray-200 dark:bg-gray-600">
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
      <CardBoard onCardSelect={handleCardSelect} />
      <div className="w-full my-3">
        <hr />
      </div>
      {selectedCardId === 1 ? <MetrologyBoard /> : null}
      {selectedCardId === 2 ? <EventBoard /> : null}
      {selectedCardId === 3 ? <AnalyticsBoard /> : null}
      {selectedCardId === 4 ? <ManeuverBoard /> : null}
    </div>
  );
};

export default DataBoard;
