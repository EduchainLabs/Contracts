// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract CodeBounty {
    uint256 public challengeIdCounter;
    address public owner;
    
    enum Status { waiting, completed, cancelled }
    
    struct Challenge {
        uint256 challengeId;
        address creator;
        uint256 bountyAmount;
        string description;
        Status challengeStatus;
    }
    
    struct Submission {
        address submitter;
        bytes32 solutionHash;
        bool isVerified;
    }
    
    mapping(uint256 => Challenge) public challenges;
    mapping(uint256 => Submission[]) public challengeSubmissions;
    mapping(uint256 => bool) public challengeCompleted;
    mapping(address => uint256) public userRewarded;
    
    event ChallengeCreated(uint256 challengeId, address creator, uint256 bounty);
    event ChallengeCancelled(uint256 challengeId, address creator);
    event SolutionSubmitted(uint256 challengeId, address submitter, bytes32 solutionHash);
    event SolutionVerified(uint256 challengeId, address verifier, address winner);
    event RewardDistributed(uint256 challengeId, address winner, uint256 amount);
    
    constructor() {
        owner = msg.sender;
    }
    
    modifier onlyOwner {
        require(msg.sender == owner, "Only owner can call this function");
        _;
    }
    
    modifier onlyCreator(uint256 _challengeId) {
        require(msg.sender == challenges[_challengeId].creator, "Only challenge creator can call this function");
        _;
    }
    
    function createChallenge(string memory _description, uint256 _bountyAmount) external payable {
        require(msg.value >= _bountyAmount, "Amount Paid is Less Than Value Published");
        challengeIdCounter++;
        challenges[challengeIdCounter] = Challenge({
            challengeId: challengeIdCounter,
            creator: msg.sender,
            bountyAmount: _bountyAmount,
            description: _description,
            challengeStatus: Status.waiting
        });
        emit ChallengeCreated(challengeIdCounter, msg.sender, _bountyAmount);
    }
    
    function submitSolution(uint256 _challengeId, bytes32 _solutionHash) external {
        require(challenges[_challengeId].challengeStatus == Status.waiting, "Challenge is not active");
        challengeSubmissions[_challengeId].push(Submission({
            submitter: msg.sender,
            solutionHash: _solutionHash,
            isVerified: true
        }));
        emit SolutionSubmitted(_challengeId, msg.sender, _solutionHash);
    }
    
    
    function distributeReward(uint256 _challengeId, address winner) external onlyCreator(_challengeId) {
        require(challenges[_challengeId].challengeStatus == Status.waiting, "Challenge is not active");
        require(!challengeCompleted[_challengeId], "Challenge already completed");
        require(userRewarded[winner] == 0, "Winner has already been rewarded");
        
        userRewarded[winner] += challenges[_challengeId].bountyAmount;
        challenges[_challengeId].challengeStatus = Status.completed;
        challengeCompleted[_challengeId] = true;
        emit RewardDistributed(_challengeId, winner, challenges[_challengeId].bountyAmount);
    }
    
    function withdrawRewards() external {
        uint256 amount = userRewarded[msg.sender];
        require(amount > 0, "No rewards to withdraw");
        userRewarded[msg.sender] = 0;
        payable(msg.sender).transfer(amount);
    }
    
    function cancelChallenge(uint256 _challengeId) external onlyCreator(_challengeId) {
        require(challenges[_challengeId].challengeStatus == Status.waiting, "Challenge is already completed or cancelled");
        require(challengeSubmissions[_challengeId].length == 0, "Challenge has submissions, cannot cancel");
        
        payable(msg.sender).transfer(challenges[_challengeId].bountyAmount);
        challenges[_challengeId].challengeStatus = Status.cancelled;
        emit ChallengeCancelled(_challengeId, msg.sender);
    }
}
