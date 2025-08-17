import "./App.css";
import AdicionarProduto from "./components/AdicionarProduto";
import Cofre from "./components/Cofre";
import ListaItens from "./components/ListaItens";
import ListaPedidos from "./components/ListarPedidos";
import ListaPedidosFornecedor from "./components/ListarPedidosFornecedor";
import PermissoesFornecedor from "./components/Permissoes";
import { useEstadosGlobais } from "./context/useEstadosGlobais";
function App() {
  const { temPermissaoAdmin, temPermissaoFornecedor, enderecoUsuario } =
    useEstadosGlobais();

  return (
    <>
      <ListaItens />
      {temPermissaoAdmin ? <PermissoesFornecedor /> : null}
      {temPermissaoFornecedor ? <AdicionarProduto /> : null}
      {enderecoUsuario && !temPermissaoFornecedor ? <ListaPedidos /> : null}
      {temPermissaoFornecedor ? <ListaPedidosFornecedor /> : null}
      {temPermissaoFornecedor ? <Cofre /> : null}
    </>
  );
}

export default App;
