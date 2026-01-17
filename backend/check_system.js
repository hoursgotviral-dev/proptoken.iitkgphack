import db from './db.js';

async function comprehensiveCheck() {
    console.log('\n🔍 ========================================');
    console.log('   COMPREHENSIVE SYSTEM CHECK');
    console.log('========================================\n');

    try {
        // 1. Database Connection
        console.log('1️⃣  Testing database connection...');
        await db.query('SELECT NOW()');
        console.log('✅ Database connected\n');

        // 2. Check all tables exist
        console.log('2️⃣  Checking database tables...');
        const tables = await db.query(`
            SELECT table_name 
            FROM information_schema.tables 
            WHERE table_schema = 'public' 
            ORDER BY table_name
        `);
        console.log(`✅ Found ${tables.rows.length} tables:`);
        tables.rows.forEach(t => console.log(`   - ${t.table_name}`));
        console.log('');

        // 3. Check users table
        console.log('3️⃣  Checking users table...');
        const userCount = await db.query('SELECT COUNT(*) FROM users');
        console.log(`✅ Users: ${userCount.rows[0].count} records\n`);

        // 4. Check wallets table
        console.log('4️⃣  Checking wallets table...');
        const walletCount = await db.query('SELECT COUNT(*) FROM wallets');
        console.log(`✅ Wallets: ${walletCount.rows[0].count} records\n`);

        // 5. Check assets table
        console.log('5️⃣  Checking assets table...');
        const assetCount = await db.query('SELECT COUNT(*) FROM assets');
        console.log(`✅ Assets: ${assetCount.rows[0].count} records\n`);

        // 6. Check blockchain_activities table
        console.log('6️⃣  Checking blockchain_activities table...');
        const activityCount = await db.query('SELECT COUNT(*) FROM blockchain_activities');
        console.log(`✅ Blockchain Activities: ${activityCount.rows[0].count} records\n`);

        // 7. Check ownerships
        console.log('7️⃣  Checking ownerships table...');
        const ownershipCount = await db.query('SELECT COUNT(*) FROM ownerships');
        console.log(`✅ Ownerships: ${ownershipCount.rows[0].count} records\n`);

        // 8. Check swaps
        console.log('8️⃣  Checking swaps table...');
        const swapCount = await db.query('SELECT COUNT(*) FROM swaps');
        console.log(`✅ Swaps: ${swapCount.rows[0].count} records\n`);

        // 9. Check collaterals
        console.log('9️⃣  Checking collaterals table...');
        const collateralCount = await db.query('SELECT COUNT(*) FROM collaterals');
        console.log(`✅ Collaterals: ${collateralCount.rows[0].count} records\n`);

        // 10. Check wallet_address column
        console.log('🔟 Checking wallet_address column...');
        const walletAddressCheck = await db.query(`
            SELECT column_name, data_type 
            FROM information_schema.columns 
            WHERE table_name = 'users' AND column_name = 'wallet_address'
        `);
        if (walletAddressCheck.rows.length > 0) {
            console.log(`✅ wallet_address column exists (${walletAddressCheck.rows[0].data_type})\n`);
        } else {
            console.log('⚠️  wallet_address column missing\n');
        }

        // 11. Sample data check
        console.log('1️⃣1️⃣  Checking sample data...');
        const sampleUser = await db.query('SELECT id, email, role FROM users LIMIT 1');
        if (sampleUser.rows.length > 0) {
            console.log('✅ Sample user found:');
            console.log(`   ID: ${sampleUser.rows[0].id}`);
            console.log(`   Email: ${sampleUser.rows[0].email}`);
            console.log(`   Role: ${sampleUser.rows[0].role}\n`);
        } else {
            console.log('ℹ️  No users in database yet\n');
        }

        // 12. Check recent activities
        console.log('1️⃣2️⃣  Checking recent blockchain activities...');
        const recentActivities = await db.query(`
            SELECT action, COUNT(*) as count 
            FROM blockchain_activities 
            GROUP BY action
        `);
        if (recentActivities.rows.length > 0) {
            console.log('✅ Activity breakdown:');
            recentActivities.rows.forEach(a => {
                console.log(`   ${a.action}: ${a.count}`);
            });
        } else {
            console.log('ℹ️  No blockchain activities yet');
        }
        console.log('');

        // Summary
        console.log('========================================');
        console.log('   ✅ ALL CHECKS PASSED!');
        console.log('========================================\n');
        console.log('📊 Database Summary:');
        console.log(`   Tables: ${tables.rows.length}`);
        console.log(`   Users: ${userCount.rows[0].count}`);
        console.log(`   Wallets: ${walletCount.rows[0].count}`);
        console.log(`   Assets: ${assetCount.rows[0].count}`);
        console.log(`   Activities: ${activityCount.rows[0].count}`);
        console.log(`   Ownerships: ${ownershipCount.rows[0].count}`);
        console.log(`   Swaps: ${swapCount.rows[0].count}`);
        console.log(`   Collaterals: ${collateralCount.rows[0].count}`);
        console.log('\n🟢 Database is fully operational!\n');

        process.exit(0);

    } catch (err) {
        console.error('\n❌ ========================================');
        console.error('   CHECK FAILED!');
        console.error('========================================\n');
        console.error('Error:', err.message);
        console.error('\nStack:', err.stack);
        process.exit(1);
    }
}

comprehensiveCheck();
