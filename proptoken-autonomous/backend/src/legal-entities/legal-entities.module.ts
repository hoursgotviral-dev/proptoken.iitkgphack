import { Module } from '@nestjs/common';
import { LegalEntitiesService } from './legal-entities.service';

@Module({
    providers: [LegalEntitiesService],
    exports: [LegalEntitiesService],
})
export class LegalEntitiesModule { }
