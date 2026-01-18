import { Resolver, Query, Args } from '@nestjs/graphql';
import { Token, OrderBook, Trade } from '../types/market.types';

@Resolver(() => Token)
export class TokensResolver {
    @Query(() => [Token], { name: 'tokens' })
    async getTokens(): Promise<Token[]> {
        // Mock data - in production, fetch from blockchain/subgraph
        return [
            {
                address: '0x5FbDB2315678afecb367f032d93F642f64180aa3',
                name: 'DLF Cyber Hub Token',
                symbol: 'DLFCH',
                totalSupply: '10000',
                currentNAV: '100000000',
                navPerToken: '10000',
                holders: 45,
                apy: 8.5,
            },
            {
                address: '0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512',
                name: 'One Horizon Token',
                symbol: 'OHC',
                totalSupply: '5000',
                currentNAV: '75000000',
                navPerToken: '15000',
                holders: 32,
                apy: 9.2,
            },
        ];
    }

    @Query(() => Token, { name: 'token', nullable: true })
    async getToken(@Args('address') address: string): Promise<Token | null> {
        const tokens = await this.getTokens();
        return tokens.find((t) => t.address.toLowerCase() === address.toLowerCase()) || null;
    }

    @Query(() => OrderBook, { name: 'orderBook' })
    async getOrderBook(@Args('tokenAddress') tokenAddress: string): Promise<OrderBook> {
        // Mock order book
        return {
            bids: [
                {
                    id: '1',
                    tokenAddress,
                    type: 'buy',
                    price: 9950,
                    amount: 10,
                    total: 99500,
                    maker: '0x123...',
                    status: 'open',
                    createdAt: new Date().toISOString(),
                },
                {
                    id: '2',
                    tokenAddress,
                    type: 'buy',
                    price: 9900,
                    amount: 25,
                    total: 247500,
                    maker: '0x456...',
                    status: 'open',
                    createdAt: new Date().toISOString(),
                },
            ],
            asks: [
                {
                    id: '3',
                    tokenAddress,
                    type: 'sell',
                    price: 10050,
                    amount: 8,
                    total: 80400,
                    maker: '0xabc...',
                    status: 'open',
                    createdAt: new Date().toISOString(),
                },
                {
                    id: '4',
                    tokenAddress,
                    type: 'sell',
                    price: 10100,
                    amount: 20,
                    total: 202000,
                    maker: '0xdef...',
                    status: 'open',
                    createdAt: new Date().toISOString(),
                },
            ],
        };
    }

    @Query(() => [Trade], { name: 'recentTrades' })
    async getRecentTrades(@Args('tokenAddress') tokenAddress: string): Promise<Trade[]> {
        // Mock recent trades
        return [
            {
                id: '1',
                tokenAddress,
                price: 10000,
                amount: 5,
                buyer: '0x111...',
                seller: '0x222...',
                timestamp: new Date(Date.now() - 60000).toISOString(),
            },
            {
                id: '2',
                tokenAddress,
                price: 9980,
                amount: 12,
                buyer: '0x333...',
                seller: '0x444...',
                timestamp: new Date(Date.now() - 120000).toISOString(),
            },
        ];
    }
}
