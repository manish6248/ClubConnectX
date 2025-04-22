require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

module.exports = {
  solidity: "0.8.28",
  networks: {
    ganache: {
      url: "http://127.0.0.1:7545",  
      accounts: ["0x7182c57fbc9fdf90fb5b53453ca6528f85ad20064f9d211063b8fd58a606fdc7"],  // Use a private key from Ganache
    },
  },
};
