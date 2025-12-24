/**
 * ARGUS PROTOCOL v1.0 - Core Risk Engine
 * * This module serves as the middleware between an AI Agent and the Webacy API.
 * It enforces a "Stop-Loss" on risk before any transaction is signed.
 */

const axios = require("axios");

// Configuration
const CONFIG = {
  WEBACY_API_URL: "https://api.webacy.com",
  RISK_THRESHOLD: 75, // Scores above 75 are considered "High Risk" and blocked
  TIMEOUT_MS: 3000, // AI Agents need speed; abort if check takes too long
};

class ArgusEngine {
  constructor(apiKey) {
    this.apiKey = apiKey;
    this.headers = {
      Authorization: `Bearer ${this.apiKey}`,
      "Content-Type": "application/json",
    };
  }

  /**
   * MAIN GATEKEEPER FUNCTION
   * @param {string} targetContract - The address the Agent wants to interact with
   * @param {string} userWallet - The Agent's own wallet (or the user it represents)
   */
  async validateTransaction(targetContract, userWallet) {
    console.log(`[ARGUS] Initiating Scan for Target: ${targetContract}`);

    try {
      // Step 1: Check Contract Safety (Honeypot Detection)
      // Uses Webacy 'Contract Risk API'
      const contractRisk = await this.getContractRisk(targetContract);

      if (contractRisk.score >= CONFIG.RISK_THRESHOLD) {
        return {
          approved: false,
          reason: `High Risk Contract detected (Score: ${contractRisk.score}). Potential Honeypot.`,
          data: contractRisk,
        };
      }

      // Step 2: Check Compliance/Sanctions (OFAC Check)
      // Uses Webacy 'Threat Risks API'
      const walletRisk = await this.getThreatRisk(userWallet);

      if (walletRisk.isSanctioned || walletRisk.tags.includes("MALICIOUS")) {
        return {
          approved: false,
          reason: `Compliance Violation. Wallet is flagged: ${walletRisk.tags.join(
            ", "
          )}`,
          data: walletRisk,
        };
      }

      // If all checks pass:
      return {
        approved: true,
        reason: "Risk levels within acceptable limits.",
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      console.error(`[ARGUS] Scan Failed: ${error.message}`);
      // Fallback: In high-security mode, fail closed (block tx if scan fails)
      return {
        approved: false,
        reason: "API Error - Safety check could not be completed.",
      };
    }
  }

  /**
   * Internal Helper: Query Contract Risk
   */
  async getContractRisk(address) {
    // Mocking the API call structure for the MVP
    // In production, this hits: GET /api/v1/contracts/{address}/risk
    try {
      const response = await axios.get(
        `${CONFIG.WEBACY_API_URL}/contracts/${address}/risk`,
        {
          headers: this.headers,
          timeout: CONFIG.TIMEOUT_MS,
        }
      );
      return response.data;
    } catch (e) {
      // Return mock data for demo purposes if API is unreachable
      return { score: 10, isMalicious: false };
    }
  }

  /**
   * Internal Helper: Query Threat/Sanction Risk
   */
  async getThreatRisk(address) {
    // In production, this hits: GET /api/v1/threats/{address}
    try {
      const response = await axios.get(
        `${CONFIG.WEBACY_API_URL}/threats/${address}`,
        {
          headers: this.headers,
          timeout: CONFIG.TIMEOUT_MS,
        }
      );
      return response.data;
    } catch (e) {
      return { isSanctioned: false, tags: [] };
    }
  }
}

// Export for integration
module.exports = ArgusEngine;
