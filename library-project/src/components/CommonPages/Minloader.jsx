import React from "react";

function MiniLoader({ size = "w-4 h-4" }) {
  return (
    <div
      className={`
        ${size}
        border-2 border-gray-300 
        border-t-[#00536e] 
        rounded-full 
        animate-spin
      `}
    ></div>
  );
}

export default MiniLoader;