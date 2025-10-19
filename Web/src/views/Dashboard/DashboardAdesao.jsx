import React from 'react';
import Sidebar from '../../components/SideBarr';
import DashboardAdesao from '../../components/chat/DashboardAdesao';

export default function DashboardAdesaoPage() {
  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      
      <div className="flex-1 flex flex-col transition-all duration-300">
        <div className="h-20 bg-gradient-to-r from-blue-600 to-blue-700 shadow flex items-center justify-between px-6 sticky top-0 z-10">
          <h1 className="text-2xl font-bold text-white">Dashboard de Adesão</h1>
        </div>
        
        <div className="flex-1 ml-20 lg:ml-60 overflow-y-auto p-6">
          <div className="max-w-7xl mx-auto">
            <DashboardAdesao />
          </div>
        </div>
      </div>
    </div>
  );
}