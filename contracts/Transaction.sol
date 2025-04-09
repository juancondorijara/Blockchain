// SPDX-License-Identifier: MIT
pragma solidity >=0.7.0 <0.9.0;

contract Transaction {

    event TransactionSent(address indexed sender, address indexed recipient, uint256 amount);

    function sendTransaction(address payable _recipient, uint256 _amount) public payable {
        require(_recipient != address(0), "Invalid recipient address");
        require(msg.value >= _amount, "Insufficient funds sent");

        _recipient.transfer(_amount);
        emit TransactionSent(msg.sender, _recipient, _amount);
    }
}
