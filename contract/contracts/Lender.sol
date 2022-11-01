// SPDX-License-Identifier: APACHE-2.0
pragma solidity ^0.8.9;

import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Lender is Ownable {
    // Truflation:
    // * https://github.com/truflation/quickstart
    // * https://github.com/truflation/nft-index-adapter
    // * https://market.link/nodes/Truflation/integrations
    AggregatorV3Interface internal nftPriceFeed;
    AggregatorV3Interface internal priceFeed;

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

    constructor(address nftPriceFeedAddr, address priceFeedAddr) {
        nftPriceFeed = AggregatorV3Interface(
            nftPriceFeedAddr
            // 0x17dED59fCd940F0a40462D52AAcD11493C6D8073
        );

        /**
         * Network: Ethereum Goerli (1)
         * Aggregator: ETH / USD
         * Address: 0xD4a33860578De61DBAbDc8BFdb98FD742fA7028e
         */
        priceFeed = AggregatorV3Interface(
            priceFeedAddr
            // 0xD4a33860578De61DBAbDc8BFdb98FD742fA7028e
        );
    }

    /**
     * Returns the latest price
     */
    function getLatestPrice() public view returns (int256) {
        (
            ,
            /*uint80 roundID*/
            int256 price,
            ,
            /*uint startedAt*/
            uint256 timeStamp, /*uint80 answeredInRound*/

        ) = priceFeed.latestRoundData();
        require(timeStamp > 0, "Round not complete");
        return price;
    }

    function getNftPriceIndex() public view {
        /*
        {
            timestamp: '2021-10-10T00:00:00.000Z',
            index: 104.6402453102453,
            aDayChange: 0.24229362591431586,
            aMonthChange: 25.03669682169257
          }
        */
        (
            uint256 timestamp,
            uint256 index,
        ) = nftPriceFeed.getRoundData();
    }

    function setLoanAmountBounds(uint256 min, uint256 max) public onlyOwner {
        require(
            min < max,
            "Loan amount minimum must be less than loan amount maximum"
        );
        require(min > 0, "Loan amount minimum must be greater than zero");
        require(
            max <= 10000 ether,
            "Loan amount maximum must be less than 10,000 ETH"
        );
        loanAmountMin = min;
        loanAmountMax = max;
        emit LoanAmountBoundsUpdated(min, max);
    }

    function calculateLoan(
        address walletAddress,
        address nftContract,
        uint256 tokenId
    ) public pure returns (uint256, uint256) {
        getLatestPrice()
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
