"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

// Sub-components for tabs (to be implemented)
import TabDashboard from "./TabDashboard";
import TabList from "./TabList";
import TabPapan from "./TabPapan";
import TabKalender from "./TabKalender";
import GlobalTaskModals from "./GlobalTaskModals";

const initialTasks = [
  { id: 1, title: "Pembuatan UI/UX Website", desc: "Membuat tampilan antarmuka website Kanban", date: "1 Juli 2026", type: "Design", priority: "Tertinggi", status: "todo", done: false, orang: ["A", "M", "N"], riwayat: [{ name: "Andi Basudara", text: "telah membuat penugasan ini", time: "2 hari lalu" }, { name: "Myesha Azka", text: "telah mengubah penerima tugas.", time: "kemarin" }], komentar: [{ name: "Nurul Kumala", text: "Semangattt!" }] },
  { id: 2, title: "Pembuatan Repository GitHub", desc: "Membuat repository dan konfigurasi branch utama", date: "5 Juli 2026", type: "Tugas", priority: "Sedang", status: "inprogress", done: false, orang: ["A", "M"], riwayat: [{ name: "Andi Basudara", text: "telah membuat tugas ini", time: "3 hari lalu" }], komentar: [] },
  { id: 3, title: "Pembuatan Database ERD", desc: "Merancang skema database dan relasi antar tabel", date: "18 Juli 2026", type: "Tugas", priority: "Rendah", status: "review", done: false, orang: ["N"], riwayat: [{ name: "Nurul Kumala", text: "telah merancang ERD awal", time: "4 hari lalu" }], komentar: [] },
  { id: 4, title: "Pembuatan Pitch Deck", desc: "Slide deck presentasi produk untuk demo akhir", date: "30 Juni 2026", type: "Tugas", priority: "Tinggi", status: "done", done: true, orang: ["A", "N"], riwayat: [{ name: "Andi Basudara", text: "telah menyelesaikan tugas ini", time: "5 hari lalu" }], komentar: [] },
  { id: 5, title: "Testing & QA Aplikasi", desc: "Melakukan pengujian fitur dan dokumentasi bug", date: "11 Juli 2026", type: "Bug", priority: "Tinggi", status: "todo", done: false, orang: ["M"], riwayat: [], komentar: [] },
  { id: 6, title: "Deploy ke Staging Server", desc: "Deploy aplikasi ke environment staging untuk review", date: "25 Juli 2026", type: "Fitur", priority: "Sedang", status: "todo", done: false, orang: ["A", "M", "N"], riwayat: [], komentar: [] },
];

const memberColors = ["bg-violet-400", "bg-emerald-400", "bg-amber-400", "bg-rose-400", "bg-sky-400", "bg-indigo-400"];

const teamsData = {
  "1": { name: "Tim Teknologi Informasi UNDIP", members: ["A", "R", "H"] },
  "2": { name: "Tim Desain Kreatif BPS", members: ["D", "E"] },
  "3": { name: "Tim Analisis Data", members: ["F", "G", "H", "I"] },
  "4": { name: "Tim Backend Development", members: ["A", "B"] },
};

const userAvatars = {
  "A": "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=50&h=50&q=80",
  "M": "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=50&h=50&q=80",
  "N": "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=50&h=50&q=80",
  "B": "https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&w=50&h=50&q=80",
  "R": "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=50&h=50&q=80",
  "H": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=50&h=50&q=80",
  "C": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=50&h=50&q=80",
};

