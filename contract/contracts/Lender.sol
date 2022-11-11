// SPDX-License-Identifier: APACHE-2.0
pragma solidity ^0.8.9;

import "@chainlink/contracts/src/v0.8/ChainlinkClient.sol";
import "@chainlink/contracts/src/v0.8/ConfirmedOwner.sol";
import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol";

contract Lender is ChainlinkClient, ConfirmedOwner {
    using Chainlink for Chainlink.Request;

    // Truflation:
    // * https://github.com/truflation/quickstart
    // * https://github.com/truflation/nft-index-adapter
    // * https://market.link/nodes/Truflation/integrations
    address public truflationOracleId;
    string public truflationJobId;
    string public truflationResult;

    string public riskResult;

    struct Loan {
        address nftContract;
        uint256 tokenId;
        uint256 loanAmount;
        uint256 loanInterestRate;
        bool nftReceived;
        bool loanSent;
    }

    // The upper bound on any individual loan amount
    uint256 public loanAmountMax;

    // The lower bound on any individual loan amount
    uint256 public loanAmountMin;

    // Each wallet can have one loan at a time
    mapping(address => Loan) private loans;

    // The mapping of nft contract and token ids to a wallet address that has the loan
    mapping(address => mapping(uint256 => address)) private borrower;

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
        truflationResult = "1";

        loanAmountMin = 0.01 ether;
        loanAmountMax = 5 ether;
    }

    function truflationDoRequest() public returns (bytes32 requestId) {
        Chainlink.Request memory req = buildChainlinkRequest(
            bytes32(bytes(truflationJobId)),
            address(this),
            this.fulfillTruflation.selector
        );
        req.add("service", "nft-index");
        req.add("data", '{"index":"nft/top11"}');
        req.add("keypath", "index");
        req.add("abi", "json");
        req.add("multiplier", "100");
        req.add("refundTo", Strings.toHexString(uint160(msg.sender), 20));
        return
            sendChainlinkRequestTo(
                truflationOracleId,
                req,
                1000000000000000000
            );
    }

    function fulfillTruflation(bytes32 _requestId, string memory _info)
        public
        recordChainlinkFulfillment(_requestId)
    {
        truflationResult = _info;
    }

    function riskoracleDoRequest() public returns (bytes32 requestId) {
        Chainlink.Request memory req = buildChainlinkRequest(
            bytes32(bytes("7d80a6386ef543a3abb52817f6707e3b")),
            address(this),
            this.fulfillRisk.selector
        );
        req.add(
            "get",
            "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&per_page=10"
        );
        req.add("path", "0,id");
        return sendChainlinkRequest(req, 1000000000000000000);
    }

    function fulfillRisk(bytes32 _requestId, string memory _info)
        public
        recordChainlinkFulfillment(_requestId)
    {
        riskResult = _info;
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
        riskoracleDoRequest();
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
    // The contract sets up the loan amount, when received the loan is confirmed and funds are transferred
    function depositNft721(address nftContract, uint256 tokenId) public {
        require(allowedNftContracts[nftContract]);
        (uint256 loanAmount, uint256 loanInterestRate) = calculateLoan(
            msg.sender,
            nftContract,
            tokenId
        );
        Loan memory loan = Loan(
            msg.sender,
            tokenId,
            loanAmount,
            loanInterestRate,
            false,
            false
        );
        loans[msg.sender] = loan;
        borrower[nftContract][tokenId] = msg.sender;
        unpaidLoanAmounts[msg.sender] = loanAmount;
        IERC721 nft = IERC721(nftContract);
        nft.safeTransferFrom(msg.sender, address(this), tokenId);
        loan.nftReceived = true;
        IERC20 token = IERC20(allowedTokenContract);
        token.transfer(msg.sender, loan.loanAmount);
        loan.loanSent = true;
        emit Deposit721(nftContract, tokenId, 0, 0);
    }

    function payback() public {
        Loan storage loan = loans[msg.sender];
        IERC20 token = IERC20(allowedTokenContract);
        token.transferFrom(msg.sender, address(this), loan.loanAmount);
        IERC721 nft = IERC721(loan.nftContract);
        nft.safeTransferFrom(address(this), msg.sender, loan.tokenId);
        unpaidLoanAmounts[msg.sender] = 0;
        //        msg.value
        //        uint256 remainingBalance = 0;
        //        if (remainingBalance == 0) {}
        emit Withdrawal(loan.nftContract, loan.tokenId);
        delete loans[msg.sender];
    }

    // When the NFT is received, transfer the token loan amount
    function onERC721Received(
        address operator,
        address from,
        uint256 tokenId,
        bytes calldata data
    ) external returns (bytes4) {
        //        IERC20 token = IERC20(allowedTokenContract);
        //        Loan memory loan = loans[borrower[from][tokenId]];
        //        loan.nftReceived = true;
        //        require(token.transfer(borrower[from][tokenId], loan.loanAmount));
        //        loan.loanSent = true;
        return this.onERC721Received.selector;
    }
}
