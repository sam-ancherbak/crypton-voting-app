const { task } = require("hardhat/config");

task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

task("votingCreate", "Create new voting")
  .addParam("address", "Contract address")
  .addParam("candidates", "Voting candidates. Write list of addresses with comma '0x3C.., 0x4B...'")
  .setAction(async (taskArgs, hre) => {
    const VotingContract = await hre.ethers.getContractFactory("Voting");
    const contract = await VotingContract.attach(taskArgs.address);
    const candidates = taskArgs.candidates
    .split(",")
    .map((string) => ethers.utils.getAddress(string.trim()));
    [owner] = await hre.ethers.getSigners();
    await contract.connect(owner).create(candidates);
    console.log("Voting created for contract", contract.address);
  })

task("votingVote", "Vote for candidate")
  .addParam("address", "Contract address")
  .addParam("index", "Campaign Index")
  .addParam("candidate", "Candidate address.")
  .setAction(async (taskArgs) => {
    const VotingContract = await ethers.getContractFactory("Voting");
    const contract = await VotingContract.attach(taskArgs.address);
    await contract.vote(taskArgs.address, taskArgs.candidate);
    console.log("You successfully vote for candidate", taskArgs.candidate);
  })

  task("votingClose", "Close voting")
  .addParam("address", "Contract address")
  .addParam("index", "Campaign Index")
  .setAction(async (taskArgs) => {
    const VotingContract = await ethers.getContractFactory("Voting");
    const contract = await VotingContract.attach(taskArgs.address);
    [owner] = await hre.ethers.getSigners();
    await contract.connect(owner).close(taskArgs.index);
    console.log("You successfully closed the voting");
  })

  task("votingComission", "Withdraw Comission")
  .addParam("address", "Contract address")
  .addParam("amount", "Withdraw amount")
  .setAction(async (taskArgs) => {
    const VotingContract = await ethers.getContractFactory("Voting");
    const contract = await VotingContract.attach(taskArgs.address);
    [owner] = await hre.ethers.getSigners();
    await contract.connect(owner).withdrawComisssion(taskArgs.amount);
    console.log("You successfully withdrawed comission");
  })