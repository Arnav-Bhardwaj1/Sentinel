import React, { useState } from "react";

const Expandable = ({ children, maxChars = 300 }) => {
  const [expanded, setExpanded] = useState(false);

  if (!children || children.length <= maxChars) {
    return (
      <p className="font-epilogue text-sm text-white/50 leading-relaxed">
        {children}
      </p>
    );
  }

  const text = expanded ? children : children.substring(0, maxChars);

  return (
    <div>
      <p className="font-epilogue text-sm text-white/50 leading-relaxed">
        {text}
        {!expanded && "..."}
      </p>
      <button
        onClick={() => setExpanded(!expanded)}
        className="mt-3 inline-flex items-center gap-1.5 font-epilogue text-sm text-[#03dac5] hover:text-[#fdba74] transition-colors duration-200 group"
      >
        {expanded ? "Read Less" : "Read More"}
        <span className={`transition-transform duration-200 ${expanded ? "rotate-180" : ""}`}>
          {expanded ? "↑" : "↓"}
        </span>
      </button>
    </div>
  );
};

export default Expandable;
