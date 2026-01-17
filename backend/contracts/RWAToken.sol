// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

/**
 * @title RWAToken
 * @dev ERC1155 token for Real World Asset fractionalization
 * Each token ID represents a unique real estate asset
 */
contract RWAToken is ERC1155, Ownable {
    using Strings for uint256;

    // Token ID counter
    uint256 private _currentTokenId = 0;

    // Mapping from token ID to asset metadata URI
    mapping(uint256 => string) private _tokenURIs;

    // Mapping from token ID to total supply
    mapping(uint256 => uint256) public tokenSupply;

    // Events
    event AssetTokenized(uint256 indexed tokenId, uint256 totalFractions, address indexed owner);
    event TokensSwapped(address indexed user, uint256 indexed tokenId, uint256 amount);
    event CollateralLocked(address indexed user, uint256 indexed tokenId, uint256 amount);

    constructor() ERC1155("https://api.proptoken.com/metadata/{id}.json") Ownable(msg.sender) {}

    /**
     * @dev Mint new asset tokens (fractionalize asset)
     * @param to Address to receive the tokens
     * @param totalFractions Total number of fractions to create
     * @param metadataURI IPFS or API URI for token metadata
     */
    function mintAsset(
        address to,
        uint256 totalFractions,
        string memory metadataURI
    ) public onlyOwner returns (uint256) {
        _currentTokenId++;
        uint256 newTokenId = _currentTokenId;

        _mint(to, newTokenId, totalFractions, "");
        _tokenURIs[newTokenId] = metadataURI;
        tokenSupply[newTokenId] = totalFractions;

        emit AssetTokenized(newTokenId, totalFractions, to);

        return newTokenId;
    }

    /**
     * @dev Get URI for a specific token
     */
    function uri(uint256 tokenId) public view override returns (string memory) {
        return _tokenURIs[tokenId];
    }

    /**
     * @dev Swap tokens (transfer to contract for liquidity)
     */
    function swapTokens(uint256 tokenId, uint256 amount) public {
        require(balanceOf(msg.sender, tokenId) >= amount, "Insufficient balance");
        
        // Transfer tokens to contract (simulating DEX)
        safeTransferFrom(msg.sender, address(this), tokenId, amount, "");
        
        emit TokensSwapped(msg.sender, tokenId, amount);
    }

    /**
     * @dev Lock tokens as collateral
     */
    function lockCollateral(uint256 tokenId, uint256 amount) public {
        require(balanceOf(msg.sender, tokenId) >= amount, "Insufficient balance");
        
        // Transfer to contract for locking
        safeTransferFrom(msg.sender, address(this), tokenId, amount, "");
        
        emit CollateralLocked(msg.sender, tokenId, amount);
    }

    /**
     * @dev Get current token ID counter
     */
    function getCurrentTokenId() public view returns (uint256) {
        return _currentTokenId;
    }
}
