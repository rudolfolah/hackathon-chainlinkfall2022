// SPDX-License-Identifier: APACHE-2.0
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Lender is Ownable {
    struct Loan {
        address nftContract;
        uint256 tokenId;
        uint256 loanAmount;
        uint256 loanInterestRate;
    }

    // The upper bound on any individual loan amount
    uint256 public loanAmountMax;

    // The lower bound on any individual loan amount
    uint256 public loanAmountMin;

    mapping(address => Loan) private loans;

    mapping(address => uint256) public unpaidLoanAmounts;

    event LoanAmountBoundsUpdated(uint256 min, uint256 max);

    event Deposit721(
        address nftContract,
        uint256 tokenId,
        uint256 loanAmount,
        uint256 loanInterestRate
    );

    event Withdrawal(address nftContract, uint256 tokenId);

    function setLoanAmountBounds(uint256 min, uint256 max) public onlyOwner {
        emit LoanAmountBoundsUpdated(min, max);
    }

    function calculateLoan(
        address walletAddress,
        address nftContract,
        uint256 tokenId
    ) pure public returns (uint256, uint256) {
        return (0, 0);
    }

    function depositNft721(address nftContract, uint256 tokenId) public {
        // Approve transferring on behalf of this contract and then transfer the token
        IERC721 nft = IERC721(nftContract);
        nft.approve(address(this), tokenId);
        nft.safeTransferFrom(msg.sender, address(this), tokenId);

        emit Deposit721(nftContract, tokenId, 0, 0);
        uint256 loanAmount;
        uint256 loanInterestRate;
        (loanAmount, loanInterestRate) = calculateLoan(
            msg.sender,
            nftContract,
            tokenId
        );
        Loan memory loan = Loan(
            nftContract,
            tokenId,
            loanAmount,
            loanInterestRate
        );
        loans[msg.sender] = loan;
        unpaidLoanAmounts[msg.sender] = loanAmount * (1 + loanInterestRate);
    }

    function payback() public {
        Loan memory loan = loans[msg.sender];
        // msg.value
        uint256 remainingBalance = 0;
        if (remainingBalance == 0) {}
        emit Withdrawal(
            loans[msg.sender].nftContract,
            loans[msg.sender].tokenId
        );
    }
}
