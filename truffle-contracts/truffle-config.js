module.exports = {
  networks: {
    development: {
      host: "127.0.0.1",
      port: 8545, // Match standard Ganache/Hardhat node port
      network_id: "*", // Match any network id
    },
  },

  // Configure your compilers
  compilers: {
    solc: {
      version: "0.8.19", // Fetch exact version from solc-bin
      settings: {
        optimizer: {
          enabled: true,
          runs: 200
        },
      }
    }
  }
};
