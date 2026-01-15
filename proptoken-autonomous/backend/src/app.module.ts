import { Module } from '@nestjs/common';
import { SubmissionModule } from './submission/submission.module';
import { OracleModule } from './oracle/oracle.module';
import { LegalWorkflowModule } from './legal-workflow/legal-workflow.module';
import { MarketModule } from './market/market.module';

@Module({
    imports: [
        SubmissionModule,
        OracleModule,
        LegalWorkflowModule,
        MarketModule,
    ],
    controllers: [],
    providers: [],
})
export class AppModule { }
