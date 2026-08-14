const hre = require("hardhat");

async function main() {
  const Agent = await hre.ethers.getContractFactory("StealthAgent");
  const agent = await Agent.deploy();

  await agent.waitForDeployment();

  console.log("StealthAgent deployed to:", await agent.getAddress());
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

