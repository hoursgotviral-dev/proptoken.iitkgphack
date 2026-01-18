import { Injectable, Logger } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';

export interface AssetTransfer {
    id: string;
    entityId: string;
    assetId: string;
    transferType: string;
    transferDate: string;
    deedUrl: string;
    notarizationId?: string;
    registryConfirmation?: string;
    custodyReceipt?: string;
    status: string;
}

@Injectable()
export class AssetTransferService {
    private readonly logger = new Logger(AssetTransferService.name);
    private transfers = new Map<string, AssetTransfer>();

    async transferAsset(request: {
        entityId: string;
        assetId: string;
        transferType: 'SALE' | 'ASSIGNMENT' | 'LICENSE';
    }): Promise<AssetTransfer> {
        this.logger.log(`Transferring asset ${request.assetId} to entity ${request.entityId} via ${request.transferType}`);

        // Mocking India-specific transfer process
        const transferId = uuidv4();
        const deedUrl = `https://cdn.proptoken.com/docs/deeds/deed-${transferId.slice(0, 8)}.pdf`;

        const transfer: AssetTransfer = {
            id: transferId,
            entityId: request.entityId,
            assetId: request.assetId,
            transferType: request.transferType,
            transferDate: new Date().toISOString().split('T')[0],
            deedUrl: deedUrl,
            notarizationId: `NT-${Math.floor(100000 + Math.random() * 900000)}`,
            registryConfirmation: `IGRS-MH-${Math.floor(10000000 + Math.random() * 90000000)}`,
            custodyReceipt: `CR-${uuidv4().slice(0, 8).toUpperCase()}`,
            status: 'COMPLETED'
        };

        this.transfers.set(transferId, transfer);
        return transfer;
    }

    async getTransfer(id: string): Promise<AssetTransfer> {
        return this.transfers.get(id);
    }
}
