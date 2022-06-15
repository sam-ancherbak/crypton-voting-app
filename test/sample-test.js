const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Voting", function () {
  let VotingContract;
  let votingInstance;
  let owner;
  let candidate1;
  let candidate2;
  let user1;
  let user2;

  beforeEach(async () => {
    VotingContract = await ethers.getContractFactory("Voting");
    votingInstance = await VotingContract.deploy();
    [owner, candidate1, candidate2, user1, user2] = await ethers.getSigners();
  });

  describe("Voting", function () {
    it("Has valid owner", async function () {
      const currentOwner = await votingInstance.owner()
      expect(currentOwner).to.eq(owner.address)
    })

    it("Correcty creates voting", async function () {
      const arguments = [candidate1.address, candidate2.address];
      await votingInstance.create(arguments);
      const votingInfo = await votingInstance.getVotingCandidates(0);
      expect(votingInfo).to.deep.eq(arguments)
    })

    it("Correcty vote and choose winner", async function () {
      const arguments = [candidate1.address, candidate2.address];
      const votingIndex = 0;
      await votingInstance.create(arguments);

      await votingInstance.connect(user1).vote(votingIndex, candidate1.address);
      await votingInstance.connect(user2).vote(votingIndex, candidate1.address);
      await votingInstance.connect(owner).vote(votingIndex, candidate2.address);

      await network.provider.send("evm_increaseTime", [300000]);
      await votingInstance.close(votingIndex);
      const votingInfo = await votingInstance.getVotingInfo(0);
      const winner = votingInfo[1];
      expect(winner).to.eq(candidate1.address)
    })

    it("Check if user already voted", async function () {
      const votingIndex = 0;
      await votingInstance.create([candidate1.address, candidate2.address]);

      await votingInstance.connect(user1);
      await votingInstance.vote(votingIndex, candidate1.address);
      await expect(
        votingInstance.connect(user1).vote(votingIndex, candidate1.address)
      ).to.be.revertedWith("Already voted");
    });

    it("Check if already ends", async function () {
      const votingIndex = 0;
      await votingInstance.create([candidate1.address, candidate2.address]);
      await network.provider.send("evm_increaseTime", [300000]);
      await expect(
        votingInstance.connect(user1).vote(votingIndex, candidate1.address)
      ).to.be.revertedWith("Already Ends");
    });
  }
  )
});