
import { User, Wallet, ActionHistory } from './types';

const BASE_URL = '/api';

const getHeaders = () => {
  const token = localStorage.getItem('proptoken_jwt');
  return {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {})
  };
};

export const api = {
  // --- Auth API ---
  async getCurrentUser(): Promise<{ user: User; wallet: Wallet } | null> {
    const token = localStorage.getItem('proptoken_jwt');
    if (!token) return null;
    
    try {
      const response = await fetch(`${BASE_URL}/auth/me`, {
        headers: getHeaders()
      });
      const result = await response.json();
      if (result.success) {
        return {
          user: result.data.user,
          wallet: await this.getWallet(result.data.user.email)
        };
      }
      return null;
    } catch {
      return null;
    }
  },

  async login(email: string): Promise<User | null> {
    const response = await fetch(`${BASE_URL}/auth/signin`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ email, password: 'password123' }) // Simplified for demo
    });
    const result = await response.json();
    if (result.success) {
      localStorage.setItem('proptoken_jwt', result.data.token);
      localStorage.setItem('proptoken_session', JSON.stringify(result.data.user));
      return result.data.user;
    }
    throw new Error(result.error?.message || 'Login failed');
  },

  async register(name: string, email: string): Promise<User> {
    const response = await fetch(`${BASE_URL}/auth/signup`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ name, email, password: 'password123' })
    });
    const result = await response.json();
    if (result.success) {
      localStorage.setItem('proptoken_jwt', result.data.token);
      localStorage.setItem('proptoken_session', JSON.stringify(result.data.user));
      return result.data.user;
    }
    throw new Error(result.error?.message || 'Registration failed');
  },

  async logout() {
    localStorage.removeItem('proptoken_jwt');
    localStorage.removeItem('proptoken_session');
  },

  async connectWallet(email: string, address: string): Promise<User> {
    // In a real app, this would be a PUT/PATCH to /account/profile
    const userJson = localStorage.getItem('proptoken_session');
    if (userJson) {
      const user = JSON.parse(userJson);
      user.walletAddress = address;
      localStorage.setItem('proptoken_session', JSON.stringify(user));
      return user;
    }
    throw new Error("Session lost");
  },

  // --- Ledger API ---
  async getWallet(email: string): Promise<Wallet> {
    const response = await fetch(`${BASE_URL}/wallet/summary`, {
      headers: getHeaders()
    });
    const result = await response.json();
    
    // Fetch history for detailed view
    const historyRes = await fetch(`${BASE_URL}/account/recent-actions`, {
      headers: getHeaders()
    });
    const historyResult = await historyRes.json();

    // Fetch positions for tokens map
    const positionsRes = await fetch(`${BASE_URL}/wallet/positions`, {
      headers: getHeaders()
    });
    const positionsResult = await positionsRes.json();

    const tokensMap: Record<string, number> = {};
    if (positionsResult.success) {
      positionsResult.data.forEach((p: any) => {
        tokensMap[p.assetId] = p.tokensOwned;
      });
    }

    if (result.success) {
      return {
        ...result.data,
        tokensByAsset: tokensMap,
        history: historyResult.success ? historyResult.data : []
      };
    }
    throw new Error("Failed to fetch wallet");
  },

  async buyTokens(email: string, assetId: string, amount: number): Promise<{ txHash: string; wallet: Wallet }> {
    const assetResponse = await fetch(`${BASE_URL}/assets`, { headers: getHeaders() });
    const assetsData = await assetResponse.json();
    const asset = assetsData.data.find((a: any) => a.id === assetId);
    
    const response = await fetch(`${BASE_URL}/fractional/purchase`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ assetId, amountStablecoin: amount * (asset?.tokenPrice || 5000) })
    });
    const result = await response.json();
    if (result.success) {
      const fullWallet = await this.getWallet(email);
      return { txHash: result.data.transaction.id, wallet: fullWallet };
    }
    throw new Error(result.error?.message || "Purchase failed");
  },

  async swapToStable(email: string, assetId: string, amount: number): Promise<{ txHash: string; wallet: Wallet }> {
    const response = await fetch(`${BASE_URL}/swap/swap`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ assetId, tokenAmount: amount })
    });
    const result = await response.json();
    if (result.success) {
      const fullWallet = await this.getWallet(email);
      return { txHash: result.data.transaction.id, wallet: fullWallet };
    }
    throw new Error(result.error?.message || "Swap failed");
  },

  async lockCollateral(email: string, assetId: string, amount: number): Promise<{ txHash: string; wallet: Wallet }> {
    const response = await fetch(`${BASE_URL}/collateral/lock`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ assetId, tokenAmountToLock: amount })
    });
    const result = await response.json();
    if (result.success) {
      const fullWallet = await this.getWallet(email);
      return { txHash: result.data.transaction.id, wallet: fullWallet };
    }
    throw new Error(result.error?.message || "Lock failed");
  },

  async pay(email: string, amount: number): Promise<{ txHash: string; wallet: Wallet }> {
    const response = await fetch(`${BASE_URL}/pay/pay`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ amountStablecoin: amount })
    });
    const result = await response.json();
    if (result.success) {
      const fullWallet = await this.getWallet(email);
      return { txHash: result.data.transaction.id, wallet: fullWallet };
    }
    throw new Error(result.error?.message || "Payment failed");
  }
};
