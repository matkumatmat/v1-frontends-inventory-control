import { NavItem } from '@/types';

//Info: The following data is used for the sidebar navigation and Cmd K bar.
export const navItems: NavItem[] = [
  {
    title: 'Dashboard',
    url: '/dashboard/overview',
    icon: 'dashboard',
    isActive: false,
    shortcut: ['d', 'd'],
    items: [] // Empty array as there are no child items for Dashboard
  },
  {
    title: 'Sales',
    url: '/',
    icon: 'product',
    shortcut: ['p', 'p'],
    isActive: false,
    items: [
      {
        title: 'Sales Order',
        url: '/inbound',
        icon: 'userPen',
        shortcut: ['m', 'm']
      },
      {
        title: 'Packing Slip',
        url: '/inbound',
        icon: 'userPen',
        shortcut: ['m', 'm']
      },
      {
        title: 'Customer',
        url: '/reports',
        icon: 'userPen',
        shortcut: ['m', 'm']
      },
    ] // No child items
  },
  {
    title: 'Product',
    url: '/dashboard/product',
    icon: 'product',
    shortcut: ['p', 'p'],
    isActive: false,
    items: [
      {
        title: 'Inbound',
        url: '/inbound',
        icon: 'userPen',
        shortcut: ['m', 'm']
      },
      {
        title: 'Outbound',
        url: '/inbound',
        icon: 'userPen',
        shortcut: ['m', 'm']
      },
      {
        title: 'Reports',
        url: '/reports',
        icon: 'userPen',
        shortcut: ['m', 'm']
      },
    ] // No child items
  },
  {
    title: 'Shipment',
    url: '#', // Placeholder as there is no direct link for the parent
    icon: 'billing',
    isActive: true,

    items: [
      {
        title: 'Shipping Plan',
        url: '/dashboard/profile',
        icon: 'userPen',
        shortcut: ['m', 'm']
      },
      {
        title: 'Shipment',
        shortcut: ['l', 'l'],
        url: '/',
        icon: 'login'
      },
      {
        title: 'Packing',
        shortcut: ['l', 'l'],
        url: '/',
        icon: 'login'
      },
    ]
  },
  {
    title: 'Document',
    url: '#', // Placeholder as there is no direct link for the parent
    icon: 'billing',
    isActive: true,

    items: [
      {
        title: 'Import',
        url: '/dashboard/profile',
        icon: 'userPen',
        shortcut: ['m', 'm']
      },
      {
        title: 'Export',
        shortcut: ['l', 'l'],
        url: '/',
        icon: 'login'
      },
      {
        title: 'Dashboard',
        shortcut: ['l', 'l'],
        url: '/dashboard/document',
        icon: 'login'
      }
    ]
  },
  {
    title: 'User',
    url: '#', // Placeholder as there is no direct link for the parent
    icon: 'billing',
    isActive: true,

    items: [
      {
        title: 'Employee Management',
        url: '/dashboard/profile',
        icon: 'userPen',
        shortcut: ['m', 'm']
      },
      {
        title: 'Overtime management',
        shortcut: ['l', 'l'],
        url: '/',
        icon: 'login'
      }
    ]
  },
  {
    title: 'Kanban',
    url: '/dashboard/kanban',
    icon: 'kanban',
    shortcut: ['k', 'k'],
    isActive: false,
    items: [] // No child items
  },
  {
    title: 'Label',
    url: 'dashboard/print/label',
    icon: 'kanban',
    shortcut: ['k', 'k'],
    isActive: false,
    items: [] // No child items
  }
];
