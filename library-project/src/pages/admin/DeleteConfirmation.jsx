import React, { useState } from "react";

function DeleteConformation({handleNo,handleYes,handleCut, loading}) {
  

  
  return (
    <div
      className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50"

    >
      {/* Modal */}
      <div
        className="bg-white rounded-lg shadow-xl w-[90%] sm:w-100 p-6 relative animate-scaleIn"
        onClick={(e) => e.stopPropagation()}
      >

        {/* Close Button */}
        <button  
        onClick={handleCut}

          className="absolute top-3 right-3 text-gray-400 hover:text-gray-700 text-xl font-bold"
        >
          &times;
        </button>

        {/* Icon */}
        <div className="flex justify-center mb-3">
          <div className="w-12 h-12 flex items-center justify-center rounded-full bg-red-100 text-red-600 text-xl">
            !
          </div>
        </div>

        {/* Title */}
        <h3 className="text-lg font-semibold text-center text-gray-800">
          Confirm Delete
        </h3>

        {/* Message */}
        <p className="text-gray-600 text-center mt-2 mb-6">
          Are you sure you want to delete this role?  
          This action cannot be undone.
        </p>

        {/* Buttons */}
        <div className="flex justify-center gap-3">
          <button
          disabled={loading}
          onClick={handleNo}
          
            className="px-4 py-2 rounded-md border border-gray-300 text-gray-600 hover:bg-gray-100 transition-all shadow-[0_10px_25px_rgba(0,0,0,0.2)] animate-[popupJump_.5s_ease] hover:scale-90 
    hover:shadow-xl 
     duration-300 ease-in-out 
    active:scale-90 active:shadow-md"
          >
            No
          </button>

          <button
          onClick={handleYes}
          disabled={loading}
         className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-65"
          >
             {loading ? "Processing..." : "Yes,Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default DeleteConformation;