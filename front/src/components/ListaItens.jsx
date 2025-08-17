import { Table, Button, Container } from "react-bootstrap";
import { useEstadosGlobais } from "../context/useEstadosGlobais";
import { useEffect } from "react";
import { parseEther } from "ethers";
import { useState } from "react";
import { alertaNaoConectado, buscarItensFornecedores } from "../servicos";

const ListaItens = () => {
  const { contrato } = useEstadosGlobais();
  const [listaItens, setListaItens] = useState([]);

  useEffect(() => {
    const listarItens = async () => {
      const itens = await buscarItensFornecedores();
      // console.log(itens);
      setListaItens(itens);
    };

    listarItens();
  }, []);

  const comprar = async (fornecedor, itemId, valor) => {
    if (contrato === null) {
      alertaNaoConectado();
      return;
    }

    try {
      await contrato.comprarItem(fornecedor, itemId, {
        value: parseEther(valor),
      });
    } catch (error) {
      // console.log(error);
      // console.log(Object.keys(error));
      // console.log(error?.info?.error?.data?.data?.reason);
      alert(error?.info?.error?.data?.data?.reason ?? "");
    }
  };

  return (
    <Container className="mt-4">
      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>Endereço Fornecedor</th>
            <th>ID Item</th>
            <th>Descrição</th>
            <th>Valor (ETH)</th>
            <th>Quantidade</th>
            <th>Ação</th>
          </tr>
        </thead>
        <tbody>
          {listaItens.length === 0 && (
            <tr>
              <td colSpan={6} className="text-center">
                Nenhum item disponível
              </td>
            </tr>
          )}

          {listaItens.map(({ fornecedor }) => {
            const totalItens = fornecedor.itens.length;

            return fornecedor.itens.map((it, idx) => (
              <tr key={`${fornecedor.endereco}-${it.id}-${idx}`}>
                {idx === 0 && (
                  <td rowSpan={totalItens}>{fornecedor.endereco}</td>
                )}
                <td>{it.id}</td>
                <td>{it.descricao}</td>
                <td>{it.valor}</td>
                <td>{it.quantidade}</td>
                <td>
                  <Button
                    variant="primary"
                    onClick={() =>
                      comprar(fornecedor.endereco, it.id, it.valor)
                    }
                  >
                    Comprar
                  </Button>
                </td>
              </tr>
            ));
          })}
        </tbody>
      </Table>
    </Container>
  );
};

export default ListaItens;
