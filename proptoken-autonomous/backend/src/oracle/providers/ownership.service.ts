import { Injectable } from '@nestjs/common';
import { OracleEvidence, OracleResult } from '../dto/oracle-result.dto';

@Injectable()
export class OwnershipService {
    aggregate(evidences: OracleEvidence[]): OracleResult {
        const score = evidences.reduce((s, e) => s + e.confidence, 0) / evidences.length;

        return {
            category: 'ownership',
            score,
            evidences,
        };
    }
}
