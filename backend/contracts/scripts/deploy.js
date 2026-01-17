const hre = require("hardhat");

async function main() {
    console.log("Deploying RWAToken to Base Sepolia...");

    const RWAToken = await hre.ethers.getContractFactory("RWAToken");
    const rwaToken = await RWAToken.deploy();

    await rwaToken.waitForDeployment();

    const address = await rwaToken.getAddress();
    console.log(`✅ RWAToken deployed to: ${address}`);
    console.log(`🔗 View on BaseScan: https://sepolia.basescan.org/address/${address}`);

    // Save deployment info
    const fs = require('fs');
    const deploymentInfo = {
        contractAddress: address,
        network: "baseSepolia",
        chainId: 84532,
        deployedAt: new Date().toISOString()
    };

    fs.writeFileSync(
        './deployment.json',
        JSON.stringify(deploymentInfo, null, 2)
    );

    console.log("\n📄 Deployment info saved to deployment.json");
    console.log("\n⏳ Waiting 30 seconds before verification...");
    await new Promise(resolve => setTimeout(resolve, 30000));

    // Verify contract
    try {
        await hre.run("verify:verify", {
            address: address,
            constructorArguments: [],
        });
        console.log("✅ Contract verified on BaseScan");
    } catch (error) {
        console.log("⚠️ Verification failed:", error.message);
    }
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
