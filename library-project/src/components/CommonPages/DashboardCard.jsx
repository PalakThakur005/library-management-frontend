import React from "react";

function DashboardCard({ title, count, icon }) {
  return (
    <div className="relative overflow-hidden  flex  items-center gap-4 p-5 rounded-xl 
    bg-white
    border border-[#01253c]/10
    shadow-sm
    hover:shadow-md hover:-translate-y-1
    transition-all duration-300">

    
      <div className="absolute left-0 top-0 h-full w-1 bg-[#2d6c93] rounded-l-xl"></div>

     
      <div className="absolute bottom-3 right-3 opacity-20">
        <div className="w-16 h-[2px] bg-[#2d6c93] mb-1"></div>
        <div className="w-12 h-[2px] bg-[#2d6c93] mb-1"></div>
        <div className="w-8 h-[2px] bg-[#00304e] mb-1"></div>
        <div className="w-5 h-[2px] bg-[#00304e]"></div>
      </div>

     
      <div className="flex items-center justify-center 
      w-10 h-10 rounded-lg 
      bg-[#01253c]/10">
        <div className="text-[#2d6c93] text-lg">
          {icon}
        </div>
      </div>

    
      <div>
        <h3 className="text-sm text-[#01253c]/70 font-medium">
          {title}
        </h3>
        <p className="text-2xl font-semibold text-[#01253c]">
          {count}
        </p>
      </div>

    </div>
  );
}

export default DashboardCard;