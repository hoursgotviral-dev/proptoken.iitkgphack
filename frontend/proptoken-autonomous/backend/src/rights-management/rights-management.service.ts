import { Injectable, Logger } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';

export interface ClaimRights {
    id: string;
    entityId: string;
    claimClass: string;
    incomeRights: any;
    redemptionRights: any;
    votingRights: any;
    priority: number;
    lossAbsorption: number;
}

export interface CapTableEntry {
    id: string;
    entityId: string;
    claimClass: string;
    unitsAuthorized: number;
    unitsIssued: number;
    unitsOutstanding: number;
    unitPrice: number;
    totalValue: number;
}

@Injectable()
export class RightsManagementService {
    private readonly logger = new Logger(RightsManagementService.name);
    private rights = new Map<string, ClaimRights[]>();
    private capTables = new Map<string, CapTableEntry[]>();

    async defineRights(entityId: string, claimDesign: any): Promise<ClaimRights[]> {
        this.logger.log(`Defining rights for entity ${entityId}`);

        // Mocking conversion from autonomous claims to legal rights
        const classes = ['SENIOR', 'JUNIOR'];
        const claimRights: ClaimRights[] = classes.map((cls, idx) => ({
            id: uuidv4(),
            entityId,
            claimClass: cls,
            incomeRights: {
                type: cls === 'SENIOR' ? 'FIXED' : 'VARIABLE',
                percentage: cls === 'SENIOR' ? 8 : 15,
                priority: idx + 1
            },
            redemptionRights: {
                mechanism: 'ASYNC',
                noticePeriod: 30
            },
            votingRights: {
                enabled: cls === 'JUNIOR',
                matters: ['Liquidation', 'Strategy Change']
            },
            priority: idx + 1,
            lossAbsorption: cls === 'JUNIOR' ? 20 : 0
        }));

        this.rights.set(entityId, claimRights);
        return claimRights;
    }

    async initializeCapTable(entityId: string, rights: ClaimRights[], navData: any): Promise<CapTableEntry[]> {
        this.logger.log(`Initializing cap table for entity ${entityId}`);

        const entries: CapTableEntry[] = rights.map(r => ({
            id: uuidv4(),
            entityId,
            claimClass: r.claimClass,
            unitsAuthorized: 1000000,
            unitsIssued: 0,
            unitsOutstanding: 0,
            unitPrice: 10, // ₹10 or $10
            totalValue: 10000000
        }));

        this.capTables.set(entityId, entries);
        return entries;
    }

    async getCapTable(entityId: string): Promise<CapTableEntry[]> {
        return this.capTables.get(entityId) || [];
    }
}
