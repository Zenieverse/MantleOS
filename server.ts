import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini SDK with telemetry headers
const apiKey = process.env.GEMINI_API_KEY;
let ai: GoogleGenAI | null = null;

if (apiKey && apiKey !== "MY_GEMINI_API_KEY") {
  try {
    ai = new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
    console.log("MantleOS server initialized Gemini SDK successfully.");
  } catch (err) {
    console.error("Failed to initialize GoogleGenAI:", err);
  }
} else {
  console.log("No valid GEMINI_API_KEY found, server will run in autonomous simulation mode.");
}

// In-memory mock database for dynamic tracking during session
const state = {
  depositedAmount: 0,
  userBalanceMNT: 5000,
  activeNftReputation: 82,
  activeNftLevel: 4,
  activeNftXp: 450,
  historicalRoi: 14.8,
  achievements: ["Genesis Allocator", "Slippage Ninja", "Mantle Pioneer"],
  decisionLogs: [
    {
      id: "0x7c94a5392d4b998ae61be6858cd3484f42febb3a4b7da3df235777bdac4fe8b1",
      timestamp: new Date(Date.now() - 600000).toISOString(),
      blockNumber: 14892041,
      agentId: "NFT-0804",
      agentType: "Alpha Agent",
      inputContext: "MNT/mETH Liquidity pool pricing gap identified on Cleo Finance.",
      reasoningSummary: "Analyzed liquidity distribution profiles. Detected localized 1.8% pricing discrepancy in mETH pool. Routing transaction through optimization router to capture yield arbitrage.",
      executionData: {
        tokenIn: "MNT",
        tokenOut: "mETH",
        amountIn: 2500,
        amountOut: 2542,
        txHash: "0x7c94a5392d4b998ae61be6858cd3484f42febb3a4b7da3df235777bdac4fe8b1",
      },
      outcomeMetrics: {
        volumeUSD: 3120,
        slippage: 0.04,
        gasUsed: 142050,
      },
      confidenceScore: 94,
      pnl: 52.4,
      riskExposure: "Low" as const,
      benchmarkRank: 3,
    },
    {
      id: "0x3e4fa83f2a1b948ac61bc6d58cd3044f12feba3a3b3da3df2354a7bdac3fe9a2",
      timestamp: new Date(Date.now() - 3600000).toISOString(),
      blockNumber: 14891823,
      agentId: "NFT-0804",
      agentType: "Treasury Agent",
      inputContext: "USDY Yield Rebalancing event triggered on Ondo Finance.",
      reasoningSummary: "USDY dynamic yield increased to 5.15% APY relative to alternative stable products. Allocating $4,000 USD from USDe reserves to maximize risk-adjusted index return.",
      executionData: {
        tokenIn: "USDe",
        tokenOut: "USDY",
        amountIn: 4000,
        amountOut: 4015,
        txHash: "0x3e4fa83f2a1b948ac61bc6d58cd3044f12feba3a3b3da3df2354a7bdac3fe9a2",
      },
      outcomeMetrics: {
        volumeUSD: 4000,
        slippage: 0.01,
        gasUsed: 98120,
      },
      confidenceScore: 98,
      pnl: 15.0,
      riskExposure: "Low" as const,
      benchmarkRank: 1,
    },
    {
      id: "0x9d3da43f1a2b948ac51bc6d32cd6044f52feba3a3b9da3df2321a7bdac3fe8d3",
      timestamp: new Date(Date.now() - 14400000).toISOString(),
      blockNumber: 14891102,
      agentId: "NFT-0804",
      agentType: "Risk Agent",
      inputContext: "Dynamic leverage limit reduction on fBTC hedging protocol.",
      reasoningSummary: "Volatility threshold spiked above 45% for BTC indexes. Deployed automated execution routines to scale down leverage by 15% to maintain risk criteria and prevent flash liqudations.",
      executionData: {
        tokenIn: "fBTC",
        tokenOut: "USDT",
        amountIn: 0.5,
        amountOut: 32650,
        txHash: "0x9d3da43f1a2b948ac51bc6d32cd6044f52feba3a3b9da3df2321a7bdac3fe8d3",
      },
      outcomeMetrics: {
        volumeUSD: 32650,
        slippage: 0.12,
        gasUsed: 175300,
      },
      confidenceScore: 88,
      pnl: -42.0,
      riskExposure: "Medium" as const,
      benchmarkRank: 5,
    }
  ],
  turingLeaderboard: [
    { id: "1", name: "MantleOS Master Collective", type: "Collective", roi: 34.2, sharpeRatio: 2.85, drawdown: 4.2, consistencyScore: 92, adaptabilityScore: 95, transparencyScore: 100, rank: 1 },
    { id: "2", name: "Alpha_Agent_v2.5", type: "Agent", roi: 29.8, sharpeRatio: 2.51, drawdown: 3.8, consistencyScore: 89, adaptabilityScore: 94, transparencyScore: 98, rank: 2 },
    { id: "3", name: "Nansen Smart Whales Index", type: "Institutional", roi: 24.5, sharpeRatio: 2.15, drawdown: 6.5, consistencyScore: 85, adaptabilityScore: 80, transparencyScore: 75, rank: 3 },
    { id: "4", name: "MantleOS Treasury-Shield", type: "Agent", roi: 18.2, sharpeRatio: 3.12, drawdown: 1.8, consistencyScore: 96, adaptabilityScore: 88, transparencyScore: 100, rank: 4 },
    { id: "u1", name: "You (Human Trader)", type: "Human", roi: 15.4, sharpeRatio: 1.45, drawdown: 12.4, consistencyScore: 68, adaptabilityScore: 75, transparencyScore: 40, rank: 5 },
    { id: "5", name: "TradFi Multi-Strategy Fund", type: "Institutional", roi: 12.1, sharpeRatio: 1.22, drawdown: 9.8, consistencyScore: 72, adaptabilityScore: 60, transparencyScore: 20, rank: 6 },
    { id: "6", name: "Virtuals_Mnt_Bot", type: "Agent", roi: 11.8, sharpeRatio: 1.35, drawdown: 11.5, consistencyScore: 78, adaptabilityScore: 81, transparencyScore: 92, rank: 7 },
  ]
};

