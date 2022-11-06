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
    bytes public truflationResult;

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

    function truflationDoTransferAndRequest(
        string memory service_,
        string memory data_,
        string memory keypath_,
        string memory abi_,
        string memory multiplier_,
        uint256 fee_
    ) public returns (bytes32 requestId) {
        require(
            LinkTokenInterface(chainlinkTokenAddress()).transferFrom(
                msg.sender,
                address(this),
                fee_
            ),
            "transfer failed"
        );
        Chainlink.Request memory req = buildChainlinkRequest(
            bytes32(bytes(truflationJobId)),
            address(this),
            this.fulfillTruflation.selector
        );
        req.add("service", service_);
        req.add("data", data_);
        req.add("keypath", keypath_);
        req.add("abi", abi_);
        req.add("multiplier", multiplier_);
        req.add("refundTo", Strings.toHexString(uint160(msg.sender), 20));
        return sendChainlinkRequestTo(truflationOracleId, req, fee_);
    }

    function fulfillTruflation(bytes32 _requestId, bytes memory bytesData)
        public
        recordChainlinkFulfillment(_requestId)
    {
        truflationResult = bytesData;
    }

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
        truflationDoTransferAndRequest(
            "nft-index",
            "",
            "index",
            "json",
            "",
            1000000000000000000
        );
    }

    function calculateLoan(
        address walletAddress,
        address nftContract,
        uint256 tokenId
    ) public view returns (uint256, uint256) {
        return (uint256(0), uint256(0));
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
