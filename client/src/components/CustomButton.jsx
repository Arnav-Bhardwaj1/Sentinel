import React from "react";

const CustomButton = ({
  btnType,
  title,
  handleClick,
  styles,
  isDisabled = false,
}) => {
  return (
    <button
      type={btnType}
      className={`font-jakarta font-semibold text-sm text-white min-h-[48px] px-6 rounded-xl
        transition-all duration-200 outline-none
        active:scale-95
        disabled:opacity-40 disabled:cursor-not-allowed disabled:pointer-events-none
        ${styles}`}
      disabled={isDisabled}
      onClick={handleClick}
    >
      {title}
    </button>
  );
};

export default CustomButton;
