// ABM Types for Frontend

export type AssetCategory = 'real-estate' | 'private-credit' | 'commodity' | 'ip-rights';
export type VerificationStatus = 'PENDING' | 'PROCESSING' | 'ORACLE_VERIFICATION' | 'ABM_ANALYSIS' | 'FRAUD_DETECTION' | 'CONSENSUS_SCORING' | 'ELIGIBLE' | 'REJECTED';
export type RiskLevel = 'low' | 'medium' | 'high' | 'critical';

export interface GeoCoordinates {
  lat: number;
  lng: number;
}

export interface AssetLocation {
  address: string;
  coordinates: GeoCoordinates;
  city: string;
  state: string;
  country: string;
  postalCode: string;
}

export interface AssetSpecifications {
  size: number;
  type: string;
  age: number;
  condition: 'excellent' | 'good' | 'fair' | 'poor';
  floors?: number;
  units?: number;
}

export interface SPVDetails {
  spvName: string;
  spvRegistrationNumber: string;
  jurisdiction: string;
  incorporationDate: string;
  registeredAddress: string;
  directors: string[];
  shareholderStructure: {
    holder: string;
    percentage: number;
  }[];
}

export interface AssetFinancials {
  currentRent: number;
  expectedYield: number;
  annualExpenses: number;
  occupancyRate: number;
  tenantCount: number;
  leaseTermsMonths: number;
  historicalCashFlow: {
    month: string;
    income: number;
    expenses: number;
  }[];
}

export interface AssetSubmission {
  id: string;
  submitterId: string;
  walletAddress: string;
  did?: string;
  signature: string;
  category: AssetCategory;
  assetName: string;
  location: AssetLocation;
  specifications: AssetSpecifications;
  spv: SPVDetails;
  registryIds: string[];
  documentUrls: string[];
  imageUrls: string[];
  videoUrls: string[];
  financials: AssetFinancials;
  claimedValue: number;
  tokenizationIntent: string;
  targetRaise: number;
  status: VerificationStatus;
  createdAt: string;
  updatedAt: string;
}

export interface VerificationProgress {
  submissionId: string;
  currentStage: VerificationStatus;
  stages: {
    submission: { completed: boolean; timestamp?: string };
    oracleVerification: {
      completed: boolean;
      timestamp?: string;
      progress: number;
      subStages: {
        satellite: { completed: boolean; score?: number };
        registry: { completed: boolean; score?: number };
        vision: { completed: boolean; score?: number };
        activity: { completed: boolean; score?: number };
        ownership: { completed: boolean; score?: number };
      };
    };
    abmAnalysis: {
      completed: boolean;
      timestamp?: string;
      progress: number;
      subStages: {
        marketIntelligence: { completed: boolean; score?: number };
        cashFlowSimulation: { completed: boolean };
        riskSimulation: { completed: boolean; score?: number };
      };
    };
    fraudDetection: {
      completed: boolean;
      timestamp?: string;
      progress: number;
      subStages: {
        ruleBased: { completed: boolean; anomalies?: number };
        mlBased: { completed: boolean; score?: number };
        patterns: { completed: boolean };
      };
    };
    consensusScoring: {
      completed: boolean;
      timestamp?: string;
      eligible?: boolean;
      confidence?: number;
    };
  };
  logs: {
    timestamp: string;
    stage: string;
    message: string;
    level: 'info' | 'warning' | 'error' | 'success';
  }[];
}

export interface EligibleAsset {
  id: string;
  submissionId: string;
  fingerprint: string;
  assetName: string;
  category: AssetCategory;
  location: AssetLocation;
  spv: SPVDetails;
  oracleAttestation: string;
  existenceScore: number;
  ownershipProbability: number;
  abmOutputHash: string;
  expectedNAV: { min: number; max: number; mean: number };
  expectedYield: { min: number; max: number; expected: number };
  riskScore: number;
  fraudLikelihood: number;
  consensusConfidence: number;
  totalTokenSupply: number;
  tokenPrice: number;
  availableTokens: number;
  cashFlowClaims: {
    claimantId: string;
    tokensOwned: number;
    percentageExposure: number;
    expectedMonthlyCF: number;
  }[];
  eligibilityTimestamp: string;
  lastUpdated: string;
}

export interface ConsensusScore {
  submissionId: string;
  existenceScore: number;
  ownershipProbability: number;
  activityScore: number;
  fraudLikelihood: number;
  riskScore: number;
  rules: {
    rule: string;
    threshold: number;
    actualValue: number;
    passed: boolean;
  }[];
  allRulesPassed: boolean;
  eligible: boolean;
  confidence: number;
  rejectionReason: string | null;
  timestamp: string;
}

export interface SubmissionFormData {
  // Identity
  submitterId: string;
  walletAddress: string;
  did: string;
  signature: string;
  
  // Asset Info
  category: AssetCategory;
  assetName: string;
  location: AssetLocation;
  specifications: AssetSpecifications;
  
  // SPV
  spv: SPVDetails;
  
  // Documents
  registryIds: string[];
  documentUrls: string[];
  imageUrls: string[];
  videoUrls: string[];
  
  // Financials
  financials: AssetFinancials;
  
  // Valuation
  claimedValue: number;
  tokenizationIntent: string;
  targetRaise: number;
}
