"use client";
import React, { useState, useRef, useEffect } from "react";

const parseTaskDate = (dateStr) => {
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
};

const getUserAvatar = (name) => {
  const currentName = typeof window !== "undefined" ? localStorage.getItem("sipantau_name") : null;
  const currentEmail = typeof window !== "undefined" ? localStorage.getItem("sipantau_email") : null;
  if (currentName && name && currentName.trim().toLowerCase() === name.trim().toLowerCase()) {
    const stored = typeof window !== "undefined" && currentEmail ? localStorage.getItem(`sipantau_avatar_${currentEmail.toLowerCase()}`) : null;
    if (stored) return stored;
  }
  if (name === "Myesha Azka" || name === "Myesha Azka Hafizha") return "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=50&h=50&q=80";
  if (name === "Nurul Kumala") return "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=50&h=50&q=80";
  if (name === "Aisha Alida Putri") return "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=50&h=50&q=80";
  if (name === "Andi Basudara") return "https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&w=50&h=50&q=80";
  return "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=50&h=50&q=80";
};

const monthNamesGlobal = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];
const shiftDate = (dateStr, days) => {
  const parsed = parseTaskDate(dateStr);
  if (!parsed) return dateStr;
  const d = new Date(parsed.year, parsed.month, parsed.day);
  d.setDate(d.getDate() + days);
  return `${d.getDate()} ${monthNamesGlobal[d.getMonth()]} ${d.getFullYear()}`;
};

