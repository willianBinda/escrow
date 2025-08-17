"use client";

import { Navbar, Container, Nav, Button } from "react-bootstrap";
import { useEstadosGlobais } from "../context/useEstadosGlobais";
const RPC = import.meta.env.VITE_RPC ?? "";
const CONTRACT_ADDRESS = import.meta.env.VITE_CONTRACT_ADDRESS ?? "";

function NavBar() {
  const { enderecoUsuario, conectar } = useEstadosGlobais();

  return (
    <Navbar bg="dark" variant="dark" expand="lg" className="px-3">
      <Container>
        <Navbar.Brand href="/">Home</Navbar.Brand>
        <Nav className="ms-auto">
          {enderecoUsuario ? (
            <Navbar.Text>
              Conectado: {enderecoUsuario.slice(0, 6)}...
              {enderecoUsuario.slice(-4)}
            </Navbar.Text>
          ) : (
            <Button variant="primary" onClick={conectar}>
              Conectar
            </Button>
          )}
        </Nav>
      </Container>
    </Navbar>
  );
}

export default NavBar;
