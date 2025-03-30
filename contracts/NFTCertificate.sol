// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

contract NFTCertificate is ERC721, Ownable {

    using Strings for uint256;
    string[] public nftMetadataURIs = [
        "https://aqua-rare-worm-454.mypinata.cloud/ipfs/bafybeiecowelxaity7cm5vo7uiy2q3xj2vv6wyhsa4w7yglyhvxakfylw4/brain.json",
        "https://aqua-rare-worm-454.mypinata.cloud/ipfs/bafybeiecowelxaity7cm5vo7uiy2q3xj2vv6wyhsa4w7yglyhvxakfylw4/speed.json"
    ];

    uint256 public nextTokenId;
    mapping(uint256 => uint256) private tokenIdToMetadataIndex;

    event CertificateMinted(address recipient, uint256 tokenId, string metadataURI);

    constructor() ERC721("NFTCertificate", "CERT") Ownable(msg.sender) {}

    function mintCertificate(address recipient, uint256 metadataIndex) external {
        require(metadataIndex < nftMetadataURIs.length, "Invalid metadata index");

        uint256 tokenId = nextTokenId;
        _safeMint(recipient, tokenId);
        tokenIdToMetadataIndex[tokenId] = metadataIndex;
        nextTokenId++;

        emit CertificateMinted(recipient, tokenId, nftMetadataURIs[metadataIndex]);
    }

    function tokenURI(uint256 tokenId) public view virtual override returns (string memory) {
        uint256 metadataIndex = tokenIdToMetadataIndex[tokenId]; 
        return nftMetadataURIs[metadataIndex];
    }
}
