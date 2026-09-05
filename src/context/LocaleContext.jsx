// src/context/LocaleContext.jsx
import React, { createContext, useContext } from "react";

const translations = {
  en: {
    title: "Attendance",
    session_not_found: "Session Not Found",
    session_not_found_msg: "The attendance session you are looking for does not exist.",
    attendance_closed: "Attendance Closed",
    closed_msg: "This session closed on {{date}} at {{time}}.",
    attendance_open: "Attendance Open",
    error_name: "Please enter your full name.",
    error_class: "Please select your class.",
    error_gender: "Please choose your gender.",
    full_name: "Full Name",
    enter_name_placeholder: "Enter your name",
    class: "Class",
    select_class: "Select class",
    gender: "Gender",
    male: "Male",
    female: "Female",
    recording_attendance: "Recording attendance…",
    submit_attendance: "Submit Attendance",
    attendance_already_recorded: "You have already checked in.",
    attendance_recorded: "Attendance Recorded",
    thank_you: "Thank you, {{name}}!",
    done: "Done",
  },
  id: {
    title: "Presensi",
    session_not_found: "Sesi Tidak Ditemukan",
    session_not_found_msg: "Sesi presensi yang Anda cari tidak ada.",
    attendance_closed: "Presensi Ditutup",
    closed_msg: "Sesi ini ditutup pada {{date}} pukul {{time}}.",
    attendance_open: "Presensi Dibuka",
    error_name: "Silakan masukkan nama lengkap.",
    error_class: "Silakan pilih kelas Anda.",
    error_gender: "Silakan pilih jenis kelamin.",
    full_name: "Nama Lengkap",
    enter_name_placeholder: "Masukkan nama Anda",
    class: "Kelas",
    select_class: "Pilih kelas",
    gender: "Jenis Kelamin",
    male: "Laki‑laki",
    female: "Perempuan",
    recording_attendance: "Merekam presensi…",
    submit_attendance: "Kirim Presensi",
    attendance_already_recorded: "Anda sudah melakukan presensi.",
    attendance_recorded: "Presensi Tercatat",
    thank_you: "Terima kasih, {{name}}!",
    done: "Selesai",
  },
};

const LocaleContext = createContext({
  t: (key, vars) => key,
});

export const LocaleProvider = ({ children, locale = "id" }) => {
  const t = (key, vars = {}) => {
    const tmpl = translations[locale][key] || key;
    return Object.entries(vars).reduce(
      (msg, [k, v]) => msg.replace(`{{${k}}}`, v),
      tmpl
    );
  };
  return (
    <LocaleContext.Provider value={{ t }}>
      {children}
    </LocaleContext.Provider>
  );
};

export const useLocale = () => useContext(LocaleContext);
