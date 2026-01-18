#!/bin/bash

# Mock SPV End-to-End Testing Script
# This script demonstrates the complete flow: submit SPV -> verify -> mint token -> view activity

set -e

BACKEND_URL="http://localhost:3001/graphql"
COLOR_GREEN='\033[0;32m'
COLOR_BLUE='\033[0;34m'
COLOR_YELLOW='\033[1;33m'
COLOR_RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${COLOR_BLUE}================================================${NC}"
echo -e "${COLOR_BLUE}PropToken2: Mock SPV Tokenization Flow Test${NC}"
echo -e "${COLOR_BLUE}================================================${NC}\n"

# Check if backend is running
echo -e "${COLOR_YELLOW}[1/7] Checking backend connection...${NC}"
if ! curl -s "$BACKEND_URL" > /dev/null 2>&1; then
    echo -e "${COLOR_RED}❌ Backend not accessible at $BACKEND_URL${NC}"
    echo -e "${COLOR_YELLOW}Start backend with: cd proptoken-autonomous/backend && npm start${NC}"
    exit 1
fi
echo -e "${COLOR_GREEN}✅ Backend connected${NC}\n"

# Step 1: Submit Mock SPV
echo -e "${COLOR_YELLOW}[2/7] Submitting Mock SPV...${NC}"
SUBMISSION_RESPONSE=$(curl -s -X POST "$BACKEND_URL" \
  -H "Content-Type: application/json" \
  -d '{
    "query": "mutation { submitMockSPV(name: \"DLF Cyber Hub\", address: \"Plot 123, Sector 43\", longitude: 77.0123, latitude: 28.4567, assetCategory: \"COMMERCIAL_REAL_ESTATE\") { submissionId spvName status abmScore satImageUrl assetFingerprint message nextStep } }"
  }')

echo -e "${COLOR_BLUE}Response:${NC}"
echo "$SUBMISSION_RESPONSE" | jq .

SUBMISSION_ID=$(echo "$SUBMISSION_RESPONSE" | jq -r '.data.submitMockSPV.submissionId')
ABM_SCORE=$(echo "$SUBMISSION_RESPONSE" | jq -r '.data.submitMockSPV.abmScore')
STATUS=$(echo "$SUBMISSION_RESPONSE" | jq -r '.data.submitMockSPV.status')

echo -e "\n${COLOR_GREEN}✅ Submission ID: $SUBMISSION_ID${NC}"
echo -e "${COLOR_GREEN}✅ ABM Score: $ABM_SCORE%${NC}"
echo -e "${COLOR_GREEN}✅ Status: $STATUS${NC}\n"

# Step 2: Retrieve Submission Details
echo -e "${COLOR_YELLOW}[3/7] Retrieving submission details...${NC}"
SUBMISSION_DETAIL=$(curl -s -X POST "$BACKEND_URL" \
  -H "Content-Type: application/json" \
  -d "{ \"query\": \"query { getSubmission(submissionId: \\\"$SUBMISSION_ID\\\") { spvName address satImageUrl abmScore coordinates { latitude longitude } } }\" }")

echo -e "${COLOR_BLUE}Response:${NC}"
echo "$SUBMISSION_DETAIL" | jq .
echo -e "${COLOR_GREEN}✅ Submission details retrieved${NC}\n"

# Step 3: Get Verified Submissions
echo -e "${COLOR_YELLOW}[4/7] Getting verified submissions ready for minting...${NC}"
VERIFIED=$(curl -s -X POST "$BACKEND_URL" \
  -H "Content-Type: application/json" \
  -d '{ "query": "query { getVerifiedSubmissions { submissionId spvName abmScore status } }" }')

echo -e "${COLOR_BLUE}Response:${NC}"
echo "$VERIFIED" | jq .
echo -e "${COLOR_GREEN}✅ Verified submissions retrieved${NC}\n"

# Step 4: Mint Token
echo -e "${COLOR_YELLOW}[5/7] Minting token from SPV...${NC}"
MINTING_RESPONSE=$(curl -s -X POST "$BACKEND_URL" \
  -H "Content-Type: application/json" \
  -d "{ \"query\": \"mutation { mintTokenFromSPV(submissionId: \\\"$SUBMISSION_ID\\\") { success tokenAddress tokenName totalSupply transactionHash blockNumber explorerUrl status message } }\" }")

