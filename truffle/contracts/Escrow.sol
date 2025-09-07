// SPDX-License-Identifier: MIT
pragma solidity >=0.8.2 <0.9.0;

import "@openzeppelin/contracts/access/AccessControl.sol";

contract Escrow is AccessControl {
    bytes32 public constant FORNECEDOR_ROLE = keccak256("FORNECEDOR_ROLE");

    enum SituacaoPermissao {
        PENDENTE,
        CONFIRMADA,
        REMOVIDA
    }

    enum SituacaoPedido {
        RECEBIDO,
        ENTREGUE,
        PENDENTE,
        FINALIZADO
    }

    uint256 private proximoItemId = 1;
    uint256 private proximoPedidoId = 1;

    struct Item {
        uint256 id;
        string descricao;
        uint256 valor;
        uint256 quantidade;
    }

    struct Pedido {
        uint256 id;
        uint itemId;
        SituacaoPedido situacao;
        address comprador;
        address fornecedor;
        uint256 valorPago;
    }

    mapping(address => uint256) public cofreFornecedor;
    mapping(address => mapping(uint256 => Item)) public itensPorFornecedor;
    mapping(address => uint256[]) public listaItensFornecedor;
    mapping(address => Pedido[]) public itensComprados;
    mapping(uint256 => Pedido) public pedidos;
    mapping(address => Pedido[]) public pedidosPorComprador;

    event ItemAdicionado(
        address indexed fornecedor,
        uint256 itemId,
        string descricao,
        uint256 valor,
        uint256 quantidade
    );
    event ItemComprado(
        uint256 indexed pedidoId,
        address indexed comprador,
        address indexed fornecedor,
        uint256 itemId,
        uint256 valorPago
    );
    // event PedidoConfirmado(address indexed comprador, address indexed fornecedor, uint256 itemId);
    event SaldoSacado(address indexed fornecedor, uint256 valor);

    event EventoPermissaoFornecedor(
        address indexed conta,
        SituacaoPermissao indexed status
    );
    event PedidoRecebido(
        uint256 indexed pedidoId,
        address indexed comprador,
        address indexed fornecedor
    );
    event PedidoEntregue(
        uint256 indexed pedidoId,
        address indexed comprador,
        address indexed fornecedor
    );
    event PedidoFinalizado(address indexed fornecedor, uint256 valor);

    constructor() {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
    }

    function concederPermissaoFornecedor(
        address _conta
    ) public onlyRole(DEFAULT_ADMIN_ROLE) {
        _grantRole(FORNECEDOR_ROLE, _conta);
    }

    function removerPermissaoFornecedor(
        address _conta
    ) public onlyRole(DEFAULT_ADMIN_ROLE) {
        _revokeRole(FORNECEDOR_ROLE, _conta);
    }

    function isFornecedor() public view returns (bool) {
        return hasRole(FORNECEDOR_ROLE, msg.sender);
    }

    function isAdmin() public view returns (bool) {
        return hasRole(DEFAULT_ADMIN_ROLE, msg.sender);
    }

    function adicionarItem(
        string memory _descricao,
        uint256 _valor,
        uint256 _quantidade
    ) public onlyRole(FORNECEDOR_ROLE) {
        require(_valor > 0, "Valor invalido");
        require(_quantidade > 0, "Quantidade invalida");

        uint256 produtoId = proximoItemId++;

        itensPorFornecedor[msg.sender][produtoId] = Item({
            id: produtoId,
            descricao: _descricao,
            valor: _valor,
            quantidade: _quantidade
        });

        listaItensFornecedor[msg.sender].push(produtoId);

        emit ItemAdicionado(
            msg.sender,
            produtoId,
            _descricao,
            _valor,
            _quantidade
        );
    }

    function listarItens(
        address _fornecedor
    ) public view returns (Item[] memory) {
        uint256[] memory ids = listaItensFornecedor[_fornecedor];
        Item[] memory resultado = new Item[](ids.length);

        for (uint256 i = 0; i < ids.length; i++) {
            resultado[i] = itensPorFornecedor[_fornecedor][ids[i]];
        }

        return resultado;
    }

    function comprarItem(
        address _fornecedor,
        uint256 _itemId
    ) external payable {
        Item storage item = itensPorFornecedor[_fornecedor][_itemId];
        require(item.quantidade > 0, "Item esgotado");
        require(msg.value >= item.valor, "Valor insuficiente");
        require(
            msg.sender != _fornecedor,
            "Fornecedor nao pode comprar seu proprio item"
        );

        item.quantidade -= 1;

        Pedido memory pedido = Pedido({
            itemId: _itemId,
            status: SituacaoPedido.PENDENTE,
            fornecedor: _fornecedor,
            valorPago: msg.value
        });

        itensComprados[msg.sender].push(pedido);

        emit ItemComprado(msg.sender, _fornecedor, _itemId, msg.value);
    }

    function sacarSaldo() external onlyRole(FORNECEDOR_ROLE) {
        uint256 saldo = cofreFornecedor[msg.sender];
        require(saldo > 0, "Nenhum saldo disponivel");

        cofreFornecedor[msg.sender] = 0;
        payable(msg.sender).transfer(saldo);
        emit SaldoSacado(msg.sender, saldo);
    }

    function listarPedidos() external view returns (Pedido[] memory) {
        return itensComprados[msg.sender];
    }

    function confirmarRecebimento(uint256 _pedidoId) external {
        require(
            _pedidoIndex < itensComprados[msg.sender].length,
            "Pedido inexistente"
        );

        Pedido storage pedido = itensComprados[msg.sender][_pedidoIndex];
        require(pedido.status == StatusItem.PENDENTE, "Pedido ja finalizado");

        pedido.status = StatusItem.FINALIZADO;
        cofreFornecedor[pedido.fornecedor] += pedido.valorPago;
        emit PedidoConfirmado(msg.sender, pedido.fornecedor, pedido.itemId);
    }

    function confirmarEntrega(uint256 _pedidoId) external {}
}
