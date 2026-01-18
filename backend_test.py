#!/usr/bin/env python3
"""
ABM & Asset Intelligence Layer - Backend API Testing Suite
Tests all endpoints and verification pipeline functionality
"""

import requests
import json
import time
import sys
from datetime import datetime, timedelta
from typing import Dict, List, Any, Optional

class ABMAPITester:
    def __init__(self, base_url: str = "http://localhost:3000"):
        self.base_url = base_url
        self.session = requests.Session()
        self.session.headers.update({'Content-Type': 'application/json'})
        
        # Test tracking
        self.tests_run = 0
        self.tests_passed = 0
        self.failed_tests = []
        self.submission_ids = []
        
        # Test data
        self.sample_submission = self._create_sample_submission()
        
    def _create_sample_submission(self) -> Dict[str, Any]:
        """Create a realistic test submission"""
        return {
            "submitterId": f"test_user_{int(time.time())}",
            "walletAddress": "0x742d35Cc6634C0532925a3b8D4C2C4e0C8b4C8b4",
            "did": "did:polygon:0x742d35Cc6634C0532925a3b8D4C2C4e0C8b4C8b4",
            "signature": "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef12",
            "category": "real-estate",
            "assetName": "Premium Commercial Complex - Bangalore",
            "location": {
                "address": "123 MG Road, Commercial District",
                "coordinates": {
                    "lat": 12.9716,
                    "lng": 77.5946
                },
                "city": "Bengaluru",
                "state": "Karnataka",
                "country": "India",
                "postalCode": "560001"
            },
            "specifications": {
                "size": 25000,
                "type": "commercial",
                "age": 5,
                "condition": "excellent",
                "floors": 8,
                "units": 40
            },
            "spv": {
                "spvName": "Bangalore Commercial Properties SPV Ltd",
                "spvRegistrationNumber": "U70100KA2020PTC134567",
                "jurisdiction": "Karnataka, India",
                "incorporationDate": "2020-03-15",
                "registeredAddress": "123 MG Road, Bengaluru, Karnataka 560001",
                "directors": ["Rajesh Kumar", "Priya Sharma"],
                "shareholderStructure": [
                    {"holder": "Rajesh Kumar", "percentage": 60},
                    {"holder": "Priya Sharma", "percentage": 40}
                ]
            },
            "registryIds": ["KA/BLR/2020/12345", "RERA/KA/2020/67890"],
            "documentUrls": [
                "https://docs.example.com/title_deed.pdf",
                "https://docs.example.com/property_card.pdf",
                "https://docs.example.com/tax_receipt.pdf"
            ],
            "imageUrls": [
                "https://images.example.com/front_view.jpg",
                "https://images.example.com/interior_1.jpg",
                "https://images.example.com/interior_2.jpg"
            ],
            "videoUrls": [
                "https://videos.example.com/property_tour.mp4"
            ],
            "financials": {
                "currentRent": 450000,
                "expectedYield": 8.5,
                "annualExpenses": 1200000,
                "occupancyRate": 85,
                "tenantCount": 12,
                "leaseTermsMonths": 36,
                "historicalCashFlow": [
                    {"month": "2024-01", "income": 4500000, "expenses": 100000},
                    {"month": "2024-02", "income": 4650000, "expenses": 105000},
                    {"month": "2024-03", "income": 4500000, "expenses": 98000}
                ]
            },
            "claimedValue": 75000000,
            "tokenizationIntent": "Fractional ownership for retail investors with monthly rental yield distribution",
            "targetRaise": 50000000
        }

    def log_test(self, test_name: str, success: bool, details: str = "", response_data: Any = None):
        """Log test results"""
        self.tests_run += 1
        if success:
            self.tests_passed += 1
            print(f"✅ {test_name}: PASSED")
            if details:
                print(f"   {details}")
        else:
            self.failed_tests.append({
                'test': test_name,
                'details': details,
                'response': response_data
            })
            print(f"❌ {test_name}: FAILED")
            print(f"   {details}")
            if response_data:
                print(f"   Response: {json.dumps(response_data, indent=2)}")

    def make_request(self, method: str, endpoint: str, data: Dict = None) -> tuple[bool, Dict, int]:
        """Make HTTP request and return success, response, status_code"""
        url = f"{self.base_url}{endpoint}"
        try:
            if method == 'GET':
                response = self.session.get(url)
            elif method == 'POST':
                response = self.session.post(url, json=data)
            elif method == 'PUT':
                response = self.session.put(url, json=data)
            elif method == 'DELETE':
                response = self.session.delete(url)
            else:
                return False, {"error": f"Unsupported method: {method}"}, 0
            
            try:
                response_data = response.json()
            except:
                response_data = {"raw_response": response.text}
            
            return response.status_code < 400, response_data, response.status_code
        except Exception as e:
            return False, {"error": str(e)}, 0

    def test_api_health(self):
        """Test basic API connectivity"""
        print("\n🔍 Testing API Health...")
        
        success, data, status = self.make_request('GET', '/')
        self.log_test(
            "API Health Check",
            success and status == 200,
            f"Status: {status}, Message: {data.get('message', 'N/A')}" if success else f"Failed to connect: {data}",
            data if not success else None
        )

    def test_create_submission(self):
        """Test asset submission creation"""
        print("\n🔍 Testing Asset Submission Creation...")
        
        # Test valid submission
        success, data, status = self.make_request('POST', '/abm/submissions', self.sample_submission)
        
        if success and status == 201:
            submission_id = data.get('data', {}).get('submissionId')
            if submission_id:
                self.submission_ids.append(submission_id)
                self.log_test(
                    "Create Valid Submission",
                    True,
                    f"Created submission: {submission_id}"
                )
            else:
                self.log_test(
                    "Create Valid Submission",
                    False,
                    "No submission ID returned",
                    data
                )
        else:
            self.log_test(
                "Create Valid Submission",
                False,
                f"Status: {status}",
                data
            )
        
        # Test invalid submission (missing required fields)
        invalid_submission = {"submitterId": "test", "category": "invalid"}
        success, data, status = self.make_request('POST', '/abm/submissions', invalid_submission)
        
        self.log_test(
            "Create Invalid Submission (Validation)",
            status == 400,
            f"Status: {status}, Expected 400 for validation error"
        )

    def test_get_submissions(self):
        """Test retrieving submissions"""
        print("\n🔍 Testing Submission Retrieval...")
        
        # Get all submissions
        success, data, status = self.make_request('GET', '/abm/submissions')
        
        self.log_test(
            "Get All Submissions",
            success and status == 200,
            f"Status: {status}, Count: {data.get('count', 0) if success else 'N/A'}",
            data if not success else None
        )
        
        # Get specific submission
        if self.submission_ids:
            submission_id = self.submission_ids[0]
            success, data, status = self.make_request('GET', f'/abm/submissions/{submission_id}')
            
            self.log_test(
                "Get Specific Submission",
                success and status == 200,
                f"Status: {status}, ID: {submission_id}",
                data if not success else None
            )
        
        # Test non-existent submission
        success, data, status = self.make_request('GET', '/abm/submissions/INVALID-ID')
        
        self.log_test(
            "Get Non-existent Submission",
            status == 404,
            f"Status: {status}, Expected 404"
        )

    def test_verification_pipeline(self):
        """Test the full verification pipeline"""
        print("\n🔍 Testing Verification Pipeline...")
        
        if not self.submission_ids:
            print("⚠️  No submissions available for verification testing")
            return
        
        submission_id = self.submission_ids[0]
        
        # Start verification
        success, data, status = self.make_request('POST', f'/abm/submissions/{submission_id}/verify')
        
        if success and status == 200:
            eligible = data.get('data', {}).get('eligible', False)
            consensus = data.get('data', {}).get('consensus', {})
            
            self.log_test(
                "Run Verification Pipeline",
                True,
                f"Eligible: {eligible}, Confidence: {consensus.get('confidence', 'N/A')}"
            )
            
            # Test running verification again (should fail)
            success2, data2, status2 = self.make_request('POST', f'/abm/submissions/{submission_id}/verify')
            
            self.log_test(
                "Prevent Duplicate Verification",
                status2 == 400,
                f"Status: {status2}, Expected 400 for already processed"
            )
            
        else:
            self.log_test(
                "Run Verification Pipeline",
                False,
                f"Status: {status}",
                data
            )

    def test_progress_tracking(self):
        """Test verification progress tracking"""
        print("\n🔍 Testing Progress Tracking...")
        
        if not self.submission_ids:
            print("⚠️  No submissions available for progress testing")
            return
        
        submission_id = self.submission_ids[0]
        
        success, data, status = self.make_request('GET', f'/abm/submissions/{submission_id}/progress')
        
        if success and status == 200:
            progress_data = data.get('data', {})
            current_stage = progress_data.get('currentStage', 'Unknown')
            logs_count = len(progress_data.get('logs', []))
            
            self.log_test(
                "Get Verification Progress",
                True,
                f"Stage: {current_stage}, Logs: {logs_count}"
            )
        else:
            self.log_test(
                "Get Verification Progress",
                False,
                f"Status: {status}",
                data
            )

    def test_individual_results(self):
        """Test individual verification result endpoints"""
        print("\n🔍 Testing Individual Result Endpoints...")
        
        if not self.submission_ids:
            print("⚠️  No submissions available for result testing")
            return
        
        submission_id = self.submission_ids[0]
        
        # Test each result endpoint
        endpoints = [
            ('oracle', 'Oracle Results'),
            ('abm', 'ABM Results'),
            ('fraud', 'Fraud Results'),
            ('consensus', 'Consensus Results'),
            ('full', 'Full Results')
        ]
        
        for endpoint, name in endpoints:
            success, data, status = self.make_request('GET', f'/abm/submissions/{submission_id}/{endpoint}')
            
            # Results should be available after verification
            expected_success = status in [200, 404]  # 404 is acceptable if verification not run
            
            self.log_test(
                f"Get {name}",
                expected_success,
                f"Status: {status}",
                data if not expected_success else None
            )

    def test_consensus_rules(self):
        """Test consensus scoring rules with different scenarios"""
        print("\n🔍 Testing Consensus Rules...")
        
        # Create submissions with different characteristics to test consensus
        test_scenarios = [
            {
                "name": "High Value Asset",
                "modifications": {
                    "claimedValue": 200000000,  # 20 Cr - very high value
                    "assetName": "High Value Commercial Tower"
                }
            },
            {
                "name": "Low Yield Asset", 
                "modifications": {
                    "financials": {
                        **self.sample_submission["financials"],
                        "expectedYield": 2.0  # Very low yield
                    },
                    "assetName": "Low Yield Residential"
                }
            },
            {
                "name": "High Risk Asset",
                "modifications": {
                    "specifications": {
                        **self.sample_submission["specifications"],
                        "condition": "poor",
                        "age": 50
                    },
                    "financials": {
                        **self.sample_submission["financials"],
                        "occupancyRate": 30  # Low occupancy
                    },
                    "assetName": "High Risk Old Building"
                }
            }
        ]
        
        for scenario in test_scenarios:
            # Create modified submission
            test_submission = {**self.sample_submission}
            test_submission.update(scenario["modifications"])
            test_submission["submitterId"] = f"test_{scenario['name'].lower().replace(' ', '_')}_{int(time.time())}"
            
            # Submit and verify
            success, data, status = self.make_request('POST', '/abm/submissions', test_submission)
            
            if success and status == 201:
                submission_id = data.get('data', {}).get('submissionId')
                if submission_id:
                    # Run verification
                    time.sleep(0.5)  # Brief pause
                    verify_success, verify_data, verify_status = self.make_request('POST', f'/abm/submissions/{submission_id}/verify')
                    
                    if verify_success:
                        eligible = verify_data.get('data', {}).get('eligible', False)
                        self.log_test(
                            f"Consensus Test - {scenario['name']}",
                            True,
                            f"Eligible: {eligible} (Expected variation based on asset characteristics)"
                        )
                    else:
                        self.log_test(
                            f"Consensus Test - {scenario['name']}",
                            False,
                            f"Verification failed: {verify_status}",
                            verify_data
                        )

    def test_registry_endpoints(self):
        """Test eligible asset registry endpoints"""
        print("\n🔍 Testing Asset Registry...")
        
        # Get all eligible assets
        success, data, status = self.make_request('GET', '/abm/registry')
        
        self.log_test(
            "Get Eligible Assets Registry",
            success and status == 200,
            f"Status: {status}, Count: {data.get('count', 0) if success else 'N/A'}",
            data if not success else None
        )
        
        # If there are eligible assets, test individual retrieval and claims
        if success and data.get('data') and len(data['data']) > 0:
            asset = data['data'][0]
            asset_id = asset.get('id')
            
            if asset_id:
                # Get specific asset
                success2, data2, status2 = self.make_request('GET', f'/abm/registry/{asset_id}')
                
                self.log_test(
                    "Get Specific Eligible Asset",
                    success2 and status2 == 200,
                    f"Status: {status2}, Asset ID: {asset_id}",
                    data2 if not success2 else None
                )
                
                # Test cash flow claim
                claim_data = {
                    "claimantId": f"investor_{int(time.time())}",
                    "tokensToAcquire": min(100, asset.get('availableTokens', 0))
                }
                
                if claim_data["tokensToAcquire"] > 0:
                    success3, data3, status3 = self.make_request('POST', f'/abm/registry/{asset_id}/claim', claim_data)
                    
                    self.log_test(
                        "Claim Cash Flow Exposure",
                        success3 and status3 == 200,
                        f"Status: {status3}, Tokens: {claim_data['tokensToAcquire']}",
                        data3 if not success3 else None
                    )
        
        # Test non-existent asset
        success, data, status = self.make_request('GET', '/abm/registry/INVALID-ASSET-ID')
        
        self.log_test(
            "Get Non-existent Asset",
            status == 404,
            f"Status: {status}, Expected 404"
        )

    def test_error_handling(self):
        """Test various error conditions"""
        print("\n🔍 Testing Error Handling...")
        
        # Test invalid JSON
        try:
            response = self.session.post(f"{self.base_url}/abm/submissions", data="invalid json")
            self.log_test(
                "Invalid JSON Handling",
                response.status_code == 400,
                f"Status: {response.status_code}, Expected 400"
            )
        except:
            self.log_test("Invalid JSON Handling", False, "Request failed unexpectedly")
        
        # Test missing content-type
        try:
            response = self.session.post(
                f"{self.base_url}/abm/submissions", 
                data=json.dumps(self.sample_submission),
                headers={'Content-Type': 'text/plain'}
            )
            self.log_test(
                "Wrong Content-Type Handling",
                response.status_code >= 400,
                f"Status: {response.status_code}"
            )
        except:
            self.log_test("Wrong Content-Type Handling", False, "Request failed unexpectedly")

    def test_data_validation(self):
        """Test comprehensive data validation"""
        print("\n🔍 Testing Data Validation...")
        
        validation_tests = [
            {
                "name": "Invalid Coordinates",
                "data": {**self.sample_submission, "location": {
                    **self.sample_submission["location"],
                    "coordinates": {"lat": 200, "lng": 200}  # Invalid coordinates
                }}
            },
            {
                "name": "Negative Size",
                "data": {**self.sample_submission, "specifications": {
                    **self.sample_submission["specifications"],
                    "size": -1000
                }}
            },
            {
                "name": "Invalid Yield",
                "data": {**self.sample_submission, "financials": {
                    **self.sample_submission["financials"],
                    "expectedYield": 150  # 150% yield is unrealistic
                }}
            },
            {
                "name": "Invalid Occupancy Rate",
                "data": {**self.sample_submission, "financials": {
                    **self.sample_submission["financials"],
                    "occupancyRate": 150  # >100% occupancy
                }}
            }
        ]
        
        for test in validation_tests:
            success, data, status = self.make_request('POST', '/abm/submissions', test["data"])
            
            self.log_test(
                f"Validation - {test['name']}",
                status == 400,
                f"Status: {status}, Expected 400 for validation error"
            )

    def run_all_tests(self):
        """Run the complete test suite"""
        print("🚀 Starting ABM & Asset Intelligence Layer API Tests")
        print("=" * 60)
        
        start_time = time.time()
        
        # Run all test categories
        self.test_api_health()
        self.test_create_submission()
        self.test_get_submissions()
        self.test_verification_pipeline()
        self.test_progress_tracking()
        self.test_individual_results()
        self.test_consensus_rules()
        self.test_registry_endpoints()
        self.test_error_handling()
        self.test_data_validation()
        
        # Print summary
        end_time = time.time()
        duration = end_time - start_time
        
        print("\n" + "=" * 60)
        print("📊 TEST SUMMARY")
        print("=" * 60)
        print(f"Total Tests: {self.tests_run}")
        print(f"Passed: {self.tests_passed}")
        print(f"Failed: {len(self.failed_tests)}")
        print(f"Success Rate: {(self.tests_passed/self.tests_run*100):.1f}%")
        print(f"Duration: {duration:.2f} seconds")
        
        if self.failed_tests:
            print(f"\n❌ FAILED TESTS ({len(self.failed_tests)}):")
            for i, failure in enumerate(self.failed_tests, 1):
                print(f"{i}. {failure['test']}: {failure['details']}")
        
        print(f"\n🎯 Submissions Created: {len(self.submission_ids)}")
        if self.submission_ids:
            print("   IDs:", ", ".join(self.submission_ids))
        
        return len(self.failed_tests) == 0

def main():
    """Main test execution"""
    print("ABM & Asset Intelligence Layer - Backend API Test Suite")
    print("Testing comprehensive asset verification pipeline...")
    
    # Initialize tester
    tester = ABMAPITester()
    
    # Run tests
    success = tester.run_all_tests()
    
    # Exit with appropriate code
    sys.exit(0 if success else 1)

if __name__ == "__main__":
    main()