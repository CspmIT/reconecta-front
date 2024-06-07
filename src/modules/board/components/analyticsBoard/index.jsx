import React from "react";
import CardCustom from "../../../../components/CardCustom";
import Linegraph from "./linegraph";
import TableCustom from "../../../../components/TableCustom";

const AnalyticsBoard = () => {
  return (
    <div className="w-full">
      <CardCustom className="border-t-8 border-r-2 border-b-2 border-blue-500">
        <TableCustom columns={[]} data={[]} />
      </CardCustom>
      <CardCustom className="border-t-8 border-r-2 border-b-2 border-blue-500">
        <Linegraph />
      </CardCustom>
    </div>
  );
};

export default AnalyticsBoard;
