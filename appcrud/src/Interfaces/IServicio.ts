export interface IServicio {
  idServicio: number;
  servicio: string;
  precio?: number;
  fechaEntrada: Date;
  idMotocicleta?: number;
  idEmpleado?: number;
}