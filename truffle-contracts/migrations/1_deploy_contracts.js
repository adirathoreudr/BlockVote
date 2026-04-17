const BlockVote = artifacts.require("BlockVote");

module.exports = function (deployer) {
  // Pass the election name as an argument to the constructor
  deployer.deploy(BlockVote, "Initial Test Election");
};
