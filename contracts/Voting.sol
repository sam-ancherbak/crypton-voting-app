//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

contract Voting {
    struct VotingCampaign {
        uint256 startAt;
        address[] candidates;
        address winner;
        mapping(address => bool) voters;
        mapping(address => uint256) candidateVotes;
        State state;
        uint256 totalSum;
    }

    VotingCampaign[] public votingCampaigns;

    enum State {
        Voting,
        Ended
    }

    address public owner;
    uint256 public contractBalance;

    modifier onlyOwner() {
        require(msg.sender == owner, "For owner only");
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    function create(address[] memory _candidates) public onlyOwner {
        VotingCampaign storage newCampaign = votingCampaigns.push();
        newCampaign.startAt = block.timestamp;
        newCampaign.state = State.Voting;
        newCampaign.candidates = _candidates;
    }

    function vote(uint256 _campaingIndex, address _candidate) public payable {
        // require(msg.value == 0.01 ether, "Incorrect sum");
        VotingCampaign storage voting = votingCampaigns[_campaingIndex];
        require(block.timestamp < voting.startAt + 3 days, "Already Ends");
        require(!voting.voters[msg.sender], "Already voted");
        voting.candidateVotes[_candidate] += 1;
        voting.totalSum += msg.value;
        voting.voters[msg.sender] = true;
    }

    function close(uint256 _campaingIndex) public {
        VotingCampaign storage voting = votingCampaigns[_campaingIndex];
        require(block.timestamp > voting.startAt + 3 days, "Not end yet");
        voting.state = State.Ended;

        address winner;
        uint256 maxVotes = 0;
        for (uint256 i = 0; i < voting.candidates.length; i++) {
            if (voting.candidateVotes[voting.candidates[i]] > maxVotes) {
                winner = voting.candidates[i];
                maxVotes = voting.candidateVotes[voting.candidates[i]];
            }
        }
        voting.winner = winner;
        uint256 comission = ((voting.totalSum * 10) / 100);
        contractBalance += comission;
        payable(winner).transfer(voting.totalSum - comission);
    }

    function withdrawComisssion(uint256 _amount) public onlyOwner {
        require(_amount <= contractBalance, "insufficient funds");
        contractBalance -= _amount;
        payable(owner).transfer(_amount);
    }

    function getVotingCandidates(uint256 _campaignIndex)
        public
        view
        returns (address[] memory)
    {
        VotingCampaign storage campaign = votingCampaigns[_campaignIndex];
        return (campaign.candidates);
    }

    function getVotingInfo(uint256 _campaignIndex) public
        view
        returns (uint256, address, uint256)
    {
        VotingCampaign storage campaign = votingCampaigns[_campaignIndex];
        return (campaign.startAt, campaign.winner, campaign.totalSum);
    }
}
