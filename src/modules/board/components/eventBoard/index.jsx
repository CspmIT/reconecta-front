import React from "react";
import TimePickerCustom from "../../../../components/TimePickerCustom";
import { FaCheck } from "react-icons/fa";
import TableCustom from "../../../../components/TableCustom";

const EventBoard = () => {
  return (
    <div className="w-full">
      <div className="w-full flex flex-row justify-center items-center">
        <div className="w-1/6 text-center mx-5">
          <TimePickerCustom text="Fecha de Inicio" />
        </div>
        <div className="w-1/6 text-center mx-5">
          <TimePickerCustom text="Fecha de Fin" />
        </div>
        <div className="w-1/6">
          <button className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded w-1/2">Filtrar</button>
        </div>
        <div className="w-1/6">
          <button className="bg-amber-400 hover:bg-amber-500 text-black py-2 px-4 rounded w-2/3">
            <span className="flex flex-row justify-evenly">
              <FaCheck /> Alertas
            </span>
          </button>
        </div>
      </div>
      <TableCustom columns={[]} data={[]} />
    </div>
  );
};

export default EventBoard;
