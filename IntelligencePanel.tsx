
import React from 'react';
import { ScamIntelligence } from '../types';

interface IntelligencePanelProps {
  intelligence: ScamIntelligence;
}

const IntelligencePanel: React.FC<IntelligencePanelProps> = ({ intelligence }) => {
  const sections = [
    { title: 'UPI IDs', data: intelligence.upiIds, icon: '🆔' },
    { title: 'Bank Accounts', data: intelligence.bankAccounts, icon: '🏦' },
    { title: 'Phishing URLs', data: intelligence.phishingUrls, icon: '🔗' },
    { title: 'Contacts', data: intelligence.phoneNumbers, icon: '📱' },
  ];

  const hasData = sections.some(s => s.data.length > 0);

  return (
    <div className="w-80 h-full flex flex-col gap-4">
      <div className="bg-[#0d0d10] border border-white/5 rounded-2xl p-5 flex flex-col h-full overflow-hidden">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-bold text-sm tracking-tight">REAL-TIME INTEL</h3>
          <div className="px-2 py-0.5 rounded text-[10px] bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">LIVE</div>
        </div>

        <div className="space-y-6 overflow-y-auto flex-1 pr-1">
          {!hasData && (
            <div className="text-center py-10 opacity-30 italic text-sm">
              Waiting for extraction...
            </div>
          )}
          
          {sections.map(section => (
            section.data.length > 0 && (
              <div key={section.title}>
                <div className="flex items-center gap-2 mb-2 text-zinc-500 text-xs font-bold uppercase tracking-widest">
                  <span>{section.icon}</span>
                  {section.title}
                </div>
                <div className="space-y-1.5">
                  {section.data.map((item, idx) => (
                    <div 
                      key={idx} 
                      className="bg-[#16161a] border border-white/5 p-2 rounded-lg text-xs font-mono break-all text-emerald-400/90 group relative cursor-pointer hover:border-emerald-500/30 transition-all"
                    >
                      {item}
                      <div className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 transition-all">📋</div>
                    </div>
                  ))}
                </div>
              </div>
            )
          ))}
          
          {intelligence.scamType && (
            <div className="pt-4 border-t border-white/5">
              <span className="text-xs text-zinc-500">Detected Category</span>
              <p className="text-sm font-bold text-zinc-200 mt-1">{intelligence.scamType}</p>
            </div>
          )}
        </div>

        <button className="w-full mt-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-xl text-xs font-bold transition-all">
          EXPORT TO REPORT
        </button>
      </div>
    </div>
  );
};

export default IntelligencePanel;
