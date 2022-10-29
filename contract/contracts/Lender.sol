// SPDX-License-Identifier: APACHE-2.0
pragma solidity ^0.8.9;

contract Lender {
    struct Loan {
        address nftContract;
        uint256 tokenId;
        uint256 loanAmount;
        uint256 loanInterestRate;
    }
    address payable public owner;

    mapping(address => Loan) private loans;

    mapping(address => uint256) public unpaidLoanAmounts;

    event Deposit721(
        address nftContract,
        uint256 tokenId,
        uint256 loanAmount,
        uint256 loanInterestRate
    );

    event Withdrawal(address nftContract, uint256 tokenId);

    function approveNft721(address nftContract) public {
    }

    function depositNft721(address nftContract, uint256 tokenId) public {
        emit Deposit721(nftContract, tokenId, 0, 0);
        uint256 loanAmount = 0;
        uint256 loanInterestRate = 0;
        Loan memory loan = Loan(nftContract, tokenId, loanAmount, loanInterestRate);
        loans[msg.sender] = loan;
        unpaidLoanAmounts[msg.sender] = loanAmount * (1 + loanInterestRate);
    }

    function payback() public {
        Loan memory loan = loans[msg.sender];
        // msg.value
        uint256 remainingBalance = 0;
        if (remainingBalance == 0) {}
        emit Withdrawal(loans[msg.sender].nftContract, loans[msg.sender].tokenId);
    }
}
