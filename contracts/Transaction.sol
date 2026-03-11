// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract Transaction {

    event TransactionSent(address from, address to, uint256 amount);

    function sendTransaction(address payable _recipient) public payable {

        require(msg.value > 0, "Debe enviar ETH");

        (bool success, ) = _recipient.call{value: msg.value}("");
        require(success, "Fallo la transaccion");

        emit TransactionSent(msg.sender, _recipient, msg.value);
    }
}


