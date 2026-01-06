
import { User, Wallet, ActionHistory } from './types.ts';
import { db } from './db.ts';

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
    const cost = amount * 5000; // Simplified price logic for plots
    
    wallet.tokensByAsset[assetId] = (wallet.tokensByAsset[assetId] || 0) + amount;
    wallet.stablecoinBalance -= cost;
    wallet.totalInvested += cost;
    
    const action: ActionHistory = {
      id: Math.random().toString(36).substring(2, 11),
      type: 'BUY_TOKENS',
      description: `Bought ${amount} units of asset ${assetId}`,
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
    const value = amount * 5000;
    
    wallet.tokensByAsset[assetId] -= amount;
    wallet.stablecoinBalance += value;
    wallet.totalInvested -= value;

    const action: ActionHistory = {
      id: Math.random().toString(36).substring(2, 11),
      type: 'SWAP',
      description: `Liquidated ${amount} units to INR stablecoins`,
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
    const value = amount * 5000;
    
    wallet.tokensByAsset[assetId] -= amount;
    wallet.lockedCollateral += value;

    const action: ActionHistory = {
      id: Math.random().toString(36).substring(2, 11),
      type: 'COLLATERAL_LOCK',
      description: `Locked ${amount} units as credit collateral`,
      timestamp: new Date().toISOString(),
      txHash: '0x' + Array.from({length: 40}, () => Math.floor(Math.random() * 16).toString(16)).join('')
    };

    wallet.history.unshift(action);
    db.updateWallet(email, wallet);
    return { txHash: action.txHash!, wallet };
  },

  async pay(email: string, amount: number): Promise<{ txHash: string; wallet: Wallet }> {
    const wallet = db.getWallet(email);
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
