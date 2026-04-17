import React from "react";

const CustomToolTip = ({ text, children }) => {
  return (
    <div className="relative inline-flex items-center justify-center">
      
      {/* trigger */}
      <div className="peer">
        {children}
      </div>

      {/* tooltip */}
      <span
        className="
          absolute -top-11 left-1/2 -translate-x-1/2

          opacity-0 scale-90 translate-y-2
          peer-hover:opacity-100 peer-hover:scale-100 peer-hover:translate-y-0

          transition-all duration-200 ease-out

          bg-gray-700 text-white text-xs font-medium
          px-3 py-1.5 rounded-full

          shadow-[0_6px_20px_rgba(0,0,0,0.25)]
          whitespace-nowrap z-50
          pointer-events-none
        "
      >
        {text}

        <span
          className="
            absolute top-full left-1/2 -translate-x-1/2
            w-2 h-2 bg-gray-700 rotate-45
          "
        />
      </span>
    </div>
  );
};

export default CustomToolTip;