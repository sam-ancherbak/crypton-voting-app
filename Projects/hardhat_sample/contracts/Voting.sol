//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

contract Voting {
    struct VotingCampaign {
        uint256 startAt;
        mapping(address => bool) candidates;
        mapping(address => bool) voters;
        mapping(address => uint256) candidateVotes;
        State state;
    }

    VotingCampaign[] public votingCampaigns;

    enum State {
        Voting,
        Ended
    }

    address public owner;

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
        for (uint256 i = 0; i < _candidates.length; i++) {
            newCampaign.candidates[_candidates[i]] = true;
        }
    }

    function vote(uint256 _campaingIndex, address _candidate) public payable {
        require(msg.value == 0.01 ether, "Incorrect sum");
        VotingCampaign storage voting = votingCampaigns[_campaingIndex];
        require(voting.state == State.Voting, "Not Started!");
        require(block.timestamp < voting.startAt + 3 days, "Already Ends");
        require(!voting.voters[msg.sender], "Already voted");
        require(!voting.candidates[_candidate], "Wrong Candidate");
        voting.candidateVotes[_candidate] += 1;
        // добавить трату средств
    }

    function end() {
        
    } 
}
