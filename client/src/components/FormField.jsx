import React from "react";

const inputClass = `
  w-full py-3.5 px-5 rounded-xl font-epilogue text-sm text-white
  bg-white/[0.04] border border-white/[0.08]
  placeholder:text-white/25 outline-none
  transition-all duration-200
  focus:border-[#f97316]/60 focus:bg-white/[0.06]
  focus:shadow-[0_0_0_3px_rgba(249,115,22,0.18)]
`.trim();

const FormField = ({
  labelName,
  placeholder,
  inputType,
  isTextArea,
  isCategory,
  value,
  handleChange,
}) => {
  return (
    <label className="flex-1 w-full flex flex-col gap-2.5">
      {labelName && (
        <span className="section-label">
          {labelName}
        </span>
      )}

      {isTextArea ? (
        <textarea
          required
          value={value}
          onChange={handleChange}
          rows={10}
          placeholder={placeholder}
          className={`${inputClass} resize-none sm:min-w-[300px]`}
        />
      ) : isCategory ? (
        <select
          required
          value={value}
          onChange={handleChange}
          className={`${inputClass} sm:min-w-[300px] bg-[#0d0d1a] cursor-pointer`}
        >
          <option value="" className="bg-[#0d0d1a] text-white/50">Select a category</option>
          <option value="Fundraiser" className="bg-[#0d0d1a]">Fundraiser</option>
          <option value="Crisis Relief" className="bg-[#0d0d1a]">Crisis Relief</option>
          <option value="Emergency" className="bg-[#0d0d1a]">Emergency</option>
          <option value="Education" className="bg-[#0d0d1a]">Education</option>
          <option value="Medical" className="bg-[#0d0d1a]">Medical</option>
          <option value="Non-Profit" className="bg-[#0d0d1a]">Non-Profit</option>
          <option value="Personal" className="bg-[#0d0d1a]">Personal</option>
          <option value="Environment" className="bg-[#0d0d1a]">Environment</option>
          <option value="Animals" className="bg-[#0d0d1a]">Animals</option>
          <option value="Other" className="bg-[#0d0d1a]">Other</option>
        </select>
      ) : (
        <input
          required
          value={value}
          onChange={handleChange}
          type={inputType}
          placeholder={placeholder}
          min={0.0000001}
          step="0.0000001"
          onFocus={(e) =>
            e.target.addEventListener("wheel", (e) => e.preventDefault(), { passive: false })
          }
          className={`${inputClass} sm:min-w-[300px]`}
        />
      )}
    </label>
  );
};

export default FormField;
