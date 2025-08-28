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

// ===================================================================================
// FILE: /lib/utils.ts
// Deskripsi: Fungsi helper standar dari shadcn/ui untuk menggabungkan class Tailwind.
// ===================================================================================
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}