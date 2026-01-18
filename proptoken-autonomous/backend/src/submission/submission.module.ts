import { Module } from '@nestjs/common';
import { SubmissionController } from './submission.controller';
import { SubmissionService } from './submission.service';
import { ABMModule } from '../abm/abm.module';
import { OracleModule } from '../oracle/oracle.module';
import { ConsensusModule } from '../consensus/consensus.module';
import { RegistryModule } from '../registry/registry.module';
import { LegalWorkflowModule } from '../legal-workflow/legal-workflow.module';

@Module({
    imports: [OracleModule, ABMModule, ConsensusModule, RegistryModule, LegalWorkflowModule],
    controllers: [SubmissionController],
    providers: [SubmissionService],
    exports: [SubmissionService]
})
export class SubmissionModule { }
