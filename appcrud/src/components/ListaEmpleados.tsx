import { useEffect, useState } from "react"
import { appsettings } from "../settings/appsettings"
import { Link } from "react-router-dom"
import Swal from "sweetalert2"
import type { IEmpleados } from "../Interfaces/IEmpleados"
import { Container, Row, Col, Table, Button } from "reactstrap"

export function ListaEmpleado() {
    const [empleados, setEmpleados] = useState<IEmpleados[]>([])

    const obtenerEmpleados = async () => {
        const response = await fetch(`${appsettings.apiUrl}Empleado/Lista`)
        if (response.ok) {
            const data = await response.json()
            setEmpleados(data)
        }
    }

    useEffect(() => {
        obtenerEmpleados()
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
                const response = await fetch(`${appsettings.apiUrl}Empleado/Eliminar/${id}`, {
                    method: "DELETE"
                })
                if (response.ok) await obtenerEmpleados()
            }
        })
    }

    return (
        <Container className="mt-5">
            <Row>
                <Col sm={{ size: 10, offset: 1 }}>
                    <h4>Lista de Empleados</h4>
                    <hr />
                    <Link className="btn btn-success mb-3" to="/nuevoempleado">
                        Nuevo Empleado
                    </Link>

                    <Table bordered hover responsive>
                        <thead>
                            <tr>
                                <th>Nombres</th>
                                <th>Apellidos</th>
                                <th>Edad</th>
                                <th>DUI</th>
                                <th>Teléfono</th>
                                <th>ID Cargo</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {empleados.map((item) => (
                                <tr key={item.idEmpleado}>
                                    <td>{item.nombres}</td>
                                    <td>{item.apellidos}</td>
                                    <td>{item.edad}</td>
                                    <td>{item.dui}</td>
                                    <td>{item.telefono}</td>
                                    <td>{item.idCargo ?? "Sin asignar"}</td>
                                    <td>
                                        <Link
                                            className="btn btn-primary me-2"
                                            to={`/editarempleado/${item.idEmpleado}`}
                                        >
                                            Editar
                                        </Link>
                                        <Button
                                            color="danger"
                                            onClick={() => eliminar(item.idEmpleado!)}
                                        >
                                            Eliminar
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                    <div className="mt-4 d-flex justify-content-end">
                        <Link to="/" className="btn btn-success mb-3">
                            Ir al Dashboard
                        </Link>
                    </div>

                </Col>
            </Row>


        </Container>
    )
}
