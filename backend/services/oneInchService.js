import fetch from 'node-fetch';
import dotenv from 'dotenv';
dotenv.config();

const ONEINCH_API_KEY = process.env.ONEINCH_API_KEY;
const BASE_URL = 'https://api.1inch.dev/swap/v6.0';

export const getQuote = async (chainId, src, dst, amount) => {
    if (!ONEINCH_API_KEY) throw new Error("ONEINCH_API_KEY not configured");

    const url = `${BASE_URL}/${chainId}/quote?src=${src}&dst=${dst}&amount=${amount}`;

    const response = await fetch(url, {
        headers: { 'Authorization': `Bearer ${ONEINCH_API_KEY}` }
    });

    if (!response.ok) {
        const err = await response.json();
        throw new Error(err.description || "Failed to fetch quote");
    }

    return response.json();
};

export const getSwapCallData = async (chainId, src, dst, amount, from, slippage = 1) => {
    if (!ONEINCH_API_KEY) throw new Error("ONEINCH_API_KEY not configured");

    const url = `${BASE_URL}/${chainId}/swap?src=${src}&dst=${dst}&amount=${amount}&from=${from}&slippage=${slippage}`;

    const response = await fetch(url, {
        headers: { 'Authorization': `Bearer ${ONEINCH_API_KEY}` }
    });

    if (!response.ok) {
        const err = await response.json();
        throw new Error(err.description || "Failed to generate swap");
    }

    return response.json();
};
