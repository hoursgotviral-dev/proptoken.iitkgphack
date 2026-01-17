
import { User, Wallet, ActionHistory, Asset, UserRole, AssetLifecycle } from './types.ts';
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

  async register(name: string, email: string, role: UserRole): Promise<User> {
    const newUser: User = { name, email, role };
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

  async listAsset(email: string, assetData: Partial<Asset>): Promise<void> {
    const newAsset: Asset = {
      id: `prop-${Math.random().toString(36).substring(2, 7).toUpperCase()}`,
      name: assetData.name || 'Untitled Plot',
      location: assetData.location || 'Unknown Location',
      yieldPercent: assetData.yieldPercent || 0,
      tokenPrice: assetData.tokenPrice || 0,
      totalTokens: assetData.totalTokens || 0,
      image: assetData.image || 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80&w=800&h=600',
      risk: assetData.risk || 'Medium',
      status: 'DRAFT',
      ownerEmail: email,
      valuation: assetData.valuation || 0,
      lastUpdated: new Date().toISOString(),
      documents: [
        { id: 'doc-1', name: 'Title Deed', type: 'TITLE_DEED', status: 'UPLOADED', url: '#' },
        { id: 'doc-2', name: 'Registry Extract', type: 'REGISTRY_EXTRACT', status: 'UPLOADED', url: '#' }
      ]
    };
    db.saveAsset(newAsset);
    
    const wallet = db.getWallet(email);
    wallet.history.unshift({
      id: Math.random().toString(36).substring(2, 11),
      type: 'LIST_ASSET',
      description: `Drafted listing for ${newAsset.name}. Verification pending.`,
      timestamp: new Date().toISOString()
    });
    db.updateWallet(email, wallet);
  },

  async submitForAudit(email: string, assetId: string): Promise<void> {
    const asset = db.getAssets().find(a => a.id === assetId);
    if (!asset || asset.status !== 'DRAFT') throw new Error("Invalid state for audit submission.");
    
    db.updateAsset(assetId, { status: 'SUBMITTED', lastUpdated: new Date().toISOString() });
    
    const wallet = db.getWallet(email);
    wallet.history.unshift({
      id: Math.random().toString(36).substring(2, 11),
      type: 'SUBMIT_AUDIT',
      description: `Submitted ${asset.name} for institutional clearance.`,
      timestamp: new Date().toISOString()
    });
    db.updateWallet(email, wallet);
  },

  async verifyAsset(email: string, assetId: string): Promise<void> {
    const user = db.getCurrentUser();
    if (user?.role !== 'ADMIN') throw new Error("Unauthorized: Admin clearance required.");

    const asset = db.getAssets().find(a => a.id === assetId);
    if (!asset || asset.status !== 'SUBMITTED') throw new Error("Asset must be in REVIEW state.");

    const mockHash = '0x' + Array.from({length: 64}, () => Math.floor(Math.random() * 16).toString(16)).join('');
    
    db.updateAsset(assetId, { 
      status: 'VERIFIED', 
      verificationHash: mockHash,
      verificationDate: new Date().toISOString(),
      lastUpdated: new Date().toISOString()
    });

    const wallet = db.getWallet(email);
    wallet.history.unshift({
      id: Math.random().toString(36).substring(2, 11),
      type: 'VERIFY',
      description: `Institutional Verification completed for ${asset.name}.`,
      timestamp: new Date().toISOString()
    });
    db.updateWallet(email, wallet);
  },

  async tokenizeAsset(email: string, assetId: string): Promise<void> {
    const asset = db.getAssets().find(a => a.id === assetId);
    if (!asset || asset.status !== 'VERIFIED') throw new Error("Asset must be VERIFIED to tokenize.");

    db.updateAsset(assetId, { 
      status: 'ACTIVE',
      contractAddress: '0x' + Array.from({length: 40}, () => Math.floor(Math.random() * 16).toString(16)).join(''),
      lastUpdated: new Date().toISOString()
    });

    const wallet = db.getWallet(email);
    wallet.history.unshift({
      id: Math.random().toString(36).substring(2, 11),
      type: 'TOKENIZE',
      description: `Fractional units live for ${asset.name}.`,
      timestamp: new Date().toISOString(),
      txHash: '0x' + Array.from({length: 40}, () => Math.floor(Math.random() * 16).toString(16)).join('')
    });
    db.updateWallet(email, wallet);
  },

  async pauseAsset(email: string, assetId: string): Promise<void> {
    const user = db.getCurrentUser();
    if (user?.role !== 'ADMIN') throw new Error("Admin authority required.");

    db.updateAsset(assetId, { status: 'PAUSED', lastUpdated: new Date().toISOString() });
    
    const wallet = db.getWallet(email);
    wallet.history.unshift({
      id: Math.random().toString(36).substring(2, 11),
      type: 'PAUSE',
      description: `Paused trading for Asset ${assetId}`,
      timestamp: new Date().toISOString()
    });
    db.updateWallet(email, wallet);
  },

  async buyTokens(email: string, assetId: string, amount: number): Promise<{ txHash: string; wallet: Wallet }> {
    const wallet = db.getWallet(email);
    const asset = db.getAssets().find(a => a.id === assetId);
    if (!asset || asset.status !== 'ACTIVE') throw new Error("Asset is not tradeable.");

    const price = asset.tokenPrice;
    const cost = amount * price;
    
    if (wallet.stablecoinBalance < cost) throw new Error("Insufficient INR balance.");

    wallet.tokensByAsset[assetId] = (wallet.tokensByAsset[assetId] || 0) + amount;
    wallet.stablecoinBalance -= cost;
    wallet.totalInvested += cost;
    
    const action: ActionHistory = {
      id: Math.random().toString(36).substring(2, 11),
      type: 'BUY_TOKENS',
      description: `Acquired ${amount} units of ${asset.name}`,
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
    const asset = db.getAssets().find(a => a.id === assetId);
    if (!asset || asset.status === 'PAUSED' || asset.status === 'DISPUTED') throw new Error("Asset units are frozen.");
    
    const price = asset.tokenPrice;
    const value = amount * price;
    
    const owned = wallet.tokensByAsset[assetId] || 0;
    if (owned < amount) throw new Error("Insufficient units.");

    wallet.tokensByAsset[assetId] = owned - amount;
    wallet.stablecoinBalance += value;
    wallet.totalInvested = Math.max(0, wallet.totalInvested - value);

    const action: ActionHistory = {
      id: Math.random().toString(36).substring(2, 11),
      type: 'SWAP',
      description: `Liquidated ${amount} units of ${asset.name}`,
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
    const asset = db.getAssets().find(a => a.id === assetId);
    if (!asset) throw new Error("Asset not found");
    
    const owned = wallet.tokensByAsset[assetId] || 0;
    if (owned < amount) throw new Error("Insufficient units.");

    const value = amount * asset.tokenPrice;
    wallet.tokensByAsset[assetId] = owned - amount;
    wallet.lockedCollateral += value;

    const action: ActionHistory = {
      id: Math.random().toString(36).substring(2, 11),
      type: 'COLLATERAL_LOCK',
      description: `Secured ${amount} units of ${asset.name} in vault`,
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
      description: `Digital settlement of ₹${amount.toLocaleString()}`,
      timestamp: new Date().toISOString(),
      amount: `₹${amount.toLocaleString()}`,
      txHash: '0x' + Array.from({length: 40}, () => Math.floor(Math.random() * 16).toString(16)).join('')
    };
    wallet.history.unshift(action);
    db.updateWallet(email, wallet);
    return { txHash: action.txHash!, wallet };
  }
};
