// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract EtherWallet{
    
    address payable public owner;
    
    constructor() {
        owner = payable(msg.sender);
    }
    
    modifier onlyOwner{
        require(msg.sender == owner, 'You are NOT the owner!');
        _;
    }
    
    // This returns the CONTRACTS's ether balance, NOT this USER's ether balance!
    function getBalance() public view onlyOwner returns (uint) {
        return address(this).balance;
    }
    
    // no need to type anything! 
    function deposit() public payable onlyOwner {
    }
    
    // Remember to type in "10**18" to withdraw 1 ether.
    // Transfer ether FROM smart contract TO owner.
    function withdraw(uint _amount) public onlyOwner {
        require(_amount <= address(this).balance, 'The contract DOESNT have enough ether!');
        payable(msg.sender).transfer(_amount);
    }
    
    // Remember to type in "10**18" to transfer 1 ether.
    // Transfer ether FROM smart contract TO a receiver.
    function transfer(address payable _receiver, uint _amount) public onlyOwner {
        require(_amount <= address(this).balance, 'The contract DOESNT have enough ether!');
        _receiver.transfer(_amount);
    }
    
}


//   10**18 = 1000000000000000000

// Wrong example:
// This will transfer ether FROM owner, NOT from smart contract, to _receiver.
// When using 'msg.sender', it means ether will be drawn from msg.sender, not the smart contract.
    // function transfer(address payable _receiver) public payable onlyOwner {
    //     _receiver.transfer(msg.value);
    // }