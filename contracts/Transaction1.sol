// SPDX-License-Identifier: MIT
pragma solidity >=0.7.0 <0.9.0;
// @title un simulador de una Transacción
// @author Juan Condori :D
// @notice Este contrato permite almacenar y transferir ETH a otras cuentas incluyendo un mensaje descriptivo.
// @dev Antes de realizar una transferencia, verifica que el contrato disponga de saldo suficiente.

contract Transaction {
    
    address public owner;

    // @notice Se dispara al enviar ETH a otra dirección junto con un mensaje.
    event SendTransaction(address indexed to, uint256 amount, string message);

    // @dev Define al creador del contrato como propietario al momento del despliegue.
    constructor() payable {
        owner = msg.sender;
    }

    // @notice Función especial que permite al contrato aceptar depósitos directamente.
    function receiveFunds() public payable {
    }

    // @notice Devuelve la cantidad total de ETH almacenada en el contrato.
    // @return El saldo disponible expresado en wei.
    function checkBalance() public view returns (uint256) {
        return address(this).balance;
    }

    // @notice Permite al propietario transferir ETH a un destinatario, adjuntando un mensaje.
    // @param destinatario Dirección que recibirá la cantidad especificada.
    // @param monto Cantidad de ETH en wei que se desea enviar.
    // @param mensaje Nota o comentario que acompaña a la remesa.
    function sendETH(address payable _to, uint256 _amount, string memory _message) public {
        require(msg.sender == owner, "No tienes permiso");
        require(address(this).balance >= _amount, "Fondos insuficientes");
        _to.transfer(_amount);
        emit SendTransaction(_to, _amount, _message);
    }

}
