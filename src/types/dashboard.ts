import type { Persona } from "./persona";

export interface User {
  id: number;
  username: string;
  email: string;
  nombre?: string;
  direccion?: string;
  ciudad?: string;
  pais?: string;
  rut?: string;
  enabled: boolean;
}

export interface BudgetItem {
  id: number;
  productCode: string;
  productName: string;
  descripcion: string;
  cantidad: number;
  precioUnitario: number;
  precioTotal: number;
}

export interface Budget {
  id: number;
  codigo: string;
  person: Persona;
  items: BudgetItem[];
  baseImponible: number;
  iva: number;
  precioLiquido: number;
  status: string;
  fechaElaboracion: string;
  fechaVencimiento: string;
}
