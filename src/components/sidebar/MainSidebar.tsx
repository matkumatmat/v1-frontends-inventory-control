import React from "react";
import { SidebarNav } from "./SidebarNav";

const SidebarNav: FC<SidebarNavProps> = ({ role, currentPage, setCurrentPage, className }) => {
  // PENTING: Props seperti 'currentPage' tidak diteruskan ke div ini.
  // Hindari menggunakan <div {...props}> di sini.
  <div className="flex flex-col h-full bg-white dark:bg-slate-950">
    <div className="p-4 border-b">
      <a href="#" className="flex items-center space-x-2">
        <svg className="w-8 h-8 text-indigo-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
        <span className="text-xl font-bold text-slate-800 dark:text-white">AppRouter</span>
      </a>
    </div>
    <div className="flex-1 overflow-y-auto">
      <SidebarNav role={role} currentPage={currentPage} setCurrentPage={setCurrentPage} />
    </div>
    <div className="p-4 border-t">
      <p className="text-sm text-slate-500">© 2025 Aplikasi Keren</p>
    </div>
  </div>
);