// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract HoneypotPrototypeToken is ERC20, Ownable {
    using Counters for Counters.Counter;

    Counters.Counter private _tokenIdCounter;

    constructor(address to) ERC20("HONEYPOT PROTOTYPE TOKEN", "HPT") {
        _mint(msg.sender, 1 ether);
        _mint(to, 100 ether);
    }
}
