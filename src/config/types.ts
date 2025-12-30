// src/config/types.ts

export interface RiskAssessment {
  isSafe: boolean; // Can the agent proceed? (True/False)
  riskScore: number; // 0-100 Score
  reason: string; // Why was it blocked?
  flags: string[]; // List of specific threats (e.g., "Phishing", "Honeypot")
}

export interface WebacyThreatResponse {
  score: number;
  level: string; // 'low', 'medium', 'high', 'critical'
  tags: Array<{
    name: string;
    key: string;
    severity: number;
  }>;
}
