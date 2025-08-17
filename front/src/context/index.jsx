import { ethers } from "ethers";
import { createContext, useState } from "react";
import { ABI, ENDERECO_CONTRATO, RPC_URL } from "../config/constantes";

const ContextoEstados = createContext(null);

function ProvedorEstados({ children }) {
  const [enderecoUsuario, setEnderecoUsuario] = useState(null);
  const [contrato, setContrato] = useState(null);
  const [temPermissaoAdmin, setTemPermissaoAdmin] = useState(false);
  const [temPermissaoFornecedor, setTemPermissaoFornecedor] = useState(false);

  async function conectar() {
    try {
      if (window.ethereum == null) {
        alert(
          "Carteira não instalada, utilizando somente leitura no contrato!"
        );
        return;
      }

      const provider = new ethers.BrowserProvider(window.ethereum);
      await provider.send("eth_requestAccounts", []);
      const signer = await provider.getSigner();
      const _contrato = new ethers.Contract(ENDERECO_CONTRATO, ABI, signer);
      setContrato(_contrato);
      setEnderecoUsuario(signer.address);
      // const a = await _contrato.FORNECEDOR_ROLE();
      // console.log(a);
      // const b = await _contrato.hasRole(a, signer.address);
      // console.log(b);
      setTemPermissaoAdmin(await _contrato.isAdmin());
      setTemPermissaoFornecedor(await _contrato.isFornecedor());
    } catch (error) {
      console.error("Erro ao conectar ao Ganache:", error);
      alert(
        "Erro ao conectar ao Ganache. Verifique se o Ganache está rodando."
      );
    }
  }

  return (
    <ContextoEstados.Provider
      value={{
        enderecoUsuario,
        contrato,
        conectar,
        temPermissaoAdmin,
        temPermissaoFornecedor,
      }}
    >
      {children}
    </ContextoEstados.Provider>
  );
}

export { ContextoEstados, ProvedorEstados };
