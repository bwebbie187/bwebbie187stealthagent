const hre = require("hardhat");

async function main() {
  const Agent = await hre.ethers.deployContract("StealthAgent");
  await Agent.waitForDeployment();

  console.log("StealthAgent deployed to:", await Agent.getAddress());
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
