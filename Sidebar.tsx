import React from 'react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Command Center', icon: '⚡' },
    { id: 'intel', label: 'Intel Database', icon: '' },
    { id: 'network', label: 'Agent Network', icon: '' },
    { id: 'settings', label: 'System Config', icon: '⚙️' },
  ];

  return (
    <aside className="w-64 bg-[#0d0d10] border-r border-white/5 flex flex-col">
      <div className="p-6">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center font-bold text-white shadow-lg shadow-emerald-900/20">
            S
          </div>
          <h1 className="font-bold text-xl tracking-tight">Sentinel</h1>
        </div>

        <nav className="space-y-2">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                activeTab === item.id
                  ? 'bg-emerald-600/10 text-emerald-400 border border-emerald-500/20'
                  : 'text-zinc-500 hover:text-zinc-300 hover:bg-white/5'
              }`}
            >
              <span>{item.icon}</span>
              {item.label}
            </button>
          ))}
        </nav>
      </div>

      <div className="mt-auto p-6 border-t border-white/5">
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
          <span className="text-xs font-mono text-zinc-500">SYSTEM ONLINE</span>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;

export default Sidebar;
