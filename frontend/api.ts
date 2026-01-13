
import { User, Wallet, ActionHistory } from './types.ts';
import { db } from './db.ts';
import { DUMMY_ASSETS } from './constants.tsx';

export const api = {
  async getCurrentUser(): Promise<{ user: User; wallet: Wallet } | null> {
    const user = db.getCurrentUser();
    if (!user) return null;
    const wallet = db.getWallet(user.email);
    return { user, wallet };
  },

  async login(email: string): Promise<User | null> {
    const users = db.getUsers();
    const user = users.find(u => u.email === email);
    if (user) {
      db.setCurrentUser(user);
      return user;
    }
    return null;
  },

  async register(name: string, email: string): Promise<User> {
    const newUser: User = { name, email };
    db.saveUser(newUser);
    db.setCurrentUser(newUser);
    return newUser;
  },

  async logout() {
    db.setCurrentUser(null);
  },

  async connectWallet(email: string, address: string): Promise<User> {
    db.updateUser(email, { walletAddress: address });
    const user = db.getCurrentUser();
    return user!;
  },

  async getWallet(email: string): Promise<Wallet> {
    return db.getWallet(email);
  },

  async buyTokens(email: string, assetId: string, amount: number): Promise<{ txHash: string; wallet: Wallet }> {
    const wallet = db.getWallet(email);
    const asset = DUMMY_ASSETS.find(a => a.id === assetId);
    const price = asset?.tokenPrice || 5000;
    const cost = amount * price;
    
    wallet.tokensByAsset[assetId] = (Number(wallet.tokensByAsset[assetId]) || 0) + amount;
    wallet.stablecoinBalance -= cost;
    wallet.totalInvested += cost;
    
    const action: ActionHistory = {
      id: Math.random().toString(36).substring(2, 11),
      type: 'BUY_TOKENS',
      description: `Bought ${amount} units of ${asset?.name || assetId}`,
      timestamp: new Date().toISOString(),
      amount: `₹${cost.toLocaleString()}`,
      txHash: '0x' + Array.from({length: 40}, () => Math.floor(Math.random() * 16).toString(16)).join('')
    };
    
    wallet.history.unshift(action);
    db.updateWallet(email, wallet);
    return { txHash: action.txHash!, wallet };
  },

  async swapToStable(email: string, assetId: string, amount: number): Promise<{ txHash: string; wallet: Wallet }> {
    const wallet = db.getWallet(email);
    const asset = DUMMY_ASSETS.find(a => a.id === assetId);
    const price = asset?.tokenPrice || 5000;
    const value = amount * price;
    
    const currentTokens = Number(wallet.tokensByAsset[assetId]) || 0;
    if (currentTokens < amount) throw new Error("Insufficient units for liquidation");

    wallet.tokensByAsset[assetId] = currentTokens - amount;
    wallet.stablecoinBalance += value;
    wallet.totalInvested = Math.max(0, wallet.totalInvested - value);

    const action: ActionHistory = {
      id: Math.random().toString(36).substring(2, 11),
      type: 'SWAP',
      description: `Liquidated ${amount} units of ${asset?.name || assetId} to INR`,
      timestamp: new Date().toISOString(),
      amount: `₹${value.toLocaleString()}`,
      txHash: '0x' + Array.from({length: 40}, () => Math.floor(Math.random() * 16).toString(16)).join('')
    };

    wallet.history.unshift(action);
    db.updateWallet(email, wallet);
    return { txHash: action.txHash!, wallet };
  },

  async lockCollateral(email: string, assetId: string, amount: number): Promise<{ txHash: string; wallet: Wallet }> {
    const wallet = db.getWallet(email);
    const asset = DUMMY_ASSETS.find(a => a.id === assetId);
    const price = asset?.tokenPrice || 5000;
    const value = amount * price;
    
    const currentTokens = Number(wallet.tokensByAsset[assetId]) || 0;
    if (currentTokens < amount) throw new Error("Insufficient units for collateral");

    wallet.tokensByAsset[assetId] = currentTokens - amount;
    wallet.lockedCollateral += value;

    const action: ActionHistory = {
      id: Math.random().toString(36).substring(2, 11),
      type: 'COLLATERAL_LOCK',
      description: `Locked ${amount} units of ${asset?.name || assetId} as collateral`,
      timestamp: new Date().toISOString(),
      txHash: '0x' + Array.from({length: 40}, () => Math.floor(Math.random() * 16).toString(16)).join('')
    };

    wallet.history.unshift(action);
    db.updateWallet(email, wallet);
    return { txHash: action.txHash!, wallet };
  },

  async pay(email: string, amount: number): Promise<{ txHash: string; wallet: Wallet }> {
    const wallet = db.getWallet(email);
    if (wallet.stablecoinBalance < amount) throw new Error("Insufficient INR balance");

    wallet.stablecoinBalance -= amount;

    const action: ActionHistory = {
      id: Math.random().toString(36).substring(2, 11),
      type: 'PAYMENT',
      description: `Utility payment of ₹${amount.toLocaleString()} settled via rail`,
      timestamp: new Date().toISOString(),
      amount: `₹${amount.toLocaleString()}`,
      txHash: '0x' + Array.from({length: 40}, () => Math.floor(Math.random() * 16).toString(16)).join('')
    };

    wallet.history.unshift(action);
    db.updateWallet(email, wallet);
    return { txHash: action.txHash!, wallet };
  }
};
