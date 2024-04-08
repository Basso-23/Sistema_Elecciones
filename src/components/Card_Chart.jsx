import React from "react";
import ProgressBar from "@ramonak/react-progress-bar";

const Card_Chart = ({ t1, actual, total }) => {
  return (
    <div className="  w-full relative rounded-sm shadow ">
      <div className=" border-b p-3 uppercase font-semibold text-[13px]">
        {t1}
      </div>
      <div className="px-3 py-5">
        <div className=" flex gap-4 mb-2 items-center">
          <div className=" text-[20px] leading-none">
            {parseInt((actual * 100) / total)}%
          </div>
          <div className="text-[#878A99] text-[13px] font-medium">
            Votos conseguidos: {actual}/{total}
          </div>
        </div>

        <ProgressBar
          completed={(actual * 100) / total}
          maxCompleted={100}
          bgColor="#0061FE"
          baseBgColor="#ecebf0"
          height="8px"
          isLabelVisible={false}
        />
      </div>
    </div>
  );
};

export default Card_Chart;
