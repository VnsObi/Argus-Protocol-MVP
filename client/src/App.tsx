import { useState } from "react";
import axios from "axios";
import {
  Shield,
  Building2,
  Search,
  CheckCircle,
  AlertTriangle,
  AlertCircle,
  LayoutDashboard,
  Settings,
  FileText,
  Bell,
  Activity,
} from "lucide-react";

function App() {
  const [activeTab, setActiveTab] = useState<"security" | "rwa">("security");

  // Security State
  const [address, setAddress] = useState("");
  const [scanResult, setScanResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [scanError, setScanError] = useState("");

  // RWA State
  const [assetId, setAssetId] = useState("");
  const [issuer, setIssuer] = useState("");
  const [rwaResult, setRwaResult] = useState<any>(null);
  const [rwaError, setRwaError] = useState("");

  const API_URL = "https://argus-protocol-mvp.onrender.com/api";

  // --- VALIDATION LOGIC ---
  const isValidWalletAddress = (addr: string) => {
    if (!addr || /\s/.test(addr)) return false;
    if (addr.length < 26 || addr.length > 60) return false;
    return /^[a-zA-Z0-9]+$/.test(addr);
  };

  const handleScan = async () => {
    setScanError("");
    setScanResult(null);
    if (!address.trim()) {
      setScanError("⚠️ Field cannot be empty.");
      return;
    }
    if (!isValidWalletAddress(address)) {
      setScanError("❌ Invalid Crypto Address format.");
      return;
    }

    setLoading(true);
    try {
      const res = await axios.get(`${API_URL}/scan?address=${address}`);
      setScanResult(res.data);
    } catch (err) {
      setScanError("🔥 Connection Error: API Unreachable");
    }
    setLoading(false);
  };

  const handleVerify = async () => {
    setRwaError("");
    setRwaResult(null);
    if (!issuer.trim() || !assetId.trim()) {
      setRwaError("⚠️ All fields are required.");
      return;
    }
    if (!isValidWalletAddress(issuer)) {
      setRwaError("❌ Invalid Issuer Address.");
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post(`${API_URL}/verify-asset`, {
        issuer,
        assetId,
        value: 50000,
      });
      setRwaResult(res.data);
    } catch (err) {
      setRwaError("🔥 Connection Error: API Unreachable");
    }
    setLoading(false);
  };

  return (
    <div className="flex h-screen bg-[#0B0E14] text-slate-300 font-sans overflow-hidden bg-grid-pattern">
      {/* 1. SIDEBAR NAVIGATION */}
      <aside className="w-64 bg-[#0F1219] border-r border-white/5 flex flex-col z-20">
        <div className="p-6 flex items-center space-x-3 border-b border-white/5">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center shadow-lg shadow-blue-500/20">
            <Shield className="w-5 h-5 text-white" />
          </div>
          <span className="text-lg font-bold text-white tracking-wide">
            ARGUS
          </span>
        </div>

        <nav className="flex-1 p-4 space-y-2 mt-4">
          <NavItem
            icon={<Shield size={20} />}
            label="Agent Guard"
            active={activeTab === "security"}
            onClick={() => setActiveTab("security")}
          />
          <NavItem
            icon={<Building2 size={20} />}
            label="RWA Radar"
            active={activeTab === "rwa"}
            onClick={() => setActiveTab("rwa")}
          />
          <div className="pt-4 pb-2">
            <p className="px-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">
              System
            </p>
          </div>
          <NavItem
            icon={<LayoutDashboard size={20} />}
            label="Analytics (Soon)"
            active={false}
          />
          <NavItem
            icon={<Settings size={20} />}
            label="API Settings"
            active={false}
          />
          <NavItem
            icon={<FileText size={20} />}
            label="Audit Logs"
            active={false}
          />
        </nav>

        <div className="p-4 border-t border-white/5">
          <div className="bg-slate-900/50 rounded-lg p-3 flex items-center space-x-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-500 to-cyan-500"></div>
            <div>
              <p className="text-sm font-medium text-white">Evans Obi</p>
              <p className="text-xs text-slate-500">Admin • CTO</p>
            </div>
          </div>
        </div>
      </aside>

      {/* 2. MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col relative z-10">
        {/* TOP HEADER */}
        <header className="h-16 border-b border-white/5 flex items-center justify-between px-8 bg-[#0B0E14]/80 backdrop-blur-sm">
          <div className="flex items-center text-sm text-slate-500">
            <Activity className="w-4 h-4 mr-2 text-emerald-500" />
            <span>
              System Status:{" "}
              <span className="text-emerald-400 font-medium">OPERATIONAL</span>
            </span>
          </div>
          <div className="flex items-center space-x-6">
            <Bell className="w-5 h-5 text-slate-400 hover:text-white cursor-pointer transition-colors" />
            <button className="text-sm font-medium text-blue-400 hover:text-blue-300">
              Docs
            </button>
          </div>
        </header>

        {/* DASHBOARD CONTENT */}
        <main className="flex-1 p-8 overflow-y-auto">
          <div className="max-w-5xl mx-auto">
            {/* TITLE SECTION */}
            <div className="mb-8">
              <h1 className="text-2xl font-bold text-white mb-2">
                {activeTab === "security"
                  ? "Security Operations Center"
                  : "Asset Compliance Desk"}
              </h1>
              <p className="text-slate-400 text-sm">
                {activeTab === "security"
                  ? "Real-time sanctions screening and risk analysis for autonomous agents."
                  : "Verification engine for Real World Assets (RWA) and Tokenized Land."}
              </p>
            </div>

            {/* TAB CONTENT: AGENT GUARD */}
            {activeTab === "security" && (
              <div className="glass-card rounded-xl p-8">
                <div className="flex items-center mb-6">
                  <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center mr-4 border border-blue-500/20">
                    <Search className="w-5 h-5 text-blue-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-white">
                      Scan Wallet Address
                    </h3>
                    <p className="text-sm text-slate-500">
                      Supports ETH, SOL, BTC, and L2s
                    </p>
                  </div>
                </div>

                <div className="flex gap-3 mb-6">
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Enter wallet address (0x...)"
                    className={`flex-1 bg-[#0F1219] border rounded-lg px-4 py-3 text-white font-mono text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all ${
                      scanError ? "border-red-500/50" : "border-white/10"
                    }`}
                  />
                  <button
                    onClick={handleScan}
                    disabled={loading}
                    className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-lg font-medium text-sm transition-all shadow-lg shadow-blue-900/20 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? "Scanning..." : "Run Analysis"}
                  </button>
                </div>

                {scanError && <ErrorMessage msg={scanError} />}
                {scanResult && !scanError && (
                  <ResultCard
                    isSafe={scanResult.isSafe}
                    reason={scanResult.reason}
                    flags={scanResult.flags}
                  />
                )}
              </div>
            )}

            {/* TAB CONTENT: RWA RADAR */}
            {activeTab === "rwa" && (
              <div className="glass-card rounded-xl p-8">
                <div className="flex items-center mb-6">
                  <div className="w-10 h-10 rounded-full bg-cyan-500/10 flex items-center justify-center mr-4 border border-cyan-500/20">
                    <Building2 className="w-5 h-5 text-cyan-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-white">
                      Verify Asset Issuer
                    </h3>
                    <p className="text-sm text-slate-500">
                      Check against trusted land registries and issuer lists
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6 mb-6">
                  <div>
                    <label className="block text-xs font-medium text-slate-400 mb-2 uppercase tracking-wider">
                      Issuer Wallet
                    </label>
                    <input
                      type="text"
                      value={issuer}
                      onChange={(e) => setIssuer(e.target.value)}
                      placeholder="0x..."
                      className="w-full bg-[#0F1219] border border-white/10 rounded-lg px-4 py-3 text-white font-mono text-sm focus:ring-2 focus:ring-cyan-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-400 mb-2 uppercase tracking-wider">
                      Asset Identifier
                    </label>
                    <input
                      type="text"
                      value={assetId}
                      onChange={(e) => setAssetId(e.target.value)}
                      placeholder="e.g. LAND-NG-001"
                      className="w-full bg-[#0F1219] border border-white/10 rounded-lg px-4 py-3 text-white font-mono text-sm focus:ring-2 focus:ring-cyan-500 outline-none"
                    />
                  </div>
                </div>

                <button
                  onClick={handleVerify}
                  disabled={loading}
                  className="w-full bg-cyan-600 hover:bg-cyan-500 text-white px-6 py-3 rounded-lg font-medium text-sm transition-all shadow-lg shadow-cyan-900/20 disabled:opacity-50"
                >
                  {loading ? "Verifying Asset..." : "Verify Asset Compliance"}
                </button>

                {rwaError && <ErrorMessage msg={rwaError} />}
                {rwaResult && !rwaError && (
                  <ResultCard
                    isSafe={rwaResult.isSafe}
                    reason={rwaResult.reason}
                    flags={[]}
                  />
                )}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

// --- SUB-COMPONENTS FOR CLEANER CODE ---

function NavItem({
  icon,
  label,
  active,
  onClick,
}: {
  icon: any;
  label: string;
  active: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center px-4 py-3 rounded-lg transition-all text-sm font-medium ${
        active
          ? "bg-blue-600/10 text-blue-400 border border-blue-500/20"
          : "text-slate-400 hover:text-slate-200 hover:bg-white/5"
      }`}
    >
      <span className="mr-3">{icon}</span>
      {label}
    </button>
  );
}

function ErrorMessage({ msg }: { msg: string }) {
  return (
    <div className="mt-6 flex items-center p-4 rounded-lg bg-red-500/5 border border-red-500/20 text-red-400 text-sm">
      <AlertCircle className="w-5 h-5 mr-3 flex-shrink-0" />
      {msg}
    </div>
  );
}

function ResultCard({
  isSafe,
  reason,
  flags,
}: {
  isSafe: boolean;
  reason: string;
  flags: string[];
}) {
  return (
    <div
      className={`mt-8 p-6 rounded-lg border flex items-start justify-between ${
        isSafe
          ? "bg-emerald-500/5 border-emerald-500/20"
          : "bg-red-500/5 border-red-500/20"
      }`}
    >
      <div>
        <div className="flex items-center mb-2">
          <h4
            className={`text-xl font-bold ${
              isSafe ? "text-emerald-400" : "text-red-400"
            }`}
          >
            {isSafe ? "VERIFICATION PASSED" : "RISK DETECTED"}
          </h4>
        </div>
        <p className="text-slate-300 text-sm mb-4">{reason}</p>

        {flags && flags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {flags.map((flag) => (
              <span
                key={flag}
                className="px-2 py-1 bg-[#0F1219] border border-white/10 rounded text-xs text-slate-400 font-mono"
              >
                {flag}
              </span>
            ))}
          </div>
        )}
      </div>
      {isSafe ? (
        <CheckCircle className="w-10 h-10 text-emerald-500 opacity-80" />
      ) : (
        <AlertTriangle className="w-10 h-10 text-red-500 opacity-80" />
      )}
    </div>
  );
}

export default App;
