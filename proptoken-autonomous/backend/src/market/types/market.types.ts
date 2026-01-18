import { ObjectType, Field, ID, Float } from '@nestjs/graphql';

@ObjectType()
export class Token {
    @Field(() => ID)
    address: string;

    @Field()
    name: string;

    @Field()
    symbol: string;

    @Field()
    totalSupply: string;

    @Field()
    currentNAV: string;

    @Field()
    navPerToken: string;

    @Field(() => Float)
    holders: number;

    @Field(() => Float)
    apy: number;
}

@ObjectType()
export class Order {
    @Field(() => ID)
    id: string;

    @Field()
    tokenAddress: string;

    @Field()
    type: string; // 'buy' | 'sell'

    @Field(() => Float)
    price: number;

    @Field(() => Float)
    amount: number;

    @Field(() => Float)
    total: number;

    @Field()
    maker: string;

    @Field()
    status: string; // 'open' | 'filled' | 'cancelled'

    @Field()
    createdAt: string;
}

@ObjectType()
export class Trade {
    @Field(() => ID)
    id: string;

    @Field()
    tokenAddress: string;

    @Field(() => Float)
    price: number;

    @Field(() => Float)
    amount: number;

    @Field()
    buyer: string;

    @Field()
    seller: string;

    @Field()
    timestamp: string;
}

@ObjectType()
export class OrderBook {
    @Field(() => [Order])
    bids: Order[];

    @Field(() => [Order])
    asks: Order[];
}
