import type { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox-viem";

const config: HardhatUserConfig = {
  solidity: "0.8.24",
  networks: {
    hardhat: {
      gas: 30000000,          // Default gas limit for Hardhat Network
      gasPrice: 50000000000,  // Default gas price in wei (20 gwei)
    },
  },
};

export default config;
