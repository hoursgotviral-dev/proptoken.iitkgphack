import { User, Wallet, ActionHistory } from "./types";
import { db } from "./db"; // mock frontend DB (Gemini)
import { DUMMY_ASSETS } from "./constants";

/**
 * 🔁 SWITCH HERE
 * false = mock mode (current working UI)
 * true  = real backend mode
 */
const USE_BACKEND = false;

/**
 * Backend base URL (when enabled)
 */
const API_BASE = "http://localhost:4000";

/* ===================== HELPERS ===================== */

function getToken(): string | null {
  return localStorage.getItem("token");
}

async function authFetch(url: string, options: RequestInit = {}) {
  const token = getToken();
  if (!token) throw new Error("Not authenticated");

  const res = await fetch(`${API_BASE}${url}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      ...(options.headers || {})
    }
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || "Request failed");
  }

  return res.json();
}

/* ===================== API ===================== */

export const api = {
  /* ========= AUTH ========= */

  async getCurrentUser(): Promise<{ user: User; wallet: Wallet } | null> {
    if (!USE_BACKEND) {
      const user = db.getCurrentUser();
      if (!user) return null;
      const wallet = db.getWallet(user.email);
      return { user, wallet };
    }

    const user = await authFetch("/account");
    const wallet = await authFetch("/wallet");
    return { user, wallet };
  },

  async login(email: string, password?: string): Promise<User | null> {
    if (!USE_BACKEND) {
      const users = db.getUsers();
      const user = users.find(u => u.email === email);
      if (user) {
        db.setCurrentUser(user);
        return user;
      }
      return null;
    }

    const res = await fetch(`${API_BASE}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });

    if (!res.ok) throw new Error("Login failed");
    const data = await res.json();
    localStorage.setItem("token", data.token);
    return data.user ?? null;
  },

  async register(name: string, email: string, password?: string): Promise<User> {
    if (!USE_BACKEND) {
      const newUser: User = { name, email };
      db.saveUser(newUser);
      db.setCurrentUser(newUser);
      return newUser;
    }

    const res = await fetch(`${API_BASE}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });

    if (!res.ok) throw new Error("Registration failed");
    return res.json();
  },

  async logout() {
    if (!USE_BACKEND) {
      db.setCurrentUser(null);
      return;
    }
    localStorage.removeItem("token");
  },

  /* ========= WALLET ========= */

  async connectWallet(email: string, address: string): Promise<User> {
    if (!USE_BACKEND) {
      db.updateUser(email, { walletAddress: address });
      return db.getCurrentUser()!;
    }

    await authFetch("/wallet/connect", {
      method: "POST",
      body: JSON.stringify({ address, chainId: 137 })
    });

    return authFetch("/account");
  },

  async getWallet(email: string): Promise<Wallet> {
    if (!USE_BACKEND) {
      return db.getWallet(email);
    }

    return authFetch("/wallet");
  },

  /* ========= DASHBOARD ========= */

 async getDashboard() {
  if (!USE_BACKEND) {
    const user = db.getCurrentUser();
    if (!user) throw new Error("Not logged in");

    const wallet = db.getWallet(user.email);

    // ✅ Monthly yield is a derived (mock) value
    const monthlyYield = Math.round(wallet.totalInvested * 0.01); // 1% mock yield

    return {
      netEquity: wallet.totalInvested,
      monthlyYield,
      balance: wallet.stablecoinBalance
    };
  }

  // Real backend mode
  return authFetch("/dashboard");
},

   
  /* ========= ASSETS ========= */

  async getAssets() {
    if (!USE_BACKEND) {
      return DUMMY_ASSETS;
    }

    return fetch(`${API_BASE}/assets`).then(res => res.json());
  },

  /* ========= BUY TOKENS ========= */

  async buyTokens(
    email: string,
    assetId: string,
    amount: number
  ): Promise<{ txHash: string; wallet: Wallet }> {
    if (!USE_BACKEND) {
      const wallet = db.getWallet(email);
      const asset = DUMMY_ASSETS.find(a => a.id === assetId);
      const price = asset?.tokenPrice || 5000;
      const cost = amount * price;

      wallet.tokensByAsset[assetId] =
        (Number(wallet.tokensByAsset[assetId]) || 0) + amount;
      wallet.stablecoinBalance -= cost;
      wallet.totalInvested += cost;

      const action: ActionHistory = {
        id: Math.random().toString(36).substring(2, 11),
        type: "BUY_TOKENS",
        description: `Bought ${amount} units of ${asset?.name}`,
        timestamp: new Date().toISOString(),
        amount: `₹${cost.toLocaleString()}`,
        txHash: "0x" + crypto.randomUUID().replace(/-/g, "")
      };

      wallet.history.unshift(action);
      db.updateWallet(email, wallet);
      return { txHash: action.txHash!, wallet };
    }

    return authFetch("/assets/buy", {
      method: "POST",
      body: JSON.stringify({ assetId, amount })
    });
  },

  /* ========= SWAP ========= */

  async swapToStable(email: string, assetId: string, amount: number) {
    if (!USE_BACKEND) {
      const wallet = db.getWallet(email);
      const asset = DUMMY_ASSETS.find(a => a.id === assetId);
      const price = asset?.tokenPrice || 5000;
      const value = amount * price;

      wallet.tokensByAsset[assetId] -= amount;
      wallet.stablecoinBalance += value;

      db.updateWallet(email, wallet);
      return { wallet };
    }

    return authFetch("/swap", {
      method: "POST",
      body: JSON.stringify({ assetId, amount })
    });
  },

  /* ========= COLLATERAL ========= */

  async lockCollateral(email: string, assetId: string, amount: number) {
    if (!USE_BACKEND) {
      const wallet = db.getWallet(email);
      const asset = DUMMY_ASSETS.find(a => a.id === assetId);
      const price = asset?.tokenPrice || 5000;

      wallet.tokensByAsset[assetId] -= amount;
      wallet.lockedCollateral += amount * price;

      db.updateWallet(email, wallet);
      return { wallet };
    }

    return authFetch("/collateral/lock", {
      method: "POST",
      body: JSON.stringify({ assetId, amount })
    });
  },

  /* ========= PAYMENTS ========= */

  async pay(email: string, amount: number) {
    if (!USE_BACKEND) {
      const wallet = db.getWallet(email);
      wallet.stablecoinBalance -= amount;
      db.updateWallet(email, wallet);
      return { wallet };
    }

    return authFetch("/payments/pay", {
      method: "POST",
      body: JSON.stringify({ amount })
    });
  }
};
