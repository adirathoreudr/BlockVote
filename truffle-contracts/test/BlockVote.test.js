const BlockVote = artifacts.require("BlockVote");

contract("BlockVote", (accounts) => {
  let votingInstance;
  const admin = accounts[0];
  const voter1 = accounts[1];
  const voter2 = accounts[2];

  before(async () => {
    votingInstance = await BlockVote.deployed();
  });

  it("should initialize with the correct election name and admin", async () => {
    const electionName = await votingInstance.electionName();
    assert.equal(electionName, "Initial Test Election", "Election name is incorrect");

    const contractAdmin = await votingInstance.admin();
    assert.equal(contractAdmin, admin, "Admin address is incorrect");
  });

  it("should allow admin to add candidates when closed", async () => {
    await votingInstance.addCandidate("Alice", { from: admin });
    const count = await votingInstance.candidatesCount();
    assert.equal(count.toNumber(), 1, "Candidate count should be 1");

    const candidate = await votingInstance.getCandidate(1);
    assert.equal(candidate.name, "Alice", "Candidate name is incorrect");
  });

  it("should prevent non-admins from adding candidates", async () => {
    try {
      await votingInstance.addCandidate("Bob", { from: voter1 });
      assert.fail("Non-admin was able to add a candidate");
    } catch (e) {
      assert(e.message.indexOf("revert") >= 0, "Error should contain revert");
    }
  });

  it("should allow admin to start election", async () => {
    await votingInstance.startElection({ from: admin });
    const isOpen = await votingInstance.votingOpen();
    assert.equal(isOpen, true, "Voting should be open");
  });

  it("should allow voting and accurately increment candidate vote counts", async () => {
    await votingInstance.vote(1, { from: voter1 });
    const candidate = await votingInstance.getCandidate(1);
    assert.equal(candidate.voteCount.toNumber(), 1, "Candidate should have 1 vote");
  });

  it("should prevent double voting", async () => {
    try {
      await votingInstance.vote(1, { from: voter1 });
      assert.fail("Voter was allowed to vote twice");
    } catch (e) {
      assert(e.message.indexOf("revert") >= 0, "Error should be revert indicating already voted");
    }
  });
});
