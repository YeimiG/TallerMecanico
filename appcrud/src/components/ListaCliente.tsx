import { useEffect, useState } from "react"
import { appsettings } from "../settings/appsettings"
import { Link } from "react-router-dom"
import Swal from "sweetalert2"
import type { ICliente } from "../Interfaces/IClientes"
import { Container, Row, Col, Table, Button } from "reactstrap"

export function ListaCliente() {
    const [cliente, setCliente] = useState<ICliente[]>([])

    const obtenerClientes = async () => {
        const response = await fetch(`${appsettings.apiUrl}Cliente/Lista`)
        if (response.ok) {
            const data = await response.json()
            setCliente(data)
        }
    }

    useEffect(() => {
        obtenerClientes()
    }, [])

    const eliminar = (id: number) => {
        Swal.fire({
            title: "¿Estás seguro?",
            text: "¡Esta acción eliminará al cliente!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Sí, eliminar"
        }).then(async (result) => {
            if (result.isConfirmed) {
                const response = await fetch(`${appsettings.apiUrl}Cliente/Eliminar/${id}`, { method: "DELETE" })
                if (response.ok) await obtenerClientes()
            }
        })
    }

    return (
        <Container className="mt-5">
            <Row>
                <Col sm={{ size: 10, offset: 1 }}>
                    <h4>Lista de Clientes</h4>
                    <hr />
                    <Link className="btn btn-success mb-3" to="/nuevocliente">Nuevo Cliente</Link>

                    <Table bordered hover responsive>
                        <thead>
                            <tr>
                                <th>Nombre</th>
                                <th>Correo</th>
                                <th>Teléfono</th>
                                <th>Dirección</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {cliente.map((item) => (
                                <tr key={item.idCliente}>
                                    <td>{item.nombreCompleto}</td>
                                    <td>{item.correo}</td>
                                    <td>{item.telefono}</td>
                                    <td>{item.direccion}</td>
                                    <td>
                                        <Link className="btn btn-primary me-2" to={`/editarcliente/${item.idCliente}`}>
                                            Editar
                                        </Link>
                                        <Button color="danger" onClick={() => eliminar(item.idCliente!)}>
                                            Eliminar
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                    <div className="mt-4 d-flex justify-content-end">
                        <Link to="/dashboard" className="btn btn-success mb-3">
                            Ir al Dashboard
                        </Link>
                    </div>
                </Col>
            </Row>
        </Container>
    )
}
