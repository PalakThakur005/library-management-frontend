import React, { useState } from "react";
import MiniLoader from "./Minloader";

function DeleteConfirmation({handleNo,handleYes,handleCut, loading}) {
  
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

          className="absolute cursor-pointer top-3 right-3 text-gray-400 hover:text-gray-700 text-xl font-bold"
        >
          &times;
        </button>

        {/* Title */}
        <h3 className="text-lg font-semibold mb-2 text-gray-800">
          Confirm Delete
        </h3>

        {/* Message */}
        <p className="text-sm text-gray-600 mb-5">
          Are you sure you want to delete this role?  
          This action cannot be undone.
        </p>

        {/* Buttons */}
        <div className="flex justify-end gap-3">
          <button
          disabled={loading}
          onClick={handleNo}
          
            className="px-4 py-2  cursor-pointer rounded-md border border-gray-300 text-gray-600 hover:bg-gray-100 transition-all shadow-[0_10px_25px_rgba(0,0,0,0.2)] animate-[popupJump_.5s_ease] hover:scale-90 
    hover:shadow-xl 
     duration-300 ease-in-out 
    active:scale-90 active:shadow-md"
          >
            No
            </button>
            
          <button
  onClick={handleYes}
  disabled={loading}
  className={`flex items-center cursor-pointer justify-center gap-2 px-4 py-2 rounded-lg text-white text-sm transition
    ${loading 
      ? "bg-blue-400 cursor-not-allowed opacity-80" 
      : "bg-blue-600 hover:bg-blue-600"
    }`}
>
  {loading ? (
    <>
      <MiniLoader size="w-4 h-4" />
      Deleting...
    </>
  ) : (
    "Yes, Delete"
  )}
</button>
        </div>
      </div>
    </div>
  );
}

export default DeleteConfirmation;