// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

/**
 * @title BlockVote
 * @dev Secure and verifiable voting mechanism allowing 1 vote per address.
 */
contract BlockVote {
    // --- State Variables ---

    address public admin;
    bool public votingOpen;
    
    // Election details
    string public electionName;
    
    struct Candidate {
        uint id;
        string name;
        uint voteCount;
    }

    // Mapping of Candidate ID to Candidate structure
    mapping(uint => Candidate) public candidates;
    uint public candidatesCount;

    // Record of voters who have voted to prevent double voting
    mapping(address => bool) public voters;

    // --- Events ---
    event VotedEvent(uint indexed candidateId, address indexed voter);
    event ElectionStarted(string electionName);
    event ElectionClosed();
    event CandidateAdded(uint candidateId, string candidateName);

    // --- Modifiers ---
    modifier onlyAdmin() {
        require(msg.sender == admin, "BlockVote: Caller is not the admin");
        _;
    }

    modifier onlyWhileOpen() {
        require(votingOpen == true, "BlockVote: Voting is currently closed");
        _;
    }

    // --- Constructor ---
    constructor(string memory _electionName) {
        admin = msg.sender;
        electionName = _electionName;
        votingOpen = false;
    }

    // --- Functions ---
    
    /**
     * @dev Add a new candidate (only admin)
     */
    function addCandidate(string memory _name) public onlyAdmin {
        require(!votingOpen, "BlockVote: Cannot add candidate while voting is open");
        candidatesCount++;
        candidates[candidatesCount] = Candidate(candidatesCount, _name, 0);
        emit CandidateAdded(candidatesCount, _name);
    }

    /**
     * @dev Start the election
     */
    function startElection() public onlyAdmin {
        require(candidatesCount > 0, "BlockVote: Cannot start election with 0 candidates");
        votingOpen = true;
        emit ElectionStarted(electionName);
    }

    /**
     * @dev Stop the election
     */
    function closeElection() public onlyAdmin {
        require(votingOpen, "BlockVote: Election is not open");
        votingOpen = false;
        emit ElectionClosed();
    }

    /**
     * @dev Cast a vote for a candidate
     * @param _candidateId the ID of the candidate
     */
    function vote(uint _candidateId) public onlyWhileOpen {
        // Require that they haven't voted before
        require(!voters[msg.sender], "BlockVote: You have already voted");

        // Require a valid candidate
        require(_candidateId > 0 && _candidateId <= candidatesCount, "BlockVote: Invalid candidate ID");

        // Record that voter has voted
        voters[msg.sender] = true;

        // Update candidate vote count
        // Using straightforward addition as Solidity ^0.8 checks for overflow/underflow automatically
        candidates[_candidateId].voteCount++;

        // Trigger voted event
        emit VotedEvent(_candidateId, msg.sender);
    }

    /**
     * @dev Retrieve candidate details
     */
    function getCandidate(uint _candidateId) public view returns (uint id, string memory name, uint voteCount) {
        require(_candidateId > 0 && _candidateId <= candidatesCount, "BlockVote: Invalid candidate ID");
        Candidate memory c = candidates[_candidateId];
        return (c.id, c.name, c.voteCount);
    }
}
