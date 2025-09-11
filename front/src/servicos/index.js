import { ethers, formatEther } from "ethers";
import { ABI, ENDERECO_CONTRATO, RPC_URL } from "../config/constantes";

export function alertaNaoConectado() {
  alert("É necessário conectar uma carteira digital compativel com a web3!");
}

export function alertaCampoNaoPreenchido(obj) {
  alert(`Erro ao adicionar o produto ${obj} não foi preenchido corretamente!`);
}

export async function buscarItensFornecedores() {
  const provider = new ethers.JsonRpcProvider(RPC_URL);
  const contrato = new ethers.Contract(ENDERECO_CONTRATO, ABI, provider);

  const filter = contrato.filters.EventoPermissaoFornecedor(null, null);
  const resultado = await contrato.queryFilter(filter, 0, "latest");

  const itens = [];
  for (const el of resultado) {
    const conta = el.args.conta;
    const itensFornecedor = await contrato.listarItens(conta);

    itens.push({
      fornecedor: {
        endereco: conta,
        itens: itensFornecedor.map((item) => {
          return {
            id: item.id,
            descricao: item.descricao,
            valor: formatEther(item.valor),
            quantidade: item.quantidade,
          };
        }),
      },
    });
  }

  return itens;
}

export async function buscarPedidos(contrato, comprador) {
  const filter = contrato.filters.ItemComprado(null, comprador, null);
  const resultado = await contrato.queryFilter(filter, 0, "latest");

  const lista = [];
  for (const el of resultado) {
    const pedidoId = el.args.pedidoId;
    const pedido = await contrato.pedidos(pedidoId);

    const item = await contrato.itensPorFornecedor(
      pedido.fornecedor,
      pedido.itemId
    );

    lista.push({
      id: pedido.id,
      itemId: pedido.itemId,
      fornecedor: pedido.fornecedor,
      descricao: item.descricao,
      valor: formatEther(pedido.valorPago),
      situacao: pedido.situacao,
    });
  }

  return lista;
}

export async function buscarPedidosFornecedor(contrato, fornecedor) {
  const filter = contrato.filters.ItemComprado(null, null, fornecedor);
  const resultado = await contrato.queryFilter(filter, 0, "latest");

  const pedidos = [];
  for (const el of resultado) {
    const pedidoId = el.args.pedidoId;
    const itemId = el.args.itemId;
    const pedido = await contrato.pedidos(pedidoId);
    const item = await contrato.itensPorFornecedor(fornecedor, itemId);

    pedidos.push({
      id: pedido.id,
      itemId: pedido.itemId,
      fornecedor: pedido.fornecedor,
      descricao: item.descricao,
      valor: formatEther(pedido.valorPago),
      situacao: pedido.situacao,
    });
  }

  return pedidos;
}
