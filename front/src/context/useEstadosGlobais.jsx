import { useContext } from "react";
import { ContextoEstados } from "./index";

export function useEstadosGlobais() {
  const contexto = useContext(ContextoEstados);
  if (!contexto)
    throw new Error(
      "useEstadosGlobais deve ser usado dentro do ProvedorEstados"
    );
  return contexto;
}
