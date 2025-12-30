// agent_demo.js - Simulates an AI Agent checking Argus before a trade
const axios = require("axios"); // We use the package you already installed

// --- CONFIGURATION ---
const ARGUS_API_URL = "https://argus-protocol-mvp.onrender.com/api/scan";
const TARGET_ADDRESS = "0x098B716B8Aaf21512996dC57EB0615e2383E2f96"; // Risky Address

async function runAgentTransaction() {
  console.log(`\n🤖 AI AGENT: Initiating transaction to ${TARGET_ADDRESS}...`);
  console.log("🛡️  ARGUS PROTOCOL: Scanning contract before execution...\n");

  try {
    // 1. Call the Live Argus API
    const response = await axios.get(
      `${ARGUS_API_URL}?address=${TARGET_ADDRESS}`
    );
    const data = response.data;

    // 2. Display Analysis
    console.log(`📊 ANALYSIS COMPLETE:`);
    console.log(`   • Risk Score: ${data.riskScore}/100`);
    console.log(`   • Verdict:    ${data.recommendation}`);
    console.log("-".repeat(40));

    // 3. AI LOGIC DECISION (The Middleware Logic)
    if (data.riskScore > 70 || data.recommendation === "BLOCK") {
      console.log(`⛔ CRITICAL ALERT: High Risk Detected!`);
      console.log(`🤖 AI AGENT: Transaction ABORTED. Assets protected.`);
    } else {
      console.log(`✅ SAFETY CHECK PASSED.`);
      console.log(`🤖 AI AGENT: Executing Transaction...`);
    }
  } catch (error) {
    console.error("❌ Error connecting to Argus API:", error.message);
  }
}

// Run the bot
runAgentTransaction();
