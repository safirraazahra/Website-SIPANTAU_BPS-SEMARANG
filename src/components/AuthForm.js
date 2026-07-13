"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function AuthForm({ defaultRole = "pemagang" }) {
  const router = useRouter();
  const [isSignUp, setIsSignUp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Form states
  const [signInEmail, setSignInEmail] = useState("");
  const [signInPassword, setSignInPassword] = useState("");

  const [signUpName, setSignUpName] = useState("");
  const [signUpEmail, setSignUpEmail] = useState("");
  const [signUpPhone, setSignUpPhone] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [signUpAddress, setSignUpAddress] = useState("");
  const [signUpRole, setSignUpRole] = useState(defaultRole);
  const [signUpInstitution, setSignUpInstitution] = useState("");
  const [signUpMajor, setSignUpMajor] = useState("");
  const [signUpPassword, setSignUpPassword] = useState("");

  const [statusMessage, setStatusMessage] = useState(null);

  // Helper to detect if email is a mentor email
  const isMentorEmail = (email) => {
    if (!email) return false;
    const lowerEmail = email.toLowerCase();
    return (
      lowerEmail.endsWith("@bps.go.id") ||
      lowerEmail.endsWith("@mentor.sipantau.com") ||
      lowerEmail.includes("mentor")
    );
  };

  // Clear any existing active session and initialize mock database if needed
  useEffect(() => {
    if (typeof window !== "undefined") {
      // Clear active login sessions
      localStorage.removeItem("sipantau_role");
      localStorage.removeItem("sipantau_name");
      localStorage.removeItem("sipantau_email");

      // Initialize default accounts in database if empty
      const existingUsers = localStorage.getItem("sipantau_users");
      if (!existingUsers) {
        const defaultUsers = [
          {
            email: "mentor@bps.go.id",
            password: "password123",
            name: "Budi Hartono",
            phone: "08123456789",
            address: "Kantor BPS Kota Semarang",
            institution: "BPS Kota Semarang",
            role: "mentor"
          },
          {
            email: "pemagang@gmail.com",
            password: "password123",
            name: "Andi Basudara",
            phone: "08987654321",
            address: "Jl. Pemuda No. 1",
            institution: "Universitas Diponegoro",
            role: "pemagang"
          }
        ];
        localStorage.setItem("sipantau_users", JSON.stringify(defaultUsers));
      }
    }
  }, []);



  const handleSubmit = (e) => {
    e.preventDefault();
    setStatusMessage(null);

    // Common Email Regex Validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (isSignUp) {
      if (!signUpName || !signUpEmail || !signUpPhone || !signUpAddress || !signUpInstitution || !signUpMajor || !signUpPassword) {
        setStatusMessage({ type: "error", text: "Semua field bertanda * wajib diisi!" });
        return;
      }
      if (!emailRegex.test(signUpEmail)) {
        setStatusMessage({ type: "error", text: "Format email tidak valid!" });
        return;
      }
      if (phoneError || !/^\d+$/.test(signUpPhone)) {
        setStatusMessage({ type: "error", text: "Nomor telepon/HP tidak valid (hanya boleh berisi angka)!" });
        return;
      }
      if (signUpPassword.length < 8) {
        setStatusMessage({ type: "error", text: "Password minimal harus 8 karakter!" });
        return;
      }

      // Check user existence in mock database
      const usersListStr = localStorage.getItem("sipantau_users") || "[]";
      const usersList = JSON.parse(usersListStr);
      const userExists = usersList.find(u => u.email.toLowerCase() === signUpEmail.toLowerCase());
      if (userExists) {
        setStatusMessage({ type: "error", text: "Email sudah terdaftar!" });
        return;
      }

      const finalRole = signUpRole;

      // Register new user
      const newUser = {
        email: signUpEmail,
        password: signUpPassword,
        name: signUpName,
        phone: signUpPhone,
        address: signUpAddress,
        institution: signUpInstitution,
        major: signUpMajor,
        role: finalRole
      };
      usersList.push(newUser);
      localStorage.setItem("sipantau_users", JSON.stringify(usersList));

      // Save active session state
      localStorage.setItem("sipantau_role", finalRole);
      localStorage.setItem("sipantau_name", signUpName);
      localStorage.setItem("sipantau_email", signUpEmail);

      setStatusMessage({
        type: "success",
        text: `Registrasi Berhasil! Selamat datang ${signUpName} (${finalRole === "mentor" ? "Mentor" : "Pemagang"}). Mengalihkan ke dashboard...`,
      });
      setTimeout(() => {
        router.push("/dashboard");
      }, 800);
    } else {
      if (!signInEmail || !signInPassword) {
        setStatusMessage({ type: "error", text: "Email dan Password wajib diisi!" });
        return;
      }
      if (!emailRegex.test(signInEmail)) {
        setStatusMessage({ type: "error", text: "Format email tidak valid!" });
        return;
      }
      if (signInPassword.length < 8) {
        setStatusMessage({ type: "error", text: "Password minimal harus 8 karakter!" });
        return;
      }

      // Lookup user in mock database
      const usersListStr = localStorage.getItem("sipantau_users") || "[]";
      const usersList = JSON.parse(usersListStr);
      const foundUser = usersList.find(u => u.email.toLowerCase() === signInEmail.toLowerCase());
      if (!foundUser) {
        setStatusMessage({ type: "error", text: "Email belum terdaftar! Silakan lakukan Sign Up terlebih dahulu." });
        return;
      }

      if (foundUser.password !== signInPassword) {
        setStatusMessage({ type: "error", text: "Password salah!" });
        return;
      }

      // Save active session state
      localStorage.setItem("sipantau_role", foundUser.role);
      localStorage.setItem("sipantau_name", foundUser.name);
      localStorage.setItem("sipantau_email", foundUser.email);

      setStatusMessage({
        type: "success",
        text: "Login Berhasil! Mengalihkan ke dashboard...",
      });
      setTimeout(() => {
        router.push("/dashboard");
      }, 800);
    }
  };

  return (
    <div className="w-full max-w-[480px] bg-white p-6 sm:p-10 flex flex-col justify-center rounded-[2.5rem] shadow-xl border border-slate-100/50">
      {/* Title */}
      <div className="text-center mb-8">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-800 tracking-tight flex items-center justify-center gap-2">
          Hi, Selamat Datang <span className="animate-bounce">👋</span>
        </h2>
      </div>

      {/* Tabs Selector */}
      <div className="bg-slate-100/80 p-1.5 rounded-full flex items-center mb-8 relative">
        <button
          type="button"
          onClick={() => {
            setIsSignUp(false);
            setStatusMessage(null);
          }}
          className={`flex-1 text-center py-2.5 rounded-full text-sm font-semibold transition-all duration-300 ${
            !isSignUp ? "bg-white text-slate-900 shadow-md" : "text-slate-500 hover:text-slate-800"
          }`}
        >
          Sign In
        </button>
        <button
          type="button"
          onClick={() => {
            setIsSignUp(true);
            setStatusMessage(null);
          }}
          className={`flex-1 text-center py-2.5 rounded-full text-sm font-semibold transition-all duration-300 ${
            isSignUp ? "bg-white text-slate-900 shadow-md" : "text-slate-500 hover:text-slate-800"
          }`}
        >
          Sign Up
        </button>
      </div>

      {/* Status Message */}
      {statusMessage && (
        <div
          className={`mb-6 p-4 rounded-xl text-sm flex items-start gap-2.5 transition-all duration-300 ${
            statusMessage.type === "success"
              ? "bg-emerald-50 text-emerald-800 border border-emerald-100"
              : "bg-rose-50 text-rose-800 border border-rose-100"
          }`}
        >
          <span className="text-base">{statusMessage.type === "success" ? "✅" : "⚠️"}</span>
          <span className="font-medium leading-relaxed">{statusMessage.text}</span>
        </div>
      )}

      {/* Authentication Form */}
      <form onSubmit={handleSubmit} className="space-y-5 transition-all duration-300">
        {!isSignUp ? (
          /* ==========================================
             SIGN IN FORM
             ========================================== */
          <div className="space-y-4">
            {/* Email Field */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-700 flex items-center gap-0.5">
                <span className="text-rose-500 font-bold">*</span> Alamat Email
              </label>
              <input
                type="email"
                value={signInEmail}
                onChange={(e) => setSignInEmail(e.target.value)}
                placeholder="nama@email.com"
                className="w-full border border-slate-200 bg-slate-50/30 rounded-full px-5 py-3 text-sm text-slate-800 placeholder-slate-400 outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-all duration-200"
                required
              />
            </div>

            {/* Password Field */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-700 flex items-center gap-0.5">
                <span className="text-rose-500 font-bold">*</span> Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={signInPassword}
                  onChange={(e) => setSignInPassword(e.target.value)}
                  placeholder="Masukkan password"
                  className="w-full border border-slate-200 bg-slate-50/30 rounded-full pl-5 pr-12 py-3 text-sm text-slate-800 placeholder-slate-400 outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-all duration-200"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors duration-150 p-1"
                >
                  {showPassword ? (
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>
          </div>
        ) : (
          /* ==========================================
             SIGN UP FORM
             ========================================== */
          <div className="space-y-4">
            {/* Nama Field */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-700 flex items-center gap-0.5">
                <span className="text-rose-500 font-bold">*</span> Nama
              </label>
              <input
                type="text"
                value={signUpName}
                onChange={(e) => setSignUpName(e.target.value)}
                placeholder="Masukkan nama lengkap"
                className="w-full border border-slate-200 bg-slate-50/30 rounded-full px-5 py-2.5 text-sm text-slate-800 placeholder-slate-400 outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-all duration-200"
                required
              />
            </div>

            {/* Email Field */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-700 flex items-center gap-0.5">
                <span className="text-rose-500 font-bold">*</span> Email
              </label>
              <input
                type="email"
                value={signUpEmail}
                onChange={(e) => setSignUpEmail(e.target.value)}
                placeholder="nama@email.com"
                className="w-full border border-slate-200 bg-slate-50/30 rounded-full px-5 py-2.5 text-sm text-slate-800 placeholder-slate-400 outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-all duration-200"
                required
              />
            </div>

            {/* Nomor Telepon Field */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-700 flex items-center gap-0.5">
                <span className="text-rose-500 font-bold">*</span> Nomor Telepon
              </label>
              <input
                type="tel"
                value={signUpPhone}
                onChange={(e) => {
                  const val = e.target.value;
                  setSignUpPhone(val);
                  if (val && !/^\d+$/.test(val)) {
                    setPhoneError("Nomor telepon hanya boleh berisi angka (tidak boleh huruf/simbol)!");
                  } else {
                    setPhoneError("");
                  }
                }}
                placeholder="Contoh: 08123456789"
                className="w-full border border-slate-200 bg-slate-50/30 rounded-full px-5 py-2.5 text-sm text-slate-800 placeholder-slate-400 outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-all duration-200"
                required
              />
              {phoneError && (
                <p className="text-[11px] text-rose-500 mt-1 font-semibold px-2">
                  {phoneError}
                </p>
              )}
            </div>

            {/* Alamat Rumah Field */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-700 flex items-center gap-0.5">
                <span className="text-rose-500 font-bold">*</span> Alamat Rumah
              </label>
              <input
                type="text"
                value={signUpAddress}
                onChange={(e) => setSignUpAddress(e.target.value)}
                placeholder="Masukkan alamat lengkap"
                className="w-full border border-slate-200 bg-slate-50/30 rounded-full px-5 py-2.5 text-sm text-slate-800 placeholder-slate-400 outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-all duration-200"
                required
              />
            </div>

            {/* Role Radio buttons */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-700 flex items-center gap-0.5">
                <span className="text-rose-500 font-bold">*</span> Role
              </label>
              <div className="flex items-center gap-6 mt-1">
                <label className="flex items-center gap-2 cursor-pointer group">
                  <input
                    type="radio"
                    name="signUpRole"
                    value="pemagang"
                    checked={signUpRole === "pemagang"}
                    onChange={() => setSignUpRole("pemagang")}
                    className="sr-only"
                  />
                  <div className={`w-4 h-4 rounded-full border flex items-center justify-center transition-all duration-200 ${
                    signUpRole === "pemagang" ? "border-violet-600 bg-white" : "border-slate-300 group-hover:border-slate-400"
                  }`}>
                    {signUpRole === "pemagang" && <div className="w-2 h-2 rounded-full bg-violet-600" />}
                  </div>
                  <span className="text-sm font-medium text-slate-700 group-hover:text-slate-900 transition-colors">Pemagang</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer group">
                  <input
                    type="radio"
                    name="signUpRole"
                    value="mentor"
                    checked={signUpRole === "mentor"}
                    onChange={() => setSignUpRole("mentor")}
                    className="sr-only"
                  />
                  <div className={`w-4 h-4 rounded-full border flex items-center justify-center transition-all duration-200 ${
                    signUpRole === "mentor" ? "border-violet-600 bg-white" : "border-slate-300 group-hover:border-slate-400"
                  }`}>
                    {signUpRole === "mentor" && <div className="w-2 h-2 rounded-full bg-violet-600" />}
                  </div>
                  <span className="text-sm font-medium text-slate-700 group-hover:text-slate-900 transition-colors">Mentor</span>
                </label>
              </div>
            </div>

            {/* Asal Instansi Field */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-700 flex items-center gap-0.5">
                <span className="text-rose-500 font-bold">*</span> Asal Instansi
              </label>
              <input
                type="text"
                value={signUpInstitution}
                onChange={(e) => setSignUpInstitution(e.target.value)}
                placeholder={signUpRole === "mentor" ? "Masukkan nama divisi / kantor BPS" : "Masukkan nama universitas / instansi"}
                className="w-full border border-slate-200 bg-slate-50/30 rounded-full px-5 py-2.5 text-sm text-slate-800 placeholder-slate-400 outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-all duration-200"
                required
              />
            </div>

            {/* Jurusan / Jabatan Field */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-700 flex items-center gap-0.5">
                <span className="text-rose-500 font-bold">*</span> {signUpRole === "mentor" ? "Jabatan" : "Jurusan"}
              </label>
              <input
                type="text"
                value={signUpMajor}
                onChange={(e) => setSignUpMajor(e.target.value)}
                placeholder={signUpRole === "mentor" ? "Contoh: Statistisi Ahli" : "Contoh: Teknik Komputer"}
                className="w-full border border-slate-200 bg-slate-50/30 rounded-full px-5 py-2.5 text-sm text-slate-800 placeholder-slate-400 outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-all duration-200"
                required
              />
            </div>

            {/* Password Field */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-700 flex items-center gap-0.5">
                <span className="text-rose-500 font-bold">*</span> Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={signUpPassword}
                  onChange={(e) => setSignUpPassword(e.target.value)}
                  placeholder="Masukkan password"
                  className="w-full border border-slate-200 bg-slate-50/30 rounded-full pl-5 pr-12 py-2.5 text-sm text-slate-800 placeholder-slate-400 outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-all duration-200"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors duration-150 p-1"
                >
                  {showPassword ? (
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-violet-600 hover:bg-violet-700 active:bg-violet-800 text-white font-bold py-3.5 px-6 rounded-full shadow-lg shadow-violet-100 hover:shadow-violet-200 transition-all duration-200 text-sm mt-4 cursor-pointer"
        >
          {isSignUp ? "Daftar" : "Log In"}
        </button>
      </form>
    </div>
  );
}
