import React, { useState } from "react";
import { Container, Form, Button, Row, Col } from "react-bootstrap";
import { useEstadosGlobais } from "../context/useEstadosGlobais";
import { alertaNaoConectado } from "../servicos";

export default function PermissoesFornecedor() {
  const { contrato } = useEstadosGlobais();
  const [enderecoCarteira, setEnderecoCarteira] = useState("");

  const adicionar = async () => {
    try {
      if (contrato != null) {
        await contrato.concederPermissaoFornecedor(enderecoCarteira);
        return;
      }
      alertaNaoConectado();
    } catch (error) {
      // console.log(error);
      alert("Erro ao conceder permissao de fornecedor!");
    }
  };

  const remover = async () => {
    try {
      if (contrato != null) {
        await contrato.removerPermissaoFornecedor(enderecoCarteira);
        return;
      }
      alertaNaoConectado();
    } catch (error) {
      // console.log(error);
      alert("Erro ao remover permissao de fornecedor!");
    }
  };

  return (
    <Container className="mt-4">
      <Form>
        <Form.Group controlId="enderecoCarteira">
          <Form.Label>Permissões do Fornecedor</Form.Label>
          <Form.Control
            type="text"
            placeholder="Endereço da carteira"
            value={enderecoCarteira}
            onChange={(e) => setEnderecoCarteira(e.target.value)}
          />
        </Form.Group>

        <Row className="mt-3">
          <Col>
            <Button variant="primary" onClick={adicionar} className="me-2">
              Adicionar
            </Button>
            <Button variant="danger" onClick={remover}>
              Remover
            </Button>
          </Col>
        </Row>
      </Form>
    </Container>
  );
}
