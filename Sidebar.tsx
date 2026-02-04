
import React from 'react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab }) => {
  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊' },
    { id: 'sessions', label: 'Active Sessions', icon: '⚡' },
    { id: 'vault', label: 'Intel Vault', icon: '📂' },
    { id: 'settings', label: 'Config', icon: '⚙️' },
  ];

  return (
    <div className="w-64 h-full bg-[#0d0d10] border-r border-white/5 flex flex-col p-4">
      <div className="flex items-center gap-3 mb-10 px-2">
        <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center font-bold text-black">S</div>
        <h1 className="text-xl font-bold tracking-tight">SENTINEL</h1>
      </div>

      <nav className="flex-1 space-y-1">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all ${
              activeTab === tab.id 
                ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' 
                : 'text-zinc-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <span className="text-lg">{tab.icon}</span>
            <span className="font-medium">{tab.label}</span>
          </button>
        ))}
      </nav>

      <div className="mt-auto p-4 bg-zinc-900/50 rounded-xl border border-white/5">
        <p className="text-xs text-zinc-500 mb-1">System Status</p>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
          <span className="text-xs font-mono text-emerald-500">AGENT_ACTIVE</span>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
