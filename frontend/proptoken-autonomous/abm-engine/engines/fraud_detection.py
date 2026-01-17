from typing import Dict, Any, List

class FraudDetectionEngine:
    """
    Multi-layer fraud detection
    """
    
    def detect(self, asset_data: Dict, financials: Dict, oracle_data: Dict) -> Dict[str, Any]:
        """
        Run fraud detection checks
        """
        anomalies = []
        
        # Check 1: Yield too high
        claimed_yield = financials.get('expectedYield', 0)
        if claimed_yield > 20: # Suspiciously high
            anomalies.append({
                'type': 'yield_anomaly',
                'severity': 'high',
                'detail': f'Claimed yield {claimed_yield}% is suspicious',
                'score': 0.3
            })
            
        # Check 2: Size mismatch (Mock logic)
        claimed_size = asset_data.get('specifications', {}).get('size', 0)
        # In real implementation we check oracle_data['existence']['satellite']['estimated_size']
        # Mocking satellite size check
        if claimed_size > 50000 and claimed_yield > 15:
             anomalies.append({
                'type': 'size_yield_mismatch',
                'severity': 'medium',
                'detail': 'Large size with high yield is rare',
                'score': 0.2
            })

        fraud_score = sum(a['score'] for a in anomalies) * 10 # Scale 0-100 (roughly)
        
        return {
            'fraud_likelihood': fraud_score,
            'anomaly_score': len(anomalies),
            'anomalies': anomalies,
            'passed': fraud_score <= 5.0
        }
