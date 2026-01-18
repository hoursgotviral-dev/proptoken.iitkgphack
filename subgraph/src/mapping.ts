import { BigInt, Address } from "@graphprotocol/graph-ts";
import {
    Token,
    Transfer,
    NAVUpdate,
    TokenHolder,
} from "../generated/schema";
import {
    Transfer as TransferEvent,
    NAVUpdated as NAVUpdatedEvent,
} from "../generated/RWASecurityToken/RWASecurityToken";

export function handleTransfer(event: TransferEvent): void {
    let token = Token.load(event.address.toHex());
    if (!token) {
        token = new Token(event.address.toHex());
        token.name = "RWA Security Token";
        token.symbol = "RWA";
        token.totalSupply = BigInt.fromI32(0);
        token.currentNAV = BigInt.fromI32(0);
        token.navPerToken = BigInt.fromI32(0);
        token.createdAt = event.block.timestamp;
    }

    // Create transfer entity
    let transfer = new Transfer(
        event.transaction.hash.toHex() + "-" + event.logIndex.toString()
    );
    transfer.token = token.id;
    transfer.from = event.params.from;
    transfer.to = event.params.to;
    transfer.amount = event.params.value;
    transfer.timestamp = event.block.timestamp;
    transfer.blockNumber = event.block.number;
    transfer.transactionHash = event.transaction.hash;
    transfer.save();

    // Update token holder balances
    updateTokenHolder(token, event.params.from, event.params.value.neg(), event.block.timestamp);
    updateTokenHolder(token, event.params.to, event.params.value, event.block.timestamp);

    token.updatedAt = event.block.timestamp;
    token.save();
}

export function handleNAVUpdated(event: NAVUpdatedEvent): void {
    let token = Token.load(event.address.toHex());
    if (!token) return;

    let navUpdate = new NAVUpdate(
        event.transaction.hash.toHex() + "-" + event.logIndex.toString()
    );
    navUpdate.token = token.id;
    navUpdate.oldNAV = token.currentNAV;
    navUpdate.newNAV = event.params.newNAV;
    navUpdate.navPerToken = event.params.navPerToken;
    navUpdate.timestamp = event.block.timestamp;
    navUpdate.blockNumber = event.block.number;
    navUpdate.transactionHash = event.transaction.hash;
    navUpdate.save();

    token.currentNAV = event.params.newNAV;
    token.navPerToken = event.params.navPerToken;
    token.save();
}

function updateTokenHolder(
    token: Token,
    address: Address,
    amount: BigInt,
    timestamp: BigInt
): void {
    if (address.toHex() == "0x0000000000000000000000000000000000000000") {
        return; // Skip zero address
    }

    let holderId = address.toHex() + "-" + token.id;
    let holder = TokenHolder.load(holderId);

    if (!holder) {
        holder = new TokenHolder(holderId);
        holder.token = token.id;
        holder.address = address;
        holder.balance = BigInt.fromI32(0);
        holder.firstPurchaseTime = timestamp;
    }

    holder.balance = holder.balance.plus(amount);
    holder.lastActivityTime = timestamp;
    holder.save();
}
