import { Table, Button, Container, FormLabel } from "react-bootstrap";
import { useEstadosGlobais } from "../context/useEstadosGlobais";
import { useEffect } from "react";
import { useState } from "react";
import {
  SituacaoPedidoLabel,
  SituacaoPedido,
  SituacaoCores,
} from "../enum/situacaoPedido";
import { alertaNaoConectado, buscarPedidosFornecedor } from "../servicos";

const ListaPedidosFornecedor = () => {
  const { contrato, enderecoUsuario } = useEstadosGlobais();
  const [listaPedidos, setListaPedidos] = useState([]);

  useEffect(() => {
    const listarPedidos = async () => {
      if (contrato === null) return;

      const lista = await buscarPedidosFornecedor(contrato, enderecoUsuario);
      // console.log(lista);
      setListaPedidos(lista);
    };
    listarPedidos();
  }, [contrato]);

  const confirmarEntrega = async (pedidoId) => {
    if (contrato === null) {
      alertaNaoConectado();
      return;
    }

    try {
      await contrato.confirmarEntrega(pedidoId);
    } catch (error) {
      // console.log(error);
      // console.log(Object.keys(error));
      // console.log(error?.info?.error?.data?.data?.reason);
      alert(error?.info?.error?.data?.data?.reason ?? "");
    }
  };

  return (
    <Container className="mt-4">
      <FormLabel>Itens comprados</FormLabel>
      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>ID Item</th>
            <th>Endereço Fornecedor</th>
            <th>Descrição</th>
            <th>Valor Pago(ETH)</th>
            <th>Situação do item</th>
            <th>Ação</th>
          </tr>
        </thead>
        <tbody>
          {listaPedidos.length === 0 && (
            <tr>
              <td colSpan={7} className="text-center">
                Nenhum item disponível
              </td>
            </tr>
          )}

          {listaPedidos.map((pedido, idx) => {
            const cores = SituacaoCores[pedido.situacao] || {};

            return (
              <tr
                key={`${pedido.fornecedor}-${pedido.itemId}-${idx}`}
                style={{ backgroundColor: cores.bg }}
              >
                <td>{pedido.itemId}</td>
                <td>{pedido.fornecedor}</td>
                <td>{pedido.descricao}</td>
                <td>{pedido.valor}</td>
                <td style={{ backgroundColor: cores.bg }}>
                  {SituacaoPedidoLabel[pedido.situacao]}
                </td>
                <td>
                  <Button
                    variant="success"
                    onClick={() => confirmarEntrega(pedido.id)}
                    disabled={
                      pedido.situacao === SituacaoPedido.ENTREGUE ||
                      pedido.situacao === SituacaoPedido.FINALIZADO
                    }
                  >
                    Confirmar Entrega
                  </Button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </Table>
    </Container>
  );
};

export default ListaPedidosFornecedor;
