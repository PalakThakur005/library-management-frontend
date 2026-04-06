import React from "react";

const AdminCard = ({ icon, title, value, color }) => {
  return (
    <div className=" flex items-center gap-4 p-5 rounded-xl shadow-[0_0_20px_rgba(0,0,0,0.25)] transition hover:-translate-y-1 hover:shadow-lg bg-white border-0">

      <div
        className="w-11 h-11 flex items-center justify-center rounded-lg text-white text-lg"
        style={{ background: color }}
      >
        {icon}
      </div>

      <div>
        <h4 className="text-sm font-medium text-gray-600">
          {title}
        </h4>
        <p className="text-xl font-bold text-black">
          {value}
        </p>
      </div>

    </div>
  );
};

export default AdminCard;