import numpy as np
import pandas as pd
from dataclasses import dataclass
from typing import Dict, Any, Tuple

@dataclass
class MarketAnalysis:
    expected_nav: Tuple[float, float]  # (min, max)
    downside_nav: float
    yield_band: Tuple[float, float]
    tail_risk: str
    market_depth: str

class MarketIntelligenceEngine:
    """
    Analyze market conditions and asset valuation
    """
    
    def analyze(self, asset_data: Dict, location: Dict, financials: Dict, oracle_data: Dict) -> Dict[str, Any]:
        """
        Full market analysis
        """
        # Mocking comparable search
        comparables = self._get_mock_comparables(location)
        
        # Calculate NAV range
        nav_range = self._calculate_nav_range(asset_data, comparables, oracle_data)
        
        # Stress test
        downside_nav = self._stress_test(nav_range)
        
        # Yield analysis
        yield_band = self._calculate_yield_band(financials, nav_range)
        
        return {
            'expected_nav': {
                'min': nav_range[0],
                'max': nav_range[1],
                'mean': np.mean(nav_range)
            },
            'downside_nav': downside_nav,
            'yield_band': {
                'min': yield_band[0],
                'max': yield_band[1]
            },
            'tail_risk': 'Medium',
            'market_depth': 'Sufficient'
        }
    
    def _get_mock_comparables(self, location):
        """
        Return mock comparables based on location
        """
        base_price = 10000 if 'New York' in str(location) else 5000
        return [{'price_per_sqft': base_price * (1 + np.random.normal(0, 0.1))} for _ in range(10)]
    
    def _calculate_nav_range(self, asset_data, comparables, oracle_data):
        prices = [c['price_per_sqft'] for c in comparables]
        mean_price = np.mean(prices)
        std_price = np.std(prices)
        
        size = asset_data.get('specifications', {}).get('size', 1000)
        # Apply a condition multiplier from oracle data if available (e.g. good condition)
        multiplier = 1.0 
        
        min_nav = (mean_price - std_price) * size * multiplier
        max_nav = (mean_price + std_price) * size * multiplier
        return (min_nav, max_nav)
    
    def _stress_test(self, nav_range):
        # Simple 20% shock
        return np.mean(nav_range) * 0.8
        
    def _calculate_yield_band(self, financials, nav_range):
        # Cap rate = NOI / Value
        noi = financials.get('cashFlow', 0) * 12 # assuming monthly CF provided or derived
        if noi == 0:
             noi = financials.get('expectedYield', 0)/100 * np.mean(nav_range)

        min_yield = (noi / nav_range[1]) * 100
        max_yield = (noi / nav_range[0]) * 100
        return (min_yield, max_yield)
