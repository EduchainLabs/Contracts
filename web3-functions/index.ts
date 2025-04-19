import {
  Web3Function,
  Web3FunctionContext,
} from "@gelatonetwork/web3-functions-sdk";
import { Contract, ethers } from "ethers";

// CodeBounty ABI - only the functions we need
const ABI = [
  {
    inputs: [],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint256",
        name: "challengeId",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "address",
        name: "creator",
        type: "address",
      },
    ],
    name: "ChallengeCancelled",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint256",
        name: "challengeId",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "address",
        name: "creator",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "bounty",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "duration",
        type: "uint256",
      },
    ],
    name: "ChallengeCreated",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint256",
        name: "challengeId",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "address",
        name: "winner",
        type: "address",
      },
    ],
    name: "ChallengeExpired",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint256",
        name: "challengeId",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "address",
        name: "winner",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "RewardDistributed",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint256",
        name: "challengeId",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "address",
        name: "submitter",
        type: "address",
      },
      {
        indexed: false,
        internalType: "bytes32",
        name: "solutionHash",
        type: "bytes32",
      },
    ],
    name: "SolutionSubmitted",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint256",
        name: "challengeId",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "address",
        name: "verifier",
        type: "address",
      },
      {
        indexed: false,
        internalType: "address",
        name: "winner",
        type: "address",
      },
    ],
    name: "SolutionVerified",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_challengeId",
        type: "uint256",
      },
    ],
    name: "cancelChallenge",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    name: "challengeCompleted",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "challengeIdCounter",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    name: "challengeSubmissions",
    outputs: [
      {
        internalType: "address",
        name: "submitter",
        type: "address",
      },
      {
        internalType: "bytes32",
        name: "solutionHash",
        type: "bytes32",
      },
      {
        internalType: "bool",
        name: "isVerified",
        type: "bool",
      },
      {
        internalType: "uint256",
        name: "submissionTime",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    name: "challenges",
    outputs: [
      {
        internalType: "uint256",
        name: "challengeId",
        type: "uint256",
      },
      {
        internalType: "address",
        name: "creator",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "bountyAmount",
        type: "uint256",
      },
      {
        internalType: "string",
        name: "title",
        type: "string",
      },
      {
        internalType: "string",
        name: "description",
        type: "string",
      },
      {
        internalType: "string",
        name: "requirements",
        type: "string",
      },
      {
        internalType: "uint8", // Changed from enum CodeBounty.Status to uint8
        name: "challengeStatus",
        type: "uint8",
      },
      {
        internalType: "uint256",
        name: "submissionsCount",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "startTime",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "duration",
        type: "uint256",
      },
      {
        internalType: "address",
        name: "winner",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "_title",
        type: "string",
      },
      {
        internalType: "string",
        name: "_description",
        type: "string",
      },
      {
        internalType: "string",
        name: "_requirements",
        type: "string",
      },
      {
        internalType: "string[]",
        name: "_tags",
        type: "string[]",
      },
      {
        internalType: "uint256",
        name: "_bountyAmount",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "_durationInDays",
        type: "uint256",
      },
    ],
    name: "createChallenge",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_challengeId",
        type: "uint256",
      },
      {
        internalType: "address",
        name: "winner",
        type: "address",
      },
    ],
    name: "distributeReward",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "getActiveChallenges",
    outputs: [
      {
        components: [
          {
            internalType: "uint256",
            name: "challengeId",
            type: "uint256",
          },
          {
            internalType: "address",
            name: "creator",
            type: "address",
          },
          {
            internalType: "uint256",
            name: "bountyAmount",
            type: "uint256",
          },
          {
            internalType: "string",
            name: "title",
            type: "string",
          },
          {
            internalType: "string",
            name: "description",
            type: "string",
          },
          {
            internalType: "string",
            name: "requirements",
            type: "string",
          },
          {
            internalType: "string[]",
            name: "tags",
            type: "string[]",
          },
          {
            internalType: "uint8", // Changed from enum CodeBounty.Status to uint8
            name: "challengeStatus",
            type: "uint8",
          },
          {
            internalType: "uint256",
            name: "submissionsCount",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "startTime",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "duration",
            type: "uint256",
          },
          {
            internalType: "address",
            name: "winner",
            type: "address",
          },
        ],
        internalType: "struct CodeBounty.Challenge[]",
        name: "",
        type: "tuple[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getCancelledChallenges",
    outputs: [
      {
        components: [
          {
            internalType: "uint256",
            name: "challengeId",
            type: "uint256",
          },
          {
            internalType: "address",
            name: "creator",
            type: "address",
          },
          {
            internalType: "uint256",
            name: "bountyAmount",
            type: "uint256",
          },
          {
            internalType: "string",
            name: "title",
            type: "string",
          },
          {
            internalType: "string",
            name: "description",
            type: "string",
          },
          {
            internalType: "string",
            name: "requirements",
            type: "string",
          },
          {
            internalType: "string[]",
            name: "tags",
            type: "string[]",
          },
          {
            internalType: "uint8", // Changed from enum CodeBounty.Status to uint8
            name: "challengeStatus",
            type: "uint8",
          },
          {
            internalType: "uint256",
            name: "submissionsCount",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "startTime",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "duration",
            type: "uint256",
          },
          {
            internalType: "address",
            name: "winner",
            type: "address",
          },
        ],
        internalType: "struct CodeBounty.Challenge[]",
        name: "",
        type: "tuple[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_challengeId",
        type: "uint256",
      },
    ],
    name: "getChallengeRemainingTime",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getCompletedChallenges",
    outputs: [
      {
        components: [
          {
            internalType: "uint256",
            name: "challengeId",
            type: "uint256",
          },
          {
            internalType: "address",
            name: "creator",
            type: "address",
          },
          {
            internalType: "uint256",
            name: "bountyAmount",
            type: "uint256",
          },
          {
            internalType: "string",
            name: "title",
            type: "string",
          },
          {
            internalType: "string",
            name: "description",
            type: "string",
          },
          {
            internalType: "string",
            name: "requirements",
            type: "string",
          },
          {
            internalType: "string[]",
            name: "tags",
            type: "string[]",
          },
          {
            internalType: "uint8", // Changed from enum CodeBounty.Status to uint8
            name: "challengeStatus",
            type: "uint8",
          },
          {
            internalType: "uint256",
            name: "submissionsCount",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "startTime",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "duration",
            type: "uint256",
          },
          {
            internalType: "address",
            name: "winner",
            type: "address",
          },
        ],
        internalType: "struct CodeBounty.Challenge[]",
        name: "",
        type: "tuple[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getExpiredChallenges",
    outputs: [
      {
        components: [
          {
            internalType: "uint256",
            name: "challengeId",
            type: "uint256",
          },
          {
            internalType: "address",
            name: "creator",
            type: "address",
          },
          {
            internalType: "uint256",
            name: "bountyAmount",
            type: "uint256",
          },
          {
            internalType: "string",
            name: "title",
            type: "string",
          },
          {
            internalType: "string",
            name: "description",
            type: "string",
          },
          {
            internalType: "string",
            name: "requirements",
            type: "string",
          },
          {
            internalType: "string[]",
            name: "tags",
            type: "string[]",
          },
          {
            internalType: "uint8", // Changed from enum CodeBounty.Status to uint8
            name: "challengeStatus",
            type: "uint8",
          },
          {
            internalType: "uint256",
            name: "submissionsCount",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "startTime",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "duration",
            type: "uint256",
          },
          {
            internalType: "address",
            name: "winner",
            type: "address",
          },
        ],
        internalType: "struct CodeBounty.Challenge[]",
        name: "",
        type: "tuple[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_user",
        type: "address",
      },
    ],
    name: "getUserStats",
    outputs: [
      {
        internalType: "uint256",
        name: "winCount",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "submissionCount",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "totalRewards",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "owner",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_challengeId",
        type: "uint256",
      },
    ],
    name: "resolveExpiredChallenge",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_challengeId",
        type: "uint256",
      },
      {
        internalType: "bytes32",
        name: "_solutionHash",
        type: "bytes32",
      },
    ],
    name: "submitSolution",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "totalSubmissionsCount",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    name: "userRewarded",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    name: "userStats",
    outputs: [
      {
        internalType: "uint256",
        name: "winCount",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "submissionCount",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "totalRewards",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "withdrawRewards",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
];

const Status = {
  WAITING: 0,
  COMPLETED: 1,
  CANCELLED: 2,
  EXPIRED: 3,
};

Web3Function.onRun(async (context: Web3FunctionContext) => {
  const { userArgs, multiChainProvider } = context;
  const provider = multiChainProvider.default();

  // Get contract address from user args
  const codeBountyAddress = "0xE64fA322753b840Ab87895f069F4f85C5cD28A13";
  if (!codeBountyAddress || !ethers.utils.isAddress(codeBountyAddress)) {
    return { canExec: false, message: "Invalid CodeBounty contract address" };
  }

  try {
    // Initialize contract instance
    const codeBounty = new Contract(codeBountyAddress, ABI, provider);

    // Get total number of challenges
    const challengeIdCounter = await codeBounty.challengeIdCounter();

    // Prepare batch of expired challenges to resolve
    const callData = [];
    const currentTime = Math.floor(Date.now() / 1000); // Current timestamp in seconds

    // Loop through all challenges
    for (let i = 1; i <= challengeIdCounter.toNumber(); i++) {
      try {
        const challenge = await codeBounty.challenges(i);

        // Check if the challenge is in waiting status (0 = Status.WAITING)
        if (challenge.challengeStatus === Status.WAITING) {
          const challengeEndTime = challenge.startTime
            .add(challenge.duration)
            .toNumber();

          // Check if challenge has expired
          if (currentTime >= challengeEndTime) {
            // Build the function call data
            const functionData = codeBounty.interface.encodeFunctionData(
              "resolveExpiredChallenge",
              [i]
            );

            callData.push({
              to: codeBountyAddress,
              data: functionData,
            });
          }
        }
      } catch (err) {
        console.log(`Error processing challenge ${i}: ${err}`);
        // Continue with next challenge
      }
    }

    // Return early if no expired challenges
    if (callData.length === 0) {
      return { canExec: false, message: "No expired challenges to resolve" };
    }

    // Return callData for execution
    return {
      canExec: true,
      callData,
    };
  } catch (error) {
    return { canExec: false, message: `Error: ${error}` };
  }
});
