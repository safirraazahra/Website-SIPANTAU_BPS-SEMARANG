"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const initialTeams = [
  { id: "1", name: "Tim Teknologi Informasi UNDIP", description: "Bertanggung jawab atas pengembangan aplikasi monitoring dan maintenance jaringan.", mentor: "Bambang Heru", totalTugas: 5, selesai: 3, members: ["A", "R", "H"] },
  { id: "2", name: "Tim Desain Kreatif BPS", description: "Mengelola desain visual dan branding untuk produk digital BPS.", mentor: "Siti Rahayu", totalTugas: 8, selesai: 6, members: ["D", "E"] },
  { id: "3", name: "Tim Analisis Data", description: "Bertanggung jawab mengolah data statistik dan membuat laporan berkala.", mentor: "Bambang Heru", totalTugas: 4, selesai: 1, members: ["F", "G", "H", "I"] },
  { id: "4", name: "Tim Backend Development", description: "Membangun API dan arsitektur server untuk sistem informasi BPS.", mentor: "Rizky Pratama", totalTugas: 7, selesai: 7, members: ["A", "B"] },
];

const memberColors = ["bg-violet-400", "bg-emerald-400", "bg-amber-400", "bg-rose-400", "bg-sky-400", "bg-indigo-400"];

const mentorList = ["Bambang Heru", "Siti Rahayu", "Rizky Pratama", "Dewi Lestari"];

