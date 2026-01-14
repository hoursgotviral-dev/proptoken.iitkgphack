import { Module } from '@nestjs/common';
import { ABMService } from './abm.service';

@Module({
    providers: [ABMService],
    exports: [ABMService],
})
export class ABMModule { }