export default function GlobalTaskModals({
  tasks,
  setTasks,
  selectedTask,
  setSelectedTask,
  isAddingTask,
  setIsAddingTask,
  setTaskToDelete,
}) {
  const [activeDropdown, setActiveDropdown] = useState(null);
  const dropdownRef = useRef(null);
  const [typeSearch, setTypeSearch] = useState("");
  const [memberSearch, setMemberSearch] = useState("");
  const [newComment, setNewComment] = useState("");
  const [taskTypes, setTaskTypes] = useState(["Design", "Bug", "Aset", "Fitur", "Tugas"]);
  const [newTypeName, setNewTypeName] = useState("");

  // Add Task Form State
  const [addTitle, setAddTitle] = useState("");
  const [addDesc, setAddDesc] = useState("");
  const [addType, setAddType] = useState("Tugas");
  const [addPriority, setAddPriority] = useState("Sedang");
  const [addOrang, setAddOrang] = useState(["A"]);
  const [addDate, setAddDate] = useState("18 Juli 2026");
  const [addStatus, setAddStatus] = useState("todo");

  // Refs for Dropdowns
  const editDateBtnRef = useRef(null);
  const addDateBtnRef = useRef(null);
  const editTypeBtnRef = useRef(null);
  const editPriorityBtnRef = useRef(null);
  const editAssigneeBtnRef = useRef(null);
  const editStatusBtnRef = useRef(null);
  const addTypeBtnRef = useRef(null);
  const addPriorityBtnRef = useRef(null);
  const addAssigneeBtnRef = useRef(null);
  const addStatusBtnRef = useRef(null);

  const [dropdownCoords, setDropdownCoords] = useState(null);

  // Close active dropdown on scroll (so floating menus don't detach), but allow scrolling inside the dropdown itself
  useEffect(() => {
    const handleScroll = (e) => {
      const container = document.getElementById("sipantau-floating-dropdown");
      if (container && (e.target === container || container.contains(e.target))) {
        return;
      }
      if (activeDropdown) {
        setActiveDropdown(null);
        setDropdownCoords(null);
      }
    };
    window.addEventListener("scroll", handleScroll, true);
    return () => window.removeEventListener("scroll", handleScroll, true);
  }, [activeDropdown]);

  const toggleDropdown = (name, triggerRef, align = "left", customWidth = null) => {
    if (activeDropdown === name) {
      setActiveDropdown(null);
      setDropdownCoords(null);
    } else {
      setActiveDropdown(name);
      if (triggerRef && triggerRef.current) {
        const rect = triggerRef.current.getBoundingClientRect();
        let left = rect.left;
        let top = rect.bottom + 6;
        let bottom = undefined;

        if (align === "right") {
          const width = customWidth || 224;
          left = rect.right - width;
        } else if (align === "calendar" || align === "outside-left") {
          left = rect.left - 280; // outside the left column
          top = Math.max(20, rect.top - 120); // slightly higher
          bottom = undefined;
        }
        setDropdownCoords({
          top,
          bottom,
          left: Math.max(10, left),
          width: rect.width
        });
      }
    }
  };

  // Dynamic Calendar State
  const [calendarDate, setCalendarDate] = useState(new Date(2026, 6, 1)); // Default July 2026

  useEffect(() => {
    if (isAddingTask && typeof isAddingTask === "string") {
      setAddStatus(isAddingTask);
      setAddTitle("");
      setAddDesc("");
      setAddType("Tugas");
      setAddPriority("Sedang");
      setAddOrang(["A"]);
      setAddDate("18 Juli 2026");
    }
  }, [isAddingTask]);

  useEffect(() => {
    function handleClickOutside(event) {
      const container = document.getElementById("sipantau-floating-dropdown");
      if (container && container.contains(event.target)) {
        return; // Click inside the floating dropdown list
      }
      if (event.target.closest("button") || event.target.closest("a")) {
        return; // Click on trigger button
      }
      setActiveDropdown(null);
      setDropdownCoords(null);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleUpdateTaskField = (field, value) => {
    if (!selectedTask) return;
    const activeUserName = typeof window !== "undefined" ? (localStorage.getItem("sipantau_name") || "Andi Basudara") : "Andi Basudara";
    let actionText = "telah memperbarui tugas";
    if (field === "status") actionText = "telah mengubah status tugas";
    else if (field === "priority") actionText = "telah memperbarui prioritas pada";
    else if (field === "type") actionText = "telah mengubah jenis tugas";
    else if (field === "orang") actionText = "telah mengubah penerima tugas";
    else if (field === "date") actionText = "telah mengubah tenggat waktu pada";
    else {
      const editVerbs = ["telah mengedit detail pada", "telah melakukan perubahan pada", "telah memperbarui detail"];
      actionText = editVerbs[Math.floor(Math.random() * editVerbs.length)];
    }
    const newHistory = { name: activeUserName, text: actionText, time: "baru saja" };
    
    // Avoid duplicate 'baru saja' logs for the same field if done rapidly
    let updatedRiwayat = selectedTask.riwayat || [];
    if (updatedRiwayat.length > 0 && updatedRiwayat[0].text === actionText && updatedRiwayat[0].time === "baru saja") {
        // Do not add duplicate
    } else {
        updatedRiwayat = [newHistory, ...updatedRiwayat];
    }

    const updated = { ...selectedTask, [field]: value, riwayat: updatedRiwayat };
    setSelectedTask(updated);
    setTasks(tasks.map((t) => (t.id === selectedTask.id ? updated : t)));
  };

  const handleAddComment = () => {
    if (!newComment.trim() || !selectedTask) return;
    const activeUserName = typeof window !== "undefined" ? (localStorage.getItem("sipantau_name") || "Andi Basudara") : "Andi Basudara";
    const comment = { name: activeUserName, text: newComment };
    const updated = {
      ...selectedTask,
      komentar: [...selectedTask.komentar, comment],
    };
    setSelectedTask(updated);
    setTasks(tasks.map((t) => (t.id === selectedTask.id ? updated : t)));
    setNewComment("");
  };

  const handleDeleteTask = (id) => {
    const task = tasks.find((t) => t.id === id);
    if (task) {
      setTaskToDelete(task);
    }
  };

  const getPriorityStyle = (priority) => {
    switch (priority) {
      case "Tertinggi": return "bg-rose-100/70 text-rose-600 border border-rose-200/40 hover:bg-rose-200/50";
      case "Tinggi": return "bg-emerald-100/70 text-emerald-600 border border-emerald-200/40 hover:bg-emerald-200/50";
      case "Sedang": return "bg-amber-100/70 text-amber-600 border border-amber-200/40 hover:bg-amber-200/50";
      case "Rendah": return "bg-cyan-100/70 text-cyan-600 border border-cyan-200/40 hover:bg-cyan-200/50";
      case "Terendah": return "bg-violet-100/70 text-violet-600 border border-violet-200/40 hover:bg-violet-200/50";
      default: return "bg-slate-100 text-slate-700 border-slate-200";
    }
  };

  const getPriorityDotColor = (priority) => {
    switch (priority) {
      case "Tertinggi": return "bg-rose-500";
      case "Tinggi": return "bg-emerald-500";
      case "Sedang": return "bg-amber-500";
      case "Rendah": return "bg-cyan-500";
      case "Terendah": return "bg-violet-500";
      default: return "bg-slate-500";
    }
  };

  const availableMembers = [
    { initial: "A", name: "Aisha Alida Putri", color: "bg-violet-500", avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=50&h=50&q=80" },
    { initial: "M", name: "Myesha Azka Hafizha", color: "bg-emerald-500", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=50&h=50&q=80" },
    { initial: "N", name: "Nurul Kumala", color: "bg-rose-500", avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=50&h=50&q=80" },
    { initial: "B", name: "Andi Basudara", color: "bg-cyan-500", avatar: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&w=50&h=50&q=80" },
    { initial: "R", name: "Rina", color: "bg-emerald-500", avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=50&h=50&q=80" },
    { initial: "H", name: "Hasan", color: "bg-amber-500", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=50&h=50&q=80" },
    { initial: "C", name: "Cindy", color: "bg-pink-500", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=50&h=50&q=80" },
  ];

  // Dynamic Calendar Generator
  const getDaysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
  const getFirstDayOfMonth = (year, month) => {
    let day = new Date(year, month, 1).getDay();
    return day === 0 ? 6 : day - 1; // 0 = Mon, 6 = Sun in our array
  };

  const monthNames = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];
  
  const handlePrevMonth = () => {
    setCalendarDate(new Date(calendarDate.getFullYear(), calendarDate.getMonth() - 1, 1));
  };
  const handleNextMonth = () => {
    setCalendarDate(new Date(calendarDate.getFullYear(), calendarDate.getMonth() + 1, 1));
  };

  const renderCalendarDropdown = (onSelectDate) => {
    const year = calendarDate.getFullYear();
    const month = calendarDate.getMonth();
    const daysInMonth = getDaysInMonth(year, month);
    const firstDay = getFirstDayOfMonth(year, month);
    
    const style = dropdownCoords
      ? { position: "fixed", top: `${dropdownCoords.top}px`, left: `${dropdownCoords.left}px` }
      : { position: "absolute", top: "100%", left: 0, marginTop: "6px" };

    return (
      <div
        style={style}
        className="bg-white border border-slate-100 shadow-2xl rounded-2xl p-3.5 z-[100] w-56 text-left"
      >
        <div className="flex items-center justify-between text-[11px] font-bold text-slate-800 border-b pb-2 mb-2">
          <button onClick={handlePrevMonth} className="px-2 py-0.5 hover:bg-slate-100 rounded text-slate-500 text-sm">&lt;</button>
          <span>{monthNames[month]} {year}</span>
          <button onClick={handleNextMonth} className="px-2 py-0.5 hover:bg-slate-100 rounded text-slate-500 text-sm">&gt;</button>
        </div>
        <div className="grid grid-cols-7 gap-1 text-center text-[10px] font-bold">
          {["S", "S", "R", "K", "J", "S", "M"].map((d, i) => (
            <span key={i} className="text-slate-400 py-1">{d}</span>
          ))}
          {Array.from({ length: firstDay }).map((_, i) => (
            <span key={`empty-${i}`}></span>
          ))}
          {[...Array(daysInMonth)].map((_, i) => {
            const d = i + 1;
            const dateStr = `${d} ${monthNames[month]} ${year}`;
            return (
              <button
                key={d}
                onClick={() => {
                  onSelectDate(dateStr);
                  setActiveDropdown(null);
                  setDropdownCoords(null);
                }}
                className={`p-1.5 rounded-lg hover:bg-violet-50 hover:text-violet-600 transition-colors`}
              >
                {d}
              </button>
            );
          })}
        </div>
      </div>
    );
  };

  const renderFloatingDropdown = () => {
    if (!activeDropdown || !dropdownCoords) return null;
    const style = {
      position: "fixed",
      left: `${dropdownCoords.left}px`,
      zIndex: 9999
    };
    if (dropdownCoords.top !== undefined) style.top = `${dropdownCoords.top}px`;
    if (dropdownCoords.bottom !== undefined) style.bottom = `${dropdownCoords.bottom}px`;

    switch (activeDropdown) {
      case "jenis":
        return (
          <div id="sipantau-floating-dropdown" style={style} className="bg-white border border-slate-150 rounded-[1.5rem] shadow-xl p-4 space-y-3 w-64 text-left">
            <div className="text-center text-xs font-bold text-slate-700">Jenis Tugas</div>
            <input
              type="text"
              placeholder="Cari jenis tugas..."
              value={typeSearch}
              onChange={(e) => setTypeSearch(e.target.value)}
              className="w-full text-xs border border-slate-200 rounded-xl px-3.5 py-2 outline-none focus:border-violet-500 placeholder-slate-350 transition-colors"
            />
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Jenis</div>
            <div className="space-y-2">
              {taskTypes
                .filter((t) => t.toLowerCase().includes(typeSearch.toLowerCase()))
                .map((type) => (
                  <label key={type} className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedTask?.type === type}
                      onChange={() => { handleUpdateTaskField("type", type); setActiveDropdown(null); setDropdownCoords(null); }}
                      className="w-3.5 h-3.5 rounded border-slate-300 text-violet-600 focus:ring-violet-500 cursor-pointer shrink-0"
                    />
                    <span className={`text-[10px] font-bold py-1.5 flex-1 text-center rounded-full transition-all border ${
                      type.toLowerCase() === "design" ? "bg-violet-100 text-violet-600 border-violet-200/40" :
                      type.toLowerCase() === "bug" ? "bg-cyan-100 text-cyan-600 border-cyan-200/40" :
                      type.toLowerCase() === "aset" ? "bg-amber-100 text-amber-600 border-amber-200/40" :
                      type.toLowerCase() === "fitur" ? "bg-rose-100 text-rose-600 border-rose-200/40" :
                      "bg-indigo-100 text-indigo-600 border-indigo-200/40"
                    }`}>
                      {type}
                    </span>
                  </label>
                ))}
            </div>
            <input
              type="text"
              placeholder="Buat jenis tugas baru"
              value={newTypeName}
              onChange={(e) => setNewTypeName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && newTypeName.trim()) {
                  const trimmed = newTypeName.trim();
                  if (!taskTypes.includes(trimmed)) {
                    setTaskTypes([...taskTypes, trimmed]);
                  }
                  handleUpdateTaskField("type", trimmed);
                  setNewTypeName("");
                  setActiveDropdown(null);
                  setDropdownCoords(null);
                }
              }}
              className="w-full text-xs border border-slate-200 rounded-xl px-3.5 py-2 outline-none focus:border-violet-500 placeholder-slate-350 transition-colors"
            />
          </div>
        );
      case "prioritas":
        return (
          <div id="sipantau-floating-dropdown" style={style} className="bg-white border border-slate-150 rounded-[1.5rem] shadow-xl p-4 w-60 text-left">
            <div className="space-y-2">
            {["Terendah", "Rendah", "Sedang", "Tinggi", "Tertinggi"].map((prio) => (
              <button
                key={prio}
                onClick={() => { handleUpdateTaskField("priority", prio); setActiveDropdown(null); setDropdownCoords(null); }}
                className={`w-full text-center py-2 rounded-full text-[10px] font-bold transition-all border cursor-pointer ${
                  prio === "Terendah" ? "bg-violet-100 text-violet-600 border-violet-200/40 hover:bg-violet-150" :
                  prio === "Rendah" ? "bg-cyan-100 text-cyan-600 border-cyan-200/40 hover:bg-cyan-150" :
                  prio === "Sedang" ? "bg-amber-100 text-amber-600 border-amber-200/40 hover:bg-amber-150" :
                  prio === "Tinggi" ? "bg-emerald-100 text-emerald-600 border-emerald-200/40 hover:bg-emerald-150" :
                  "bg-rose-100 text-rose-600 border-rose-200/40 hover:bg-rose-150"
                }`}
              >
                {prio}
              </button>
            ))}
            </div>
          </div>
        );
      case "penerima":
        return (
          <div id="sipantau-floating-dropdown" style={style} className="bg-white border border-slate-100 rounded-2xl shadow-xl p-3 space-y-1.5 w-60 text-left">
            <div className="text-center text-xs font-bold text-slate-700 mb-2">Anggota</div>
            <input
              type="text"
              placeholder="Cari anggota..."
              value={memberSearch}
              onChange={(e) => setMemberSearch(e.target.value)}
              className="w-full text-xs border border-slate-200 rounded-xl px-3 py-1.5 outline-none focus:border-violet-500 placeholder-slate-350 transition-colors mb-2"
            />
            <div className="space-y-1 max-h-40 overflow-y-auto pr-1 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
              {availableMembers.filter(m => m.name.toLowerCase().includes(memberSearch.toLowerCase())).map((member) => (
                <button
                  key={member.name}
                  onClick={() => {
                    if (!selectedTask) return;
                    const alreadyHas = selectedTask.orang.includes(member.initial);
                    const updatedOrang = alreadyHas
                      ? selectedTask.orang.filter((o) => o !== member.initial)
                      : [...selectedTask.orang, member.initial];
                    handleUpdateTaskField("orang", updatedOrang);
                  }}
                  className="w-full text-left px-2 py-1.5 rounded-lg hover:bg-slate-50 flex items-center justify-between text-[10px] font-bold text-slate-600"
                >
                  <div className="flex items-center gap-2">
                    <img src={member.avatar} alt={member.name} className="w-6 h-6 rounded-full object-cover" />
                    <span>{member.name}</span>
                  </div>
                  {selectedTask?.orang.includes(member.initial) && <span className="text-violet-600">✓</span>}
                </button>
              ))}
            </div>
          </div>
        );
      case "status":
        return (
          <div id="sipantau-floating-dropdown" style={style} className="bg-white border border-slate-100 rounded-2xl shadow-xl py-1 w-36 text-left">
            {[
              { id: "todo", label: "To do", bg: "hover:bg-teal-50/50 hover:text-teal-700" },
              { id: "inprogress", label: "In Progress", bg: "hover:bg-rose-50/50 hover:text-rose-700" },
              { id: "review", label: "In Review", bg: "hover:bg-sky-50/50 hover:text-sky-700" },
              { id: "done", label: "Done", bg: "hover:bg-amber-50/50 hover:text-amber-700" },
            ].map((st) => (
              <button
                key={st.id}
                onClick={() => {
                  handleUpdateTaskField("status", st.id);
                  handleUpdateTaskField("done", st.id === "done");
                  setActiveDropdown(null);
                  setDropdownCoords(null);
                }}
                className={`w-full text-left px-4 py-2 text-[10px] font-bold text-slate-600 flex items-center ${st.bg}`}
              >
                {st.label}
              </button>
            ))}
          </div>
        );
      case "add-jenis":
        return (
          <div id="sipantau-floating-dropdown" style={style} className="bg-white border border-slate-150 rounded-[1.5rem] shadow-xl p-4 space-y-3 w-64 text-left">
            <div className="text-center text-xs font-bold text-slate-700">Jenis Tugas</div>
            <input
              type="text"
              placeholder="Cari jenis tugas..."
              value={typeSearch}
              onChange={(e) => setTypeSearch(e.target.value)}
              className="w-full text-xs border border-slate-200 rounded-xl px-3.5 py-2 outline-none focus:border-violet-500 placeholder-slate-350 transition-colors"
            />
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Jenis</div>
            <div className="space-y-2">
              {taskTypes
                .filter((t) => t.toLowerCase().includes(typeSearch.toLowerCase()))
                .map((type) => (
                  <label key={type} className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={addType === type}
                      onChange={() => { setAddType(type); setActiveDropdown(null); setDropdownCoords(null); }}
                      className="w-3.5 h-3.5 rounded border-slate-300 text-violet-600 focus:ring-violet-500 cursor-pointer shrink-0"
                    />
                    <span className={`text-[10px] font-bold py-1.5 flex-1 text-center rounded-full transition-all border ${
                      type.toLowerCase() === "design" ? "bg-violet-100 text-violet-600 border-violet-200/40" :
                      type.toLowerCase() === "bug" ? "bg-cyan-100 text-cyan-600 border-cyan-200/40" :
                      type.toLowerCase() === "aset" ? "bg-amber-100 text-amber-600 border-amber-200/40" :
                      type.toLowerCase() === "fitur" ? "bg-rose-100 text-rose-600 border-rose-200/40" :
                      "bg-indigo-100 text-indigo-600 border-indigo-200/40"
                    }`}>
                      {type}
                    </span>
                  </label>
                ))}
            </div>
            <input
              type="text"
              placeholder="Buat jenis tugas baru"
              value={newTypeName}
              onChange={(e) => setNewTypeName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && newTypeName.trim()) {
                  const trimmed = newTypeName.trim();
                  if (!taskTypes.includes(trimmed)) {
                    setTaskTypes([...taskTypes, trimmed]);
                  }
                  setAddType(trimmed);
                  setNewTypeName("");
                  setActiveDropdown(null);
                  setDropdownCoords(null);
                }
              }}
              className="w-full text-xs border border-slate-200 rounded-xl px-3.5 py-2 outline-none focus:border-violet-500 placeholder-slate-350 transition-colors"
            />
          </div>
        );
      case "add-prioritas":
        return (
          <div id="sipantau-floating-dropdown" style={style} className="bg-white border border-slate-150 rounded-[1.5rem] shadow-xl p-4 w-60 text-left">
            <div className="space-y-2">
            {["Terendah", "Rendah", "Sedang", "Tinggi", "Tertinggi"].map((prio) => (
              <button
                key={prio}
                onClick={() => { setAddPriority(prio); setActiveDropdown(null); setDropdownCoords(null); }}
                className={`w-full text-center py-2 rounded-full text-[10px] font-bold transition-all border cursor-pointer ${
                  prio === "Terendah" ? "bg-violet-100 text-violet-600 border-violet-200/40 hover:bg-violet-150" :
                  prio === "Rendah" ? "bg-cyan-100 text-cyan-600 border-cyan-200/40 hover:bg-cyan-150" :
                  prio === "Sedang" ? "bg-amber-100 text-amber-600 border-amber-200/40 hover:bg-amber-150" :
                  prio === "Tinggi" ? "bg-emerald-100 text-emerald-600 border-emerald-200/40 hover:bg-emerald-150" :
                  "bg-rose-100 text-rose-600 border-rose-200/40 hover:bg-rose-150"
                }`}
              >
                {prio}
              </button>
            ))}
            </div>
          </div>
        );
      case "add-penerima":
        return (
          <div id="sipantau-floating-dropdown" style={style} className="bg-white border border-slate-100 rounded-2xl shadow-xl p-3 space-y-1.5 w-60 text-left">
            <div className="text-center text-xs font-bold text-slate-700 mb-2">Anggota</div>
            <input
              type="text"
              placeholder="Cari anggota..."
              value={memberSearch}
              onChange={(e) => setMemberSearch(e.target.value)}
              className="w-full text-xs border border-slate-200 rounded-xl px-3 py-1.5 outline-none focus:border-violet-500 placeholder-slate-350 transition-colors mb-2"
            />
            <div className="space-y-1 max-h-40 overflow-y-auto pr-1 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
              {availableMembers.filter(m => m.name.toLowerCase().includes(memberSearch.toLowerCase())).map((member) => (
              <button key={member.name}
                onClick={() => {
                  const has = addOrang.includes(member.initial);
                  setAddOrang(has ? addOrang.filter(o => o !== member.initial) : [...addOrang, member.initial]);
                }}
                className="w-full text-left px-2 py-1.5 rounded-lg hover:bg-slate-50 flex items-center justify-between text-[10px] font-bold text-slate-600"
              >
                <div className="flex items-center gap-2">
                  <img src={member.avatar} alt={member.name} className="w-6 h-6 rounded-full object-cover" />
                  <span>{member.name}</span>
                </div>
                {addOrang.includes(member.initial) && <span className="text-violet-600">&#x2713;</span>}
              </button>
            ))}
            </div>
          </div>
        );
      case "add-status":
        return (
          <div id="sipantau-floating-dropdown" style={style} className="bg-white border border-slate-100 rounded-2xl shadow-xl py-1 w-36 text-left">
            {[
              { id: "todo", label: "To do" },
              { id: "inprogress", label: "In Progress" },
              { id: "review", label: "In Review" },
              { id: "done", label: "Done" },
            ].map((st) => (
              <button
                key={st.id}
                onClick={() => {
                  setAddStatus(st.id);
                  setActiveDropdown(null);
                  setDropdownCoords(null);
                }}
                className="w-full text-left px-4 py-2 text-[10px] font-bold text-slate-600 hover:bg-slate-50 flex items-center justify-between"
              >
                {st.label}
              </button>
            ))}
          </div>
        );
      case "kalender":
        return renderCalendarDropdown((date) => handleUpdateTaskField("date", date));
      case "add-kalender":
        return renderCalendarDropdown((date) => setAddDate(date));
      default:
        return null;
    }
  };

  return (
    <>
      {/* ================= EDIT MODAL ================= */}
      {selectedTask && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-2xl h-[580px] max-h-[90vh] overflow-y-auto flex flex-col shadow-2xl relative border border-slate-100">
            
            {/* Modal Header */}
            <div className="p-6 border-b border-slate-100 flex items-center justify-between gap-4 w-full">
              <input
                type="text"
                value={selectedTask.title}
                onChange={(e) => handleUpdateTaskField("title", e.target.value)}
                className="text-base font-extrabold text-slate-800 border-b border-transparent hover:border-slate-200 focus:border-violet-500 outline-none w-full pb-1 transition-all"
                placeholder="Judul tugas..."
              />
              <button
                onClick={() => { setSelectedTask(null); setActiveDropdown(null); }}
                className="w-8 h-8 rounded-full bg-slate-50 hover:bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-600 transition-colors font-bold cursor-pointer shrink-0"
              >
                ✕
              </button>
            </div>

            <div className="px-6 py-4 grid grid-cols-1 md:grid-cols-2 gap-5">
              
              <div className="space-y-3.5">
                
                {/* Deskripsi */}
                <div className="space-y-1.5">
                  <label className="text-sm font-bold text-slate-800 block">Deskripsi</label>
                  <textarea
                    value={selectedTask.desc}
                    onChange={(e) => handleUpdateTaskField("desc", e.target.value)}
                    className="w-full text-xs font-semibold text-slate-600 border border-slate-200 rounded-xl p-3 bg-slate-50/20 outline-none focus:border-violet-500 h-20 resize-none"
                  />
                </div>

                {/* Jenis Tugas */}
                <div className="space-y-1.5">
                  <label className="text-sm font-bold text-slate-800 block">Jenis Tugas</label>
                  <button
                    ref={editTypeBtnRef}
                    onClick={() => toggleDropdown("jenis", editTypeBtnRef)}
                    className="flex items-center gap-2 bg-indigo-50 hover:bg-indigo-100/70 border border-indigo-100 rounded-xl px-3 py-1.5 text-xs font-bold text-indigo-700 cursor-pointer w-max"
                  >
                    <span className="w-2 h-2 rounded bg-indigo-600" />
                    <span>{selectedTask.type}</span>
                    <span className="text-[8px] opacity-70 ml-1">▼</span>
                  </button>
                </div>

                {/* Prioritas Tugas */}
                <div className="space-y-1.5">
                  <label className="text-sm font-bold text-slate-800 block">Prioritas Tugas</label>
                  <button
                    ref={editPriorityBtnRef}
                    onClick={() => toggleDropdown("prioritas", editPriorityBtnRef)}
                    className={`flex items-center gap-2 border rounded-xl px-3 py-1.5 text-xs font-bold ${getPriorityStyle(selectedTask.priority)} cursor-pointer w-max`}
                  >
                    <span className={`w-2 h-2 rounded-full ${getPriorityDotColor(selectedTask.priority)}`} />
                    <span>{selectedTask.priority}</span>
                    <span className="text-[8px] opacity-70 ml-1">▼</span>
                  </button>
                </div>

                {/* Penerima Tugas */}
                <div className="space-y-1.5">
                  <label className="text-sm font-bold text-slate-800 block">Penerima Tugas</label>
                  <div className="flex items-center gap-2">
                    {selectedTask.orang.map((m, i) => {
                      const memberObj = availableMembers.find(mem => mem.initial === m);
                      return memberObj ? (
                        <img key={i} src={memberObj.avatar} alt={memberObj.name} className="w-7 h-7 rounded-full object-cover border-2 border-white shadow-sm" />
                      ) : (
                        <div key={i} className="w-7 h-7 rounded-full bg-slate-200 border-2 border-white flex items-center justify-center text-slate-600 text-[10px] font-bold shadow-sm">
                          {m}
                        </div>
                      );
                    })}
                    <button
                      ref={editAssigneeBtnRef}
                      onClick={() => toggleDropdown("penerima", editAssigneeBtnRef, "outside-left")}
                      className="w-7 h-7 rounded-full border border-dashed border-slate-300 hover:border-slate-400 text-slate-400 hover:text-slate-600 text-xs font-bold flex items-center justify-center cursor-pointer bg-white"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Tenggat Tugas */}
                <div className="space-y-1.5">
                  <label className="text-sm font-bold text-slate-800 block">Tenggat Tugas</label>
                  <button
                    ref={editDateBtnRef}
                    onClick={() => toggleDropdown("kalender", editDateBtnRef, "outside-left", 224)}
                    className="flex items-center gap-1.5 bg-slate-50/50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 cursor-pointer w-max"
                  >
                    <span>📅</span>
                    <span>{selectedTask.date}</span>
                  </button>
                </div>

              </div>

              <div className="space-y-4">
                
                {/* Status & Hapus Buttons */}
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <button
                      ref={editStatusBtnRef}
                      onClick={() => toggleDropdown("status", editStatusBtnRef)}
                      className={`flex items-center gap-2 border rounded-xl px-3 py-1.5 text-xs font-bold capitalize cursor-pointer ${
                        selectedTask.status === "todo" ? "bg-teal-50 text-teal-700 border-teal-100" :
                        selectedTask.status === "inprogress" ? "bg-rose-50 text-rose-700 border-rose-100" :
                        selectedTask.status === "review" ? "bg-sky-50 text-sky-700 border-sky-100" :
                        "bg-amber-50 text-amber-700 border-amber-100"
                      }`}
                    >
                      <span>{selectedTask.status === "todo" ? "To do" : selectedTask.status === "inprogress" ? "In Progress" : selectedTask.status === "review" ? "In Review" : "Done"}</span>
                      <span className="text-[8px] opacity-70">▼</span>
                    </button>
                  </div>

                  <button
                    onClick={() => handleDeleteTask(selectedTask.id)}
                    className="flex items-center gap-1.5 border border-rose-100 hover:bg-rose-50/50 bg-rose-50/20 rounded-xl px-3 py-1.5 text-xs font-bold text-rose-600 transition-colors cursor-pointer"
                  >
                    <span>Hapus Tugas</span>
                    <span className="text-[10px]">🗑️</span>
                  </button>
                </div>

                {/* Riwayat */}
                <div className="space-y-2">
                  <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Riwayat</h3>
                  <div className="space-y-3">
                    {selectedTask.riwayat && selectedTask.riwayat.map((hist, i) => (
                      <div key={i} className="flex items-start gap-2.5">
                        <img
                          src={getUserAvatar(hist.name)}
                          alt="avatar"
                          className="w-7 h-7 rounded-full object-cover border border-slate-100 shrink-0"
                        />
                        <div>
                          <p className="text-[10px] text-slate-600 leading-tight">
                            <strong className="text-slate-800 font-bold">{hist.name}</strong> {hist.text}
                          </p>
                          <span className="text-[9px] text-slate-400 font-medium">{hist.time}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Komentar */}
                <div className="space-y-3 border-t border-slate-100 pt-4">
                  <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Komentar</h3>
                  <div className="space-y-3 max-h-36 overflow-y-auto pr-1 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                    {selectedTask.komentar && selectedTask.komentar.map((comment, i) => (
                      <div key={i} className="flex items-start gap-2.5">
                        <img
                          src={getUserAvatar(comment.name)}
                          alt="avatar"
                          className="w-7 h-7 rounded-full object-cover border border-slate-100 shrink-0"
                        />
                        <div>
                          <p className="text-[10px] text-slate-700 font-bold">{comment.name}</p>
                          <p className="text-[10px] text-slate-500 font-medium leading-relaxed">{comment.text}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="flex items-center gap-2 pt-2">
                    <img
                      src={getUserAvatar(typeof window !== "undefined" ? (localStorage.getItem("sipantau_name") || "Andi Basudara") : "Andi Basudara")}
                      alt="avatar"
                      className="w-7 h-7 rounded-full object-cover border border-slate-100 shrink-0"
                    />
                    <div className="flex-1 relative flex items-center border border-slate-200 rounded-xl bg-slate-50/20 px-3 py-1.5 focus-within:border-violet-500 transition-colors">
                      <input
                        type="text"
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        onKeyDown={(e) => { if (e.key === "Enter") handleAddComment(); }}
                        placeholder="Tambahkan komentar..."
                        className="w-full text-[10px] font-semibold text-slate-600 bg-transparent outline-none pr-6 placeholder-slate-400"
                      />
                      <button
                        onClick={handleAddComment}
                        className="absolute right-2 text-slate-400 hover:text-violet-600 cursor-pointer p-1"
                      >
                        ➢
                      </button>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================= ADD MODAL ================= */}
      {isAddingTask && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-2xl h-[580px] max-h-[90vh] overflow-y-auto flex flex-col shadow-2xl relative border border-slate-100">
            
            {/* Modal Header */}
            <div className="p-6 border-b border-slate-100 flex items-center justify-between gap-4 w-full">
              <input
                type="text"
                value={addTitle}
                onChange={(e) => setAddTitle(e.target.value)}
                className="text-base font-extrabold text-slate-800 border-b border-transparent hover:border-slate-200 focus:border-violet-500 outline-none w-full pb-1 transition-all placeholder-slate-300"
                placeholder="Judul tugas baru..."
              />
              <button
                onClick={() => { setIsAddingTask(null); setActiveDropdown(null); }}
                className="w-8 h-8 rounded-full bg-slate-50 hover:bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-600 transition-colors font-bold cursor-pointer shrink-0"
              >
                ✕
              </button>
            </div>

            <div className="px-6 py-4 grid grid-cols-1 md:grid-cols-2 gap-5">
              
              <div className="space-y-3.5">
                {/* Deskripsi */}
                <div className="space-y-1.5">
                  <label className="text-sm font-bold text-slate-800 block">Deskripsi</label>
                  <textarea
                    placeholder="Masukkan deskripsi tugas..."
                    value={addDesc}
                    onChange={(e) => setAddDesc(e.target.value)}
                    className="w-full text-xs font-semibold text-slate-600 border border-slate-200 rounded-xl p-3 bg-slate-50/20 outline-none focus:border-violet-500 h-20 resize-none"
                  />
                </div>

                {/* Jenis Tugas */}
                <div className="space-y-1.5">
                  <label className="text-sm font-bold text-slate-800 block">Jenis Tugas</label>
                  <button
                    ref={addTypeBtnRef}
                    onClick={() => toggleDropdown("add-jenis", addTypeBtnRef)}
                    className="flex items-center gap-2 bg-indigo-50 hover:bg-indigo-100/70 border border-indigo-100 rounded-xl px-3 py-1.5 text-xs font-bold text-indigo-700 cursor-pointer w-max"
                  >
                    <span className="w-2 h-2 rounded bg-indigo-600" />
                    <span>{addType}</span>
                    <span className="text-[8px] opacity-70 ml-1">▼</span>
                  </button>
                </div>

                {/* Prioritas Tugas */}
                <div className="space-y-1.5">
                  <label className="text-sm font-bold text-slate-800 block">Prioritas Tugas</label>
                  <button
                    ref={addPriorityBtnRef}
                    onClick={() => toggleDropdown("add-prioritas", addPriorityBtnRef)}
                    className={`flex items-center gap-2 border rounded-xl px-3 py-1.5 text-xs font-bold ${getPriorityStyle(addPriority)} cursor-pointer w-max`}
                  >
                    <span className={`w-2 h-2 rounded-full ${getPriorityDotColor(addPriority)}`} />
                    <span>{addPriority}</span>
                    <span className="text-[8px] opacity-70 ml-1">▼</span>
                  </button>
                </div>

                {/* Penerima Tugas */}
                <div className="space-y-1.5">
                  <label className="text-sm font-bold text-slate-800 block">Penerima Tugas</label>
                  <div className="flex items-center gap-2">
                    {addOrang.map((m, i) => {
                      const memberObj = availableMembers.find(mem => mem.initial === m);
                      return memberObj ? (
                        <img key={i} src={memberObj.avatar} alt={memberObj.name} className="w-7 h-7 rounded-full object-cover border-2 border-white shadow-sm" />
                      ) : (
                        <div key={i} className="w-7 h-7 rounded-full bg-slate-200 border-2 border-white flex items-center justify-center text-slate-600 text-[10px] font-bold shadow-sm">
                          {m}
                        </div>
                      );
                    })}
                    <button
                      ref={addAssigneeBtnRef}
                      onClick={() => toggleDropdown("add-penerima", addAssigneeBtnRef, "outside-left")}
                      className="w-7 h-7 rounded-full border border-dashed border-slate-300 hover:border-slate-400 text-slate-400 hover:text-slate-600 text-xs font-bold flex items-center justify-center cursor-pointer bg-white"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Tenggat Tugas */}
                <div className="space-y-1.5">
                  <label className="text-sm font-bold text-slate-800 block">Tenggat Tugas</label>
                  <button
                    ref={addDateBtnRef}
                    onClick={() => toggleDropdown("add-kalender", addDateBtnRef, "outside-left", 224)}
                    className="flex items-center gap-1.5 bg-slate-50/50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 cursor-pointer w-max"
                  >
                    <span>📅</span>
                    <span>{addDate}</span>
                  </button>
                </div>
              </div>

              <div className="space-y-4">
                {/* Status Tugas */}
                <div className="space-y-1.5">
                  <label className="text-sm font-bold text-slate-800 block">Status Tugas</label>
                  <button
                    ref={addStatusBtnRef}
                    onClick={() => toggleDropdown("add-status", addStatusBtnRef)}
                    className={`flex items-center gap-2 border rounded-xl px-3 py-1.5 text-xs font-bold capitalize cursor-pointer w-max ${
                      addStatus === "todo" ? "bg-teal-50 text-teal-700 border-teal-100" :
                      addStatus === "inprogress" ? "bg-rose-50 text-rose-700 border-rose-100" :
                      addStatus === "review" ? "bg-sky-50 text-sky-700 border-sky-100" :
                      "bg-amber-50 text-amber-700 border-amber-100"
                    }`}
                  >
                    <span>{addStatus === "todo" ? "To do" : addStatus === "inprogress" ? "In Progress" : addStatus === "review" ? "In Review" : "Done"}</span>
                    <span className="text-[8px] opacity-70 border-teal-100">▼</span>
                  </button>
                </div>
              </div>

            </div>

            <div className="px-6 py-3.5 border-t border-slate-100 flex items-center justify-end gap-3 bg-slate-50/50 rounded-b-3xl mt-auto">
              <button
                onClick={() => { setIsAddingTask(null); setActiveDropdown(null); }}
                className="px-4 py-2 rounded-xl border border-slate-200 hover:bg-slate-100 text-xs font-bold text-slate-500 cursor-pointer transition-colors"
              >
                Batal
              </button>
              <button
                onClick={() => {
                  if (!addTitle.trim()) {
                    alert("Judul tugas tidak boleh kosong!");
                    return;
                  }
                  const activeUserName = typeof window !== "undefined" ? (localStorage.getItem("sipantau_name") || "Andi Basudara") : "Andi Basudara";
                  const newTask = {
                    id: Date.now(),
                    title: addTitle,
                    desc: addDesc || "Tidak ada deskripsi",
                    date: addDate,
                    type: addType,
                    priority: addPriority,
                    status: addStatus,
                    done: addStatus === "done",
                    orang: addOrang.length > 0 ? addOrang : ["A"],
                    riwayat: [{ name: activeUserName, text: ["telah membuat penugasan", "telah menjadwalkan tugas", "telah menambahkan tugas baru", "telah membuat tugas ini"][Math.floor(Math.random() * 4)], time: "baru saja" }],
                    komentar: [],
                  };
                  setTasks([...tasks, newTask]);
                  setIsAddingTask(null);
                  setActiveDropdown(null);
                }}
                className="px-4 py-2 rounded-xl bg-violet-600 hover:bg-violet-700 text-xs font-bold text-white shadow-md shadow-violet-100 active:scale-95 transition-all cursor-pointer"
              >
                Tambah Tugas
              </button>
            </div>
          </div>
        </div>
      )}
      {renderFloatingDropdown()}
    </>
  );
}