export default function TeamDetailPage({ params }) {
  const unwrappedParams = React.use ? React.use(params) : params;
  const teamId = unwrappedParams?.id || "1";
  const team = teamsData[teamId] || teamsData["1"];

  const router = useRouter();
  const [activeTab, setActiveTab] = useState("list");
  const [isMentor, setIsMentor] = useState(false);

  useEffect(() => {
    // Read role from login — set via localStorage key "sipantau_role"
    const role = typeof window !== "undefined" ? localStorage.getItem("sipantau_role") : null;
    setIsMentor(role === "mentor");
  }, []);

  // --- GLOBAL STATE ---
  const [tasks, setTasks] = useState(initialTasks);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem(`sipantau_tasks_${teamId}`);
      if (stored) {
        try {
          setTasks(JSON.parse(stored));
        } catch (e) {
          console.error("Failed to parse tasks:", e);
        }
      }
      setIsLoaded(true);
    }
  }, [teamId]);

  useEffect(() => {
    if (isLoaded && typeof window !== "undefined") {
      localStorage.setItem(`sipantau_tasks_${teamId}`, JSON.stringify(tasks));
    }
  }, [tasks, teamId, isLoaded]);

  const [selectedTask, setSelectedTask] = useState(null);
  const [isAddingTask, setIsAddingTask] = useState(null);
  const [taskToDelete, setTaskToDelete] = useState(null);

  const tabs = [
    { id: "dashboard", label: "Dashboard", icon: "🌐" },
    { id: "list", label: "List", icon: "≡" },
    { id: "papan", label: "Papan", icon: "📋" },
    { id: "kalender", label: "Kalender", icon: "📅" },
  ];

  return (
    <div className="flex flex-col h-full space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.push("/dashboard/team")}
            className="w-8 h-8 rounded-full hover:bg-slate-100 flex items-center justify-center text-indigo-600 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            {team.name}
          </h1>
        </div>

        <div className="flex -space-x-2">
          {team.members.map((m, i) => (
            userAvatars[m] ? (
              <img key={i} src={userAvatars[m]} alt={m} className="w-8 h-8 rounded-full border-2 border-white object-cover shadow-sm" />
            ) : (
              <div key={i} className={`w-8 h-8 rounded-full border-2 border-white ${memberColors[i % memberColors.length]} flex items-center justify-center text-white text-xs font-bold shadow-sm`}>
                {m}
              </div>
            )
          ))}
          <div className="w-8 h-8 rounded-full border-2 border-white bg-slate-100 flex items-center justify-center text-slate-400 text-xs font-bold shadow-sm cursor-pointer hover:bg-slate-200">+</div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex w-full border-b border-slate-100">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 pb-3 text-sm font-bold flex items-center justify-center gap-2 border-b-2 transition-all ${activeTab === tab.id
                ? "border-violet-600 text-violet-700"
                : "border-transparent text-slate-400 hover:text-slate-600"
              }`}
          >
            <span className="text-base">{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 min-h-0 bg-slate-50/50 rounded-xl p-4 overflow-auto">
        {activeTab === "dashboard" && <TabDashboard tasks={tasks} />}
        {activeTab === "list" && (
          <TabList
            tasks={tasks}
            setTasks={setTasks}
            setSelectedTask={setSelectedTask}
            setIsAddingTask={setIsAddingTask}
          />
        )}
        {activeTab === "papan" && (
          <TabPapan
            tasks={tasks}
            setTasks={setTasks}
            setSelectedTask={setSelectedTask}
            setTaskToDelete={setTaskToDelete}
          />
        )}
        {activeTab === "kalender" && (
          <TabKalender
            tasks={tasks}
            setTasks={setTasks}
            setSelectedTask={setSelectedTask}
          />
        )}
      </div>

      <GlobalTaskModals
        tasks={tasks}
        setTasks={setTasks}
        selectedTask={selectedTask}
        setSelectedTask={setSelectedTask}
        isAddingTask={isAddingTask}
        setIsAddingTask={setIsAddingTask}
        setTaskToDelete={setTaskToDelete}
      />

      {/* Custom Delete Confirmation Modal */}
      {taskToDelete && (
        <div className="fixed inset-0 z-[100] bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-sm p-6 shadow-2xl border border-slate-100 flex flex-col items-center text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-rose-50 flex items-center justify-center text-rose-500">
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <div className="space-y-1">
              <h3 className="text-sm font-extrabold text-slate-800">Hapus Tugas</h3>
              <p className="text-xs text-slate-500 font-medium">Anda akan menghapus &quot;{taskToDelete.title}&quot;</p>
            </div>
            <div className="flex items-center gap-3 w-full pt-2">
              <button
                onClick={() => setTaskToDelete(null)}
                className="flex-1 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-bold text-slate-600 transition-colors"
              >
                Tidak, simpan.
              </button>
              <button
                onClick={() => {
                  setTasks(tasks.filter(t => t.id !== taskToDelete.id));
                  setTaskToDelete(null);
                  setSelectedTask(null);
                }}
                className="flex-1 py-2.5 rounded-xl bg-rose-500 hover:bg-rose-600 text-xs font-bold text-white shadow-md shadow-rose-100 active:scale-95 transition-all"
              >
                Ya, hapus.
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
