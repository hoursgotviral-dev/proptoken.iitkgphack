export interface OracleEvidence {
    source: string;              // "Satellite", "Registry", etc.
    rawData: any;                // actual fetched data
    derivedSignal: string;       // "Building detected", "Owner match"
    confidence: number;          // 0–1
    explanation: string;         // human-readable
    imageUrl?: string;           // Optional for visual evidence
}

export interface OracleResult {
    category: 'existence' | 'ownership' | 'activity';
    score: number;               // aggregated score
    evidences: OracleEvidence[];
}

export class OracleResultDto {
    submissionId: string;
    results: OracleResult[];
    verifiedAt: string;

    // Legacy fields for backward compatibility with ConsensusService/ABMService
    existence?: { score: number };
    ownership?: { probability: number };
    activity?: { score: number };
}
