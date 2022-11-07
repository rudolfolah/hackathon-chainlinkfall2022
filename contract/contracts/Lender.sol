// SPDX-License-Identifier: APACHE-2.0
pragma solidity ^0.8.9;

import "@chainlink/contracts/src/v0.8/ChainlinkClient.sol";
import "@chainlink/contracts/src/v0.8/ConfirmedOwner.sol";
import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";

contract Lender is ChainlinkClient, ConfirmedOwner {
    using Chainlink for Chainlink.Request;

    // Truflation:
    // * https://github.com/truflation/quickstart
    // * https://github.com/truflation/nft-index-adapter
    // * https://market.link/nodes/Truflation/integrations
    address public truflationOracleId;
    string public truflationJobId;
    string public truflationResult;

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

    // Each wallet can have one loan at a time
    mapping(address => Loan) private loans;

    // The total of unpaid loans
    mapping(address => uint256) public unpaidLoanAmounts;

    // This counts the total number of loans that are unpaid from the past or are currently in progress
    mapping(address => uint256) public numberOfUnpaidLoans;

    // The ERC721 NFT contracts allowed to be used for a loan
    mapping(address => bool) public allowedNftContracts;

    // The ERC20 token contract allowed to be exchanged
    address public allowedTokenContract;

    event LoanAmountBoundsUpdated(uint256 min, uint256 max);

    event Deposit721(
        address nftContract,
        uint256 tokenId,
        uint256 loanAmount,
        uint256 loanInterestRate
    );

    event Withdrawal(address nftContract, uint256 tokenId);

    constructor(
        address chainlinkToken_,
        address chainlinkOracle_,
        address truflationOracleId_,
        string memory truflationJobId_
    ) ConfirmedOwner(msg.sender) {
        setChainlinkToken(chainlinkToken_);
        setChainlinkOracle(chainlinkOracle_);
        truflationOracleId = truflationOracleId_;
        truflationJobId = truflationJobId_;

        loanAmountMin = 0.01 ether;
        loanAmountMax = 5 ether;
    }

    function truflationDoRequest() public returns (bytes32 requestId) {
        Chainlink.Request memory req = buildChainlinkRequest(
            bytes32(bytes("d220e5e687884462909a03021385b7ae")),
            address(this),
            this.fulfillTruflation.selector
        );
        req.add("service", "nft-index");
        req.add("data", '{"index":"nft/top11"}');
        req.add("keypath", "index");
        req.add("abi", "json");
        req.add("multiplier", "");
        req.add("refundTo", Strings.toHexString(uint160(msg.sender), 20));
        return
            sendChainlinkRequestTo(
                0x6D141Cf6C43f7eABF94E288f5aa3f23357278499,
                req,
                1000000000000000000
            );
        //        require(
        //            LinkTokenInterface(chainlinkTokenAddress()).transferFrom(
        //                msg.sender,
        //                address(this),
        //                fee_
        //            ),
        //            "transfer failed"
        //        );
        //        Chainlink.Request memory req = buildChainlinkRequest(
        //            bytes32(bytes(truflationJobId)),
        //            address(this),
        //            this.fulfillTruflation.selector
        //        );
        //        req.add("service", service_);
        //        req.add("data", data_);
        //        req.add("keypath", keypath_);
        //        req.add("abi", abi_);
        //        req.add("multiplier", multiplier_);
        //        req.add("refundTo", Strings.toHexString(uint160(msg.sender), 20));
        //        return sendChainlinkRequestTo(truflationOracleId, req, fee_);
        //        return 0;
    }

    function fulfillTruflation(bytes32 _requestId, string memory _info)
        public
        recordChainlinkFulfillment(_requestId)
    {
        truflationResult = _info;
    }

    function allowNfts(address nft_) public onlyOwner {
        allowedNftContracts[nft_] = true;
    }

    function allowTokens(address token_) public onlyOwner {
        allowedTokenContract = token_;
    }

    // This is done manually through the settings for now
    // In the future, we would use Chainlink Keepers to update the loan amount bounds every hour or every day
    function setLoanAmountBounds(uint256 min, uint256 max) public onlyOwner {
        require(
            min < max,
            "Loan amount minimum must be less than loan amount maximum"
        );
        require(
            min > 0.001 ether,
            "Loan amount minimum must be greater than zero"
        );
        require(
            max <= 10000 ether,
            "Loan amount maximum must be less than 10,000 ETH"
        );
        loanAmountMin = min;
        loanAmountMax = max;
        emit LoanAmountBoundsUpdated(min, max);
    }

    function requestUpdateLoanConfig() public onlyOwner {
        truflationDoRequest();
    }

    function calculateLoan(
        address walletAddress,
        address nftContract,
        uint256 tokenId
    ) public view returns (uint256, uint256) {
        return (0.01 ether, uint256(10525));
    }

    // Transfers an NFT from the message sender to the contract
    // The contract transfers the loan amount over to the message sender and keeps track of the loan
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
