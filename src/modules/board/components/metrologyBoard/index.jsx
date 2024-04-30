import React from "react";
import { boardMetrology } from "../../utils/objects";
import CardCustom from "../../../../components/CardCustom";

const MetrologyBoard = () => {
  return (
    <div className="w-full flex flex-row flex-wrap justify-center">
      {boardMetrology.map((item, i) => (
        <div className={`w-1/2 md:w-1/3 flex justify-center items-center p-3`} key={i}>
          <CardCustom className="w-5/6 min-h-52 border-t-8 border-r-2 border-b-2 border-blue-500">
            <h1 className="font-bold text-xl my-3">{item.name}</h1>
            <div className={`w-full h-full text-center flex flex-row flex-wrap items-center`}>
              {item.children.map((chil, j) => (
                <div key={j} className={`my-1 text-center ${item.children.length === 6 ? "w-1/2" : "w-full"}`}>
                  <b>{chil.name}</b>
                </div>
              ))}
            </div>
          </CardCustom>
        </div>
      ))}
    </div>
  );
};

export default MetrologyBoard;
