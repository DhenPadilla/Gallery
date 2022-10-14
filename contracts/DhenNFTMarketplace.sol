
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";

contract DheNFTMarketplace {
    struct Listing {
       uint256 price;
       address seller;
    }

    mapping(uint256 => Listing) public listings;

    // Modifiers
    // Requires the msg.sender is the owner of the specified NFT
    modifier isDhen(address dheNFTContractAddress, uint256 tokenId) {
        require(
            IERC721(dheNFTContractAddress).ownerOf(tokenId) == msg.sender,
            "You are not Dhen!?"
        );
        _;
    }

    // Requires nft to not yet be listed for sale
    modifier isNotListed(uint256 tokenId) {
        require(
            listings[tokenId].price == 0,
            "This DheNFT has already been listed"
        );
        _;
    }

    // Requires that the specified NFT is already listed for sale
    modifier isListed(uint256 tokenId) {
        require(listings[tokenId].price > 0, "This DheNFT has not been listed");
        _;
    }

    // Events
    event ListingCreated(address dheNFTAddress, uint256 tokenId, uint256 price, address seller);
    event ListingCancelled(address dheNFTAddress, uint256 tokenId, address seller);
    event ListingUpdated(address dheNFTAddress, uint256 tokenId, uint256 newPrice, address seller);
    event ListingPurchased(address dheNFTAddress, uint256 tokenId, address seller, address buyer);

    // Add NFT to marketplace
    function createListing(
        address dheNFTContractAddress,
        uint256 dheNFTokenId,
        uint256 price
    ) external isNotListed(dheNFTokenId) isDhen(dheNFTContractAddress, dheNFTokenId)
    {
        // Cannot create a listing to sell DheNFT for < 0 ETH
        require(price > 0, "Listing a DheNFT must have a price > 0");

        // Check the caller is the owner of the NFT (isDhen) & has approved 
        // the marketplace contract to transfer on their behalf
        IERC721 dheNFTContract = IERC721(dheNFTContractAddress);
        require(
            dheNFTContract.isApprovedForAll(msg.sender, address(this)) ||
            dheNFTContract.getApproved(dheNFTokenId) == address(this),
            "Dhen has not approved this listing of his NFT"
        );

        // Add the listing to the DheNFTMarketplace map
        listings[dheNFTokenId] = Listing({
            price: price,
            seller: msg.sender
        });

        emit ListingCreated(dheNFTContractAddress, dheNFTokenId, price, msg.sender);
    }

    // Remove NFT from marketplace
    function cancelListing(
        address dheNFTContractAdress,
        uint256 dheNFTokenId
    ) external isListed(dheNFTokenId) isDhen(dheNFTContractAdress, dheNFTokenId) {
        delete listings[dheNFTokenId];

        emit ListingCancelled(dheNFTContractAdress, dheNFTokenId, msg.sender);
    }

    // Update NFT listed price
    function updateListing(
        address dheNFTContractAddress,
        uint256 dheNFTokenId,
        uint256 newPrice
    ) external isListed(dheNFTokenId) isDhen(dheNFTContractAddress, dheNFTokenId) {
        require(newPrice > 0, "Price must be > 0");

        listings[dheNFTokenId].price = newPrice;

        emit ListingUpdated(dheNFTContractAddress, dheNFTokenId, newPrice, msg.sender);
    }

    // Purchase a listed Dhen NFT
    function purchaseListing(
        address dheNFTContractAddress,
        uint256 dheNFTokenId
    ) external payable isListed(dheNFTokenId) {
        // Load the listed NFT as local copy
        Listing memory listing = listings[dheNFTokenId];

        // Buyer must have sent through cGLD of the correct price
        require(msg.value == listing.price, "That is the incorrect funds");

        // Delete listing from the marketplace
        delete listings[dheNFTokenId];

        // Transfer the NFT from seller (Dhen) to buyer
        IERC721(dheNFTContractAddress).safeTransferFrom(
            listing.seller,
            msg.sender,
            dheNFTokenId
        );

        // Transfer ETH sent from buyer to seller
        (bool sent, ) = payable(listing.seller).call{ value: msg.value }("");
        require(sent, "Failed to transfer funds");


        emit ListingPurchased(dheNFTContractAddress, dheNFTokenId, listing.seller, msg.sender);
    }
}