import React, { useEffect, useState } from "react";
import api from "../../components/Api/Axios";
import toast from "react-hot-toast";
import { FaIdCard } from "react-icons/fa";
import useTitle from "../../components/hooks/useTitle";

const MyLibraryCard = () => {

    useTitle("My Library Card")

  const [card, setCard] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchCard = async () => {
    try {
      const res = await api.get("/api/mybooks/my-card");
      setCard(res.data.card);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to load card");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCard();
  }, []);

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center text-gray-500">
        Loading Library Card...
      </div>
    );
  }

  if (!card) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center bg-white shadow-xl rounded-2xl p-8">
          <FaIdCard className="text-4xl text-gray-400 mx-auto mb-3" />
          <h2 className="text-xl font-semibold text-gray-700">
            No Library Card Found
          </h2>
          <p className="text-gray-400 mt-2">
            Admin hasn’t issued any card yet.
          </p>
        </div>
      </div>
    );
  }

  const isExpired = new Date(card.expiryDate) < new Date();

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 via-purple-50 to-emerald-50 ">

      <div className="max-w-4xl mx-auto mb-8 bg-white rounded-2xl shadow-[0_0_20px_rgba(0,0,0,0.20)] p-6 border border-gray-100">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">
          Hello{" "}
          <span className="text-[#2d6c93] capitalize">
            {card.user?.name}
          </span>{" "}
          👋
        </h2>

        <p className="text-sm sm:text-base text-gray-600 mt-2">
           View your digital library card, including card details, status, and validity information.
        </p>
      </div>

      {/* ✅ CARD SECTION */}
      <div className="max-w-4xl mx-auto w-full grid md:grid-cols-2 rounded-3xl overflow-hidden shadow-2xl border border-white/40">

        {/* LEFT SIDE */}
        <div className="relative bg-linear-to-br from-[#2d6c93]  to-indigo-500 text-white p-4 sm:p-6">

          <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-2xl"></div>

          <h2 className="text-lg font-bold">📚 Library Card</h2>
          <p className="text-xs opacity-80 mb-8">
            Official Digital Identity
          </p>

         <div className="space-y-4 text-sm grid grid-cols-2 gap-6 md:justify-between md:flex md:flex-col md:space-y-4 sm:grid sm:grid-cols-2 sm:gap-6 sm:space-y-0">

  {/* LEFT SIDE */}
  <div className="space-y-3">
    <div>
      <p className="opacity-70">Card Number</p>
      <p className="font-semibold ">{card.cardNumber}</p>
    </div>

    <div>
      <p className="opacity-70">Role</p>
      <span className="font-semibold capitalize">
        {card.user?.role}
      </span>
    </div>
  </div>

  {/* RIGHT SIDE */}
  <div className="space-y-3 ">
   <div>
      <p className="opacity-70">Name</p>
      <p className="font-semibold capitalize">
        {card.user?.name}
      </p>
    </div>

    
    <div>
      <p className="opacity-70">Email</p>
      <p className="text-sm break-all">
        {card.user?.email}
      </p>
    </div>
  </div>

</div>

        </div>

        {/* RIGHT SIDE */}
        <div className="bg-white/90 backdrop-blur-md p-4 sm:p-6 space-y-6">

          <h2 className="text-xl font-bold text-gray-800">
            Card Details
          </h2>

          <div className="grid grid-cols-2 gap-4">

            <div className="p-4 rounded-xl bg-blue-50">
              <p className="text-xs text-gray-500">Issue Date</p>
              <p className="text-sm text-gray-800">
                {new Date(card.issueDate).toDateString()}
              </p>
            </div>

            <div className="p-4 rounded-xl bg-purple-50">
              <p className="text-xs text-gray-500">Expiry Date</p>
              <p className={`text-sm ${isExpired ? "text-red-500" : "text-green-600"}`}>
                {new Date(card.expiryDate).toDateString()}
              </p>
            </div>

          </div>

          {/* STATUS */}
          <div
            className={`p-4 rounded-xl text-center capitalize font-medium
              ${
                card.user?.status === "active"
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-600"
              }`}
          >
           Card Status: {card.user?.status}
          </div>

          {/* INFO */}
          <div className="p-4 rounded-xl bg-gray-50 text-sm text-gray-600">
            This library card is digitally issued and used for all library operations.
          </div>

        </div>

      </div>
    </div>
  );
};

export default MyLibraryCard;