import { Injectable, Logger } from '@nestjs/common';
import { LegalEntitiesService, EntityType } from '../legal-entities/legal-entities.service';
import { AssetTransferService } from '../asset-transfer/asset-transfer.service';
import { RightsManagementService } from '../rights-management/rights-management.service';
import { DocumentGenerationService } from '../document-generation/document-generation.service';
import { ESignatureService } from '../esignature/esignature.service';

export enum WorkflowStatus {
    INITIATED = 'INITIATED',
    ENTITY_FORMED = 'ENTITY_FORMED',
    ASSET_TRANSFERRED = 'ASSET_TRANSFERRED',
    RIGHTS_DEFINED = 'RIGHTS_DEFINED',
    DOCS_GENERATED = 'DOCS_GENERATED',
    SIGNATURES_COLLECTED = 'SIGNATURES_COLLECTED',
    COMPLETED = 'COMPLETED',
    FAILED = 'FAILED'
}

@Injectable()
export class LegalWorkflowOrchestrator {
    private readonly logger = new Logger(LegalWorkflowOrchestrator.name);
    private workflows = new Map<string, any>();

    constructor(
        private readonly entityService: LegalEntitiesService,
        private readonly transferService: AssetTransferService,
        private readonly rightsService: RightsManagementService,
        private readonly docService: DocumentGenerationService,
        private readonly signatureService: ESignatureService,
    ) { }

    async startWorkflow(assetId: string) {
        const workflowId = `WF-${Date.now()}`;
        this.logger.log(`Starting legal workflow ${workflowId} for asset ${assetId}`);

        const state = {
            id: workflowId,
            assetId,
            status: WorkflowStatus.INITIATED,
            history: []
        };
        this.workflows.set(workflowId, state);

        // Run the workflow steps sequentially
        this.runWorkflow(workflowId);

        return workflowId;
    }

    private async runWorkflow(workflowId: string) {
        const state = this.workflows.get(workflowId);
        if (!state) return;

        try {
            // 1. Entity Formation
            const entity = await this.entityService.formEntity({
                assetId: state.assetId,
                entityType: EntityType.SPV,
                jurisdiction: 'India',
                purpose: 'RWA Tokenization'
            });
            state.status = WorkflowStatus.ENTITY_FORMED;
            state.history.push({ step: 'ENTITY_FORMATION', result: entity });

            // 2. Asset Transfer
            const transfer = await this.transferService.transferAsset({
                entityId: entity.id,
                assetId: state.assetId,
                transferType: 'ASSIGNMENT'
            });
            state.status = WorkflowStatus.ASSET_TRANSFERRED;
            state.history.push({ step: 'ASSET_TRANSFER', result: transfer });

            // 3. Rights Definition
            const rights = await this.rightsService.defineRights(entity.id, {});
            const capTable = await this.rightsService.initializeCapTable(entity.id, rights, {});
            state.status = WorkflowStatus.RIGHTS_DEFINED;
            state.history.push({ step: 'RIGHTS_DEFINITION', result: { rights, capTable } });

            // 4. Document Generation
            const documents = await this.docService.generateDocuments(entity.id);
            state.status = WorkflowStatus.DOCS_GENERATED;
            state.history.push({ step: 'DOC_GENERATION', result: documents });

            // 5. E-Signature
            for (const doc of documents) {
                await this.signatureService.sendForSignature(doc.id, ['Signatory 1', 'Custodian']);
            }
            // Simple mock: assume signatures are collected
            state.status = WorkflowStatus.SIGNATURES_COLLECTED;
            state.history.push({ step: 'SIGNATURE_COLLECTION', result: 'All signatures requested' });

            state.status = WorkflowStatus.COMPLETED;
            this.logger.log(`Legal workflow ${workflowId} completed successfully`);

        } catch (error) {
            state.status = WorkflowStatus.FAILED;
            this.logger.error(`Legal workflow ${workflowId} failed`, error);
        }
    }

    getWorkflowStatus(id: string) {
        return this.workflows.get(id);
    }
}
