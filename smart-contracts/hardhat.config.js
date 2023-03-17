require("@nomicfoundation/hardhat-toolbox");
require("@nomiclabs/hardhat-ethers");
require("@nomiclabs/hardhat-etherscan");
require("dotenv").config();

task("accounts", "Prints the list of accounts", async () => {
  const accounts = await ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

module.exports = {
  solidity: {
    version: "0.8.10",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  networks: {
    mumbai: {
      url: process.env.ALCHEMY_MUMBAI,
      accounts: [process.env.PRIVATE_KEY],
    },
    mainnet: {
      url: process.env.ALCHEMY_MAINNET,
      accounts: [process.env.PRIVATE_KEY_MAIN],
    },
  },
  etherscan: {
    apiKey: process.env.ETHERSCAN,
  },
};
