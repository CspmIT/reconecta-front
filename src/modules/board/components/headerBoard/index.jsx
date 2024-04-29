import React from "react";
import { FaCircle, FaRedo } from "react-icons/fa";
import { boardStatus, boardFields } from "../../utils/objects";

const HeaderBoard = () => {
  return (
    <div className="w-full flex flex-row justify-around items-center">
      <div className="w-1/3 px-3">
        {boardFields.map((item, i) => (
          <div className="flex flex-row my-1" key={i}>
            <h3 className="ml-5">
              {item.name}: <b>Canal</b>
            </h3>
          </div>
        ))}
      </div>
      <div className="w-1/3 flex flex-row justify-center">
        <div className="rounded-full grid min-w-40 max-w-40 min-h-40 max-h-40 bg-red-500 justify-center items-center shadow-md shadow-red-700">
          <div className="text-center grid cursor-pointer bg-white rounded-full min-w-28 max-w-28 min-h-28 max-h-28 items-center shadow-md shadow-slate-500">
            <b className="text-black">CERRADO</b>
          </div>
        </div>
      </div>
      <div className="w-1/3">
        {boardStatus.map((item, i) => (
          <div className="flex flex-row my-1" key={i}>
            <FaCircle />
            <h3 className="ml-3">{item.name}</h3>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HeaderBoard;
