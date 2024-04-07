import React from "react";
import ProgressBar from "@ramonak/react-progress-bar";

const Card_Chart = ({ t1, actual, total }) => {
  return (
    <div className=" h-[140px] w-full relative rounded-sm shadow">
      <div>{t1}</div>
      <div>
        {actual}/{total}
      </div>
      <div>
        <ProgressBar completed={(actual * 100) / total} maxCompleted={100} />
      </div>
    </div>
  );
};

export default Card_Chart;
