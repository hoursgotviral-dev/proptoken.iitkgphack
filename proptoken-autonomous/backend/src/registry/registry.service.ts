import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class RegistryService {
    private readonly logger = new Logger(RegistryService.name);

    // Mock on-chain registry
    private registry = new Map<string, any>();

    async registerAsset(submissionId: string, consensusResult: any) {
        if (!consensusResult.eligible) {
            this.logger.warn(`Asset ${submissionId} not eligible for registration.`);
            return;
        }

        this.logger.log(`Registering asset ${submissionId} on-chain...`);

        // In real implementation: Call Smart Contract via Ethers.js / Viem

        const registrationRecord = {
            assetId: submissionId,
            ...consensusResult,
            txHash: '0xmocktransactionhash',
            registeredAt: new Date().toISOString()
        };

        this.registry.set(submissionId, registrationRecord);
        return registrationRecord;
    }
}
