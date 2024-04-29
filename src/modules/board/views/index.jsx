import { Button } from "@mui/material";
import React from "react";
import { FaList, FaMapMarkedAlt, FaTable } from "react-icons/fa";
import { useParams } from "react-router-dom";
import DataBoard from "../components/dataBoard";

const Board = () => {
  const { id } = useParams();
  const buttons = [{ icon: <FaList /> }, { icon: <FaTable /> }, { icon: <FaMapMarkedAlt /> }];
  return (
    <div className="w-full flex flex-row justify-center text-black dark:text-white">
      <div className="w-full h-min flex-row flex flex-wrap justify-between rounded-md bg-gray-50 dark:bg-gray-700 p-4">
        <div className="w-10/12">
          <h1 className="text-left text-2xl">Nombre del reconectador</h1>
        </div>
        <div className="w-2/12 justify-evenly flex">
          {buttons.map((button, i) => (
            <Button size="medium" variant="contained" key={i} href={`/board/${id}/${i}`}>
              {button.icon}
            </Button>
          ))}
        </div>
        <div className="w-full">
          <hr className="my-4"></hr>
        </div>
        <DataBoard id={id} />
      </div>
    </div>
  );
};

export default Board;
