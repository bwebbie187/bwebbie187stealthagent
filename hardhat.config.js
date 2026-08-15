require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

module.exports = {
  solidity: "0.8.20",
  networks: {
    goat: {
      url: process.env.GOAT_RPC,
      chainId: 48899,
      accounts: [process.env.PRIVATE_KEY],
    },
  },
};
