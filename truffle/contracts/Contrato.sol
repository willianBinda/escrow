// SPDX-License-Identifier: MIT
pragma solidity >=0.8.2 <0.9.0;

contract Contrato{
    event Teste(address indexed fornecedor, string descricao);
    function teste(string memory _descricao) external {
        emit Teste(msg.sender, _descricao);
    }

    
}