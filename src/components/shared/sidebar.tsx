import React from 'react';

const Sidebar = () => {
  return (
    // Styling sidebar dengan Tailwind CSS
    <aside className="w-64 bg-gray-100 p-4 dark:bg-zinc-800">
      <h2 className="text-xl font-bold mb-4">WMS Menu</h2>
      <nav>
        <ul>
          <li className="mb-2">
            <a href="/" className="hover:text-blue-500">Dashboard</a>
          </li>
          <li className="mb-2">
            <a href="/inventory" className="hover:text-blue-500">Inventory</a>
          </li>
          <li className="mb-2">
            <a href="/orders" className="hover:text-blue-500">Orders</a>
          </li>
          <li className="mb-2">
            <a href="/reports" className="hover:text-blue-500">Reports</a>
          </li>
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;