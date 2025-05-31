export interface IServicio {
    idServicio: number;
    servicio1: string;
    precio: number;
    fechaEntrada: string;
    empleado: {
        idEmpleado: number;
        nombres: string;
    };
    motocicleta: {
        idMotocicleta: number;
        modelo: string;
    };
}
