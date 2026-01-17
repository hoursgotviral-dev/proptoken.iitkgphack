import { Module } from '@nestjs/common';
import { TokensResolver } from './tokens.resolver';

@Module({
    providers: [TokensResolver],
})
export class TokensModule { }
