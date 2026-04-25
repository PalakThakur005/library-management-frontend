import React from "react";
import MiniLoader from "../../components/CommonPages/Minloader";

const ResetPassword = ({ user , onCancel, onConfirm, onCut, loading }) => {
   
    return (


        <div className="fixed inset-0 backdrop-blur bg-black/40 flex items-center justify-center z-1100">

            <div className="bg-white w-[90%] sm:w-100 p-6 rounded-xl shadow-lg relative">

                <span
                    onClick={onCut}
                    className="absolute top-3 right-4 text-xl cursor-pointer text-gray-500 hover:text-black"
                >
                    &times;
                </span>

                <h2 className="text-lg font-semibold mb-3">
                    Reset Password 🔐
                </h2>

                <p className="text-sm text-gray-600 mb-5">
                    Are you sure you want to reset password for{" "}
                    <span className="font-semibold">{user?.name}{" "}</span>?
                </p>

                <div className="flex justify-end gap-3">

                    <button onClick={onCancel}
                        disabled={loading}
                        className="px-4 py-2 text-sm bg-gray-200 rounded hover:bg-gray-300">
                        Cancel
                    </button>
<button
  onClick={onConfirm}
  disabled={loading}
  className={`px-4 py-2 rounded-lg flex items-center justify-center gap-2 transition
    ${
      loading
        ? "bg-[#2d6c93] cursor-not-allowed"
        : "bg-[#2d6c93] hover:bg-[#3d799f]"
    } text-white`}
>
  {loading ? (
    <>
      <MiniLoader size="w-5 h-5" />
      Processing...
    </>
  ) : (
    "Confirm"
  )}
</button>

                </div>

            </div>
        </div>


    );
};

export default ResetPassword;