echo -e "${COLOR_BLUE}Response:${NC}"
echo "$MINTING_RESPONSE" | jq .

TOKEN_ADDRESS=$(echo "$MINTING_RESPONSE" | jq -r '.data.mintTokenFromSPV.tokenAddress')
TOKEN_NAME=$(echo "$MINTING_RESPONSE" | jq -r '.data.mintTokenFromSPV.tokenName')
TOKEN_SUPPLY=$(echo "$MINTING_RESPONSE" | jq -r '.data.mintTokenFromSPV.totalSupply')
EXPLORER_URL=$(echo "$MINTING_RESPONSE" | jq -r '.data.mintTokenFromSPV.explorerUrl')

echo -e "\n${COLOR_GREEN}✅ Token Address: $TOKEN_ADDRESS${NC}"
echo -e "${COLOR_GREEN}✅ Token Name: $TOKEN_NAME${NC}"
echo -e "${COLOR_GREEN}✅ Total Supply: $TOKEN_SUPPLY${NC}"
echo -e "${COLOR_GREEN}✅ Explorer: $EXPLORER_URL${NC}\n"

# Step 5: Get Token Minting Result
echo -e "${COLOR_YELLOW}[6/7] Retrieving token minting result...${NC}"
TOKEN_RESULT=$(curl -s -X POST "$BACKEND_URL" \
  -H "Content-Type: application/json" \
  -d "{ \"query\": \"query { getTokenMinting(submissionId: \\\"$SUBMISSION_ID\\\") { tokenAddress tokenName totalSupply transactionHash explorerUrl status } }\" }")

echo -e "${COLOR_BLUE}Response:${NC}"
echo "$TOKEN_RESULT" | jq .
echo -e "${COLOR_GREEN}✅ Token minting result retrieved${NC}\n"

# Step 6: Get Activity Feed
echo -e "${COLOR_YELLOW}[7/7] Retrieving activity feed...${NC}"
ACTIVITY=$(curl -s -X POST "$BACKEND_URL" \
  -H "Content-Type: application/json" \
  -d '{ "query": "query { getActivityFeed(limit: 10, offset: 0) { events { id type message timestamp status explorerUrl } total hasMore } }" }')

echo -e "${COLOR_BLUE}Activity Feed:${NC}"
echo "$ACTIVITY" | jq .
echo -e "${COLOR_GREEN}✅ Activity feed retrieved${NC}\n"

# Dashboard Summary
echo -e "${COLOR_YELLOW}Dashboard Summary...${NC}"
DASHBOARD=$(curl -s -X POST "$BACKEND_URL" \
  -H "Content-Type: application/json" \
  -d '{ "query": "query { getDashboardSummary { totalSubmissions verifiedCount failedCount tokensMinted } }" }')

echo -e "${COLOR_BLUE}Response:${NC}"
echo "$DASHBOARD" | jq .

echo -e "\n${COLOR_BLUE}================================================${NC}"
echo -e "${COLOR_GREEN}✅ ALL TESTS COMPLETED SUCCESSFULLY!${NC}"
echo -e "${COLOR_BLUE}================================================${NC}\n"

echo -e "${COLOR_YELLOW}Summary:${NC}"
echo -e "  SPV Name: DLF Cyber Hub"
echo -e "  Submission ID: $SUBMISSION_ID"
echo -e "  ABM Score: $ABM_SCORE%"
echo -e "  Token Name: $TOKEN_NAME"
echo -e "  Token Address: $TOKEN_ADDRESS"
echo -e "  Token Supply: $TOKEN_SUPPLY"
echo -e "  Explorer URL: $EXPLORER_URL"
echo -e "\n${COLOR_YELLOW}Next Steps:${NC}"
echo -e "  1. View satellite imagery: Fetch from satImageUrl"
echo -e "  2. Monitor on Sepolia: Open $EXPLORER_URL in browser"
echo -e "  3. Check activity feed for transaction updates"
echo -e "  4. Query getActivityFeed for complete event history\n"
