import { Module } from '@nestjs/common';
import { LegalWorkflowOrchestrator } from './legal-workflow.orchestrator';
import { LegalEntitiesModule } from '../legal-entities/legal-entities.module';
import { AssetTransferModule } from '../asset-transfer/asset-transfer.module';
import { RightsManagementModule } from '../rights-management/rights-management.module';
import { DocumentGenerationModule } from '../document-generation/document-generation.module';
import { ESignatureModule } from '../esignature/esignature.module';

@Module({
    imports: [
        LegalEntitiesModule,
        AssetTransferModule,
        RightsManagementModule,
        DocumentGenerationModule,
        ESignatureModule,
    ],
    providers: [LegalWorkflowOrchestrator],
    exports: [LegalWorkflowOrchestrator],
})
export class LegalWorkflowModule { }
