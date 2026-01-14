import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class ConsensusService {
    private readonly logger = new Logger(ConsensusService.name);

    calculateScore(oracleResults: any, abmResults: any) {
        this.logger.log('Calculating consensus score...');

        const existenceScore = oracleResults.existence?.score || 0;
        const ownershipProb = oracleResults.ownership?.probability || 0;
        const fraudLikelihood = abmResults.fraud?.fraud_likelihood || 100;

        // Hard Rules
        const isEligible =
            existenceScore >= 0.9 &&
            ownershipProb >= 0.8 &&
            fraudLikelihood <= 5.0;

        return {
            eligible: isEligible,
            scores: {
                existence: existenceScore,
                ownership: ownershipProb,
                fraud: fraudLikelihood,
            },
            timestamp: new Date().toISOString()
        };
    }
}
