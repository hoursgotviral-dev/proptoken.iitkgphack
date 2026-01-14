// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./interfaces/IAssetRegistry.sol";

contract AssetRegistry is IAssetRegistry {
    struct Asset {
        bytes32 fingerprint;
        bytes32 oracleAttestation;
        bytes32 abmOutputHash;
        uint256 existenceScore;
        uint256 ownershipProb;
        uint256 fraudLikelihood;
        uint256 riskScore;
        uint256 timestamp;
        bool eligible;
    }
    
    mapping(bytes32 => Asset) public assets;
    mapping(address => bytes32[]) public ownerAssets;
    
    address public oracleAddress;
    address public consensusEngine;
    
    modifier onlyConsensus() {
        require(msg.sender == consensusEngine, "Only consensus engine");
        _;
    }
    
    constructor(address _consensusEngine, address _oracleAddress) {
        consensusEngine = _consensusEngine;
        oracleAddress = _oracleAddress;
    }

    function registerAsset(
        bytes32 fingerprint,
        address owner,
        bytes32 oracleAttestation,
        bytes32 abmOutputHash,
        uint256[4] memory scores, // [existence, ownership, fraud, risk]
        bool eligible
    ) external override onlyConsensus {
        require(assets[fingerprint].timestamp == 0, "Asset already registered");
        
        assets[fingerprint] = Asset({
            fingerprint: fingerprint,
            oracleAttestation: oracleAttestation,
            abmOutputHash: abmOutputHash,
            existenceScore: scores[0],
            ownershipProb: scores[1],
            fraudLikelihood: scores[2],
            riskScore: scores[3],
            timestamp: block.timestamp,
            eligible: eligible
        });
        
        ownerAssets[owner].push(fingerprint);
        
        emit AssetRegistered(fingerprint, owner, eligible);
    }
    
    function getAsset(bytes32 fingerprint) external view override returns (bool, uint256, uint256) {
        Asset memory asset = assets[fingerprint];
        return (asset.eligible, asset.existenceScore, asset.riskScore);
    }
}
