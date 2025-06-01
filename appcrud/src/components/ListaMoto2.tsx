import { useEffect, useState } from "react"
import { appsettings } from "../settings/appsettings"
import { Link } from "react-router-dom"
import Swal from "sweetalert2"
import type { IMoto } from "../Interfaces/IMotos"
import { Container, Row, Col, Table, Button } from "reactstrap"

export function ListaMoto2() {
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


    return (
        <Container className="mt-5">
            <Row>
                <Col sm={{ size: 10, offset: 1 }}>
                    <h4>Lista de Motocicletas</h4>
                    <hr />
                    <Link className="btn btn-success mb-3" to="/nuevamoto2">
                        Nueva Motocicleta
                    </Link>

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
                                        <Link
                                            className="btn btn-primary me-2"
                                            to={`/editarmoto/${item.idMotocicleta}`}
                                        >
                                            Editar
                                        </Link>
                                        <Link
                                            className="btn btn-info ms-2"
                                            to={`/nuevoservicio/${item.idMotocicleta}`}
                                        >
                                            Agregar Servicio
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                    <div className="mt-4 d-flex justify-content-end">
                        <Link to="/dashboard2" className="btn btn-success mb-3">
                            Ir al Dashboard
                        </Link>
                    </div>
                </Col>
            </Row>
        </Container>
    )
}