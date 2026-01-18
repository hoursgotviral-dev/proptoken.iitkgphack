import { Module } from '@nestjs/common';
import { RightsManagementService } from './rights-management.service';

@Module({
    providers: [RightsManagementService],
    exports: [RightsManagementService],
})
export class RightsManagementModule { }
