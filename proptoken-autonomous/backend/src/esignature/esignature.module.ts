import { Module } from '@nestjs/common';
import { ESignatureService } from './esignature.service';

@Module({
    providers: [ESignatureService],
    exports: [ESignatureService],
})
export class ESignatureModule { }
