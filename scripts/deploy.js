const fs = require("node:fs");
const path = require("node:path");
const hre = require("hardhat");

const NETWORKS = {
  base: { chainId: 8453, mainnet: true },
  baseSepolia: { chainId: 84532, mainnet: false },
  goat: { chainId: 2345, mainnet: true },
  goatTestnet: { chainId: 48816, mainnet: false },
};

async function main() {
  const networkConfig = NETWORKS[hre.network.name];
  if (!networkConfig) {
    throw new Error(
      `Unsupported deployment network "${hre.network.name}". Choose base, baseSepolia, goat, or goatTestnet.`,
    );
  }

  const { chainId } = await hre.ethers.provider.getNetwork();
  if (chainId !== BigInt(networkConfig.chainId)) {
    throw new Error(
      `Network mismatch: Hardhat network "${hre.network.name}" is configured for chain ${networkConfig.chainId}, but the RPC reports ${chainId}.`,
    );
  }

  if (networkConfig.mainnet && process.env.DEPLOY_CONFIRM_MAINNET !== "1") {
    throw new Error(
      `Refusing mainnet deployment. Set DEPLOY_CONFIRM_MAINNET=1 only after verifying the network, deployer, and contract.`,
    );
  }

  const [deployer] = await hre.ethers.getSigners();
  if (!deployer) {
    throw new Error("No deployer account is configured. Set PRIVATE_KEY in your local .env file.");
  }

  const balance = await hre.ethers.provider.getBalance(deployer.address);
  if (balance === 0n) {
    throw new Error(`Deployer ${deployer.address} has no native token for gas on ${hre.network.name}.`);
  }

  console.log(`Network: ${hre.network.name} (chain ${chainId})`);
  console.log(`Deployer: ${deployer.address}`);
  console.log(`Balance: ${hre.ethers.formatEther(balance)} native tokens`);

  const StealthAgent = await hre.ethers.getContractFactory("StealthAgent", deployer);
  const agent = await StealthAgent.deploy();
  const deploymentTx = agent.deploymentTransaction();
  if (!deploymentTx) {
    throw new Error("Could not retrieve the contract deployment transaction.");
  }

  const receipt = await deploymentTx.wait(1);
  const address = await agent.getAddress();
  const deployedCode = await hre.ethers.provider.getCode(address);
  if (deployedCode === "0x") {
    throw new Error(`Deployment transaction mined, but no contract code was found at ${address}.`);
  }

  const deployment = {
    contractName: "StealthAgent",
    network: hre.network.name,
    chainId: chainId.toString(),
    address,
    deployer: deployer.address,
    transactionHash: deploymentTx.hash,
    blockNumber: receipt.blockNumber,
    deployedAt: new Date().toISOString(),
  };

  const deploymentsDir = path.join(__dirname, "..", "deployments");
  fs.mkdirSync(deploymentsDir, { recursive: true });
  const outputPath = path.join(deploymentsDir, `${hre.network.name}.json`);
  fs.writeFileSync(outputPath, `${JSON.stringify(deployment, null, 2)}\n`);

  console.log(`StealthAgent deployed at: ${address}`);
  console.log(`Transaction: ${deploymentTx.hash}`);
  console.log(`Deployment details saved to: ${path.relative(process.cwd(), outputPath)}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
