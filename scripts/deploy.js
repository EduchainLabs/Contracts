const hre = require("hardhat");

async function main() {
  const deployedContract = await hre.ethers.deployContract("OnChainLab");
  await deployedContract.waitForDeployment();
  console.log(`OnChainLab contract deployed to ${deployedContract.target}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
