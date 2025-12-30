// src/index.ts
import { AgentGuard } from "./modules/agent-guard";
import { RWARadar } from "./modules/rwa-radar"; // Import the new module
import * as dotenv from "dotenv";

dotenv.config();

async function main() {
  const apiKey = process.env.WEBACY_API_KEY;
  if (!apiKey) {
    console.error("❌ ERROR: Missing API Key");
    process.exit(1);
  }

  // Initialize Both Engines
  const guard = new AgentGuard(apiKey);
  const radar = new RWARadar();

  console.log("========================================");
  console.log("🛡️  ARGUS PROTOCOL: ENTERPRISE SUITE");
  console.log("   [1] Agent Guard (Sanctions Firewall)");
  console.log("   [2] RWA Radar (Asset Compliance)");
  console.log("========================================\n");

  // ---------------------------------------------
  // SCENARIO A: The North Korean Hacker (Security Check)
  // ---------------------------------------------
  console.log("--- 🚨 SCENARIO A: SECURITY THREAT ---");
  const hackerAddress = "0x098B716B8Aaf21512996dC57EB0615e2383E2f96"; // Lazarus Group
  const securityResult = await guard.checkAddress(hackerAddress);

  if (!securityResult.isSafe) {
    console.log(`🚫 BLOCKED by Agent Guard: ${securityResult.reason}`);
  } else {
    console.log(`✅ PASSED Agent Guard`);
  }

  // ---------------------------------------------
  // SCENARIO B: The Unverified Land Deal (RWA Check)
  // ---------------------------------------------
  console.log("\n--- 🏢 SCENARIO B: UNVERIFIED ASSET DEAL ---");
  const unknownIssuer = "0x8888888888888888888888888888888888888888"; // Random guy
  const landDeedID = "LAND-NG-ASABA-001";

  const complianceResult = await radar.verifyAsset(
    landDeedID,
    unknownIssuer,
    50000
  );

  if (!complianceResult.isSafe) {
    console.log(`⚠️  FLAGGED by RWA Radar: ${complianceResult.reason}`);
  } else {
    console.log(`✅ VERIFIED by RWA Radar`);
  }

  console.log("\n========================================");
  console.log("System Status: OPERATIONAL");
}

main();
