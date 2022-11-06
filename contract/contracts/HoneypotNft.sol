// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract HoneypotNft is ERC721, Ownable {
    using Counters for Counters.Counter;

    Counters.Counter private _tokenIdCounter;

    constructor() ERC721("Test NFT", "TESTNFT") {
        safeMint(msg.sender);
        safeMint(msg.sender);
        safeMint(msg.sender);
        safeMint(msg.sender);

        safeMint(msg.sender);
        safeMint(msg.sender);
        safeMint(msg.sender);
        safeMint(msg.sender);

        safeMint(msg.sender);
        safeMint(msg.sender);
        safeMint(msg.sender);
        safeMint(msg.sender);
    }

    function safeMint(address to) public onlyOwner {
        uint256 tokenId = _tokenIdCounter.current();
        _tokenIdCounter.increment();
        _safeMint(to, tokenId);
    }

    function _baseURI() internal view virtual override returns (string memory) {
        return "/images/nft-example-";
    }
}
