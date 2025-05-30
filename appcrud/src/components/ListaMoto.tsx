import { useEffect, useState } from "react"
import { appsettings } from "../settings/appsettings"
import { Link } from "react-router-dom"
import Swal from "sweetalert2"
import type { IMoto } from "../Interfaces/IMotos"
import { Container, Row, Col, Table, Button } from "reactstrap"

export function ListaMoto() {
    const [motos, setMotos] = useState<IMoto[]>([])

    const obtenerMotos = async () => {
        const response = await fetch(`${appsettings.apiUrl}Motocicleta/Lista`)
        if (response.ok) {
            const data = await response.json()
            setMotos(data)
        }
    }

    useEffect(() => {
        obtenerMotos()
    }, [])

    const eliminar = (id: number) => {
        Swal.fire({
            title: "¿Estás seguro?",
            text: "¡Esta acción eliminará la motocicleta!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Sí, eliminar"
        }).then(async (result) => {
            if (result.isConfirmed) {
                const response = await fetch(`${appsettings.apiUrl}Motocicleta/Eliminar/${id}`, { method: "DELETE" })
                if (response.ok) await obtenerMotos()
            }
        })
    }

    return (
        <Container className="mt-5">
            <Row>
                <Col sm={{ size: 10, offset: 1 }}>
                    <h4>Lista de Motocicletas</h4>
                    <hr />
                    <Link className="btn btn-success mb-3" to="/nuevamoto/">Nueva Motocicleta</Link>

                    <Table bordered hover responsive>
                        <thead>
                            <tr>
                                <th>Marca</th>
                                <th>Modelo</th>
                                <th>Año</th>
                                <th>ID Cliente</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {motos.map((item) => (
                                <tr key={item.idMotocicleta}>
                                    <td>{item.marca}</td>
                                    <td>{item.modelo}</td>
                                    <td>{item.anio}</td>
                                    <td>{item.idCliente ?? "Sin asignar"}</td>
                                    <td>
                                        <Link className="btn btn-primary me-2" to={`/editarmoto/${item.idMotocicleta}`}>
                                            Editar
                                        </Link>
                                        <Button color="danger" onClick={() => eliminar(item.idMotocicleta!)}>
                                            Eliminar
                                        </Button>
                                        <Link className="btn btn-primary me-2" to={`/nuevoservicio/${item.idMotocicleta}`}>
                                            Agregar Servicio
                                        </Link>
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
