import React from "react";

const ResetPassword = ({ user , onCancel, onConfirm, onCut, loading }) => {
    return (


        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

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
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                    >
                        {loading ? "Processing..." : "Confirm"}
                    </button>

                </div>

            </div>
        </div>


    );
};

export default ResetPassword;