require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

const privateKey = process.env.PRIVATE_KEY;
const accounts = privateKey ? [privateKey] : [];

module.exports = {
  solidity: "0.8.20",
  networks: {
    base: {
      url: process.env.BASE_RPC || "https://mainnet.base.org",
      chainId: 8453,
      accounts,
    },
    baseSepolia: {
      url: process.env.BASE_SEPOLIA_RPC || "https://sepolia.base.org",
      chainId: 84532,
      accounts,
    },
    goat: {
      url: process.env.GOAT_RPC || "https://rpc.goat.network",
      chainId: 2345,
      accounts,
    },
    goatTestnet: {
      url: process.env.GOAT_TESTNET_RPC || "https://rpc.testnet3.goat.network",
      chainId: 48816,
      accounts,
    },
  },
};
