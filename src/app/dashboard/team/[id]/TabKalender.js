"use client";

import React, { useState, useRef, useEffect } from "react";

const monthNames = ["Januari","Februari","Maret","April","Mei","Juni","Juli","Agustus","September","Oktober","November","Desember"];
const shortMonthNames = ["Jan","Feb","Mar","Apr","Mei","Jun","Jul","Agu","Sep","Okt","Nov","Des"];

function getDaysInMonth(y, m) { return new Date(y, m + 1, 0).getDate(); }
function getFirstDayOfWeek(y, m) { const d = new Date(y, m, 1).getDay(); return d === 0 ? 6 : d - 1; }

function parseTaskDate(dateStr) {
  if (!dateStr) return null;
  const parts = dateStr.trim().split(" ");
  if (parts.length < 3) return null;
  const day = parseInt(parts[0]);
  const year = parseInt(parts[2]);
  const monthStr = parts[1].toLowerCase();
  const fullMonths = ["januari","februari","maret","april","mei","juni","juli","agustus","september","oktober","november","desember"];
  const shortMonths = ["jan","feb","mar","apr","mei","jun","jul","agu","sep","okt","nov","des"];
  let month = fullMonths.findIndex(m => monthStr.startsWith(m.substring(0,3)));
  if (month === -1) month = shortMonths.findIndex(m => monthStr.startsWith(m.substring(0,3)));
  if (isNaN(day) || isNaN(year) || month === -1) return null;
  return { day, month, year };
}

