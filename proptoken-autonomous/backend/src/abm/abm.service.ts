import { Injectable, Logger } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class ABMService {
    private readonly logger = new Logger(ABMService.name);
    private readonly ENGINE_URL = process.env.ABM_URL || 'http://localhost:8000';

    async analyzeMarket(assetData: any, location: any, financials: any, oracleData: any) {
        try {
            this.logger.log('Sending data to ABM Engine for Market Analysis...');
            const response = await axios.post(`${this.ENGINE_URL}/analyze/market`, {
                asset_data: assetData,
                location,
                financials,
                oracle_data: oracleData
            });
            return response.data;
        } catch (error) {
            this.logger.error('ABM Market Analysis failed', error.message);
            // Return a robust fallback or throw for now
            throw error;
        }
    }

    async analyzeFraud(assetData: any, financials: any, oracleData: any) {
        try {
            this.logger.log('Sending data to ABM Engine for Fraud Detection...');
            const response = await axios.post(`${this.ENGINE_URL}/analyze/fraud`, {
                asset_data: assetData,
                financials,
                oracle_data: oracleData
            });
            return response.data;
        } catch (error) {
            this.logger.error('ABM Fraud Analysis failed', error.message);
            throw error;
        }
    }
}
