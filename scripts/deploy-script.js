const hre = require('hardhat')
const ethers = hre.ethers

async function main() {
    const [owner] = await ethers.getSigners()
    const VotingContract = await ethers.getContractFactory("Voting")
    const voting = await VotingContract.connect(owner).deploy();
    await voting.deployed()
    console.log("Voting contract address: ", voting.address)
    console.log("Owner address: ", owner.address);
}

main()
    .then(() => process.exit(0))
    .then().catch(error => {
        console.error(error);
        process.exit(1);
    });