export default function TabKalender({ tasks, setTasks, setSelectedTask }) {
  const now = new Date();
  const [calYear, setCalYear] = useState(now.getFullYear());
  const [calMonth, setCalMonth] = useState(now.getMonth());

  // Inline Add Task Popover State
  const [addingTaskDay, setAddingTaskDay] = useState(null);
  const [newTitle, setNewTitle] = useState("");
  const [newType, setNewType] = useState("Tugas");
  const [newPriority, setNewPriority] = useState("Tertinggi");
  const [newOrang, setNewOrang] = useState(["A"]);

  const popoverRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (popoverRef.current && !popoverRef.current.contains(event.target)) {
        setAddingTaskDay(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const daysInMonth = getDaysInMonth(calYear, calMonth);
  const firstDay = getFirstDayOfWeek(calYear, calMonth);

  const prevMonth = () => { if (calMonth === 0) { setCalMonth(11); setCalYear(calYear-1); } else setCalMonth(calMonth-1); };
  const nextMonth = () => { if (calMonth === 11) { setCalMonth(0); setCalYear(calYear+1); } else setCalMonth(calMonth+1); };

  const getTasksForDay = (day) => tasks.filter(t => {
    const parsed = parseTaskDate(t.date);
    return parsed && parsed.day === day && parsed.month === calMonth && parsed.year === calYear;
  });

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "Tertinggi": return "bg-rose-100 text-rose-700 border-rose-200";
      case "Tinggi": return "bg-emerald-100 text-emerald-700 border-emerald-200";
      case "Sedang": return "bg-amber-100 text-amber-700 border-amber-200";
      case "Rendah": return "bg-cyan-100 text-cyan-700 border-cyan-200";
      case "Terendah": return "bg-violet-100 text-violet-700 border-violet-200";
      default: return "bg-slate-100 text-slate-700 border-slate-200";
    }
  };

  const handleInlineAddTask = (day) => {
    if (!newTitle.trim()) return;
    const activeUserName = typeof window !== "undefined" ? (localStorage.getItem("sipantau_name") || "Andi Basudara") : "Andi Basudara";
    const newTask = {
      id: Date.now(),
      title: newTitle,
      desc: "Tugas baru ditambahkan via kalender",
      date: `${day} ${monthNames[calMonth]} ${calYear}`,
      type: newType,
      priority: newPriority,
      status: "todo",
      done: false,
      orang: newOrang,
      riwayat: [{ name: activeUserName, text: "telah membuat penugasan", time: "baru saja" }],
      komentar: [],
    };
    setTasks([...tasks, newTask]);
    setNewTitle("");
    setAddingTaskDay(null);
  };

  return (
    <div className="bg-white border border-slate-100 rounded-3xl p-5 shadow-sm space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button onClick={prevMonth} className="w-8 h-8 rounded-xl hover:bg-slate-100 flex items-center justify-center text-slate-500 font-bold cursor-pointer transition-colors">‹</button>
          <span className="text-base font-extrabold text-slate-800 min-w-[160px] text-center">
            {monthNames[calMonth]} {calYear}
          </span>
          <button onClick={nextMonth} className="w-8 h-8 rounded-xl hover:bg-slate-100 flex items-center justify-center text-slate-500 font-bold cursor-pointer transition-colors">›</button>
        </div>
        <div className="text-xs font-bold text-slate-400">
          {tasks.length} tugas total
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="overflow-x-auto">
        <div className="min-w-[650px] border border-slate-100 rounded-2xl overflow-visible relative">
          {/* Weekday headers */}
          <div className="grid grid-cols-7 bg-slate-50 border-b border-slate-100 text-center py-2.5 rounded-t-2xl">
            {["Senin","Selasa","Rabu","Kamis","Jumat","Sabtu","Minggu"].map((day) => (
              <span key={day} className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{day}</span>
            ))}
          </div>

          {/* Day Cells */}
          <div className="grid grid-cols-7 divide-x divide-y divide-slate-100/80 overflow-visible">
            {/* Empty padding cells for first week */}
            {Array.from({length: firstDay}).map((_, i) => (
              <div key={`empty-${i}`} className="min-h-[90px] p-2 bg-slate-50/30" />
            ))}

            {/* Actual day cells */}
            {[...Array(daysInMonth)].map((_, i) => {
              const day = i + 1;
              const dayTasks = getTasksForDay(day);
              const isToday = day === now.getDate() && calMonth === now.getMonth() && calYear === now.getFullYear();
              
              // Determine status strip color from the first task
              let statusStripColor = "";
              if (dayTasks.length > 0) {
                const firstStatus = dayTasks[0].status;
                if (firstStatus === "todo") statusStripColor = "bg-teal-400";
                else if (firstStatus === "inprogress") statusStripColor = "bg-rose-400";
                else if (firstStatus === "review") statusStripColor = "bg-sky-400";
                else if (firstStatus === "done") statusStripColor = "bg-amber-400";
              }

              return (
                <div
                  key={day}
                  onClick={() => {
                    if (addingTaskDay !== day) {
                      setAddingTaskDay(day);
                      setNewTitle("");
                      setNewType("Tugas");
                      setNewPriority("Tertinggi");
                      setNewOrang(["A"]);
                    }
                  }}
                  className="min-h-[105px] p-2 flex flex-col gap-1 bg-white hover:bg-slate-50/70 transition-all relative group cursor-pointer border-t border-slate-100/80 first:border-t-0"
                >
                  {/* Status Strip at Top */}
                  {dayTasks.length > 0 && (
                    <div className={`h-[3px] absolute top-0 left-0 right-0 ${statusStripColor}`} />
                  )}

                  {/* Day Number and Hover Plus Icon */}
                  <div className="flex items-center justify-between">
                    <span className={`text-[11px] font-bold w-5 h-5 flex items-center justify-center rounded-full ${
                      isToday ? "bg-violet-600 text-white" : "text-slate-700"
                    }`}>
                      {day}
                    </span>
                    <span className="text-[12px] font-extrabold text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity">
                      +
                    </span>
                  </div>

                  {/* Tasks List or Muted hover overlay */}
                  <div className="flex-1 flex flex-col gap-0.5 justify-end">
                    {dayTasks.length === 0 ? (
                      <span className="text-[9px] font-bold text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity text-center pb-2">
                        Tambah Tugas
                      </span>
                    ) : (
                      <>
                        {dayTasks.slice(0, 2).map((t) => (
                          <button
                            key={t.id}
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedTask(t);
                            }}
                            className="w-full text-left truncate px-1 py-0.5 text-[10px] font-bold text-slate-800 hover:text-violet-600 transition-colors cursor-pointer bg-transparent border-none outline-none shadow-none"
                          >
                            {t.title}
                          </button>
                        ))}
                        {dayTasks.length > 2 && (
                          <span className="text-[8px] text-slate-400 font-bold px-1">+{dayTasks.length - 2} lagi</span>
                        )}
                      </>
                    )}
                  </div>

                  {/* Inline Add Task Popover Card */}
                  {addingTaskDay === day && (
                    <div
                      ref={popoverRef}
                      onClick={(e) => e.stopPropagation()}
                      className="absolute top-full left-1/2 -translate-x-1/2 mt-1 bg-white border border-slate-100 shadow-2xl rounded-3xl p-4 w-64 space-y-3 z-[60] text-left cursor-default"
                    >
                      <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                        <span className="text-xs font-extrabold text-slate-800">Judul Tugas</span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setAddingTaskDay(null);
                          }}
                          className="text-slate-400 hover:text-slate-600 font-bold text-xs p-1"
                        >
                          ✕
                        </button>
                      </div>

                      <textarea
                        value={newTitle}
                        onChange={(e) => setNewTitle(e.target.value)}
                        placeholder="Tambah Tugas..."
                        className="w-full text-xs font-semibold text-slate-600 border border-slate-100 rounded-xl p-2.5 outline-none focus:border-violet-500 h-16 resize-none placeholder-slate-300"
                        autoFocus
                      />

                      <div className="space-y-2 pt-1">
                        {/* Type Row */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1.5 text-slate-400 text-xs">
                            <span>🏷️</span>
                            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wide">Jenis</span>
                          </div>
                          <select
                            value={newType}
                            onChange={(e) => setNewType(e.target.value)}
                            className="text-[9px] font-bold text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-full outline-none cursor-pointer border-none"
                          >
                            {["Tugas", "Fitur", "Bug", "Design", "Aset"].map(t => (
                              <option key={t} value={t}>{t}</option>
                            ))}
                          </select>
                        </div>

                        {/* Priority Row */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1.5 text-slate-400 text-xs">
                            <span>🔴</span>
                            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wide">Prioritas</span>
                          </div>
                          <select
                            value={newPriority}
                            onChange={(e) => setNewPriority(e.target.value)}
                            className="text-[9px] font-bold text-rose-700 bg-rose-50 px-2.5 py-1 rounded-full outline-none cursor-pointer border-none"
                          >
                            {["Tertinggi", "Tinggi", "Sedang", "Rendah", "Terendah"].map(p => (
                              <option key={p} value={p}>{p}</option>
                            ))}
                          </select>
                        </div>

                        {/* Assignee Row */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1.5 text-slate-400 text-xs">
                            <span>👥</span>
                            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wide">Penerima</span>
                          </div>
                          <div className="flex -space-x-1">
                            {newOrang.map((m, idx) => (
                              <div key={idx} className="w-5 h-5 rounded-full border border-white bg-slate-200 text-slate-600 text-[8px] font-bold flex items-center justify-center shadow-sm">
                                {m}
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Date Row */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1.5 text-slate-400 text-xs">
                            <span>📅</span>
                            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wide">Tanggal</span>
                          </div>
                          <span className="text-[10px] font-bold text-slate-500">
                            {day} {shortMonthNames[calMonth]} {calYear}
                          </span>
                        </div>
                      </div>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleInlineAddTask(day);
                        }}
                        className="w-full bg-violet-600 hover:bg-violet-700 text-white font-bold text-[11px] py-2.5 rounded-xl shadow-md shadow-violet-100 active:scale-95 transition-all"
                      >
                        Tambah
                      </button>
                    </div>
                  )}

                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
