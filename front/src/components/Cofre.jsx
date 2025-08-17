import { Button, Col, Container, Form, Row, Spinner } from "react-bootstrap";
import { useEstadosGlobais } from "../context/useEstadosGlobais";
import { useEffect, useState } from "react";
import { formatEther } from "ethers";

const Cofre = () => {
  const { contrato, enderecoUsuario } = useEstadosGlobais();
  const [saldo, setSaldo] = useState({ saldo: 0n, saldoFormatado: "0.0" });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const setUp = async () => {
      if (contrato === null) return;
      const saldoWei = await contrato.cofreFornecedor(enderecoUsuario);

      setSaldo({ saldo: saldoWei, saldoFormatado: formatEther(saldoWei) });
    };

    const eventoSaldo = () => {
      if (contrato === null) return;
      console.log("evento");
      const filter = contrato.filters.PedidoFinalizado(enderecoUsuario);
      contrato.on(filter, (retorno) => {
        console.log(retorno);
        const valorWei = retorno.args.valor;
        console.log(valorWei);
        const valorTotal = valorWei + saldo.saldo;
        console.log(valorTotal);
        setSaldo((prev) => {
          const novoSaldo = prev.saldo + valorWei;
          return { saldo: novoSaldo, saldoFormatado: formatEther(novoSaldo) };
        });
      });
    };

    setUp();
    eventoSaldo();
    return () => {
      if (contrato) contrato.removeAllListeners("PedidoFinalizado");
    };
  }, [contrato]);

  const sacar = async () => {
    if (!contrato) return;
    setLoading(true);

    try {
      const tx = await contrato.sacarSaldo();
      await tx.wait();
      // Atualiza o saldo depois do saque
      const saldoWei = await contrato.cofreFornecedor(enderecoUsuario);
      setSaldo({ saldo: saldoWei, saldoFormatado: formatEther(saldoWei) });
    } catch (error) {
      console.error("Erro ao sacar:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="mt-4 mb-4">
      <Row className="align-items-center">
        <Col md="6">
          <h5>Saldo em Cofre:</h5>
          <span>{saldo.saldoFormatado} ETH</span>
        </Col>
        <Col md="6" className="text-end">
          <Button
            variant="primary"
            onClick={sacar}
            disabled={loading || saldo.saldo === 0n}
          >
            {loading ? (
              <>
                <Spinner
                  as="span"
                  animation="border"
                  size="sm"
                  role="status"
                  aria-hidden="true"
                />{" "}
                Sacando...
              </>
            ) : (
              "Sacar"
            )}
          </Button>
        </Col>
      </Row>
    </Container>
  );
};

export default Cofre;