// API: Health Check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", time: new Date().toISOString() });
});

// API: Fetch State
app.get("/api/state", (req, res) => {
  res.json(state);
});

// API: Register Deposit Mock
app.post("/api/deposit", (req, res) => {
  const { amount } = req.body;
  const depositAmount = parseFloat(amount) || 100;
  
  state.depositedAmount += depositAmount;
  state.activeNftReputation = Math.min(100, state.activeNftReputation + 2);
  state.activeNftXp += 75;
  if (state.activeNftXp >= 1000) {
    state.activeNftLevel += 1;
    state.activeNftXp -= 1000;
    state.achievements.push(`Level ${state.activeNftLevel} Achieved`);
  }

  // Create a new on-chain decision log
  const txId = "0x" + Array.from({length: 64}, () => Math.floor(Math.random()*16).toString(16)).join("");
  const newDecision = {
    id: txId,
    timestamp: new Date().toISOString(),
    blockNumber: 14892042 + state.decisionLogs.length,
    agentId: "NFT-0804",
    agentType: "Treasury Agent",
    inputContext: `Fresh user deposit of $${depositAmount} MNT received. Scaling active farming indexes.`,
    reasoningSummary: `Allocating $${depositAmount} proportionally to maximize Sharpe Ratio under current market regimes. Strategy executed instantly over Mantle liquidity layer.`,
    executionData: {
      tokenIn: "MNT",
      tokenOut: "mETH",
      amountIn: depositAmount,
      amountOut: Number((depositAmount * 0.992).toFixed(4)),
      txHash: txId
    },
    outcomeMetrics: {
      volumeUSD: depositAmount,
      slippage: 0.02,
      gasUsed: 124500
    },
    confidenceScore: 96,
    pnl: Number((depositAmount * 0.015).toFixed(2)),
    riskExposure: "Low" as const,
    benchmarkRank: 2
  };

  state.decisionLogs.unshift(newDecision);

  // Update dynamic leaderboard
  const userRankIndex = state.turingLeaderboard.findIndex(x => x.id === "u1");
  if (userRankIndex !== -1) {
    state.turingLeaderboard[userRankIndex].roi += 0.5;
    state.turingLeaderboard[userRankIndex].consistencyScore = Math.min(100, state.turingLeaderboard[userRankIndex].consistencyScore + 3);
    state.turingLeaderboard[userRankIndex].adaptabilityScore = Math.min(100, state.turingLeaderboard[userRankIndex].adaptabilityScore + 2);
  }

  res.json({
    success: true,
    newBalance: state.userBalanceMNT,
    totalDeposited: state.depositedAmount,
    activeNftReputation: state.activeNftReputation,
    activeNftXp: state.activeNftXp,
    activeNftLevel: state.activeNftLevel,
    newDecision
  });
});

