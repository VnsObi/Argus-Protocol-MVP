// src/modules/agent-guard.ts
import axios from "axios";
import { RiskAssessment } from "../config/types";

export class AgentGuard {
  private apiKey: string;
  private baseUrl: string = "https://api.webacy.com";

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async checkAddress(targetAddress: string): Promise<RiskAssessment> {
    try {
      console.log(`🛡️  Argus Guard: Scanning ${targetAddress}...`);

      const url = `${this.baseUrl}/addresses/sanctioned/${targetAddress}?chain=eth`;

      const response = await axios.get(url, {
        headers: {
          "x-api-key": this.apiKey,
          accept: "application/json",
        },
      });

      // The Server confirmed structure: { address: "0x...", is_sanctioned: boolean }
      const data = response.data as any;

      if (data.is_sanctioned === true) {
        return {
          isSafe: false,
          riskScore: 100,
          reason: "CRITICAL: Address is on Global Sanctions List (OFAC)",
          flags: ["SANCTIONED", "LAZARUS_GROUP_LINKED"],
        };
      }

      return {
        isSafe: true,
        riskScore: 0,
        reason: "Address is Clean.",
        flags: [],
      };
    } catch (error: any) {
      console.error(`❌ API Error: ${error.message}`);
      return {
        isSafe: false,
        riskScore: -1,
        reason: "Scan Failed",
        flags: ["API_ERROR"],
      };
    }
  }
}
