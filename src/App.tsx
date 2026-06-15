import React, { useState, useEffect } from "react";
import { 
  Cpu, 
  Coins, 
  Shield, 
  Activity, 
  TrendingUp, 
  Sparkles, 
  ChevronRight, 
  Share2, 
  Target, 
  LineChart, 
  BookOpen, 
  Zap, 
  Award, 
  Terminal, 
  User, 
  Users, 
  BarChart3, 
  ArrowRightLeft, 
  Globe, 
  Search, 
  Code, 
  AlertTriangle, 
  Play,
  ArrowUpRight,
  RefreshCw,
  Sliders,
  DollarSign,
  Briefcase,
  Layers,
  CheckCircle,
  Clock,
  HelpCircle
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { AgentType, AgentNFT, DecisionLog, TuringCompetitor, SmartMoneyFlow, AlloraForecast, SocialNarrative, AgentMessage } from "./types";

export default function App() {
  // Navigation tabs
  const [activeTab, setActiveTab] = useState<"terminal" | "leaderboard" | "intelligence" | "pitch">("terminal");
  const [pitchSlide, setPitchSlide] = useState(0);

  // App state
  const [promptInput, setPromptInput] = useState("Generate passive income with minimal risk over mETH and USDY pools.");
  const [loadingPlan, setLoadingPlan] = useState(false);
  const [activePlan, setActivePlan] = useState<any>(null);
  const [depositAmount, setDepositAmount] = useState("100");
  const [isDepositing, setIsDepositing] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  // Server state mirroring
  const [appState, setAppState] = useState({
    depositedAmount: 0,
    userBalanceMNT: 5000,
    activeNftReputation: 82,
    activeNftLevel: 4,
    activeNftXp: 450,
    historicalRoi: 14.8,
    achievements: ["Genesis Allocator", "Slippage Ninja", "Mantle Pioneer"],
    decisionLogs: [] as DecisionLog[],
    turingLeaderboard: [] as TuringCompetitor[]
  });

  // Feeds
  const [nansenFlows, setNansenFlows] = useState<SmartMoneyFlow[]>([]);
  const [alloraForecasts, setAlloraForecasts] = useState<AlloraForecast[]>([]);
  const [elfaNarratives, setElfaNarratives] = useState<SocialNarrative[]>([]);

  // Simulation speed and telemetry logs
  const [simulatedLogs, setSimulatedLogs] = useState<string[]>([
    "MantleOS [v1.0.4] Initialized.",
    "Connected to Mantle Settlement RPC.",
    "Synergizing Alpha & Risk Agent models...",
    "Listening to Allora predictability oracles...",
    "Nansen Smart Money Index online."
  ]);

  // Load initial server configurations
  const fetchState = async () => {
    try {
      const res = await fetch("/api/state");
      if (res.ok) {
        const data = await res.json();
        setAppState(data);
      }

      const resNan = await fetch("/api/intelligence/nansen");
      if (resNan.ok) {
        setNansenFlows(await resNan.json());
      }
      
      const resAll = await fetch("/api/intelligence/allora");
      if (resAll.ok) {
        setAlloraForecasts(await resAll.json());
      }

      const resElfa = await fetch("/api/intelligence/elfa");
      if (resElfa.ok) {
        setElfaNarratives(await resElfa.json());
      }
    } catch (err) {
      console.error("Error connecting to server APIs:", err);
    }
  };

  useEffect(() => {
    fetchState();
    
    // Interval for appending live simulated on-chain logs to make the feed feel incredibly dynamic
    const interval = setInterval(() => {
      const liveActions = [
        "MantleOS NFT identity validated securely on-chain.",
        "Reputation score re-computed dynamically via ERC-8004 module.",
        "Allora dynamic confidence margin verified for MNT staking vaults.",
        "Nansen signals: whale accumulation spotted on fBTC.",
        "Risk agent re-calculated volatility bounds; optimal ratio stable.",
        "Treasury routing complete: Liquidity updated on Cleo Finance.",
        "Learning Agent re-indexing historical PnL logs relative to S&P500."
      ];
      const randomLog = liveActions[Math.floor(Math.random() * liveActions.length)];
      setSimulatedLogs(prev => [randomLog, ...prev.slice(0, 15)]);
    }, 12000);

    return () => clearInterval(interval);
  }, []);

  // Submit Orchestrate query
  const submitOrchestration = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!promptInput.trim()) return;

    setLoadingPlan(true);
    setSimulatedLogs(prev => [`Dispatching orchestrator query: "${promptInput}"`, ...prev]);

    try {
      const res = await fetch("/api/gemini/orchestrate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: promptInput })
      });

      if (res.ok) {
        const plan = await res.json();
        setActivePlan(plan);
        setSimulatedLogs(prev => [`Orchestrator plan generation complete: "${plan.planTitle}"`, ...prev]);
      } else {
        setSimulatedLogs(prev => ["Failed to orchestrate plan. Please try again.", ...prev]);
      }
    } catch (err) {
      console.error(err);
      setSimulatedLogs(prev => ["Connection error to Gemini orchestra agent.", ...prev]);
    } finally {
      setLoadingPlan(false);
    }
  };

  // Perform Simulated Deposit
  const handleDeposit = async () => {
    const amt = parseFloat(depositAmount);
    if (!amt || amt <= 0) return;

    setIsDepositing(true);
    setSimulatedLogs(prev => [`Depositing $${amt} MNT into Autonomous Operating Sandbox...`, ...prev]);

    try {
      const res = await fetch("/api/deposit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: amt })
      });

      if (res.ok) {
        const data = await res.json();
        // Update local appState with new on-chain response
        setAppState(prev => ({
          ...prev,
          userBalanceMNT: prev.userBalanceMNT - amt,
          depositedAmount: data.totalDeposited,
          activeNftReputation: data.activeNftReputation,
          activeNftXp: data.activeNftXp,
          activeNftLevel: data.activeNftLevel,
          decisionLogs: [data.newDecision, ...prev.decisionLogs]
        }));

        setSimulatedLogs(prev => [
          `Mantle Transaction settled! Tx: ${data.newDecision.id.substring(0, 18)}...`,
          `ERC-8004 Agent NFT Reputation increased to ${data.activeNftReputation}%!`,
          `XP gained: +75 XP`,
          ...prev
        ]);
        
        // Refresh turing leaderboard, etc.
        fetchState();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsDepositing(false);
    }
  };

  // Copy agent card share
  const handleShare = () => {
    setCopiedLink(true);
    navigator.clipboard.writeText(`https://ai.studio/build/mantleos?nft=#0804&rep=${appState.activeNftReputation}&roi=${appState.historicalRoi}`);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  // Pitch Slide Navigator
  const nextSlide = () => setPitchSlide(prev => (prev + 1) % 6);
  const prevSlide = () => setPitchSlide(prev => (prev - 1 + 6) % 6);

  const slideContent = [
    {
      title: "1. The Thesis: Black-Box Agents are Dead",
      tagline: "The Turing Test Hackathon Winner",
      bullets: [
        "AI agents currently manage millions of dollars under the hood as opaque, risky black boxes.",
        "MantleOS secures AI transparency: writing every decision, parameter, reasoning, and context on-chain.",
        "Aligns perfectly with Allora (predictions), Nansen (flows), Elfa (social), and Virtuals (digital identity).",
        "Introducing ERC-8004: Dynamic portability NFTs for autonomous wealth-engine reputation."
      ]
    },
    {
      title: "2. Collaborating AI Agent Economy",
      tagline: "Swarms that Negotiate and Hedger Risk",
      bullets: [
        "Alpha Agent: Continuously crawls Ondo, Cleo, Merchant Moe to discover yield.",
        "Risk Agent: Formulates risk boundaries, stress tests leverage, and models volatility.",
        "Treasury Agent: Re-weights indexes dynamically with instant cross-protocol routing.",
        "Governance & Learning Agents: Match transaction parameters against active governance profiles."
      ]
    },
    {
      title: "3. On-Chain AI Benchmarking System",
      tagline: "Verifiable Public Records Over Mantle",
      bullets: [
        "Decision Hash: Unique reference generated for every allocation action.",
        "Reasoning Log: Natural language justification, model temperature, and confidence scoring saved on-chain.",
        "Dynamic Settlement: Tracks yield vs expectation to calculate Adaptive Learning Scores.",
        "University of HK Academic Alignment: Generates On-Chain Agent Performance Index reports."
      ]
    },
    {
      title: "4. The Turing Test Mode",
      tagline: "Gamified Human vs. Artificial Intellect",
      bullets: [
        "Direct performance comparison leaderboard featuring human portfolios, agent herds, and quant index pools.",
        "Monitors ROI, Sharpe Ratio, downside Drawdown, consistency metrics and transparency metrics.",
        "Animoca Alignment: Evolution milestones, level tiers, achievements, and unique Agent Avatars.",
        "Creates a viral, socially shareable ecosystem of personalized agent progress cards."
      ]
    },
    {
      title: "5. Massive Market & Moat Analysis",
      tagline: "Monetizing Autonomous Strategy Execution",
      bullets: [
        "Performance Fees: MantleOS takes 10% on generated outperformance over basic staking yields.",
        "Reputation-as-a-Service: Third-party Web3 protocols license verified agent track records.",
        "AI Marketplace: Developers upload custom strategy models and trade research data.",
        "Tokenomics Loop: $MNT operates as native fuel, premium tiers locked through ecosystem staking."
      ]
    },
    {
      title: "6. Grand Vision Road Map",
      tagline: "Scaling from Local Sandbox to Multi-Chain Core",
      bullets: [
        "Stage 1 (Q3 2026): Launch testnet sandbox, validate ERC-8004 spec, deploy initial model routing.",
        "Stage 2 (Q4 2026): Launch Mainnet pool integration with Cleo, Ondo Finance & Merchant Moe.",
        "Stage 3 (H1 2027): Institutional SDK offering for sovereign wealth structures and decentralized DAOs.",
        "Stage 4 (H2 2027): Fully autonomous decentralization, zero-knowledge reputation validity proofs."
      ]
    }
  ];

  return (
    <div className="h-screen bg-[#050608] text-[#e0e0e0] font-sans flex flex-col overflow-hidden border-4 border-[#1a1c23]" id="mantle-os-container">
      
      {/* GLOWING AMBIENT BACKGROUND */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#00E5A4]/5 rounded-full blur-3xl pointer-events-none animate-pulse-slow"></div>
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl pointer-events-none animate-pulse-slow col-start-1"></div>

      {/* TOP ECOSYSTEM METRIC TICKER & NAVIGATION HEADER */}
      <header className="h-16 border-b border-[#1a1c23] flex items-center justify-between px-6 bg-[#0a0b0f] shrink-0 z-10" id="primary-header">
        <div className="flex items-center gap-4">
          <div className="w-8 h-8 bg-gradient-to-br from-[#00E5A4] to-[#00A572] rounded flex items-center justify-center font-bold text-black font-display text-base">M</div>
          <div className="flex flex-col">
            <h1 className="text-sm md:text-base font-bold tracking-tight text-white leading-none">MantleOS</h1>
            <span className="text-[10px] text-[#00E5A4] uppercase tracking-widest font-mono">Autonomous Wealth OS v1.0.4</span>
          </div>
        </div>

        {/* WORKSPACE NAVIGATION TABS */}
        <div className="hidden md:flex bg-[#050608] p-1 rounded-lg border border-[#1a1c23] gap-1" id="nav-tabs">
          {[
            { id: "terminal", label: "Agent Terminal", icon: Terminal },
            { id: "leaderboard", label: "Turing Competition", icon: Target },
            { id: "intelligence", label: "Nansen/Allora/Elfa", icon: Activity },
            { id: "pitch", label: "Hackathon Slide Deck", icon: Briefcase }
          ].map(tab => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                id={`tab-${tab.id}`}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-[11px] font-mono transition duration-200 cursor-pointer ${
                  active 
                    ? "bg-[#111318] text-[#00E5A4] border border-[#00E5A422] font-semibold"
                    : "text-neutral-400 hover:text-neutral-200 hover:bg-[#111318]/40"
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${active ? 'text-[#00E5A4]' : 'text-neutral-500'}`} />
                {tab.label}
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-4 md:gap-8 font-mono text-[11px]">
          <div className="hidden sm:flex flex-col items-end">
            <span className="text-[#666] text-[9px] leading-none mb-1">TOTAL VALUE AUTONOMOUS</span>
            <span className="text-white font-bold">$1,248,392,104.42</span>
          </div>
          <div className="hidden sm:block w-px h-8 bg-[#1a1c23]"></div>
          <div className="flex flex-col items-end">
            <span className="text-[#666] text-[9px] leading-none mb-1">MANTLE GAS</span>
            <span className="text-[#00E5A4] font-bold">0.02 GWEI</span>
          </div>
          <div className="px-2.5 py-1 bg-[#ff4e0022] border border-[#ff4e00] text-[#ff4e00] rounded animate-pulse font-bold tracking-tighter text-[10px]">
            TURING TEST MODE ACTIVE
          </div>
        </div>
      </header>

      {/* MOBILE TAB CONTROLS */}
      <div className="md:hidden bg-[#0a0b0f] border-b border-[#1a1c23] px-4 py-2.5 flex overflow-x-auto gap-1 shrink-0 z-10 no-scrollbar">
        {[
          { id: "terminal", label: "Terminal", icon: Terminal },
          { id: "leaderboard", label: "Turing Arena", icon: Target },
          { id: "intelligence", label: "Feeds", icon: Activity },
          { id: "pitch", label: "Pitch Deck", icon: Briefcase }
        ].map(tab => {
          const Icon = tab.icon;
          const active = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-1.5 px-3 py-1 rounded text-xs transition duration-200 shrink-0 ${
                active 
                  ? "bg-[#111318] text-[#00E5A4] border border-[#00E5A422] font-semibold"
                  : "text-neutral-400"
              }`}
            >
              <Icon className="w-3 h-3" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* PRIMARY CONSOLE SHEET GUTS */}
      <main className="flex-1 flex overflow-hidden">
        
        {/* TAB INDEPENDENT SYSTEM PROFILE CARD (Always visible on left column as Active Agent Fleet + Identity) */}
        <aside className="hidden md:flex w-64 border-r border-[#1a1c23] bg-[#07080a] p-4 flex-col gap-6 overflow-y-auto no-scrollbar shrink-0" id="left-system-rail">
          
          {/* ACTIVE AGENT FLEET */}
          <section>
        <h2 className="text-[10px] text-[#666] uppercase tracking-[0.2em] mb-4 font-mono font-bold">Active Agent Fleet</h2>
        <div className="space-y-3">
          
          {/* Alpha-01 Card */}
          <div className="p-3 bg-[#111318] border-l-2 border-[#00E5A4] rounded-r">
            <div className="flex justify-between items-start mb-1">
              <span className="font-bold text-xs font-display text-white">Alpha-01</span>
              <span className="text-[9px] bg-[#00E5A422] text-[#00E5A4] px-1 rounded font-mono font-medium">DISCOVERY</span>
            </div>
            <div className="w-full bg-[#1a1c23] h-1 rounded-full overflow-hidden">
              <div className="w-[82%] h-full bg-[#00E5A4]"></div>
            </div>
            <div className="mt-2 flex justify-between text-[10px] text-[#888] font-mono">
              <span>Rep: {appState.activeNftReputation + 16 > 99 ? 99 : appState.activeNftReputation + 16}.2</span>
              <span>Scan: 24ms</span>
            </div>
          </div>

          {/* Risk Guardian Card */}
          <div className="p-3 bg-[#111318] border-l-2 border-[#ff4e00] rounded-r opacity-90">
            <div className="flex justify-between items-start mb-1">
              <span className="font-bold text-xs font-display text-white">Risk-Guardian</span>
              <span className="text-[9px] bg-[#ff4e0022] text-[#ff4e00] px-1 rounded font-mono font-medium">VIGILANCE</span>
            </div>
            <div className="w-full bg-[#1a1c23] h-1 rounded-full overflow-hidden">
              <div className="w-[95%] h-full bg-[#ff4e00]"></div>
            </div>
            <div className="mt-2 flex justify-between text-[10px] text-[#888] font-mono">
              <span>Rep: 99.9</span>
              <span className="text-[#ff4e00]">Shield: ON</span>
            </div>
          </div>

          {/* Alloc-9 Card */}
          <div className="p-3 bg-[#111318] border-l-2 border-blue-500 rounded-r opacity-80">
            <div className="flex justify-between items-start mb-1">
              <span className="font-bold text-xs font-display text-white">Alloc-9</span>
              <span className="text-[9px] bg-[#111318] text-blue-400 px-1 rounded font-mono font-medium">TREASURY</span>
            </div>
            <div className="w-full bg-[#1a1c23] h-1 rounded-full overflow-hidden">
              <div className="w-[40%] h-full bg-blue-500"></div>
            </div>
            <div className="mt-2 flex justify-between text-[10px] text-[#888] font-mono">
              <span>Rep: 92.1</span>
              <span>Balancing...</span>
            </div>
          </div>

        </div>
      </section>

      {/* ERC-8004 LANDING PORTABILITY CARD */}
      <section className="mt-auto">
        <div className="p-4 rounded-lg bg-gradient-to-b from-[#1a1c23] to-[#0a0b0f] border border-[#2a2c33]">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-xs font-bold text-white font-display">ERC-8004 Identity</h3>
            <span className="text-[9px] font-mono bg-[#00E5A422] text-[#00E5A4] px-1 rounded">Lv. {appState.activeNftLevel}</span>
          </div>
          
          <div className="aspect-square bg-[#050608] rounded mb-3 flex flex-col items-center justify-center border border-[#333] relative overflow-hidden p-2">
            <div className="relative w-20 h-20 flex items-center justify-center">
              <div className="absolute inset-0 border-4 border-[#00E5A4] border-t-transparent rounded-full animate-spin-slow opacity-30"></div>
              <div className="absolute inset-2 border-2 border-white/10 rounded-full flex items-center justify-center font-mono text-xs text-[#00E5A4] font-bold">
                REP {appState.activeNftReputation}
              </div>
            </div>
            <span className="text-[9px] text-[#888] font-mono mt-2">XP: {appState.activeNftXp} / 1000</span>
          </div>

          <button 
            onClick={handleShare}
            className="w-full py-2 bg-[#00E5A4] hover:bg-[#00c28b] text-black font-bold text-[10px] uppercase tracking-widest rounded transition font-mono cursor-pointer"
          >
            {copiedLink ? "Link Copied!" : "Generate Agent Card"}
          </button>
        </div>
      </section>

    </aside>

    {/* TAB SWITCHED CENTER-RIGHT WORKSPACE PANEL */}
    <section className="flex-1 flex flex-col bg-[#050608] overflow-y-auto no-scrollbar" id="primary-workspace">

      {/* TOP THREE MONITOR CARDS STATS */}
      <div className="p-4 md:p-6 grid grid-cols-1 md:grid-cols-3 gap-4 shrink-0">
        
        {/* Portfolio Allocation Card */}
        <div className="bg-[#0d0f14] border border-[#1a1c23] rounded p-4 flex flex-col justify-between h-32 md:h-28">
          <span className="text-[10px] text-[#666] font-mono uppercase tracking-wider">Portfolio Allocation</span>
          <div className="flex items-end justify-between">
            <span className="text-xl md:text-2xl font-bold font-mono text-white">mETH {appState.depositedAmount > 0 ? "54" : "42"}%</span>
            <span className="text-[#00E5A4] text-xs font-mono">+{appState.historicalRoi}% APY</span>
          </div>
          <div className="h-1.5 w-full bg-[#1a1c23] rounded flex overflow-hidden">
            <div className="h-full bg-orange-400 w-1/4"></div>
            <div className="h-full bg-[#00E5A4] w-1/2"></div>
            <div className="h-full bg-blue-400 w-1/4"></div>
          </div>
        </div>

        {/* Alpha Discovery Rate Card */}
        <div className="bg-[#0d0f14] border border-[#1a1c23] rounded p-4 flex flex-col justify-between h-32 md:h-28">
          <span className="text-[10px] text-[#666] font-mono uppercase tracking-wider">Alpha Discovery Rate</span>
          <div className="text-xl md:text-2xl font-bold font-mono text-white">
            412 <span className="text-xs text-[#666] font-normal font-sans">/hr</span>
          </div>
          <div className="flex items-end gap-1 h-3 pb-0.5">
            <div className="h-1.5 w-1 bg-[#00E5A4] opacity-20 rounded-sm"></div>
            <div className="h-3 w-1 bg-[#00E5A4] opacity-40 rounded-sm"></div>
            <div className="h-2.5 w-1 bg-[#00E5A4] opacity-60 rounded-sm"></div>
            <div className="h-4 w-1 bg-[#00E5A4] opacity-80 rounded-sm"></div>
            <div className="h-3.5 w-1 bg-[#00E5A4] rounded-sm"></div>
            <div className="h-2 w-1 bg-[#00E5A4] opacity-70 rounded-sm"></div>
            <div className="h-1 w-1 bg-[#00E5A4] opacity-30 rounded-sm"></div>
            <div className="h-4.5 w-1 bg-[#00E5A4] rounded-sm"></div>
          </div>
        </div>

        {/* Confidence Index Card */}
        <div className="bg-[#0d0f14] border border-[#1a1c23] rounded p-4 flex flex-col justify-between h-32 md:h-28 shadow-[inset_0_0_20px_rgba(0,229,164,0.03)]">
          <span className="text-[10px] text-[#666] font-mono uppercase tracking-wider">Confidence Index</span>
          <div className="text-3xl md:text-4xl font-bold font-mono text-[#00E5A4]">
            {appState.activeNftReputation}%
          </div>
          <span className="text-[9px] text-[#666] font-mono uppercase">STOCHASTIC STABILITY: MAX PEAK</span>
        </div>

      </div>

      {/* CORE ACTION STREAM CHASSIS FRAME */}
      <div className="flex-1 px-4 md:px-6 pb-6 flex flex-col min-h-0">
        <div className="flex-1 border border-[#1a1c23] bg-[#0a0b0f] rounded-lg flex flex-col overflow-hidden">
          
          {/* Stream frame title */}
          <div className="bg-[#111318] border-b border-[#1a1c23] px-4 py-2.5 flex justify-between items-center shrink-0">
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#888] font-mono flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping"></span>
              Real-Time Cognitive Stream & Active Monitor
            </span>
            <div className="flex gap-1.5">
              <div className="w-2 h-2 rounded-full bg-[#ff4e00]"></div>
              <div className="w-2 h-2 rounded-full bg-orange-500"></div>
              <div className="w-2 h-2 rounded-full bg-[#00E5A4]"></div>
            </div>
          </div>

          {/* STREAM VIEWER AND DATA VIEWPORT */}
          <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6">

            {/* TAB 1: PORTFOLIO TERMINAL & GOALS ORCHESTRATION */}
            <div className={`${activeTab === "terminal" ? "" : "hidden"} flex flex-col gap-6`}>
              
              {/* GOALS INPUT SUBMITTER - THE WOW MOMENT */}
              <div className="bg-[#0d0f14]/80 rounded-xl border border-[#1a1c23] p-6 shadow-xl relative overflow-hidden" id="demo-box">
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#00E5A4]/5 rounded-full blur-2xl pointer-events-none"></div>
                
                <div className="flex items-center gap-2 mb-3">
                  <Sparkles className="w-4 h-4 text-[#00E5A4]" />
                  <span className="text-xs uppercase font-mono tracking-widest text-[#00E5A4] font-bold">
                    Demo Sandbox: Type any Investment Mandate
                  </span>
                </div>
                <h2 className="text-lg font-bold tracking-tight text-neutral-105 font-display mb-2">
                  Simulate Autonomous Financial Swarm Planning
                </h2>
                <p className="text-xs text-[#888] mb-4 max-w-2xl font-sans">
                  Define your target investment yields, asset allocations, or parameters. 
                  Our cooperatory model orchestrates a peer-to-peer session amongst specialized agents (`MantleOS-Alpha`, `MantleOS-Risk`, `MantleOS-Treasury`) to structure the optimal allocation route.
                </p>

                <form onSubmit={submitOrchestration} className="flex gap-2.5">
                  <div className="relative flex-1">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neutral-500">
                      <Sliders className="w-4 h-4" />
                    </div>
                    <input 
                      type="text" 
                      value={promptInput}
                      onChange={(e) => setPromptInput(e.target.value)}
                      placeholder="e.g. Generate mETH staking yield with low-volatility hedging"
                      className="w-full bg-[#050608] text-white pl-10 pr-4 py-3 rounded-xl text-xs border border-[#1a1c23] focus:outline-none focus:ring-1 focus:ring-[#00E5A4] transition-all font-mono"
                      id="mandate-input-element"
                    />
                  </div>
                  <button 
                    type="submit"
                    disabled={loadingPlan}
                    className="bg-[#00E5A4] hover:bg-[#00c28b] text-black font-semibold px-5 rounded-xl text-xs flex items-center gap-2 cursor-pointer transition disabled:opacity-50 font-display"
                    id="orchestrate-submit-btn"
                  >
                    {loadingPlan ? (
                      <>
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        Orchestrating...
                      </>
                    ) : (
                      <>
                        <Play className="w-3.5 h-3.5 fill-current" />
                        Execute Plan
                      </>
                    )}
                  </button>
                </form>

                {/* Quick suggestions list */}
                <div className="flex gap-2.5 mt-3 flex-wrap">
                  <span className="text-[10px] text-neutral-400 flex items-center">Try preset constraints:</span>
                  {[
                    "Maximize MNT-mETH pool yield with aggressive risk profile",
                    "Low risk USDY index optimization with stable liquidity re-weights",
                    "Delta-neutral fBTC & USDe stable rate arbitrage"
                  ].map((preset, pIdx) => (
                    <button 
                      key={pIdx}
                      type="button"
                      onClick={() => {
                        setPromptInput(preset);
                        setSimulatedLogs(prev => [`Selected Preset: "${preset}"`, ...prev]);
                      }}
                      className="text-[10px] bg-[#050608] hover:bg-[#111318] border border-[#1a1c23] px-2 py-1 rounded text-[#00E5A4] text-left transition cursor-pointer font-mono"
                    >
                      {preset}
                    </button>
                  ))}
                </div>
              </div>

            {/* REAL-TIME DEBATE BOARD & ACTIVE GENERATED PLAN */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6" id="agent-orchestration-view">
              
              {/* ORCHESTRATED SWARM DEBATE CHAT */}
              <div className="lg:col-span-7 bg-[#0d0f14] rounded-lg border border-[#1a1c23] p-5 flex flex-col h-[520px]" id="debate-panel">
                <div className="flex justify-between items-center border-b border-[#1a1c23] pb-3 mb-4">
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-[#00E5A4]" />
                    <h3 className="text-sm font-semibold text-white font-display">Live Swarm Peer-to-Peer Debate</h3>
                  </div>
                  <span className="text-[10px] font-mono uppercase bg-[#00E5A422] border border-[#00E5A444] text-[#00E5A4] px-2 py-0.5 rounded">
                    Active Session
                  </span>
                </div>

                <div className="flex-1 overflow-y-auto space-y-4 pr-1 text-xs">
                  
                  {/* Default initial greet message */}
                  <div className="bg-[#111318] p-3 rounded border border-[#1a1c23]">
                    <p className="text-neutral-400 italic font-mono text-[11px]">
                      SYSTEM NOTE: Awaiting user prompt dispatch. Alpha, Risk and Treasury agents are listening on port 3000. Under current local time <strong className="text-neutral-300">2026-06-15</strong>, all models initialized.
                    </p>
                  </div>

                  {activePlan ? (
                    activePlan.agentsDebate.map((msg: any, mIdx: number) => {
                      const isAlpha = msg.sender.includes("Alpha");
                      const isRisk = msg.sender.includes("Risk");
                      const avatarBg = isAlpha ? "from-amber-400 to-amber-600" : isRisk ? "from-red-500 to-red-700" : "from-[#00E5A4] to-[#00A572]";
                      return (
                        <div key={mIdx} className="space-y-1 animate-fade-in">
                          <div className="flex items-center gap-2">
                            <span className={`w-2 h-2 rounded-full bg-gradient-to-tr ${avatarBg}`}></span>
                            <strong className="text-neutral-250 font-display text-xs">{msg.senderName}</strong>
                            <span className="text-[9px] uppercase font-mono px-1.5 py-0.5 rounded bg-[#111318] text-[#888] border border-[#1a1c23]">
                              {msg.sender}
                            </span>
                          </div>
                          <div className="bg-[#050608] p-3 rounded border border-[#1a1c23] text-[#e0e0e0] relative">
                            <p className="leading-relaxed font-mono text-[11px]">{msg.message}</p>
                            <span className="absolute bottom-1 right-2 text-[8px] font-mono text-neutral-600">VERIFIED Reasoning Hash</span>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="h-full flex flex-col items-center justify-center text-neutral-500 gap-2 border border-dashed border-[#1a1c23] rounded p-6">
                      <Terminal className="w-8 h-8 text-neutral-700 animate-pulse" />
                      <p className="text-xs text-neutral-400">No active plan debated yet. Type your mandate above and execute plan.</p>
                      <button 
                        onClick={() => submitOrchestration()}
                        className="text-xs bg-[#111318] hover:bg-[#1a1c23] text-[#00E5A4] border border-[#00E5A422] px-3.5 py-1.5 rounded font-mono transition mt-2 cursor-pointer"
                      >
                        Run Default Strategy Search
                      </button>
                    </div>
                  )}

                  {loadingPlan && (
                    <div className="space-y-4 animate-pulse">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping"></span>
                          <span className="h-3 w-28 bg-[#111318] rounded"></span>
                        </div>
                        <div className="h-12 w-full bg-[#050608] rounded border border-[#1a1c23]"></div>
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-red-500 animate-ping"></span>
                          <span className="h-3 w-28 bg-[#111318] rounded"></span>
                        </div>
                        <div className="h-12 w-full bg-[#050608] rounded border border-[#1a1c23]"></div>
                      </div>
                    </div>
                  )}

                </div>
              </div>

              {/* GENERATED PORTFOLIO ROUTE BREAKDOWN */}
              <div className="lg:col-span-5 bg-[#0d0f14] rounded-lg border border-[#1a1c23] p-5 flex flex-col h-[520px] overflow-hidden" id="plan-breakdown-panel">
                <div className="flex justify-between items-center border-b border-[#1a1c23] pb-3 mb-4">
                  <div className="flex items-center gap-2">
                    <LineChart className="w-4 h-4 text-[#00E5A4]" />
                    <h3 className="text-sm font-semibold text-white font-display">Target Allocations & Routes</h3>
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto space-y-5 text-xs pr-1">
                  {activePlan ? (
                    <div className="space-y-5">
                      <div className="bg-[#050608] p-4 rounded border border-[#1a1c23]">
                        <span className="text-[9px] uppercase font-mono text-[#666]">Suggested Portfolio Name</span>
                        <h4 className="text-sm font-bold text-[#00E5A4] font-display mt-0.5">{activePlan.planTitle}</h4>
                        <div className="grid grid-cols-2 gap-4 mt-3 pt-3 border-t border-[#1a1c23]">
                          <div>
                            <span className="text-[#666] block text-[9px] font-mono">Estimated Net Yield</span>
                            <strong className="text-emerald-400 text-sm font-mono font-bold">+{activePlan.estimatedRoi}% APY</strong>
                          </div>
                          <div>
                            <span className="text-[#666] block text-[9px] font-mono">Safety Audit Guard</span>
                            <strong className="text-[#00E5A4] text-sm font-mono font-bold uppercase">{activePlan.safetyRating} Rating</strong>
                          </div>
                        </div>
                      </div>

                      {/* Percent distributions */}
                      <div>
                        <h5 className="text-[10px] font-mono font-bold uppercase tracking-wider text-neutral-400 mb-2">Ecosystem Distribution Profile</h5>
                        <div className="space-y-2.5">
                          {Object.entries(activePlan.allocation || {}).map(([token, prc]: any, idx) => (
                            <div key={idx} className="space-y-1">
                              <div className="flex justify-between text-[11px] font-mono">
                                <span className="text-[#888] font-semibold">{token} Asset</span>
                                <span className="text-[#00E5A4] font-bold">{prc}%</span>
                              </div>
                              <div className="h-1.5 w-full bg-[#050608] rounded-full border border-[#1a1c23] overflow-hidden">
                                <div 
                                  className="h-full bg-[#00E5A4] rounded-full transition-all duration-500" 
                                  style={{ width: `${prc}%` }}
                                ></div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Generated routing checklist */}
                      <div className="space-y-2 border-t border-[#1a1c23] pt-4">
                        <h5 className="text-[10px] font-mono uppercase tracking-wider text-neutral-400 font-bold mb-2">Swarm Execution Plan</h5>
                        <div className="space-y-2">
                          {(activePlan.actions || []).map((step: any, sIdx: number) => (
                            <div key={sIdx} className="bg-[#050608] p-2.5 rounded border border-[#1a1c23] flex items-start gap-2.5">
                              <CheckCircle className="w-3.5 h-3.5 text-[#00E5A4] shrink-0 mt-0.5" />
                              <div>
                                <p className="text-neutral-300 font-mono text-[11px]">{step.step}</p>
                                <div className="flex gap-2.5 mt-1 font-mono text-[9px] text-neutral-500">
                                  <span>YIELD: <strong className="text-emerald-400">{step.expectedYield}</strong></span>
                                  <span>|</span>
                                  <span>CONFIDENCE: <strong className="text-[#00E5A4]">{step.confidence}%</strong></span>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                    </div>
                  ) : (
                    <div className="h-full flex flex-col items-center justify-center text-neutral-500 gap-2 border border-dashed border-[#1a1c23] rounded p-6">
                      <Sliders className="w-8 h-8 text-neutral-700" />
                      <p className="text-xs text-neutral-400 text-center">Plan breakdown analysis generates concurrently with swarm debate.</p>
                    </div>
                  )}
                </div>
              </div>

            </div>

            {/* LIVE ON-CHAIN SANDBOX LEDGER AND BLOCK SEQUENCER */}
            <div className="bg-[#0d0f14] rounded-lg border border-[#1a1c23] p-6 flex flex-col xl:flex-row gap-6 justify-between items-stretch">
              
              {/* JUDGE LIVE ACTION INTERACTION */}
              <div className="flex-1 flex flex-col justify-between" id="judge-deposit-interaction">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Coins className="w-4 h-4 text-[#00E5A4]" />
                    <h3 className="text-sm font-semibold text-white font-display">Turing Test Sandboxed Settler</h3>
                  </div>
                  <p className="text-xs text-neutral-400 mb-4 leading-relaxed font-sans">
                    Test the wealth operating system directly on-chain. Deposit MNT test currency into our liquidity sandbox. 
                    MantleOS automatically routes currency to optimal mETH, USDY parameters, updates your ERC-8004 NFT level and reputation, 
                    and records decision hashes live on our benchmark ledger.
                  </p>
                </div>

                <div className="flex gap-3 items-center">
                  <div className="bg-[#050608] px-3.5 py-2 rounded border border-[#1a1c23] flex items-center shrink-0">
                    <span className="text-xs font-mono font-bold text-[#00E5A4] mr-2">MNT:</span>
                    <input 
                      type="number" 
                      value={depositAmount} 
                      onChange={(e) => setDepositAmount(e.target.value)}
                      className="w-16 bg-transparent text-white outline-none p-0 text-xs font-bold font-mono focus:ring-0 focus:outline-none" 
                      min="1"
                    />
                  </div>
                  <button 
                    onClick={handleDeposit}
                    disabled={isDepositing}
                    className="flex-1 bg-[#00E5A4] hover:bg-[#00c28b] text-black font-bold py-2.5 px-4 rounded text-xs flex items-center justify-center gap-2 transition cursor-pointer disabled:opacity-55 font-mono shadow shadow-emerald-500/10"
                    id="submit-deposit-button"
                  >
                    {isDepositing ? (
                      <>
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        Settling on Mantle L2...
                      </>
                    ) : (
                      <>
                        <Coins className="w-3.5 h-3.5" />
                        Deposit & Run Portfolio Swarm
                      </>
                    )}
                  </button>
                </div>
                
                <div className="mt-3 text-[10px] font-mono text-neutral-500 flex justify-between">
                  <span>Balance: <strong>{appState.userBalanceMNT} MNT</strong></span>
                  <span>Total Simulated Deposit: <strong>${appState.depositedAmount} USD</strong></span>
                </div>
              </div>

              {/* REAL-TIME SYSTEM TERMINAL LOG CONSOLE (Bloomberg feel) */}
              <div className="xl:w-[380px] bg-[#050608] rounded border border-[#1a1c23] p-4 font-mono text-[10px] flex flex-col justify-between" id="telemetry-log-console">
                <div className="flex justify-between text-neutral-500 mb-2 border-b border-[#1a1c23] pb-1.5 shrink-0">
                  <span>MANTLEOS TELEMETRY FLOW</span>
                  <span className="animate-pulse text-[#00E5A4]">● LIVE FEED</span>
                </div>
                <div className="flex-1 h-32 overflow-y-auto space-y-1 text-neutral-400 select-none pr-1">
                  {simulatedLogs.map((log, lIdx) => (
                    <div key={lIdx} className="leading-5 truncate text-neutral-450 text-[10px]">
                      <span className="text-[#00E5A4] mr-1.5">&gt;</span>
                      {log}
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* PUBLIC ALIGNMENT LEDGER */}
            <div className="bg-[#0d0f14] rounded-lg border border-[#1a1c23] p-6">
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-2">
                  <Terminal className="w-4 h-4 text-[#00E5A4]" />
                  <h3 className="text-sm font-semibold text-white font-display">On-Chain Asset Decision Ledger</h3>
                </div>
              </div>

              <div className="overflow-x-auto text-xs">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-[#1a1c23] text-neutral-500 font-mono text-[10px]">
                      <th className="pb-3 pr-2">BLOCK / TIME</th>
                      <th className="pb-3 px-2">DECISION HASH</th>
                      <th className="pb-3 px-2">COGNITIVE SENDER</th>
                      <th className="pb-3 px-2">REASONING SUMMARY & ROUTING CRITERIA</th>
                      <th className="pb-3 px-2 text-right">VOLUME / APY</th>
                      <th className="pb-3 pl-2 text-right">CONFIDENCE</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#1a1c23]">
                    {appState.decisionLogs.map((log, idx) => (
                      <tr key={idx} className="hover:bg-[#111318]/50 transition">
                        <td className="py-3 pr-2 font-mono text-neutral-400 text-[10px]">
                          <div>Block: #{log.blockNumber}</div>
                          <div className="text-[9px] text-[#666] mt-0.5">{new Date(log.timestamp).toLocaleTimeString()}</div>
                        </td>
                        <td className="py-3 px-2 font-mono text-[#00E5A4] text-[10px]">
                          {log.id.slice(0, 10)}...{log.id.slice(-8)}
                        </td>
                        <td className="py-3 px-2 font-medium text-neutral-300">
                          <span className="bg-[#00E5A422] text-[#00E5A4] px-1.5 py-0.5 rounded text-[10px] uppercase font-mono border border-[#00E5A444]">
                            {log.agentType}
                          </span>
                        </td>
                        <td className="py-3 px-2 text-[#888] leading-relaxed text-[11px] max-w-sm">
                          {log.reasoningSummary}
                        </td>
                        <td className="py-3 px-2 text-right font-mono text-neutral-300">
                          <div>${log.outcomeMetrics.volumeUSD} USD</div>
                          <div className="text-emerald-400 text-[10px] mt-0.5">PnL: +${log.pnl}</div>
                        </td>
                        <td className="py-3 pl-2 text-right font-mono text-[#00E5A4] font-bold">
                          {log.confidenceScore}%
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

          </div>

          {/* TAB 2: TURING TEST LEADERBOARD */}
          <div className={`${activeTab === "leaderboard" ? "" : "hidden"} bg-[#0d0f14] rounded-lg border border-[#1a1c23] p-6 flex flex-col gap-6`}>
            
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-[#1a1c23] pb-5">
              <div>
                <h3 className="text-base font-bold text-white font-display">Turing Test Arena: Human vs. Machine</h3>
                <p className="text-xs text-neutral-400 mt-1 font-sans">
                  Decentralized real-time simulation benchmarking individual and institutional human strategies against automated MantleOS agent swarms.
                </p>
              </div>
              <button 
                onClick={handleDeposit}
                className="bg-[#050608] text-[#00E5A4] hover:bg-[#111318] border border-[#1a1c23] px-4 py-2 rounded text-xs flex items-center gap-2 transition font-medium shrink-0 cursor-pointer font-mono"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                Recalculate Sharpe Limits
              </button>
            </div>

            {/* Grid of leading statistics highlighting performance */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4" id="arena-stats">
              <div className="bg-[#050608] p-4 rounded border border-[#1a1c23]">
                <span className="text-[9px] font-mono text-[#666] uppercase">Top Strategy Group</span>
                <strong className="text-base font-display block text-[#00E5A4] mt-1">MantleOS Collectives</strong>
                <span className="text-xs text-emerald-400 font-mono font-medium mt-1 inline-block">34.2% Net ROI</span>
              </div>
              <div className="bg-[#050608] p-4 rounded border border-[#1a1c23]">
                <span className="text-[9px] font-mono text-[#666] uppercase">Average Bot Sharpe</span>
                <strong className="text-base font-display block text-neutral-200 mt-1">2.48 Sharpe</strong>
                <span className="text-xs text-neutral-500 font-mono font-medium mt-1 inline-block">S&P500 Average: 1.12</span>
              </div>
              <div className="bg-[#050608] p-4 rounded border border-[#1a1c23]">
                <span className="text-[9px] font-mono text-[#666] uppercase">Human Outperformance</span>
                <strong className="text-base font-display block text-rose-400 mt-1">AI Lead: 18.8%</strong>
                <span className="text-xs text-rose-400/80 font-mono font-medium mt-1 inline-block">Drawdown variance reduced</span>
              </div>
              <div className="bg-[#050608] p-4 rounded border border-[#1a1c23]">
                <span className="text-[9px] font-mono text-[#666] uppercase">Portability NFT spec</span>
                <strong className="text-base font-display block text-neutral-200 mt-1">ERC-8004</strong>
                <span className="text-xs text-[#00E5A4] mt-1 inline-block font-semibold">Decentralized Rep</span>
              </div>
            </div>

            {/* ARENA TABLE */}
            <div className="overflow-x-auto text-xs mt-2">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-[#1a1c23] text-neutral-500 font-mono text-[10px]">
                    <th className="pb-3 pr-2">RANK</th>
                    <th className="pb-3 px-2">COMPETITORS</th>
                    <th className="pb-3 px-2">ROI (ANNUALIZED)</th>
                    <th className="pb-3 px-2">SHARPE RATIO</th>
                    <th className="pb-3 px-2">DOWNSIDE DRAWDOWN</th>
                    <th className="pb-3 px-2">CONSISTENCY SCORE</th>
                    <th className="pb-3 px-2">ADAPTIVITY</th>
                    <th className="pb-3 pl-2 text-right">TRANSPARENCY WEIGHT</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1a1c23] font-mono">
                  {appState.turingLeaderboard.map((comp, cIdx) => {
                    const isUser = comp.id === "u1";
                    return (
                      <tr 
                        key={cIdx} 
                        className={`transition ${isUser ? 'bg-[#00E5A411] text-[#00E5A4] font-bold' : 'hover:bg-[#111318]/40'}`}
                      >
                        <td className="py-4 pr-2 font-bold text-neutral-300 pl-1 text-[11px]">
                          {comp.rank === 1 ? "🏆 01" : `0${comp.rank}`}
                        </td>
                        <td className="py-4 px-2 font-sans font-semibold text-neutral-200">
                          <div className="flex items-center gap-2">
                            {isUser ? (
                              <User className="w-3.5 h-3.5 text-[#00E5A4]" />
                            ) : comp.type === "Agent" ? (
                              <Cpu className="w-3.5 h-3.5 text-orange-400" />
                            ) : comp.type === "Collective" ? (
                              <Users className="w-3.5 h-3.5 text-indigo-400" />
                            ) : (
                              <Globe className="w-3.5 h-3.5 text-neutral-450" />
                            )}
                            {comp.name}
                            <span className={`text-[8px] uppercase tracking-widest px-1.5 py-0.5 rounded font-mono ${
                              isUser ? "bg-[#00E5A422] text-[#00E5A4] border border-[#00E5A444]" :
                              comp.type === "Agent" ? "bg-orange-500/10 text-orange-400 border border-orange-500/20" :
                              comp.type === "Collective" ? "bg-indigo-500/10 text-indigo-400 border border-indigo-500/20" : "bg-[#111318] text-[#888] border border-[#1a1c23]"
                            }`}>
                              {comp.type}
                            </span>
                          </div>
                        </td>
                        <td className="py-4 px-2 text-emerald-400 font-bold">{comp.roi}%</td>
                        <td className="py-4 px-2 font-bold text-neutral-350">{comp.sharpeRatio}</td>
                        <td className="py-4 px-2 text-rose-450">{comp.drawdown}%</td>
                        <td className="py-4 px-2">
                          <div className="flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 bg-[#00E5A4] rounded-full animate-pulse"></span>
                            {comp.consistencyScore}%
                          </div>
                        </td>
                        <td className="py-4 px-2 text-neutral-300">{comp.adaptabilityScore}/100</td>
                        <td className="py-4 pl-2 text-right">
                          <strong className={comp.transparencyScore > 80 ? 'text-[#00E5A4]' : 'text-neutral-500'}>
                            {comp.transparencyScore}%
                          </strong>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* DESIGN AND THEORY CORNER */}
            <div className="bg-[#050608] p-4 rounded border border-[#1a1c23] text-xs mt-3">
              <span className="text-[10px] text-[#00E5A4] font-bold font-mono tracking-wider uppercase block mb-1">
                University of HK: On-Chain Agent Economics Research Alignment
              </span>
              <p className="text-neutral-400 leading-relaxed text-[11px] font-sans">
                The benchmark uses statistical data feeds. Machine competitors generate cryptographic outcome hashes every minute, 
                proving the legitimacy of autonomous execution. While modern trading bots often rely on centralized infrastructure, 
                MantleOS agents settle operations exclusively through Mantle liquidity hooks context logs.
              </p>
            </div>

          </div>

          {/* TAB 3: LIVE RE-BALANCING MARKET FEEDS & SOCIAL SENTIMENT */}
          <div className={`${activeTab === "intelligence" ? "" : "hidden"} flex flex-col gap-6`}>
            
            <div className="bg-[#0d0f14] rounded-lg border border-[#1a1c23] p-6">
              <div className="border-b border-[#1a1c23] pb-4 mb-5">
                <h3 className="text-base font-bold text-white font-display">Triple-Aligned AI Alpha Graph</h3>
                <p className="text-xs text-neutral-400 mt-1 font-sans">
                  Synthesizing predictive signals, social narrative shift trackers, and institutional whales flow trackers into a single visual monitor.
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6" id="three-pillars-intelligence">
                
                {/* COLUMN A: NANSEN SMART MONEY FLOWS */}
                <div className="bg-[#0a0b0f] rounded border border-[#1a1c23] p-4.5 flex flex-col h-[480px]" id="nansen-monitor-feed">
                  <div className="flex justify-between items-center border-b border-[#1a1c23] pb-3 mb-3.5">
                    <span className="text-[11px] font-mono tracking-widest text-[#00E5A4] font-bold uppercase">
                      Nansen Whale flows
                    </span>
                    <span className="text-[9px] uppercase font-mono text-[#666]">Mantle Vaults</span>
                  </div>
                  <div className="flex-1 overflow-y-auto space-y-3 pr-1 text-xs">
                    {nansenFlows.map((flow, fIdx) => (
                      <div key={flow.id || fIdx} className="bg-[#111318] p-3 rounded border border-[#1a1c23] space-y-1.5 hover:border-[#00E5A444] transition duration-200">
                        <div className="flex justify-between items-center">
                          <span className="font-bold text-neutral-200 flex items-center gap-1 font-display">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                            {flow.token}
                          </span>
                          <span className="text-[9px] bg-[#050608] px-1.5 py-0.5 rounded text-neutral-400 capitalize font-mono border border-[#1a1c23]">
                            {flow.category}
                          </span>
                        </div>
                        <div className="text-[10px] text-[#888] font-mono flex justify-between">
                          <span className="truncate">Route: <strong className="text-neutral-350">{flow.fromAddress}</strong> &gt; <strong className="text-neutral-350">{flow.toAddress}</strong></span>
                        </div>
                        <div className="flex justify-between items-center font-mono text-[10px] pt-1.5 border-t border-[#1a1c23] mt-1">
                          <span className="text-neutral-500">Amount:</span>
                          <strong className="text-[#00E5A4]">${flow.amountUSD.toLocaleString()} USD</strong>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* COLUMN B: ALLORA PREDICTIVE INFERENCE VECTORS */}
                <div className="bg-[#0a0b0f] rounded border border-[#1a1c23] p-4.5 flex flex-col h-[480px]" id="allora-predictor-feed">
                  <div className="flex justify-between items-center border-b border-[#1a1c23] pb-3 mb-3.5">
                    <span className="text-[11px] font-mono tracking-widest text-[#00E5A4] font-bold uppercase">
                      Allora Probability Oracles
                    </span>
                    <span className="text-[9px] uppercase font-mono text-[#666]">Inferences</span>
                  </div>
                  <div className="flex-1 overflow-y-auto space-y-3 pr-1 text-xs">
                    {alloraForecasts.map((fore, oIdx) => (
                      <div key={oIdx} className="bg-[#111318] p-3.5 rounded border border-[#1a1c23] space-y-2">
                        <div className="text-[11px] text-[#00E5A4] uppercase font-mono tracking-tight font-semibold">
                          {fore.target}
                        </div>
                        <div className="flex justify-between items-end">
                          <div>
                            <span className="text-neutral-500 text-[10px] block font-mono">Prediction Estimate:</span>
                            <strong className="text-neutral-250 text-sm font-bold font-display">{fore.prediction}</strong>
                          </div>
                          <div className="text-right font-mono">
                            <span className="text-neutral-500 text-[10px] block">Confidence:</span>
                            <span className="text-emerald-400 font-bold text-xs">{fore.probability}%</span>
                          </div>
                        </div>
                        <div className="h-1 w-full bg-[#050608] rounded-full overflow-hidden border border-[#1a1c23]/50">
                          <div className="h-full bg-[#00E5A4]" style={{ width: `${fore.probability}%` }}></div>
                        </div>
                        <div className="text-[9px] text-[#666] text-right font-mono">
                          Last Updated: <strong>{fore.lastUpdated}</strong>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* COLUMN C: ELFA SOCIAL SENTIMENT MONITORS */}
                <div className="bg-[#0a0b0f] rounded border border-[#1a1c23] p-4.5 flex flex-col h-[480px]" id="elfa-sentiment-feed">
                  <div className="flex justify-between items-center border-b border-[#1a1c23] pb-3 mb-3.5">
                    <span className="text-[11px] font-mono tracking-widest text-[#00E5A4] font-bold uppercase">
                      Elfa Social Sentiment Shift
                    </span>
                    <span className="text-[9px] uppercase font-mono text-[#666]">Narratives</span>
                  </div>
                  <div className="flex-1 overflow-y-auto space-y-3 pr-1 text-xs">
                    {elfaNarratives.map((narr, elIdx) => (
                      <div key={elIdx} className="bg-[#111318] p-3 rounded border border-[#1a1c23] space-y-1.5">
                        <div className="flex justify-between items-center">
                          <strong className="text-neutral-200 text-xs font-semibold font-display">{narr.keyword}</strong>
                          <span className={`text-[9px] px-1.5 py-0.5 rounded font-mono font-bold ${
                            narr.narrativeShift === "Exploding" ? "bg-rose-500/10 text-rose-450 border border-rose-500/20 animate-pulse" : "bg-[#050608] text-neutral-400 border border-[#1a1c23]"
                          }`}>
                            {narr.narrativeShift}
                          </span>
                        </div>
                        <div className="flex justify-between text-[11px] font-mono text-neutral-400">
                          <span>Volume: {narr.mentionVolume} shares</span>
                          <span className={narr.sentimentScore > 0 ? 'text-emerald-400' : 'text-neutral-500'}>
                            Score: {narr.sentimentScore}
                          </span>
                        </div>
                        <div className="text-[9px] text-neutral-500 flex justify-between pt-1 border-t border-[#1a1c23] font-mono">
                          <span>Platform: <strong>{narr.primarySource}</strong></span>
                          <span className="text-emerald-400">+{narr.growth24h}% growth (24h)</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            </div>

          </div>

          {/* TAB 4: HACKATHON PITCH ENGINE & DOCUMENTATION DELIVERABLES */}
          <div className={`${activeTab === "pitch" ? "" : "hidden"} flex flex-col gap-6`}>
            
            {/* INTERACTIVE PRESENTATION SLIDESHOW */}
            <div className="bg-[#0d0f14] rounded-lg border border-[#1a1c23] p-6 relative overflow-hidden" id="deck-view">
              <div className="absolute top-0 right-1/4 w-40 h-40 bg-[#00E5A4]/5 rounded-full blur-3xl pointer-events-none"></div>

              <div className="flex justify-between items-center border-b border-[#1a1c23] pb-4 mb-5">
                <div className="flex items-center gap-2">
                  <Briefcase className="w-5 h-5 text-[#00E5A4]" />
                  <h3 className="text-base font-bold text-white font-display">Turing Test Pitch Deck Presentation</h3>
                </div>
                <div className="flex gap-2 text-xs font-mono text-neutral-400">
                  Slide: <strong className="text-[#00E5A4]">{pitchSlide + 1} / 6</strong>
                </div>
              </div>

              {/* SLIDE CONTENT AREA */}
              <div className="min-h-[280px] bg-[#050608] pr-4 pl-6 py-6 rounded border border-[#1a1c23] flex flex-col justify-between" id="slide-viewer">
                <div>
                  <span className="text-[10px] font-mono text-[#00E5A4] uppercase tracking-widest bg-[#00E5A422] px-2.5 py-0.5 rounded border border-[#00E5A444] font-bold mb-3.5 inline-block">
                    {slideContent[pitchSlide].tagline}
                  </span>
                  <h4 className="text-lg font-bold font-display text-white mb-4">{slideContent[pitchSlide].title}</h4>
                  <ul className="space-y-3 text-xs text-neutral-300 font-sans">
                    {slideContent[pitchSlide].bullets.map((bullet, bIdx) => (
                      <li key={bIdx} className="flex items-start gap-2.5 leading-relaxed">
                        <ChevronRight className="w-4 h-4 text-[#00E5A4] shrink-0 mt-0.5" />
                        <span>{bullet}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="flex justify-between items-center pt-6 border-t border-[#1a1c23] mt-6 shrink-0">
                  <span className="text-[10px] font-mono text-neutral-500">MantleOS Hackathon Entry | VC Pitch Strategy</span>
                  <div className="flex gap-2">
                    <button 
                      onClick={prevSlide}
                      className="bg-[#111318] border border-[#1a1c23] hover:bg-[#1a1c23] text-neutral-300 px-3.5 py-1.5 rounded text-xs font-medium cursor-pointer transition font-mono"
                    >
                      Previous Slide
                    </button>
                    <button 
                      onClick={nextSlide}
                      className="bg-[#00E5A4] hover:bg-[#00c28b] text-black font-bold px-3.5 py-1.5 rounded text-xs cursor-pointer transition font-mono"
                    >
                      Next Slide
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* GRAND VISION DELIVERABLES CHECKLIST GRID */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6" id="hackathon-briefs-section">
              
              {/* COMPREHENSIVE BUSINESS MODEL ANALYSIS */}
              <div className="bg-[#0d0f14] rounded-lg border border-[#1a1c23] p-5 space-y-4" id="business-brief">
                <div className="flex items-center gap-2 border-b border-[#1a1c23] pb-3">
                  <Coins className="w-4 h-4 text-[#00E5A4]" />
                  <h4 className="text-sm font-semibold text-white font-display">Business Model & Monetization Channels</h4>
                </div>
                <div className="space-y-3.5 text-xs font-sans">
                  <div className="space-y-1">
                    <strong className="text-neutral-200">1. Decentralized Performance Fees (2.5% - 10%)</strong>
                    <p className="text-[#888] leading-relaxed text-[11px]">
                      Taking a flat percentage fee on generated outperformance. No returns = no fees. Completely aligned with human capital constraints.
                    </p>
                  </div>
                  <div className="space-y-1">
                    <strong className="text-neutral-200">2. Premium Orchestration swarms</strong>
                    <p className="text-[#888] leading-relaxed text-[11px]">
                      Access to hyper-sophisticated neural nets and cross-layer routing loops requires locking a custom volume of native staking tokens.
                    </p>
                  </div>
                  <div className="space-y-1">
                    <strong className="text-neutral-200">3. Reputation-as-a-Service (RaaS) APIs</strong>
                    <p className="text-[#888] leading-relaxed text-[11px]">
                      We expose standard secure SDK endpoints allowing outside Web3 applications (Virtuals, Elfa, Allora) to check and build on our portable ERC-8004 AI NFT indicators.
                    </p>
                  </div>
                </div>
              </div>

              {/* TECHNICAL STUFF / COMPLIANCE AND SECURITY */}
              <div className="bg-[#0d0f14] rounded-lg border border-[#1a1c23] p-5 space-y-4" id="technical-brief">
                <div className="flex items-center gap-2 border-b border-[#1a1c23] pb-3">
                  <Shield className="w-4 h-4 text-[#00E5A4]" />
                  <h4 className="text-sm font-semibold text-white font-display">Security Engine & stress Control</h4>
                </div>
                <div className="space-y-3.5 text-xs font-sans">
                  <div className="space-y-1 border-l-2 border-red-500/20 pl-3">
                    <strong className="text-neutral-200">Dynamic Leverage Safety Fuse</strong>
                    <p className="text-[#888] leading-relaxed text-[11px]">
                      If the Elfa social sentiment score or Allora forecast drops below a 70% threshold, the Risk Agent overrides Alpha instructions and instantly sells volatile exposure.
                    </p>
                  </div>
                  <div className="space-y-1 border-l-2 border-[#00E5A422] pl-3">
                    <strong className="text-neutral-200">Verifiable Reasoning Hashes</strong>
                    <p className="text-[#888] leading-relaxed text-[11px]">
                      Inputs and text reasoning outputs from Gemini are hashed and attached natively inside the Mantle transaction payload, allowing public auditable replication.
                    </p>
                  </div>
                  <div className="space-y-1 border-l-2 border-[#1a1c23] pl-3">
                    <strong className="text-neutral-200">University Research Frameworks</strong>
                    <p className="text-[#888] leading-relaxed text-[11px]">
                      Collaborating with HKU researchers to document agent-to-agent negotiation slippage profiles, forming the first public On-Chain Agent Performance Index.
                    </p>
                  </div>
                </div>
              </div>

            </div>

          </div>
        </div>
      </div>
    </div>

    </section>

  </main>

  {/* COMPACT FOOTER */}
  <footer className="bg-[#0a0b0f] border-t border-[#1a1c23] py-5 px-6 text-center text-xs text-neutral-500 shrink-0 z-10" id="primary-footer">
    <p className="max-w-2xl mx-auto font-sans leading-relaxed text-[11px] text-[#888]">
      MantleOS is built for the Turing Test Hackathon. 
      Deep integration with Nansen Smart Money flows, Allora forecasting, Elfa social intelligence, and Virtuals Protocols. 
      Every financial planning decision is benchmarked securely on-chain.
    </p>
    <p className="mt-1.5 text-[9px] text-[#666] font-mono">
      &copy; 2026 MantleOS Project. Settle Layer: Mantle L2. Portability specification: ERC-8004.
    </p>
  </footer>

</div>
  );
}
