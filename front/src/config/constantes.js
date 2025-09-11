import contrato from "../assets/Escrow.json";

export const RPC_URL = import.meta.env.VITE_RPC_URL ?? "";
export const ENDERECO_CONTRATO = import.meta.env.VITE_ENDERECO_CONTRATO ?? "";
export const ABI = contrato.abi;
