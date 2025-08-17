import React, { useState } from "react";
import { Container, Form, Button, Row, Col, InputGroup } from "react-bootstrap";
import { useEstadosGlobais } from "../context/useEstadosGlobais";
import { alertaCampoNaoPreenchido, alertaNaoConectado } from "../servicos";
import { parseEther } from "ethers";

export default function AdicionarProduto() {
  const [descricao, setDescricao] = useState("");
  const [valor, setValor] = useState("");
  const [quantidade, setQuantidade] = useState("");
  const { contrato } = useEstadosGlobais();

  const adicionarProduto = async () => {
    if (contrato === null) {
      alertaNaoConectado();
      return;
    }

    if (descricao === "") {
      alertaCampoNaoPreenchido("descricao");
      return;
    }

    if (valor === "") {
      alertaCampoNaoPreenchido("valor");
      return;
    }

    if (quantidade === "") {
      alertaCampoNaoPreenchido("quantidade");
      return;
    }

    try {
      const valorWEI = parseEther(valor);

      const tx = await contrato.adicionarItem(descricao, valorWEI, quantidade);

      // console.log("Transação enviada. Hash:", tx.hash);

      await tx.wait();
      // console.log("Transação confirmada:", receipt);
    } catch (error) {
      // console.log(error);
      alert("Erro ao adicionar um produto!");
    }
  };

  return (
    <Container className="mt-4">
      <Form>
        <Form.Group controlId="descricao" className="mb-3">
          <Form.Label>Descrição do Produto</Form.Label>
          <Form.Control
            type="text"
            placeholder="Descrição do produto"
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
          />
        </Form.Group>

        <Row className="mb-3">
          <Col md={6}>
            <Form.Group controlId="valor">
              <Form.Label>Valor</Form.Label>
              <InputGroup>
                <Form.Control
                  type="number"
                  placeholder="Valor do produto"
                  value={valor}
                  onChange={(e) => setValor(e.target.value)}
                  step="0.01"
                  min="0"
                />
                <InputGroup.Text>ETH</InputGroup.Text>
              </InputGroup>
            </Form.Group>
          </Col>

          <Col md={6}>
            <Form.Group controlId="quantidade">
              <Form.Label>Quantidade</Form.Label>
              <Form.Control
                type="number"
                placeholder="Quantidade"
                value={quantidade}
                onChange={(e) => {
                  const valorLimpo = e.target.value.replace(/\D/g, "");
                  setQuantidade(valorLimpo);
                }}
                min="0"
                step="1"
              />
            </Form.Group>
          </Col>
        </Row>

        <Button variant="primary" onClick={adicionarProduto}>
          Adicionar Produto
        </Button>
      </Form>
    </Container>
  );
}
