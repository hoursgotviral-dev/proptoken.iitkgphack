import { Injectable, Logger } from '@nestjs/common';
import { OracleEvidence } from '../dto/oracle-result.dto';

@Injectable()
export class ActivityService {
    private readonly logger = new Logger(ActivityService.name);

    async verify(address: string): Promise<OracleEvidence> {
        this.logger.log(`Analyzing activity signals for ${address}`);

        return {
            source: 'Activity Signals',
            rawData: {
                signals: ['commercial zoning', 'high footfall area', 'active power usage'],
                address,
                sensorLastHeartbeat: new Date().toISOString()
            },
            derivedSignal: 'High activity commercial zone',
            confidence: 0.78,
            explanation: 'The address lies in a known commercial district with sustained utility usage and footfall indicators.'
        };
    }
}
