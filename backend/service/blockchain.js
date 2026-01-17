
export async function lockCollateralOnChain(tokenId, amount) {
  console.log(`🔒 Locking ${amount} tokens of ${tokenId} on-chain`);

  return {
    success: true,
    txHash: "0x" + Math.random().toString(16).substring(2)
  };
}

export async function swapTokensOnChain({ userWallet, tokenId, amount }) {
  console.log(`🔁 Swapping ${amount} tokens of ${tokenId} on-chain`);


  const receivedAmount = amount * 5000;

  return {
    success: true,
    receivedAmount,
    txHash: "0x" + Math.random().toString(16).substring(2)
  };
}

