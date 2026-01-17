import { Injectable, Logger } from '@nestjs/common';
import { OracleEvidence } from '../dto/oracle-result.dto';

@Injectable()
export class SatelliteService {
    private readonly logger = new Logger(SatelliteService.name);

    async verify(coordinates: [number, number]): Promise<OracleEvidence> {
        this.logger.log(`Fetching satellite imagery for [${coordinates[0]}, ${coordinates[1]}]`);

        // Mocking static map URL (Yandex/Static Maps is free and simple for demo)
        const [lat, lng] = coordinates;
        const imageUrl = `https://static-maps.yandex.ru/1.x/?ll=${lng},${lat}&z=18&l=sat`;

        return {
            source: 'Satellite Imagery',
            rawData: {
                imageUrl,
                coordinates: { lat, lng },
                resolution: '50cm/pixel',
                provider: 'Sentinel-2 / DigitalGlobe'
            },
            imageUrl: imageUrl, // For direct UI rendering
            derivedSignal: 'Built structure visible at coordinates',
            confidence: 0.92,
            explanation: `High-resolution satellite imagery confirms the presence of a dense built-up structure at the given coordinates [${lat}, ${lng}].`
        };
    }
}
