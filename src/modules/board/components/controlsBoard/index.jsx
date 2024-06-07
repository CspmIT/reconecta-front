import { Button, Checkbox } from "@mui/material";
import React, { useState } from "react";
import { FaLock, FaLockOpen } from "react-icons/fa";
import { boardControls } from "../../utils/objects";
import { TbInnerShadowTopRightFilled } from "react-icons/tb";

const ControlsBoard = () => {
  const [enabled, setEnabled] = useState(false);

  const label = { inputProps: { "aria-label": "Checkbox demo" } };

  return (
    <div>
      <div className="my-3 text-center">
        <b className="text-xl mr-3">Controles</b>
        <Button size="large" variant="contained" onClick={() => setEnabled(!enabled)}>
          {enabled ? <FaLockOpen /> : <FaLock />}
        </Button>
      </div>
      <div className="w-full flex flex-row flex-wrap justify-between">
        {boardControls.map((control, index) =>
          control.type === "switch" ? (
            <div key={index} className="w-1/4 flex flex-row justify-center items-center text-center my-3">
              <label>
                <b className="mr-2">{control.name}</b>
              </label>
              {enabled ? <Checkbox {...label} checked={control.checked} /> : <TbInnerShadowTopRightFilled className="text-red-500 dark:text-red-500 animate-pulse" />}

              {/* <label className="inline-flex items-center cursor-pointer">
                <input disabled={!enabled} type="checkbox" value="" className="sr-only peer" />
                <div className="relative w-14 h-7 bg-gray-400 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
              </label> */}
            </div>
          ) : (
            <div key={index} className="w-1/4 text-center my-3">
              <label>
                <b className="mr-2">{control.name}</b>
              </label>
              <div className="flex flex-row justify-center">
                {Array.from({ length: 4 }, (_, i) => (
                  <span className={`${i === 1 ? "bg-blue-600" : "bg-slate-400"} mx-2 text-white rounded-[50%] w-[28px] h-[27px] flex pl-[10px] pt-[3px]`} key={i}>
                    {i + 1}
                  </span>
                ))}
              </div>
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default ControlsBoard;
