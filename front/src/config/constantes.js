import contrato from "../assets/contrato.json";

export const RPC_URL = import.meta.env.VITE_RPC_URL ?? "";
export const ENDERECO_CONTRATO = import.meta.env.VITE_ENDERECO_CONTRATO ?? "";
export const ABI = contrato;
