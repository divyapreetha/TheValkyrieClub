/** @type import('hardhat/config').HardhatUserConfig */
require("dotenv").config({ path: ".env" });
// require("@nomicfoundation/hardhat-toolbox");
// require('@openzeppelin/hardhat-upgrades');
// require("@nomicfoundation/hardhat-chai-matchers");
require("@nomiclabs/hardhat-ethers");
require("@nomiclabs/hardhat-etherscan");


const { METAMASK_RINKEBY_PRIVATE_KEY, NEXT_PUBLIC_INFURA_URL, ETHERSCAN_API_KEY } = process.env;

task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();
  for (const account of accounts) {
    console.log(account.address);
  }
});

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.16",
  settings: {
    optimizer: {
      enabled: true,
      runs: 200,
    },
  },
  defaultNetwork : "rinkeby",
  networks: {
    hardhat: {},
    rinkeby: {
      url: NEXT_PUBLIC_INFURA_URL,
      accounts: [`0x${METAMASK_RINKEBY_PRIVATE_KEY}`],
    }
  },
  etherscan: {
    apiKey: ETHERSCAN_API_KEY
  }
};
