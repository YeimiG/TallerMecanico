import { useEffect, useState } from "react"
import { appsettings } from "../settings/appsettings"
import { Link } from "react-router-dom"
import Swal from "sweetalert2"
import type { IEmpleados } from "../Interfaces/IEmpleados"
import type { ICargo } from "../Interfaces/ICargo"
import { Container, Row, Col, Table, Button } from "reactstrap"

export function ListaEmpleados() {
    const [empleados, setEmpleados] = useState<IEmpleados[]>([])
    const [cargos, setCargos] = useState<ICargo[]>([])

    const obtenerDatos = async () => {
        // Obtener lista de empleados
        const responseEmpleados = await fetch(`${appsettings.apiUrl}Empleado/Lista`)
        if (responseEmpleados.ok) {
            const dataEmpleados = await responseEmpleados.json()
            setEmpleados(dataEmpleados)
        }

        // Obtener lista de cargos
        const responseCargos = await fetch(`${appsettings.apiUrl}Cargo/Lista`)
        if (responseCargos.ok) {
            const dataCargos = await responseCargos.json()
            setCargos(dataCargos)
        }
    }

    useEffect(() => {
        obtenerDatos()
    }, [])

    const eliminar = (id: number) => {
        Swal.fire({
            title: "¿Estás seguro?",
            text: "¡Esta acción eliminará al empleado!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Sí, eliminar"
        }).then(async (result) => {
            if (result.isConfirmed) {
                const response = await fetch(`${appsettings.apiUrl}Empleado/Eliminar/${id}`, { method: "DELETE" })
                if (response.ok) await obtenerDatos()
            }
        })
    }

    // Función para obtener el nombre del cargo por su ID
    const obtenerNombreCargo = (idCargo?: number) => {
        if (!idCargo) return "Sin cargo asignado"
        const cargo = cargos.find(c => c.idCargo === idCargo)
        return cargo ? cargo.cargo1 : "Cargo no encontrado"
    }

    return (
        <Container className="mt-5">
            <Row>
                <Col sm={{ size: 10, offset: 1 }}>
                    <h4>Lista de Empleados</h4>
                    <hr />
                    <Link className="btn btn-success mb-3" to="/nuevoempleado">Nuevo Empleado</Link>

                    <Table bordered hover responsive>
                        <thead>
                            <tr>
                                <th>Nombres</th>
                                <th>Apellidos</th>
                                <th>Edad</th>
                                <th>DUI</th>
                                <th>Teléfono</th>
                                <th>Cargo</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {empleados.map((item) => (
                                <tr key={item.IdEmpleadp}>
                                    <td>{item.Nombres}</td>
                                    <td>{item.Apellidos}</td>
                                    <td>{item.Edad}</td>
                                    <td>{item.Dui}</td>
                                    <td>{item.telefono}</td>
                                    <td>{obtenerNombreCargo(item.IdCargo)}</td>
                                    <td>
                                        <Link className="btn btn-primary me-2" to={`/editarempleado/${item.IdEmpleadp}`}>
                                            Editar
                                        </Link>
                                        <Button color="danger" onClick={() => eliminar(item.IdEmpleadp!)}>
                                            Eliminar
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </Col>
            </Row>
        </Container>
    )
}