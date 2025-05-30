import { useEffect, useState } from "react";
import { appsettings } from "../settings/appsettings";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import type { IServicio } from "../Interfaces/IServicio";
import { Container, Row, Col, Table, Button } from "reactstrap";
import { format } from "date-fns"; // Para formatear fechas

export function ListaServicio() {
    const [servicios, setServicios] = useState<IServicio[]>([]);
    const [cargando, setCargando] = useState(true);

    const obtenerServicios = async () => {
        try {
            setCargando(true);
            const response = await fetch(`${appsettings.apiUrl}Servicio/Lista`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
                },
            });
            
            if (!response.ok) {
                throw new Error("Error al cargar servicios");
            }
            
            const data = await response.json();
            setServicios(data);
        } catch (error) {
            console.error("Error:", error);
            Swal.fire({
                title: "Error",
                text: "No se pudieron cargar los servicios",
                icon: "error",
            });
        } finally {
            setCargando(false);
        }
    };

    useEffect(() => {
        obtenerServicios();
    }, []);

    const eliminarServicio = (id: number) => {
        Swal.fire({
            title: "¿Estás seguro?",
            text: "¡Esta acción eliminará el servicio permanentemente!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Sí, eliminar",
            cancelButtonText: "Cancelar"
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const response = await fetch(`${appsettings.apiUrl}Servicio/Eliminar/${id}`, { 
                        method: "DELETE",
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
                        },
                    });
                    
                    if (!response.ok) {
                        throw new Error("Error al eliminar servicio");
                    }
                    
                    await Swal.fire({
                        title: "Eliminado!",
                        text: "El servicio ha sido eliminado.",
                        icon: "success",
                    });
                    
                    obtenerServicios();
                } catch (error) {
                    Swal.fire({
                        title: "Error",
                        text: "No se pudo eliminar el servicio",
                        icon: "error",
                    });
                }
            }
        });
    };

    if (cargando) {
        return (
            <Container className="mt-5 text-center">
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Cargando...</span>
                </div>
                <p>Cargando servicios...</p>
            </Container>
        );
    }

    return (
        <Container className="mt-5">
            <Row>
                <Col sm={{ size: 10, offset: 1 }}>
                    <h4>Lista de Servicios</h4>
                    <hr />
                    <Link className="btn btn-success mb-3" to="/nuevoservicio">
                        Nuevo Servicio
                    </Link>

                    <Table bordered hover responsive>
                        <thead>
                            <tr>
                                <th>Servicio</th>
                                <th>Precio</th>
                                <th>Fecha de Entrada</th>
                                <th>ID Motocicleta</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {servicios.length > 0 ? (
                                servicios.map((servicio) => (
                                    <tr key={servicio.idServicio}>
                                        <td>{servicio.servicio}</td>
                                        <td>{servicio.precio ? `$${servicio.precio.toFixed(2)}` : 'N/A'}</td>
                                        <td>
                                            {format(new Date(servicio.fechaEntrada), 'dd/MM/yyyy HH:mm')}
                                        </td>
                                        <td>{servicio.idMotocicleta || 'N/A'}</td>
                                        <td>
                                            <Link 
                                                className="btn btn-primary me-2" 
                                                to={`/editarservicio/${servicio.idServicio}`}
                                            >
                                                Editar
                                            </Link>
                                            <Button 
                                                color="danger" 
                                                onClick={() => eliminarServicio(servicio.idServicio)}
                                            >
                                                Eliminar
                                            </Button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={5} className="text-center">
                                        No hay servicios registrados
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </Table>
                </Col>
            </Row>
        </Container>
    );
}