export default function TeamPage() {
  const router = useRouter();
  const [teams, setTeams] = useState(initialTeams);
  const [isMentor, setIsMentor] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);

  useEffect(() => {
    const role = typeof window !== "undefined" ? localStorage.getItem("sipantau_role") : null;
    setIsMentor(role === "mentor");
  }, []);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterMentor, setFilterMentor] = useState("Semua");

  // Add group form state
  const [newName, setNewName] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [newMentor, setNewMentor] = useState(mentorList[0]);
  const [newMembersRaw, setNewMembersRaw] = useState("");

  const handleAddTeam = () => {
    if (!newName.trim()) return;
    const members = newMembersRaw.split(",").map(m => m.trim().charAt(0).toUpperCase()).filter(Boolean);
    const team = {
      id: String(Date.now()),
      name: newName,
      description: newDesc || "Tidak ada deskripsi.",
      mentor: newMentor,
      totalTugas: 0,
      selesai: 0,
      members: members.length > 0 ? members : ["A"],
    };
    setTeams([...teams, team]);
    setShowAddModal(false);
    setNewName(""); setNewDesc(""); setNewMembersRaw(""); setNewMentor(mentorList[0]);
  };

  const filtered = teams.filter(t => {
    const matchSearch = t.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchMentor = filterMentor === "Semua" || t.mentor === filterMentor;
    return matchSearch && matchMentor;
  });

  const allMentors = ["Semua", ...new Set(teams.map(t => t.mentor))];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b border-slate-100 pb-5 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Direktori Kelompok Magang
          </h1>
          <p className="text-sm text-slate-400 font-medium mt-1">
            Daftar tim kerja kolaboratif magang BPS.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          {/* Tambah Kelompok — only for mentor */}
          {isMentor && (
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-2 bg-violet-600 hover:bg-violet-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-md shadow-violet-100 active:scale-95 transition-all cursor-pointer"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
              </svg>
              Tambah Kelompok
            </button>
          )}
        </div>
      </div>

      {/* Stats Row — mentor only */}
      {isMentor && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: "Total Kelompok", value: teams.length, icon: "👥", color: "bg-violet-50 text-violet-700" },
            { label: "Total Peserta", value: teams.reduce((a, t) => a + t.members.length, 0), icon: "🎓", color: "bg-emerald-50 text-emerald-700" },
            { label: "Tugas Aktif", value: teams.reduce((a, t) => a + t.totalTugas, 0), icon: "📋", color: "bg-amber-50 text-amber-700" },
            { label: "Tugas Selesai", value: teams.reduce((a, t) => a + t.selesai, 0), icon: "✅", color: "bg-sky-50 text-sky-700" },
          ].map((stat) => (
            <div key={stat.label} className={`rounded-2xl p-4 ${stat.color} border border-slate-100/80`}>
              <div className="text-xl mb-1">{stat.icon}</div>
              <div className="text-2xl font-extrabold">{stat.value}</div>
              <div className="text-[11px] font-bold opacity-70 mt-0.5">{stat.label}</div>
            </div>
          ))}
        </div>
      )}

      {/* Filter & Search */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative flex-1 min-w-[200px]">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 11A6 6 0 105 11a6 6 0 0012 0z" />
          </svg>
          <input
            type="text"
            placeholder="Cari kelompok..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2.5 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 outline-none focus:border-violet-500 bg-white placeholder-slate-400 transition-colors"
          />
        </div>

        {isMentor && (
          <div className="flex items-center gap-2 flex-wrap">
            {allMentors.map(m => (
              <button
                key={m}
                onClick={() => setFilterMentor(m)}
                className={`px-3 py-2 rounded-xl text-[11px] font-bold transition-all ${filterMentor === m ? "bg-violet-600 text-white shadow-sm" : "bg-white border border-slate-200 text-slate-500 hover:border-violet-300 hover:text-violet-600"}`}
              >
                {m}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Team Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filtered.map((team) => {
          const progress = team.totalTugas > 0 ? Math.round((team.selesai / team.totalTugas) * 100) : 0;
          return (
            <div
              key={team.id}
              className="border border-slate-100 rounded-none p-6 bg-white hover:shadow-lg hover:shadow-slate-100 transition-all duration-200 flex flex-col gap-4 relative overflow-hidden group"
            >
              {/* Left accent border */}
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-violet-600" />

              {/* Team name & desc */}
              <div className="pl-2">
                <h2 className="text-sm font-extrabold text-slate-800 leading-snug">{team.name}</h2>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">{team.description}</p>
              </div>

              {/* Info Chips */}
              <div className="grid grid-cols-2 gap-3 pl-2 mt-2 w-full">
                {/* Mentor chip */}
                <div className="flex items-center justify-center gap-3 border border-slate-200 rounded-md py-3 px-2 bg-white">
                  <svg className="w-6 h-6 text-slate-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" />
                  </svg>
                  <div className="flex flex-col text-left">
                    <div className="text-[12px] font-bold text-slate-800 leading-tight">Mentor</div>
                    <div className="text-[10px] text-slate-400 mt-0.5">{team.mentor}</div>
                  </div>
                </div>

                {/* Tugas chip */}
                <div className="flex items-center justify-center gap-3 border border-slate-200 rounded-md py-3 px-2 bg-white">
                  <svg className="w-6 h-6 text-slate-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                  </svg>
                  <div className="flex flex-col text-left">
                    <div className="text-[12px] font-bold text-slate-800 leading-tight">Tugas Aktif</div>
                    <div className="text-[10px] text-slate-400 mt-0.5">{team.totalTugas} Tugas</div>
                  </div>
                </div>
              </div>



              {/* Footer: Avatars + Actions */}
              <div className="flex items-center justify-between pl-2">
                {/* Member Avatars */}
                <div className="flex -space-x-2">
                  {team.members.slice(0, 4).map((m, i) => (
                    <div
                      key={i}
                      className={`w-7 h-7 rounded-full border-2 border-white ${memberColors[i % memberColors.length]} flex items-center justify-center text-white text-[10px] font-bold shadow-sm`}
                    >
                      {m}
                    </div>
                  ))}
                  {team.members.length > 4 && (
                    <div className="w-7 h-7 rounded-full border-2 border-white bg-slate-100 flex items-center justify-center text-slate-500 text-[9px] font-bold shadow-sm">
                      +{team.members.length - 4}
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  {/* Delete button — mentor only */}
                  {isMentor && (
                    <button
                      onClick={() => setTeams(teams.filter(t => t.id !== team.id))}
                      className="p-1.5 rounded-lg text-slate-300 hover:text-rose-500 hover:bg-rose-50 transition-all cursor-pointer opacity-0 group-hover:opacity-100"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  )}

                  {/* Lihat Detail */}
                  <button
                    onClick={() => router.push(`/dashboard/team/${team.id}`)}
                    className="flex items-center gap-1 text-xs font-extrabold text-violet-600 hover:text-violet-700 active:scale-95 transition-all cursor-pointer"
                  >
                    Lihat Detail
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          );
        })}

        {/* Empty state */}
        {filtered.length === 0 && (
          <div className="col-span-2 flex flex-col items-center justify-center py-16 text-center text-slate-400">
            <div className="text-4xl mb-3">🔍</div>
            <p className="text-sm font-bold">Tidak ada kelompok ditemukan</p>
            <p className="text-xs mt-1">Coba ubah kata kunci atau filter pencarian.</p>
          </div>
        )}
      </div>

      {/* ========== ADD GROUP MODAL ========== */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl border border-slate-100 overflow-hidden">
            
            {/* Modal Header */}
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h2 className="text-base font-extrabold text-slate-800">Tambah Kelompok</h2>
                <p className="text-xs text-slate-400 mt-0.5">Buat tim kerja baru untuk peserta magang.</p>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="w-8 h-8 rounded-full bg-slate-50 hover:bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-600 font-bold cursor-pointer transition-colors"
              >
                ✕
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-5">
              {/* Nama Kelompok */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Nama Kelompok <span className="text-rose-500">*</span></label>
                <input
                  type="text"
                  value={newName}
                  onChange={e => setNewName(e.target.value)}
                  placeholder="Contoh: Tim Teknologi Informasi UNDIP"
                  className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-700 outline-none focus:border-violet-500 placeholder-slate-300 transition-colors"
                />
              </div>

              {/* Deskripsi */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Deskripsi Kelompok</label>
                <textarea
                  value={newDesc}
                  onChange={e => setNewDesc(e.target.value)}
                  placeholder="Jelaskan tanggung jawab kelompok ini..."
                  rows={3}
                  className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-700 outline-none focus:border-violet-500 placeholder-slate-300 resize-none transition-colors"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* Pilih Mentor */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Mentor</label>
                  <select
                    value={newMentor}
                    onChange={e => setNewMentor(e.target.value)}
                    className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-700 outline-none focus:border-violet-500 bg-white cursor-pointer appearance-none"
                  >
                    {mentorList.map(m => <option key={m} value={m}>{m}</option>)}
                  </select>
                </div>

                {/* Anggota */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Anggota (pisahkan koma)</label>
                  <input
                    type="text"
                    value={newMembersRaw}
                    onChange={e => setNewMembersRaw(e.target.value)}
                    placeholder="Andi, Budi, Citra"
                    className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-700 outline-none focus:border-violet-500 placeholder-slate-300 transition-colors"
                  />
                </div>
              </div>

              {/* Preview anggota */}
              {newMembersRaw.trim() && (
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Preview:</span>
                  {newMembersRaw.split(",").map((m, i) => m.trim() && (
                    <div key={i} className={`w-7 h-7 rounded-full ${memberColors[i % memberColors.length]} border-2 border-white flex items-center justify-center text-white text-[10px] font-bold shadow-sm`}>
                      {m.trim().charAt(0).toUpperCase()}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-6 border-t border-slate-100 bg-slate-50/50 flex items-center justify-end gap-3">
              <button
                onClick={() => setShowAddModal(false)}
                className="px-5 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-100 text-xs font-bold text-slate-500 cursor-pointer transition-colors"
              >
                Batal
              </button>
              <button
                onClick={handleAddTeam}
                className="px-5 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-700 text-xs font-bold text-white shadow-md shadow-violet-100 active:scale-95 transition-all cursor-pointer"
              >
                Buat Kelompok
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
