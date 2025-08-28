import React, { useState } from 'react';
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

export const navConfig = {
  admin: [
    { href: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { 
      label: 'Manajemen', 
      icon: Users,
      submenu: [
        { href: 'manage-users', label: 'Kelola Pengguna', icon: Users },
        { href: 'manage-content', label: 'Kelola Konten', icon: FileCode },
      ]
    },
    { href: 'settings', label: 'Settings', icon: Settings },
  ],
  developer: [
    { href: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: 'config', label: 'Configuration', icon: Settings },
    { href: 'deploy-history', label: 'Deploy History', icon: History },
  ],
  guest: [
    { href: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: 'history', label: 'History', icon: History },
  ],
};

