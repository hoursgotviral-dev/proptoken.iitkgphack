from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import Dict, Any, List
from engines.market_intelligence import MarketIntelligenceEngine
from engines.fraud_detection import FraudDetectionEngine

app = FastAPI(title="ABM Engine", version="1.0.0")

# Initialize engines
market_engine = MarketIntelligenceEngine()
fraud_engine = FraudDetectionEngine()

class AnalysisRequest(BaseModel):
    asset_data: Dict[str, Any]
    location: Dict[str, Any]
    financials: Dict[str, Any]
    oracle_data: Dict[str, Any] = {}

@app.get("/")
def read_root():
    return {"status": "online", "service": "ABM Engine"}

@app.post("/analyze/market")
async def analyze_market(request: AnalysisRequest):
    try:
        result = market_engine.analyze(
            request.asset_data,
            request.location,
            request.financials,
            request.oracle_data
        )
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/analyze/fraud")
async def analyze_fraud(request: AnalysisRequest):
    try:
        result = fraud_engine.detect(
            request.asset_data,
            request.financials,
            request.oracle_data
        )
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
