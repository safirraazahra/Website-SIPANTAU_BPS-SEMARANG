"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Dashboard() {
  const router = useRouter();
  const [userName, setUserName] = useState("Andi");

  useEffect(() => {
    const name = typeof window !== "undefined" ? localStorage.getItem("sipantau_name") : null;
    if (name) {
      setUserName(name.split(" ")[0]);
    }
  }, []);

  return (
    <div className="flex flex-col justify-between min-h-full">
      <div className="space-y-8">
        {/* Header */}
        <div className="border-b border-slate-100 pb-5">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">Beranda</h1>
          <p className="text-sm text-slate-400 font-medium mt-1">Selamat datang kembali {userName}!</p>
        </div>

        {/* Welcome Banner */}
        <div className="w-full bg-gradient-to-r from-violet-600 to-indigo-600 rounded-3xl p-6 sm:p-8 text-white shadow-lg shadow-violet-100 flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-2xl -mr-8 -mt-8" />
          <div className="space-y-2 max-w-2xl relative z-10">
            <h2 className="text-lg sm:text-xl font-extrabold">Selamat Pagi, {userName}!</h2>
            <p className="text-xs sm:text-sm text-indigo-100 leading-relaxed font-medium">
              &ldquo;Tanpa data, Anda hanyalah orang lain dengan pendapat.&rdquo; Mari bantu BPS menyediakan data berkualitas untuk Indonesia hari ini.
            </p>
          </div>
          <button
            onClick={() => router.push("/dashboard/team")}
            className="shrink-0 bg-white hover:bg-slate-50 text-indigo-600 text-xs sm:text-sm font-extrabold px-5 py-3 rounded-2xl shadow-md hover:shadow-lg active:scale-95 transition-all duration-200 cursor-pointer self-start md:self-center"
          >
            Lihat Tugas Hari Ini →
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { icon: "✓", color: "emerald", label: "2 Selesai", desc: "Tugas yang sudah terselesaikan." },
            { icon: "📄", color: "blue", label: "4 Dijadwalkan", desc: "Tugas yang segera dimulai." },
            { icon: "🔄", color: "amber", label: "1 Diperbarui", desc: "Perubahan dalam penugasan." },
            { icon: "⚠️", color: "rose", label: "1 Terlambat", desc: "Penugasan melewati batas waktu." },
          ].map((stat) => (
            <div key={stat.label} className="p-5 border border-slate-100 bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-200 flex flex-col justify-between min-h-[90px]">
              <div className="flex items-center gap-2.5">
                <div className={`w-6 h-6 rounded-full border border-${stat.color}-500 flex items-center justify-center text-${stat.color}-500 font-extrabold text-xs`}>
                  {stat.icon}
                </div>
                <span className="text-sm font-extrabold text-slate-800">{stat.label}</span>
              </div>
              <span className="text-[11px] font-semibold text-slate-400 mt-3">{stat.desc}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="flex justify-end mt-8 border-t border-slate-100 pt-6">
        <button
          onClick={() => router.push("/dashboard/team")}
          className="text-xs sm:text-sm font-extrabold text-indigo-600 hover:text-indigo-700 active:scale-95 transition-all duration-150 cursor-pointer"
        >
          Lihat Tim Sekarang →
        </button>
      </div>
    </div>
  );
}
