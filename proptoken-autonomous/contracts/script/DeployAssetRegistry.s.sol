// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Script.sol";
import "../src/AssetRegistry.sol";

contract DeployAssetRegistry is Script {
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        address admin = vm.addr(deployerPrivateKey);

        vm.startBroadcast(deployerPrivateKey);

        AssetRegistry registry = new AssetRegistry(admin);
        
        // Grant CONSENSUS_ROLE to the admin (for testing)
        registry.grantRole(registry.CONSENSUS_ROLE(), admin);
        
        console.log("AssetRegistry deployed to:", address(registry));

        vm.stopBroadcast();
    }
}
