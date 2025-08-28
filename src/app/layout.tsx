'use client'
import React from "react";
import { useState } from "react";
import {navConfig} from '@/config/navigation'
import { SidebarContent } from "@/components/ui/sidebar";
import {cn} from '@/lib/utils'
import { PageContainer } from "@/components/layout/PageContainer";
import { 
  Home, 
  LayoutDashboard, 
  Settings, 
  Users, 
  FileCode, 
  History, 
  ChevronDown, 
  Menu 
} from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export default function App() {
  const [currentRole, setCurrentRole] = useState('admin');
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  const handleSetCurrentPage = (page) => {
    setCurrentPage(page);
    setIsSheetOpen(false); // Tutup sheet setelah navigasi
  };

  const pageTitle = navConfig[currentRole]
    .flatMap(item => item.submenu ? [item, ...item.submenu] : [item])
    .find(item => item.href === currentPage)?.label || 'Halaman Tidak Ditemukan';

  return (
    <div className="bg-slate-50 font-sans text-slate-900">
      <div className="flex min-h-screen">
        {/* Sidebar untuk Desktop */}
        <aside className="hidden md:block w-64 border-r flex-shrink-0">
          <SidebarContent role={currentRole} currentPage={currentPage} setCurrentPage={handleSetCurrentPage} />
        </aside>

        <div className="flex-1 flex flex-col w-full overflow-hidden">
          <header className="bg-white shadow-sm p-4 flex items-center sticky top-0 z-10">
            {/* Tombol Sheet untuk Mobile */}
            <div className="md:hidden mr-4">
               <button onClick={() => setIsSheetOpen(true)} className="p-2 rounded-md hover:bg-slate-100">
                  <Menu className="h-6 w-6" />
               </button>
            </div>
            
            <div className="flex-1">
              <h2 className="text-xl font-semibold hidden md:block">{pageTitle}</h2>
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium text-slate-600">Ganti Role:</span>
                {['admin', 'developer', 'guest'].map(role => (
                  <button key={role} onClick={() => { setCurrentRole(role); setCurrentPage('dashboard'); }} className={cn("px-3 py-1 text-sm rounded-full transition-colors", currentRole === role ? 'bg-slate-900 text-white' : 'bg-slate-200 text-slate-700 hover:bg-slate-300')}>
                    {role.charAt(0).toUpperCase() + role.slice(1)}
                  </button>
                ))}
              </div>
            </div>
          </header>
          
          {/* Konten utama sekarang dibungkus dengan PageContainer */}
          <PageContainer>
            <div>
              <h1 className="text-4xl font-extrabold text-slate-800 mb-4">{pageTitle}</h1>
              <p className="text-lg text-slate-600">{`Ini adalah konten untuk halaman ${pageTitle} dengan role ${currentRole}.`}</p>
              {/* Tambahkan konten ekstra untuk mengetes scroll */}
              <div className="mt-8 space-y-4 text-slate-500">
                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
                <p>Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt.</p>
                <p>Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur?</p>
                <p>Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur? At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga.</p>
              </div>
            </div>
          </PageContainer>
        </div>
      </div>
      
      {/* Komponen Sheet untuk Sidebar Mobile */}
      {isSheetOpen && (
        <>
          <div className="fixed inset-0 bg-black/60 z-40 md:hidden" onClick={() => setIsSheetOpen(false)}></div>
          <div className={cn(
            "fixed top-0 left-0 h-full w-64 bg-white z-50 transform transition-transform duration-300 ease-in-out md:hidden",
            isSheetOpen ? "translate-x-0" : "-translate-x-full"
          )}>
            <SidebarContent role={currentRole} currentPage={currentPage} setCurrentPage={handleSetCurrentPage} />
          </div>
        </>
      )}
    </div>
  );
}
