// API Configuration for PropToken Frontend
// Connects to backend on port 3003

const API_BASE_URL = (typeof import.meta !== 'undefined' && import.meta.env?.VITE_API_URL) || 'http://localhost:3003';

// API Client with error handling
class ApiClient {
    private baseURL: string;
    private token: string | null;

    constructor(baseURL: string) {
        this.baseURL = baseURL;
        this.token = localStorage.getItem('token');
    }

    private getHeaders(): HeadersInit {
        const headers: HeadersInit = {
            'Content-Type': 'application/json',
        };

        if (this.token) {
            headers['Authorization'] = `Bearer ${this.token}`;
        }

        return headers;
    }

    private async request<T>(
        endpoint: string,
        options: RequestInit = {}
    ): Promise<T> {
        const url = `${this.baseURL}${endpoint}`;
        const config: RequestInit = {
            ...options,
            headers: {
                ...this.getHeaders(),
                ...options.headers,
            },
        };

        try {
            const response = await fetch(url, config);

            if (!response.ok) {
                const error = await response.json().catch(() => ({
                    error: response.statusText,
                }));
                throw new Error(error.error || 'Request failed');
            }

            return await response.json();
        } catch (error) {
            console.error('API Error:', error);
            throw error;
        }
    }

    // Authentication
    async register(email: string, password: string, role: 'CLIENT' | 'BUILDER') {
        return this.request('/auth/register', {
            method: 'POST',
            body: JSON.stringify({ email, password, role }),
        });
    }

    async login(email: string, password: string) {
        const response: any = await this.request('/auth/login', {
            method: 'POST',
            body: JSON.stringify({ email, password }),
        });

        if (response.token) {
            this.token = response.token;
            localStorage.setItem('token', response.token);
        }

        return response;
    }

    logout() {
        this.token = null;
        localStorage.removeItem('token');
    }

    // Assets
    async getAssets() {
        return this.request('/assets', { method: 'GET' });
    }

    async getMyAssets() {
        return this.request('/assets/my-assets', { method: 'GET' });
    }

    async getMyTokens() {
        return this.request('/assets/my-tokens', { method: 'GET' });
    }

    async createAsset(data: {
        name: string;
        description: string;
        location: string;
        valuation: number;
    }) {
        return this.request('/assets', {
            method: 'POST',
            body: JSON.stringify(data),
        });
    }

    async tokenizeAsset(
        assetId: number,
        data: { total_fractions: number; price_per_fraction: number }
    ) {
        return this.request(`/assets/${assetId}/tokenize`, {
            method: 'POST',
            body: JSON.stringify(data),
        });
    }

    async buyTokens(assetId: number, fractions: number) {
        return this.request(`/assets/${assetId}/buy`, {
            method: 'POST',
            body: JSON.stringify({ fractions }),
        });
    }

    // Wallet
    async getWallet() {
        return this.request('/wallet', { method: 'GET' });
    }

    async deposit(amount: number) {
        return this.request('/wallet/deposit', {
            method: 'POST',
            body: JSON.stringify({ amount }),
        });
    }

    // Trading
    async swapTokens(asset_id: number, amount: number) {
        return this.request('/swap', {
            method: 'POST',
            body: JSON.stringify({ asset_id, amount }),
        });
    }

    async lockCollateral(asset_id: number, amount: number) {
        return this.request('/collateral/lock', {
            method: 'POST',
            body: JSON.stringify({ asset_id, amount }),
        });
    }

    // Dashboard
    async getDashboard() {
        return this.request('/dashboard', { method: 'GET' });
    }

    // Activity Feed
    async getActivityFeed(limit = 20, offset = 0) {
        return this.request(`/activity/feed?limit=${limit}&offset=${offset}`, {
            method: 'GET',
        });
    }

    async getMyActivity() {
        return this.request('/activity/my-activity', { method: 'GET' });
    }

    async getActivityStats() {
        return this.request('/activity/stats', { method: 'GET' });
    }

    async getTransaction(txHash: string) {
        return this.request(`/activity/tx/${txHash}`, { method: 'GET' });
    }

    // Account
    async getAccount() {
        return this.request('/account', { method: 'GET' });
    }

    // Yield
    async getYieldHistory() {
        return this.request('/yield/my-history', { method: 'GET' });
    }
}

// Export singleton instance
export const api = new ApiClient(API_BASE_URL);

// Export types
export interface Asset {
    id: number;
    owner_id: number;
    name: string;
    description: string;
    location: string;
    valuation: number;
    status: string;
    created_at: string;
}

export interface TokenOwnership {
    ownership_id: number;
    tokens_owned: number;
    asset_id: number;
    name: string;
    description: string;
    location: string;
    valuation: number;
    status: string;
    price_per_fraction: number;
    total_fractions: number;
    investment_value: number;
}

export interface Activity {
    id: number;
    action: string;
    tx_hash: string;
    details: any;
    created_at: string;
    user_email?: string;
}

export interface Dashboard {
    walletBalance: number;
    tokenEquity: number;
    netEquity: number;
    totalYield: number;
}

export default api;
