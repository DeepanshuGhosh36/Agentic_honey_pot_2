
export enum MessageRole {
  SCAMMER = 'scammer',
  AGENT = 'agent',
  SYSTEM = 'system'
}

export interface Message {
  id: string;
  role: MessageRole;
  text: string;
  timestamp: number;
}

export interface ScamIntelligence {
  bankAccounts: string[];
  upiIds: string[];
  phishingUrls: string[];
  phoneNumbers: string[];
  scamType: string;
}

export interface HoneyPotSession {
  id: string;
  status: 'idle' | 'detecting' | 'engaging' | 'completed';
  isScam: boolean;
  confidence: number;
  messages: Message[];
  intelligence: ScamIntelligence;
  persona: string;
  startTime: number;
  lastUpdateTime: number;
}

export interface DetectionResult {
  isScam: boolean;
  confidence: number;
  reason: string;
  suggestedPersona: string;
}
