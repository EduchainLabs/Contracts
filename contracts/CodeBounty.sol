//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0; 

contract CodeBounty {
    uint256 public challengeIdCounter;
    address public owner;
    enum Status {
        waiting,completed,cancelled
    }
    struct Challenge {
        uint256 challengeId;
        address creator;
        uint256 bountyAmount;
        string description;
        Status challengeStatus;  
    }

    struct Submission {
        address submittor;
        uint256  challengId;
        bytes32 solutionHash;
        bool isVerified;
    }

    mapping(uint256 => Submission[]) public challengeSubmissions;
    mapping (uint256 => Challenge) public challenges;
    mapping (uint256 => address) public challengeToCreator;
    mapping (uint256 => bool) public challengeCompleted;
    mapping (address => uint256) public userRewarded;

    event ChallengeCreated(uint256 challengeId, address creator, uint256 bounty);
    event RewardDistributed(uint256 challengeId, address winner, uint256 amount);

    constructor(){
        owner = msg.sender;
    }

    modifier onlyOwner {
        require(msg.sender == owner);
        _;
    }

    modifier onlyCreator(uint256 _challengeId){
        require(msg.sender == challenges[_challengeId].creator);
        _;
    }

    function createChallenge(string memory _description,uint256 _bountyAmount ) external payable  {
        require(msg.value >= _bountyAmount,"Amount Paid is Less Than Value Published" );
        challengeIdCounter++;
        challenges[challengeIdCounter] = Challenge({
            challengeId : challengeIdCounter,
            creator : msg.sender,
            bountyAmount : _bountyAmount,
            description : _description,
            challengeStatus : Status.waiting
        });
        challengeToCreator[challengeIdCounter] = msg.sender;
        emit ChallengeCreated(challengeIdCounter, msg.sender, _bountyAmount);
    }

    function cancelChallenge(uint256 _challengeId) external onlyCreator(_challengeId) {
        require(challenges[_challengeId].challengeStatus == Status.waiting, "Challenge is already completed");
        require(challenges[_challengeId].bountyAmount < address(this).balance, "Cant Cancel Challenge Because of Fund shortage");

        payable(msg.sender).transfer(challenges[_challengeId].bountyAmount);
        challenges[_challengeId].challengeStatus = Status.cancelled;
    }

    function distributeReward(uint256 _challengeId, address winner) external onlyCreator(_challengeId) {
        require(challenges[_challengeId].challengeStatus == Status.waiting);
        require(!challengeCompleted[_challengeId] , "Challenge Already Completed");

        payable(winner).transfer(challenges[_challengeId].bountyAmount);
        challenges[_challengeId].challengeStatus = Status.completed;
        challengeCompleted[_challengeId] = true;
    }
}

