export enum AgentType {
  ALPHA = "Alpha Agent",
  RISK = "Risk Agent",
  TREASURY = "Treasury Agent",
  EXECUTION = "Execution Agent",
  GOVERNANCE = "Governance Agent",
  REPUTATION = "Reputation Agent",
  LEARNING = "Learning Agent"
}

export interface AgentNFT {
  id: string; // Token ID e.g. #0804
  type: AgentType;
  name: string;
  avatar: string;
  level: number;
  xp: number;
  reputationScore: number; // 0-100
  historicalRoi: number; // %
  sharpeRatio: number;
  drawdown: number; // %
  assetsUnderManagement: number; // in USD or MNT
  achievements: string[];
  strategyProfile: string;
  riskMetrics: {
    volatility: number;
    beta: number;
    var: number; // Value at Risk %
  };
  rank: number; // Global leaderboard rank
}

export interface DecisionLog {
  id: string; // Decision Hash (hex)
  timestamp: string;
  blockNumber: number;
  agentId: string;
  agentType: AgentType;
  inputContext: string;
  reasoningSummary: string;
  executionData: {
    tokenIn: string;
    tokenOut: string;
    amountIn: number;
    amountOut: number;
    txHash: string;
  };
  outcomeMetrics: {
    volumeUSD: number;
    slippage: number;
    gasUsed: number;
  };
  confidenceScore: number; // 0-100
  pnl: number; // USD
  riskExposure: "Low" | "Medium" | "High";
  benchmarkRank: number;
}

export interface TuringCompetitor {
  id: string;
  name: string;
  type: "Human" | "Agent" | "Collective" | "Institutional";
  roi: number; // %
  sharpeRatio: number;
  drawdown: number; // %
  consistencyScore: number; // %
  adaptabilityScore: number; // 0-100
  transparencyScore: number; // 0-100
  rank: number;
}

export interface SmartMoneyFlow {
  id: string;
  token: "MNT" | "mETH" | "fBTC" | "USDY" | "USDe" | "MI4";
  fromAddress: string;
  toAddress: string;
  amountUSD: number;
  amountToken: number;
  category: "Whale" | "Fund" | "Agent Treasury" | "Exchange";
  timestamp: string;
  actionType: "Accumulating" | "Distributing" | "Yield Arbitrage" | "Liquidity Provisioning";
}

export interface AlloraForecast {
  target: string; // e.g. "MNT Direction (24h)", "mETH Yield"
  prediction: "Bullish" | "Bearish" | "Neutral" | number; // String outcome or percentage yield / direction
  probability: number; // confidence 0-100%
  timeframe: string; // "1h" | "24h" | "7d"
  lastUpdated: string;
}

export interface SocialNarrative {
  keyword: string;
  sentimentScore: number; // -1 to +1
  mentionVolume: number;
  growth24h: number; // %
  primarySource: "X (Twitter)" | "Discord" | "Telegram" | "Governance Forums";
  narrativeShift: "Exploding" | "Steady" | "Fading" | "Emerging";
}

export interface AgentMessage {
  id: string;
  sender: AgentType;
  senderName: string;
  message: string;
  timestamp: string;
  actionHash?: string;
  importance: "low" | "medium" | "high";
}
