"use client";

import React, { useState, useRef, useEffect } from "react";

export default function TabPapan({ tasks, setTasks, setSelectedTask, setTaskToDelete }) {
  const [showAddForm, setShowAddForm] = useState(null);
  const [activeMenuId, setActiveMenuId] = useState(null);
  const [showCalendar, setShowCalendar] = useState(false);
  const [draggedTaskId, setDraggedTaskId] = useState(null);
  const [calYear, setCalYear] = useState(2026);
  const [calMonth, setCalMonth] = useState(6); // 0-indexed, 6 = July

  const [newTitle, setNewTitle] = useState("");
  const [newType, setNewType] = useState("Tugas");
  const [newPriority, setNewPriority] = useState("Tertinggi");
  const [newDate, setNewDate] = useState("1 Jul 2026");

  const menuRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setActiveMenuId(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const monthNames = ["Januari","Februari","Maret","April","Mei","Juni","Juli","Agustus","September","Oktober","November","Desember"];
  const shortMonthNames = ["Jan","Feb","Mar","Apr","Mei","Jun","Jul","Agu","Sep","Okt","Nov","Des"];

  const getDaysInMonth = (y, m) => new Date(y, m + 1, 0).getDate();
  const getFirstDay = (y, m) => { const d = new Date(y, m, 1).getDay(); return d === 0 ? 6 : d - 1; };

  const handleAddTask = (status) => {
    if (!newTitle.trim()) return;
    const newTask = {
      id: Date.now(),
      title: newTitle,
      desc: "Tugas baru ditambahkan ke papan",
      date: newDate,
      type: newType,
      priority: newPriority,
      status,
      done: false,
      orang: ["A"],
      riwayat: [{ name: "Anda", text: "telah membuat tugas ini", time: "baru saja" }],
      komentar: [],
    };
    setTasks([...tasks, newTask]);
    setNewTitle("");
    setShowAddForm(null);
    setShowCalendar(false);
  };

  const handleDeleteTask = (id) => {
    const task = tasks.find(t => t.id === id);
    if (task) {
      setTaskToDelete(task);
    }
    setActiveMenuId(null);
  };

  const handleDragStart = (e, id) => { setDraggedTaskId(id); e.dataTransfer.effectAllowed = "move"; };
  const handleDragOver = (e) => { e.preventDefault(); e.dataTransfer.dropEffect = "move"; };
  const handleDrop = (e, status) => {
    e.preventDefault();
    if (!draggedTaskId) return;
    setTasks(tasks.map(t => t.id === draggedTaskId ? { ...t, status } : t));
    setDraggedTaskId(null);
  };

  const getPriorityStyle = (priority) => {
    switch (priority) {
      case "Tertinggi": return "bg-rose-50 text-rose-600";
      case "Tinggi": return "bg-emerald-50 text-emerald-600";
      case "Sedang": return "bg-amber-50 text-amber-600";
      case "Rendah": return "bg-cyan-50 text-cyan-600";
      case "Terendah": return "bg-violet-50 text-violet-600";
      default: return "bg-slate-50 text-slate-600";
    }
  };

  const columns = [
    { id: "todo", title: "To do", bg: "bg-teal-50/50", headerBg: "bg-teal-50", border: "border-teal-400", text: "text-teal-700", dot: "bg-teal-400" },
    { id: "inprogress", title: "In Progress", bg: "bg-rose-50/30", headerBg: "bg-rose-50", border: "border-rose-400", text: "text-rose-700", dot: "bg-rose-400" },
    { id: "review", title: "In Review", bg: "bg-sky-50/30", headerBg: "bg-sky-50", border: "border-sky-400", text: "text-sky-700", dot: "bg-sky-400" },
    { id: "done", title: "Done", bg: "bg-amber-50/30", headerBg: "bg-amber-50", border: "border-amber-400", text: "text-amber-700", dot: "bg-amber-400" },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-start">
      {columns.map((col) => {
        const colTasks = tasks.filter((t) => t.status === col.id);
        return (
          <div
            key={col.id}
            className={`rounded-2xl p-3 border border-slate-100 ${col.bg} flex flex-col gap-3 min-h-[480px] transition-colors`}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, col.id)}
          >
            {/* Column Header */}
            <div className={`flex items-center justify-between p-2 rounded-xl border ${col.border} ${col.headerBg}`}>
              <div className="flex items-center gap-2">
                <span className={`w-2.5 h-2.5 rounded-full ${col.dot}`} />
                <span className={`text-xs font-extrabold ${col.text}`}>{col.title}</span>
              </div>
              <span className={`text-[10px] font-bold ${col.text} opacity-80`}>{colTasks.length}</span>
            </div>

            {/* Task Cards */}
            <div className="space-y-3 flex-1">
              {colTasks.map((task) => (
                <div
                  key={task.id}
                  draggable
                  onDragStart={(e) => handleDragStart(e, task.id)}
                  onClick={() => setSelectedTask(task)}
                  className={`bg-white border border-slate-100 rounded-xl p-3.5 shadow-sm space-y-2 relative cursor-grab active:cursor-grabbing transition-opacity ${draggedTaskId === task.id ? "opacity-40" : "opacity-100"}`}
                >
                  {/* Card Header */}
                  <div className="flex items-center justify-between">
                    <span className="bg-violet-50 text-violet-700 px-2 py-0.5 rounded text-[9px] font-bold">{task.type}</span>
                    <div className="relative" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={() => setActiveMenuId(activeMenuId === task.id ? null : task.id)}
                        className="text-slate-400 hover:text-slate-700 font-bold p-1 cursor-pointer"
                      >···</button>
                      {activeMenuId === task.id && (
                        <div ref={menuRef} className="absolute right-0 mt-1 w-32 bg-white border border-slate-100 rounded-xl shadow-lg py-1.5 z-20">
                          <button
                            onClick={() => { setSelectedTask(task); setActiveMenuId(null); }}
                            className="w-full text-left px-3 py-1.5 text-[10px] font-bold text-slate-600 hover:bg-slate-50 flex items-center justify-between"
                          >
                            <span>Detail Tugas</span><span>›</span>
                          </button>
                          <button
                            onClick={() => handleDeleteTask(task.id)}
                            className="w-full text-left px-3 py-1.5 text-[10px] font-bold text-rose-600 hover:bg-rose-50/50 flex items-center justify-between"
                          >
                            <span>Hapus Tugas</span><span>🗑️</span>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  <h4 className="text-xs font-extrabold text-slate-800 leading-snug">{task.title}</h4>
                  <p className="text-[10px] text-slate-400 leading-relaxed line-clamp-2">{task.desc}</p>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-50">
                    <div className="flex items-center gap-1.5">
                      <span className={`px-2 py-0.5 rounded text-[8px] font-bold ${getPriorityStyle(task.priority)}`}>{task.priority}</span>
                      <span className="text-[8px] font-bold text-slate-400 flex items-center gap-0.5">📅 {task.date}</span>
                    </div>
                    <div className="flex -space-x-1.5">
                      {task.orang.map((o, idx) => (
                        <div key={idx} className="w-4 h-4 rounded-full border border-white bg-slate-200 text-slate-600 text-[8px] font-bold flex items-center justify-center shadow-sm">{o}</div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Add Task Inline */}
            {showAddForm === col.id ? (
              <div className="bg-white border border-slate-100 rounded-xl shadow-lg p-3 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-50 pb-2">
                  <span className="text-sm font-extrabold text-slate-800">Judul Tugas</span>
                  <button onClick={() => setShowAddForm(null)} className="text-slate-400 hover:text-slate-600 font-bold p-1">✕</button>
                </div>

                <textarea
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="Tambah Tugas..."
                  className="w-full text-xs font-semibold text-slate-600 border border-slate-100 rounded-xl p-2.5 outline-none focus:border-violet-500 h-20 resize-none placeholder-slate-300"
                />

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[12px]">🏷️</span>
                    <select value={newType} onChange={(e) => setNewType(e.target.value)} className="text-[10px] font-bold text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-full outline-none cursor-pointer">
                      {["Tugas","Fitur","Bug","Aset"].map(t => <option key={t}>{t}</option>)}
                    </select>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[12px]">✅</span>
                    <select value={newPriority} onChange={(e) => setNewPriority(e.target.value)} className="text-[10px] font-bold text-rose-600 bg-rose-50 px-2.5 py-1 rounded-full outline-none cursor-pointer">
                      {["Tertinggi","Tinggi","Sedang","Rendah"].map(p => <option key={p}>{p}</option>)}
                    </select>
                  </div>

                  {/* Tenggat kalender inline */}
                  <div className="relative">
                    <div className="flex items-center justify-between">
                      <span className="text-[12px]">📅</span>
                      <button
                        onClick={() => setShowCalendar(!showCalendar)}
                        className="text-[10px] font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 px-2 py-1 rounded-full"
                      >{newDate}</button>
                    </div>
                    {showCalendar && (
                      <div className="absolute right-0 mt-2 bg-white border border-slate-100 shadow-2xl rounded-2xl p-3 z-30 w-52">
                        <div className="flex items-center justify-between text-[10px] font-bold text-slate-800 border-b pb-1.5 mb-1.5">
                          <span>{monthNames[calMonth]} {calYear}</span>
                          <div className="flex gap-1">
                            <button onClick={() => { if (calMonth === 0) { setCalMonth(11); setCalYear(calYear-1); } else setCalMonth(calMonth-1); }} className="px-1.5 hover:bg-slate-100 rounded">&lt;</button>
                            <button onClick={() => { if (calMonth === 11) { setCalMonth(0); setCalYear(calYear+1); } else setCalMonth(calMonth+1); }} className="px-1.5 hover:bg-slate-100 rounded">&gt;</button>
                          </div>
                        </div>
                        <div className="grid grid-cols-7 gap-1 text-center text-[9px] font-bold">
                          {["S","S","R","K","J","S","M"].map((d,i) => <span key={i} className="text-slate-400">{d}</span>)}
                          {Array.from({length: getFirstDay(calYear, calMonth)}).map((_,i) => <span key={i}/>)}
                          {[...Array(getDaysInMonth(calYear, calMonth))].map((_,i) => {
                            const d = i+1;
                            const dateStr = `${d} ${shortMonthNames[calMonth]} ${calYear}`;
                            return (
                              <button key={d} onClick={() => { setNewDate(dateStr); setShowCalendar(false); }}
                                className={`p-1 rounded hover:bg-violet-50 hover:text-violet-600 ${newDate === dateStr ? "bg-violet-600 text-white" : "text-slate-600"}`}
                              >{d}</button>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <button
                  onClick={() => handleAddTask(col.id)}
                  className="w-full bg-violet-600 hover:bg-violet-700 text-white font-bold text-[11px] py-2.5 rounded-xl shadow-md shadow-violet-100 active:scale-95 transition-all"
                >Tambah</button>
              </div>
            ) : (
              <button
                onClick={() => { setShowAddForm(col.id); setNewTitle(""); setShowCalendar(false); }}
                className="w-full border border-dashed border-slate-200 hover:border-slate-300 hover:bg-white text-slate-400 hover:text-slate-600 font-bold text-xs py-2 rounded-xl flex items-center justify-center gap-1 transition-all cursor-pointer"
              >
                <span>+</span> Tambah
              </button>
            )}
          </div>
        );
      })}
    </div>
  );
}
