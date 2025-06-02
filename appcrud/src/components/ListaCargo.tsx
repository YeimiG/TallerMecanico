import { useEffect, useState } from "react"
import { appsettings } from "../settings/appsettings"
import { Link } from "react-router-dom"
import Swal from "sweetalert2"
import type { ICargo } from "../Interfaces/ICargo"
import { Container, Row, Col, Table, Button } from "reactstrap"

export function ListaCargos() {
    const [cargos, setCargos] = useState<ICargo[]>([])

    const obtenerCargos = async () => {
        const response = await fetch(`${appsettings.apiUrl}Cargo/Lista`)
        if (response.ok) {
            const data = await response.json()
            setCargos(data)
        }
    }

    useEffect(() => {
        obtenerCargos()
    }, [])

    const eliminar = (id: number) => {
        Swal.fire({
            title: "¿Estás seguro?",
            text: "¡Esta acción eliminará el cargo!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Sí, eliminar"
        }).then(async (result) => {
            if (result.isConfirmed) {
                const response = await fetch(`${appsettings.apiUrl}Cargo/Eliminar/${id}`, { method: "DELETE" })
                if (response.ok) await obtenerCargos()
            }
        })
    }

    return (
        <Container className="mt-5">
            <Row>
                <Col sm={{ size: 8, offset: 2 }}>
                    <h4>Lista de Cargos</h4>
                    <hr />
                    <Link className="btn btn-success mb-3" to="/nuevocargo">Nuevo Cargo</Link>

                    <Table bordered hover responsive>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Nombre del Cargo</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {cargos.map((cargo) => (
                                <tr key={cargo.idCargo}>
                                    <td>{cargo.idCargo}</td>
                                    <td>{cargo.cargo1}</td>
                                    <td>
                                        <Link className="btn btn-primary me-2" to={`/editarcargo/${cargo.idCargo}`}>
                                            Editar
                                        </Link>
                                        <Button color="danger" onClick={() => eliminar(cargo.idCargo!)}>
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
