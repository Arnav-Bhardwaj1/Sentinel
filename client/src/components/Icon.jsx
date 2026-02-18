import React from "react";

const Icon = ({ styles, name, imgUrl, isActive }) => {
  return (
    <div
      className={`relative w-12 h-12 rounded-xl cursor-pointer flex justify-center items-center ${styles}`}
    >
      <img
        src={imgUrl}
        alt={name}
        className={`w-1/2 h-1/2 ${name === "Sentinel" && "w-full h-full"} ${!isActive && "opacity-50"}`}
      />
    </div>
  );
};

export default Icon;