// API: Call Gemini to produce real agent debate and plan
app.post("/api/gemini/orchestrate", async (req, res) => {
  const { prompt } = req.body;
  if (!prompt || typeof prompt !== "string") {
    return res.status(400).json({ error: "Missing or invalid prompt string." });
  }

  const defaultSchema = {
    planTitle: "Conservative Stable Yield Optimization",
    targetRisk: "Low",
    allocation: { MNT: 35, mETH: 25, fBTC: 15, USDY: 15, USDe: 10 },
    estimatedRoi: 14.2,
    safetyRating: "A+",
    reasoning: "A diversified, low-volatility allocation balanced across Mantle's leading assets.",
    agentsDebate: [
      {
        id: "1",
        sender: "Alpha Agent",
        senderName: "Aetheria-Alpha",
        message: "Yield gap discovered on Ondo USDY at 5.15% APY and mETH at 4.2% APY. Recommend heavy initial stable allocation to capture low-beta yield.",
        importance: "high",
        timestamp: new Date().toISOString()
      },
      {
        id: "2",
        sender: "Risk Agent",
        senderName: "Boreas-Risk",
        message: "Stable yields are attractive. Ensure 15% fBTC hedge is deployed continuously to mitigate downside variance on the MNT exposure.",
        importance: "medium",
        timestamp: new Date().toISOString()
      },
      {
        id: "3",
        sender: "Treasury Agent",
        senderName: "Chronos-Treasury",
        message: "Executing. Routing 35% MNT, 25% mETH, 15% fBTC, 15% USDY, and 10% USDe routes through Merchant Moe and Ondo markets.",
        importance: "high",
        timestamp: new Date().toISOString()
      }
    ],
    actions: [
      { step: "Stake MNT on mETH Liquid Staking Protocol", expectedYield: "4.2% APY", confidence: 98 },
      { step: "Deploy 15% collateral to Ondo USDY Yield Vault", expectedYield: "5.15% APY", confidence: 95 },
      { step: "Establish automated fBTC-USDT dynamic hedge", expectedYield: "Risk Containment", confidence: 90 }
    ]
  };

  if (!ai) {
    // If no API key, return a beautifully shaped simulated simulation
    console.log("Simulating response without API key...");
    const randomizedObj = { ...defaultSchema };
    if (prompt.toLowerCase().includes("aggresive") || prompt.toLowerCase().includes("high risk") || prompt.toLowerCase().includes("maximize")) {
      randomizedObj.planTitle = "Hyper-Growth Leverage Yield Harvesting";
      randomizedObj.targetRisk = "High";
      randomizedObj.allocation = { MNT: 50, mETH: 30, fBTC: 10, USDY: 5, USDe: 5 };
      randomizedObj.estimatedRoi = 31.8;
      randomizedObj.safetyRating = "B-";
      randomizedObj.reasoning = "Aggressive leverage allocation optimized for high-growth on-chain pools and automated liquid staking arbitrage.";
      randomizedObj.agentsDebate[0].message = `Aggressive yields detected in MNT/mETH Pools. Let's maximize output of alpha vaults! Input query: '${prompt}'`;
      randomizedObj.agentsDebate[1].message = "Warning! Leverage thresholds exceed standard criteria. Liquidation risk elevated by 15% relative to the standard regime.";
    } else if (prompt.toLowerCase().includes("medium") || prompt.toLowerCase().includes("moderate")) {
      randomizedObj.planTitle = "Balanced Ecosystem Yield Harvest";
      randomizedObj.targetRisk = "Medium";
      randomizedObj.allocation = { MNT: 40, mETH: 25, fBTC: 15, USDY: 10, USDe: 10 };
      randomizedObj.estimatedRoi = 19.5;
      randomizedObj.safetyRating = "A-";
      randomizedObj.reasoning = "A balanced layout utilizing liquid staked ETH and USDY arbitrage pools, providing excellent capital efficiency.";
    } else {
      randomizedObj.planTitle = `Auto-Strategizer: '${prompt.substring(0, 40)}...'`;
    }
    return res.json(randomizedObj);
  }

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: `You are MantleOS, an Autonomous Wealth Operating System. The user submitted this goal: "${prompt}".
As the AI core, you orchestrate and coordinate a debate among 3 specialized agents: Alpha Agent, Risk Agent, and Treasury Agent.
Generate a cohesive on-chain wealth-management plan in valid, unformatted JSON. Do not wrap code in markdown.
Return strict JSON that matches this exact schema structure:
{
  "planTitle": "string",
  "targetRisk": "Low" | "Medium" | "High",
  "allocation": {
    "MNT": number,
    "mETH": number,
    "fBTC": number,
    "USDY": number,
    "USDe": number
  },
  "estimatedRoi": number (as standard percentage e.g. 14.5),
  "safetyRating": "A+" | "A" | "A-" | "B+" | "B" | "C",
  "reasoning": "string overview",
  "agentsDebate": [
    {
      "id": "1",
      "sender": "Alpha Agent",
      "senderName": "Aetheria-Alpha",
      "message": "string debate contribution discussing specific yield discovery",
      "importance": "high" | "medium" | "low",
      "timestamp": "string"
    },
    {
      "id": "2",
      "sender": "Risk Agent",
      "senderName": "Boreas-Risk",
      "message": "string risk assessment response analyzing exposure metrics and collateral limits",
      "importance": "high" | "medium" | "low",
      "timestamp": "string"
    },
    {
      "id": "3",
      "sender": "Treasury Agent",
      "senderName": "Chronos-Treasury",
      "message": "string action item reallocating capital across fBTC, USDY, USDe, MNT, and mETH on Mantle",
      "importance": "high" | "medium" | "low",
      "timestamp": "string"
    }
  ],
  "actions": [
    {
      "step": "string step 1 action",
      "expectedYield": "string (e.g. 5% APY)",
      "confidence": number (rating 0-100)
    }
  ]
}`,
      config: {
        responseMimeType: "application/json",
      },
    });

    const parsed = JSON.parse(response.text?.trim() || "{}");
    res.json(parsed);
  } catch (error: any) {
    console.error("Gemini endpoint error:", error);
    res.status(500).json({ error: error.message || "Failed to query Gemini API", fallback: defaultSchema });
  }
});

