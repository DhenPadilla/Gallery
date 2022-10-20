require("@nomiclabs/hardhat-waffle");

// Initialize `dotenv` with the `.config()` function
require("dotenv").config({ path: ".env" });

// Environment variables should now be available
// under `process.env`
const ALFAJORES_PRIVATE_KEY = process.env.ALFAJORES_PRIVATE_KEY;
const ALFAJORES_RPC_URL = process.env.ALFAJORES_RPC_URL;

const MAINNET_PRIVATE_KEY = process.env.CELO_MAIN_NET_PRIVATE_KEY;
const MAINNET_RPC_URL = process.env.CELO_MAIN_NET_RPC_URL;

// Show an error if environment variables are missing
if (!MAINNET_PRIVATE_KEY) {
  console.error("Missing PRIVATE_KEY environment variable");
}

if (!MAINNET_RPC_URL) {
  console.error("Missing RPC_URL environment variable");
}

// Add the alfajores network to the configuration
module.exports = {
  solidity: "0.8.4",
  networks: {
    alfajores: {
      url: ALFAJORES_RPC_URL,
      accounts: [ALFAJORES_PRIVATE_KEY],
    },
    mainnet: {
      url: MAINNET_RPC_URL,
      accounts: [MAINNET_PRIVATE_KEY],
    },
  },
};