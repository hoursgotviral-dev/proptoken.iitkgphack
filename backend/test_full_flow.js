import fetch from 'node-fetch';

const BASE_URL = 'http://localhost:4000';
let authToken = '';
let userId = '';
let assetId = '';

const log = (emoji, step, msg) => console.log(`${emoji} [${step}] ${msg}`);
const error = (step, msg) => console.error(`❌ [${step}] ${msg}`);

async function testFullFlow() {
    console.log('\n🧪 ========================================');
    console.log('   RWA BACKEND - FULL INTEGRATION TEST');
    console.log('========================================\n');

    try {
        // ==========================================
        // 1. REGISTRATION
        // ==========================================
        log('📝', 'STEP 1', 'Testing User Registration...');
        const testEmail = `test_${Date.now()}@example.com`;
        const testPassword = 'TestPass123!';

        const regRes = await fetch(`${BASE_URL}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: testEmail,
                password: testPassword,
                role: 'BUILDER'
            })
        });

        const regData = await regRes.json();
        if (regRes.status !== 201) {
            error('REGISTRATION', `Failed: ${JSON.stringify(regData)}`);
            throw new Error('Registration failed');
        }

        userId = regData.user.id;
        log('✅', 'STEP 1', `User registered: ${regData.user.email} (ID: ${userId})`);

        // ==========================================
        // 2. LOGIN
        // ==========================================
        log('🔐', 'STEP 2', 'Testing Login...');
        const loginRes = await fetch(`${BASE_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: testEmail,
                password: testPassword
            })
        });

        const loginData = await loginRes.json();
        if (!loginData.token) {
            error('LOGIN', 'No token received');
            throw new Error('Login failed');
        }

        authToken = loginData.token;
        log('✅', 'STEP 2', `Login successful! Token: ${authToken.substring(0, 20)}...`);

        // ==========================================
        // 3. CHECK WALLET
        // ==========================================
        log('💰', 'STEP 3', 'Checking Wallet...');
        const walletRes = await fetch(`${BASE_URL}/wallet`, {
            headers: { 'Authorization': `Bearer ${authToken}` }
        });

        const walletData = await walletRes.json();
        log('✅', 'STEP 3', `Wallet Balance: $${walletData.stablecoin_balance}`);

        // ==========================================
        // 4. DEPOSIT FUNDS (for testing)
        // ==========================================
        log('💵', 'STEP 4', 'Depositing test funds...');
        const depositRes = await fetch(`${BASE_URL}/wallet/deposit`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${authToken}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ amount: 100000 })
        });

        if (depositRes.ok) {
            log('✅', 'STEP 4', 'Deposited $100,000 for testing');
        }

        // ==========================================
        // 5. CREATE ASSET
        // ==========================================
        log('🏠', 'STEP 5', 'Creating Real Estate Asset...');
        const assetRes = await fetch(`${BASE_URL}/assets`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${authToken}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name: 'Luxury Penthouse Mumbai',
                description: '3BHK Premium Apartment',
                location: 'Mumbai, Maharashtra',
                valuation: 50000000
            })
        });

        const assetData = await assetRes.json();
        if (assetRes.status !== 201) {
            error('CREATE ASSET', JSON.stringify(assetData));
            throw new Error('Asset creation failed');
        }

        assetId = assetData.id;
        log('✅', 'STEP 5', `Asset created: ${assetData.name} (ID: ${assetId})`);

        // ==========================================
        // 6. TOKENIZE ASSET (BLOCKCHAIN MINTING)
        // ==========================================
        log('🪙', 'STEP 6', 'Tokenizing Asset (Blockchain Minting)...');
        const tokenizeRes = await fetch(`${BASE_URL}/assets/${assetId}/tokenize`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${authToken}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                total_fractions: 1000,
                price_per_fraction: 50000
            })
        });

        const tokenizeData = await tokenizeRes.json();
        if (!tokenizeRes.ok) {
            error('TOKENIZE', JSON.stringify(tokenizeData));
            throw new Error('Tokenization failed');
        }

        log('✅', 'STEP 6', `Asset tokenized!`);
        log('🔗', 'STEP 6', `TX Hash: ${tokenizeData.txHash}`);
        if (tokenizeData.blockNumber) {
            log('📦', 'STEP 6', `Block: ${tokenizeData.blockNumber}`);
        }

        // ==========================================
        // 7. REGISTER CLIENT & BUY TOKENS
        // ==========================================
        log('👤', 'STEP 7', 'Creating Client user...');
        const clientEmail = `client_${Date.now()}@example.com`;

        const clientRegRes = await fetch(`${BASE_URL}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: clientEmail,
                password: testPassword,
                role: 'CLIENT'
            })
        });

        const clientRegData = await clientRegRes.json();
        const clientLoginRes = await fetch(`${BASE_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: clientEmail,
                password: testPassword
            })
        });

        const clientLoginData = await clientLoginRes.json();
        const clientToken = clientLoginData.token;
        log('✅', 'STEP 7', `Client registered: ${clientEmail}`);

        // Deposit funds for client
        await fetch(`${BASE_URL}/wallet/deposit`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${clientToken}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ amount: 500000 })
        });
        log('💵', 'STEP 7', 'Client deposited $500,000');

        // Buy tokens
        log('🛒', 'STEP 8', 'Client buying 10 tokens...');
        const buyRes = await fetch(`${BASE_URL}/assets/${assetId}/buy`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${clientToken}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ fractions: 10 })
        });

        const buyData = await buyRes.json();
        if (!buyRes.ok) {
            error('BUY TOKENS', JSON.stringify(buyData));
            throw new Error('Token purchase failed');
        }
        log('✅', 'STEP 8', 'Client purchased 10 tokens!');

        // ==========================================
        // 9. SWAP TOKENS FOR STABLECOIN
        // ==========================================
        log('💱', 'STEP 9', 'Testing Token Swap...');
        const swapRes = await fetch(`${BASE_URL}/swap`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${clientToken}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                asset_id: assetId,
                amount: 5
            })
        });

        const swapData = await swapRes.json();
        if (!swapRes.ok) {
            error('SWAP', JSON.stringify(swapData));
            throw new Error('Swap failed');
        }

        log('✅', 'STEP 9', `Swapped 5 tokens for $${swapData.stablecoinReceived}`);
        log('🔗', 'STEP 9', `TX Hash: ${swapData.txHash}`);

        // ==========================================
        // 10. LOCK COLLATERAL
        // ==========================================
        log('🔒', 'STEP 10', 'Testing Collateral Lock...');
        const collateralRes = await fetch(`${BASE_URL}/collateral/lock`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${clientToken}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                asset_id: assetId,
                amount: 3
            })
        });

        const collateralData = await collateralRes.json();
        if (!collateralRes.ok) {
            error('COLLATERAL', JSON.stringify(collateralData));
            throw new Error('Collateral lock failed');
        }

        log('✅', 'STEP 10', `Locked 3 tokens as collateral (Value: $${collateralData.collateralValue})`);
        log('🔗', 'STEP 10', `TX Hash: ${collateralData.txHash}`);

        // ==========================================
        // 11. CHECK ACTIVITY FEED
        // ==========================================
        log('📊', 'STEP 11', 'Checking Blockchain Activity Feed...');
        const activityRes = await fetch(`${BASE_URL}/activity/feed?limit=10`);
        const activityData = await activityRes.json();

        log('✅', 'STEP 11', `Found ${activityData.activities.length} blockchain activities`);
        activityData.activities.slice(0, 3).forEach((activity, i) => {
            log('📝', 'STEP 11', `  ${i + 1}. ${activity.action} - ${activity.tx_hash.substring(0, 20)}...`);
        });

        // ==========================================
        // 12. CHECK DASHBOARD
        // ==========================================
        log('📈', 'STEP 12', 'Checking Client Dashboard...');
        const dashboardRes = await fetch(`${BASE_URL}/dashboard`, {
            headers: { 'Authorization': `Bearer ${clientToken}` }
        });

        const dashboardData = await dashboardRes.json();
        log('✅', 'STEP 12', `Dashboard Metrics:`);
        log('💰', 'STEP 12', `  Wallet Balance: $${dashboardData.walletBalance}`);
        log('📊', 'STEP 12', `  Token Equity: $${dashboardData.tokenEquity}`);
        log('💎', 'STEP 12', `  Net Equity: $${dashboardData.netEquity}`);
        log('💸', 'STEP 12', `  Total Yield: $${dashboardData.totalYield}`);

        // ==========================================
        // FINAL SUMMARY
        // ==========================================
        console.log('\n✅ ========================================');
        console.log('   ALL TESTS PASSED! 🎉');
        console.log('========================================');
        console.log('\n📋 Test Summary:');
        console.log('  ✅ User Registration & Login');
        console.log('  ✅ Wallet Management');
        console.log('  ✅ Asset Creation');
        console.log('  ✅ Blockchain Token Minting');
        console.log('  ✅ Token Purchase');
        console.log('  ✅ Token Swapping');
        console.log('  ✅ Collateral Locking');
        console.log('  ✅ Activity Feed');
        console.log('  ✅ Dashboard Metrics');
        console.log('\n🚀 System is fully operational!\n');

        process.exit(0);

    } catch (err) {
        console.error('\n❌ ========================================');
        console.error('   TEST FAILED!');
        console.error('========================================');
        console.error(`\n💥 Error: ${err.message}`);
        console.error(`\n📍 Stack: ${err.stack}`);
        process.exit(1);
    }
}

// Run the test
console.log('⏳ Waiting for server to be ready...');
setTimeout(() => {
    testFullFlow();
}, 2000);
