export const SituacaoPedido = {
  RECEBIDO: 0n,
  ENTREGUE: 1n,
  PENDENTE: 2n,
  FINALIZADO: 3n,
};

export const SituacaoPedidoLabel = {
  [SituacaoPedido.RECEBIDO]: "Recebido",
  [SituacaoPedido.ENTREGUE]: "Entregue",
  [SituacaoPedido.PENDENTE]: "Pendente",
  [SituacaoPedido.FINALIZADO]: "Finalizado",
};

export const SituacaoCores = {
  [SituacaoPedido.RECEBIDO]: { bg: "#d0f0c0", btn: "success" }, // verde claro
  [SituacaoPedido.ENTREGUE]: { bg: "#add8e6", btn: "info" }, // azul claro
  [SituacaoPedido.PENDENTE]: { bg: "#fff3b0", btn: "warning" }, // amarelo
  [SituacaoPedido.FINALIZADO]: { bg: "#d3d3d3", btn: "secondary" }, // cinza
};
