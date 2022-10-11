// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

contract DhenNFT is ERC721, Ownable {
    using Strings for uint256;
    /**
      * @dev _baseTokenURI for computing {tokenURI}. If set, the resulting URI for each
      * token will be the concatenation of the `baseURI` and the `tokenId`.
      */
    string private _baseTokenURI = "https://dhenpadilla-nfts.s3.eu-west-1.amazonaws.com/";
    uint256 private _tokenIds = 0;

    constructor() ERC721("DhenNFT", "dpNFT") {}

    function mintDhenToken() external onlyOwner {
        _tokenIds++;
        uint256 tokenId = _tokenIds;
        _safeMint(msg.sender, tokenId);
    }

    function tokenURI(uint256 _tokenId) public view virtual override returns (string memory) {
        require(_exists(_tokenId), "ERC721Metadata: URI query for nonexistent token");

        string memory currentBaseURI = _baseTokenURI;
        return bytes(currentBaseURI).length > 0 ? string(abi.encodePacked(currentBaseURI, _tokenId.toString(), ".json")) : "";
    }
}