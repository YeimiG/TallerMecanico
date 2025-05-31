export interface IServicio {
    idServicio: number
    servicio1: string
    precio: number
    fechaEntrada: Date
    empleado?: {
        idEmpleado: number
        nombres: string
    }
    motocicleta?: {
        idMotocicleta: number
        modelo: string
    }
    idMotocicleta?: number
    idEmpleado?: number
}
