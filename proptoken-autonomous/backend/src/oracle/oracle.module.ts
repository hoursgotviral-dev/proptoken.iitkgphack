import { Module } from '@nestjs/common';
import { OracleService } from './oracle.service';
import { ExistenceService } from './providers/existence.service';
import { OwnershipService } from './providers/ownership.service';
import { SatelliteService } from './providers/satellite.service';
import { RegistryService } from './providers/registry.service';
import { ActivityService } from './providers/activity.service';

@Module({
    providers: [
        OracleService,
        ExistenceService,
        OwnershipService,
        SatelliteService,
        RegistryService,
        ActivityService,
    ],
    exports: [OracleService],
})
export class OracleModule { }
