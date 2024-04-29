import { Button } from "@mui/material";
import React from "react";
import { FaLock } from "react-icons/fa";
import { boardControls } from "../../utils/objects";

const ControlsBoard = () => {
  return (
    <div>
      <div className="my-3 text-center">
        <b className="text-xl mr-3">Controles</b>
        <Button size="large" variant="contained">
          <FaLock />
        </Button>
      </div>
      <div className="w-full flex flex-row flex-wrap justify-between">
        {boardControls.map((control, index) => (
          <div key={index} className="w-1/4 text-center mt-2">
            <b>{control.name}</b>
            <br />
            <label className="inline-flex items-center cursor-pointer">
              <input type="checkbox" value="" className="sr-only peer" />
              <div className="relative w-14 h-7 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
            </label>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ControlsBoard;