// Seed Static Feeds for Nansen, Allora, and Elfa alignment
app.get("/api/intelligence/nansen", (req, res) => {
  res.json([
    { id: "s1", token: "MNT", fromAddress: "0x12ea...9a3a", toAddress: "MantleOS Treasury-Shield", amountUSD: 450000, amountToken: 520000, category: "Whale" },
    { id: "s2", token: "mETH", fromAddress: "Lido Staking", toAddress: "0xf9b4...291a", amountUSD: 890000, amountToken: 245, category: "Fund" },
    { id: "s3", token: "USDY", fromAddress: "Ondo Treasury", toAddress: "MantleOS Master Collective", amountUSD: 230000, amountToken: 228000, category: "Agent Treasury" },
    { id: "s4", token: "USDe", fromAddress: "Athena Pool", toAddress: "0x38e2...18ad", amountUSD: 670000, amountToken: 670000, category: "Whale" },
    { id: "s5", token: "fBTC", fromAddress: "0x981d...feba", toAddress: "Cleo Vault", amountUSD: 1200000, amountToken: 12.8, category: "Fund" },
  ]);
});

app.get("/api/intelligence/allora", (req, res) => {
  res.json([
    { target: "MNT Price Direction (24h)", prediction: "Bullish", probability: 88, timeframe: "24h", lastUpdated: "5s ago" },
    { target: "mETH Peak Staking Yield", prediction: "4.45%", probability: 94, timeframe: "7d", lastUpdated: "12s ago" },
    { target: "fBTC-USDT Volatility Spike", prediction: "Bearish (Low Risk)", probability: 81, timeframe: "24h", lastUpdated: "2s ago" },
    { target: "USDY Arbitrage Premium", prediction: "Neutral", probability: 76, timeframe: "1h", lastUpdated: "45s ago" },
    { target: "USDe Funding Yield Rate", prediction: "11.2%", probability: 89, timeframe: "24h", lastUpdated: "1m ago" },
  ]);
});

app.get("/api/intelligence/elfa", (req, res) => {
  res.json([
    { keyword: "MNT Staking Upgrade", sentimentScore: 0.82, mentionVolume: 2450, growth24h: 34.2, primarySource: "X (Twitter)", narrativeShift: "Exploding" },
    { keyword: "mETH Liquidity Yield", sentimentScore: 0.68, mentionVolume: 1280, growth24h: 18.5, primarySource: "Discord", narrativeShift: "Steady" },
    { keyword: "USDY Yield Rebalance", sentimentScore: 0.45, mentionVolume: 820, growth24h: 4.8, primarySource: "Governance Forums", narrativeShift: "Emerging" },
    { keyword: "Farming leverage threats", sentimentScore: -0.35, mentionVolume: 490, growth24h: 12.4, primarySource: "Telegram", narrativeShift: "Fading" },
  ]);
});

// Start server using Vite middleware in development, serve static client files in production
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[MantleOS] server booted & operating on http://0.0.0.0:${PORT}`);
  });
}

startServer();
