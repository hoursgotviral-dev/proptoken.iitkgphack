import { Injectable, Logger } from '@nestjs/common';
import { ExistenceService } from './providers/existence.service';
import { OwnershipService } from './providers/ownership.service';
import { SatelliteService } from './providers/satellite.service';
import { RegistryService } from './providers/registry.service';
import { ActivityService } from './providers/activity.service';
import { OracleResultDto, OracleResult } from './dto/oracle-result.dto';

@Injectable()
export class OracleService {
    private readonly logger = new Logger(OracleService.name);

    constructor(
        private readonly existenceService: ExistenceService,
        private readonly ownershipService: OwnershipService,
        private readonly satelliteService: SatelliteService,
        private readonly registryService: RegistryService,
        private readonly activityService: ActivityService,
    ) { }

    async verify(submission: any): Promise<OracleResultDto> {
        this.logger.log(`Verifying submission: ${submission.id}`);

        const { location, registryIds, ownerName, address } = submission;
        const coordinates = location?.coordinates || [28.4949, 77.0887];
        const city = location?.city || 'Gurugram';
        const mainRegistryId = registryIds?.[0] || 'REG-GGM-12345';
        const normalizedOwner = ownerName || submission.did || 'ABC Realty Pvt Ltd';

        // 1. Fetch individual evidences
        const satelliteEvidence = await this.satelliteService.verify(coordinates);
        const registryEvidence = await this.registryService.verify(mainRegistryId, normalizedOwner, city);
        const activityEvidence = await this.activityService.verify(address || city);

        // 2. Aggregate existence result
        const existenceResult = this.existenceService.aggregate([
            satelliteEvidence,
            activityEvidence,
        ]);

        // 3. Aggregate ownership result
        const ownershipResult = this.ownershipService.aggregate([
            registryEvidence,
        ]);

        // 4. Activity category (simple mapping for structure)
        const activityResult: OracleResult = {
            category: 'activity',
            score: activityEvidence.confidence,
            evidences: [activityEvidence]
        };

        const results = [existenceResult, ownershipResult, activityResult];

        return {
            submissionId: submission.id,
            results,
            verifiedAt: new Date().toISOString(),
            // Legacy fields for backward compatibility
            existence: { score: existenceResult.score },
            ownership: { probability: ownershipResult.score },
            activity: { score: activityResult.score }
        };
    }
}
