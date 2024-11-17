// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract CoinFlip {
    address public owner;

    // Event to log the game results
    // 0 for rock,1 for paper,2 for scissors
    event GameResult(address indexed player, uint betAmount, uint choice, uint result, uint payout);

    // Constructor to set the contract owner
    constructor() {
        owner = msg.sender;
    }

    // Modifier to restrict access to certain functions
    modifier onlyOwner() {
        require(msg.sender == owner, "Only the owner can call this function");
        _;
    }

    // Function for the contract owner to deposit funds
    function depositFunds() external payable onlyOwner {}

    // Function for the contract owner to withdraw funds
    function withdrawFunds(uint _amount) external onlyOwner {
        require(address(this).balance >= _amount, "Insufficient balance");
        payable(owner).transfer(_amount);
    }

    // Function to play the game
    function flip(uint _bet, uint _choice) external payable {
        require(msg.value == _bet, "Bet amount must match the sent value");
        require(_bet > 0, "Bet amount must be greater than zero");
        require(address(this).balance >= _bet * 2, "Contract balance is insufficient for the payout");

        // Generate random outcome (0 for rock,1 for paper,2 for scissors)
        uint outcome = getResult();

        uint payout = 0;

        // Determine if the player wins and calculate payout
        if (outcome == _choice) {
            payout = _bet * 2;
            payable(msg.sender).transfer(payout);
        }

        // Log the result of the game
        emit GameResult(msg.sender, _bet, _choice, outcome, payout);
    }

    // Internal function to generate a pseudo-random result (for educational purposes only)
    function getResult() internal view returns (uint) {
        // Generate a pseudo-random num using block data
        uint random = uint(keccak256(abi.encodePacked(block.timestamp, block.prevrandao, msg.sender)));
        return random % 3; // 0 for rock,1 for paper,2 for scissors
    }

    // Function to check the contract's balance
    function getContractBalance() external view returns (uint) {
        return address(this).balance;
    }

    // Function to check if the contract is still active (optional)
    function isContractActive() external view returns (bool) {
        return address(this).balance > 0;
    }

    // Fallback function to accept Ether
    receive() external payable {}
}