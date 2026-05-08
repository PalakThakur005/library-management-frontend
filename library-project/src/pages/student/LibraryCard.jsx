import React, { useEffect, useState } from "react";
import api from "../../components/Api/Axios";
import toast from "react-hot-toast";
import { FaIdCard } from "react-icons/fa";
import useTitle from "../../components/hooks/useTitle";

const LibraryCard = () => {

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

<div className="max-w-4xl mx-auto w-full grid md:grid-cols-2 rounded-3xl overflow-hidden shadow-2xl"
  style={{ boxShadow: "0 24px 60px rgba(45,108,147,0.22)" }}>

  <div className="relative p-6 sm:p-7 flex flex-col gap-0 overflow-hidden text-white"
    style={{ background: "#2d6c93" }}>

    <div className="absolute -top-10 -right-10 w-36 h-36 rounded-full"
      style={{ background: "rgba(255,255,255,0.08)" }} />
    <div className="absolute -bottom-8 -left-8 w-28 h-28 rounded-full"
      style={{ background: "rgba(255,255,255,0.06)" }} />

    <div className="absolute top-0 left-0 right-0 h-1"
      style={{ background: "linear-gradient(90deg, rgba(255,255,255,0.6), rgba(255,255,255,0.1))" }} />

    <div className="relative z-10 flex items-center gap-2 mb-1">
      <div className="w-8 h-8 rounded-lg flex items-center justify-center text-base"
        style={{ background: "rgba(255,255,255,0.15)" }}>📚</div>
      <span className="font-bold text-xs tracking-widest uppercase opacity-90"
        style={{ fontFamily: "'Syne', sans-serif" }}>Library Card</span>
    </div>
    <p className="relative z-10 text-[10px] opacity-55 tracking-wide mb-5">
      Official Digital Identity
    </p>

    <div className="relative z-10 flex items-center gap-3 mb-5">
      <div className="w-13 h-13 rounded-xl flex items-center justify-center text-2xl font-extrabold shrink-0"
        style={{
          background: "rgba(255,255,255,0.18)",
          border: "2px solid rgba(255,255,255,0.3)",
          fontFamily: "'Syne', sans-serif",
          width: 52, height: 52
        }}>
        {card.user?.name?.charAt(0).toUpperCase()}
      </div>
      <div>
        <p className="font-bold text-sm capitalize leading-tight"
          style={{ fontFamily: "'Syne', sans-serif" }}>{card.user?.name}</p>
        <p className="text-[10.5px] opacity-65 mt-0.5 break-all">{card.user?.email}</p>
      </div>
    </div>

    <div className="relative z-10 grid grid-cols-2 gap-3 mb-auto">
      <div>
        <p className="text-[9.5px] uppercase tracking-wider opacity-55 mb-1">Role</p>
        <p className="font-bold text-[12.5px] capitalize" style={{ fontFamily: "'Syne', sans-serif" }}>
          {card.user?.role}
        </p>
      </div>
    </div>

    <div className="relative z-10 pt-4 mt-4"
      style={{ borderTop: "1px solid rgba(255,255,255,0.12)" }}>
      <p className="text-[9px] uppercase tracking-widest opacity-50 mb-1">Card Number</p>
      <p className="font-extrabold text-sm tracking-widest"
        style={{ fontFamily: "'Syne', sans-serif" }}>{card.cardNumber}</p>
    </div>
  </div>

  <div className="flex flex-col gap-4 p-6 sm:p-7" style={{ background: "#f7fbfd" }}>

    <h2 className="font-extrabold text-base pb-3 text-[#1a3d52]"
      style={{ fontFamily: "'Syne', sans-serif", borderBottom: "1.5px solid #d8eaf3" }}>
      Card Details
    </h2>

    <div className="grid grid-cols-2 gap-3">
      <div className="rounded-2xl p-3" style={{ background: "#e5f3fb" }}>
        <p className="text-[9.5px] uppercase tracking-wider mb-1" style={{ color: "#7a9db5" }}>Issue Date</p>
        <p className="font-bold text-xs text-[#1a3d52]" style={{ fontFamily: "'Syne', sans-serif" }}>
          {new Date(card.issueDate).toDateString()}
        </p>
      </div>
      <div className="rounded-2xl p-3"
        style={{ background: isExpired ? "#fdecea" : "#eef7ed" }}>
        <p className="text-[9.5px] uppercase tracking-wider mb-1" style={{ color: "#7a9db5" }}>Expiry Date</p>
        <p className={`font-bold text-xs ${isExpired ? "text-red-600" : "text-[#1a3d52]"}`}
          style={{ fontFamily: "'Syne', sans-serif" }}>
          {new Date(card.expiryDate).toDateString()}
        </p>
      </div>
    </div>

    <div className={`rounded-2xl p-3 flex items-center justify-between
      ${card.user?.status === "active" ? "bg-[#e6f4ec]" : "bg-[#fdecea]"}`}>
      <div className="flex items-center gap-2">
        <span className={`w-2.5 h-2.5 rounded-full ${card.user?.status === "active"
          ? "bg-green-500 animate-pulse" : "bg-red-500"}`} />
        <span className="font-bold text-sm capitalize"
          style={{
            fontFamily: "'Syne', sans-serif",
            color: card.user?.status === "active" ? "#1e7e44" : "#c0392b"
          }}>
          {card.user?.status}
        </span>
      </div>
      <span className="text-[9.5px] font-semibold uppercase tracking-wide px-2.5 py-1 rounded-full text-white"
        style={{ background: card.user?.status === "active" ? "#27ae60" : "#e74c3c" }}>
        {card.user?.status === "active" ? "Verified" : "Blocked"}
      </span>
    </div>

    <div className="rounded-2xl p-3 text-[11px] leading-relaxed mt-auto"
      style={{ background: "#e5f3fb", borderLeft: "3px solid #2d6c93", color: "#3a6b82" }}>
      This library card is digitally issued and required for all library operations.
    </div>

  </div>
</div>
    </div>
  );
};

export default LibraryCard;