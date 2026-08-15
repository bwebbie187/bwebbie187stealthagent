const hre = require("hardhat");

async function main() {
  const StealthAgent = await hre.ethers.getContractFactory("StealthAgent");
  const agent = await StealthAgent.deploy();

  await agent.waitForDeployment();

  console.log("StealthAgent deployed to:", await agent.getAddress());
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
