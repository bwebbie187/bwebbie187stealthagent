// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract StealthAgent {
    address public owner;
    uint256 public updateFee = 0.0001 ether;

    struct Signal {
        string data;
        uint256 timestamp;
        address sender;
    }

    mapping(address => Signal) public signals;

    event SignalUpdated(address indexed user, string data, uint256 timestamp);
    event FeeUpdated(uint256 newFee);
    event Withdraw(address indexed owner, uint256 amount);

    constructor() {
        owner = msg.sender;
    }

    function updateSignal(string calldata data) external payable {
        require(msg.value >= updateFee, "Insufficient fee");

        signals[msg.sender] = Signal({
            data: data,
            timestamp: block.timestamp,
            sender: msg.sender
        });

        emit SignalUpdated(msg.sender, data, block.timestamp);
    }

    function setFee(uint256 newFee) external {
        require(msg.sender == owner, "Not owner");
        updateFee = newFee;
        emit FeeUpdated(newFee);
    }

    function withdraw() external {
        require(msg.sender == owner, "Not owner");
        uint256 amount = address(this).balance;
        payable(owner).transfer(amount);
        emit Withdraw(owner, amount);
    }
}
