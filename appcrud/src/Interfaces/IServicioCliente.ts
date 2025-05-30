import type { ICliente } from "./IClientes";
import type { IServicio } from "./IServicio";

export interface IServicioCliente {
  idServicio_Cliente?: number;       // opcional para "Nuevo"
  idServicio: number;
  idCliente: number;
  idClienteNavigation?: ICliente;
  idServicioNavigation?: IServicio;
}