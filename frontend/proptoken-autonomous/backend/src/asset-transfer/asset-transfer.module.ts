import { Module } from '@nestjs/common';
import { AssetTransferService } from './asset-transfer.service';

@Module({
    providers: [AssetTransferService],
    exports: [AssetTransferService],
})
export class AssetTransferModule { }
