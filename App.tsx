
import React, { useState, useCallback, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import ChatInterface from './components/ChatInterface';
import IntelligencePanel from './components/IntelligencePanel';
import { HoneyPotAI } from './services/geminiService';
import { HoneyPotSession, Message, MessageRole, ScamIntelligence } from './types';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [loading, setLoading] = useState(false);
  
  const [session, setSession] = useState<HoneyPotSession>({
    id: crypto.randomUUID(),
    status: 'idle',
    isScam: false,
    confidence: 0,
    messages: [],
    intelligence: {
      bankAccounts: [],
      upiIds: [],
      phishingUrls: [],
      phoneNumbers: [],
      scamType: ''
    },
    persona: '',
    startTime: Date.now(),
    lastUpdateTime: Date.now()
  });

  const [stats, setStats] = useState({
    totalDetected: 142,
    intelExtracted: 89,
    activeAgents: 3
  });

  const handleIncomingMessage = async (text: string) => {
    const newMessage: Message = {
      id: crypto.randomUUID(),
      role: MessageRole.SCAMMER,
      text,
      timestamp: Date.now()
    };

    setSession(prev => ({
      ...prev,
      messages: [...prev.messages, newMessage],
      status: prev.status === 'idle' ? 'detecting' : prev.status,
      lastUpdateTime: Date.now()
    }));

    setLoading(true);

    try {
      const updatedMessages = [...session.messages, newMessage];
      
      // Step 1: Detect Scam if not already engaged
      if (session.status === 'idle' || session.status === 'detecting') {
        const detection = await HoneyPotAI.detectScam(updatedMessages);
        if (detection.isScam) {
          setSession(prev => ({
            ...prev,
            isScam: true,
            confidence: detection.confidence,
            status: 'engaging',
            persona: detection.suggestedPersona
          }));
          
          // Trigger first agent response
          const agentText = await HoneyPotAI.getAgentResponse(updatedMessages, detection.suggestedPersona);
          addAgentMessage(agentText);
        } else {
          // Normal chat (could still be a scam, keep monitoring)
          setSession(prev => ({ ...prev, status: 'detecting' }));
        }
      } else if (session.status === 'engaging') {
        // Step 2: Continuous Engagement
        const agentText = await HoneyPotAI.getAgentResponse(updatedMessages, session.persona);
        addAgentMessage(agentText);
        
        // Step 3: Extract Intel periodically or after every message
        const intel = await HoneyPotAI.extractIntelligence([...updatedMessages]);
        setSession(prev => ({
          ...prev,
          intelligence: {
            ...prev.intelligence,
            bankAccounts: Array.from(new Set([...prev.intelligence.bankAccounts, ...intel.bankAccounts])),
            upiIds: Array.from(new Set([...prev.intelligence.upiIds, ...intel.upiIds])),
            phishingUrls: Array.from(new Set([...prev.intelligence.phishingUrls, ...intel.phishingUrls])),
            phoneNumbers: Array.from(new Set([...prev.intelligence.phoneNumbers, ...intel.phoneNumbers])),
            scamType: intel.scamType || prev.intelligence.scamType
          }
        }));
      }
    } catch (error) {
      console.error("Workflow error:", error);
    } finally {
      setLoading(false);
    }
  };

  const addAgentMessage = (text: string) => {
    const agentMsg: Message = {
      id: crypto.randomUUID(),
      role: MessageRole.AGENT,
      text,
      timestamp: Date.now()
    };
    setSession(prev => ({
      ...prev,
      messages: [...prev.messages, agentMsg],
      lastUpdateTime: Date.now()
    }));
  };

  const renderDashboard = () => (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: 'SCAMS NEUTRALIZED', value: stats.totalDetected, color: 'emerald' },
          { label: 'INTEL POINTS COLLECTED', value: stats.intelExtracted, color: 'blue' },
          { label: 'ACTIVE DEPLOYMENTS', value: stats.activeAgents, color: 'amber' }
        ].map((stat, i) => (
          <div key={i} className="bg-[#0d0d10] border border-white/5 p-6 rounded-2xl">
            <p className="text-xs font-bold text-zinc-500 tracking-widest mb-2 uppercase">{stat.label}</p>
            <div className="flex items-baseline gap-2">
              <span className={`text-4xl font-bold font-mono text-${stat.color}-500`}>{stat.value}</span>
              <span className="text-emerald-500 text-xs font-bold">↑ 12%</span>
            </div>
          </div>
        ))}
      </div>

      <div className="flex gap-6 h-[600px]">
        <div className="flex-1">
          <ChatInterface 
            session={session} 
            onSendMessage={handleIncomingMessage}
            isLoading={loading}
          />
        </div>
        <IntelligencePanel intelligence={session.intelligence} />
      </div>
    </div>
  );

  return (
    <div className="flex h-screen w-full bg-[#0a0a0c] overflow-hidden text-zinc-200">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <main className="flex-1 overflow-y-auto p-8">
        <header className="flex justify-between items-center mb-10">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Agent Command Center</h2>
            <p className="text-zinc-500 text-sm">Monitoring simulated Mock Scammer API streams</p>
          </div>
          <div className="flex gap-3">
            <div className="px-4 py-2 bg-zinc-900 border border-white/5 rounded-xl flex items-center gap-2">
              <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
              <span className="text-xs font-bold font-mono">ENCRYPTION_ACTIVE</span>
            </div>
          </div>
        </header>

        {activeTab === 'dashboard' ? renderDashboard() : (
          <div className="h-full flex items-center justify-center text-zinc-500 border border-dashed border-white/10 rounded-2xl bg-zinc-900/10">
            <p className="text-lg">Module "{activeTab}" is initializing...</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default App;
