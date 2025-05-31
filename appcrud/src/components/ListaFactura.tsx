import { useEffect, useState } from "react";
import { appsettings } from "../settings/appsettings";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import type { IFactura } from "../Interfaces/IFactura";
import type { IServicio } from "../Interfaces/IServicio";
import { Container, Row, Col, Table, Button, Input } from "reactstrap";
import { format } from "date-fns";

export function ListaFactura() {
    const [facturas, setFacturas] = useState<IFactura[]>([]);
    const [servicios, setServicios] = useState<IServicio[]>([]);
    const [cargando, setCargando] = useState(true);

    // Cargar servicios
    const obtenerServicios = async () => {
        try {
            const response = await fetch(`${appsettings.apiUrl}Servicio/Lista`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
                },
            });
            if (!response.ok) throw new Error("Error al cargar servicios");
            const data = await response.json();
            setServicios(data);
        } catch (error) {
            console.error(error);
            Swal.fire("Error", "No se pudieron cargar los servicios", "error");
        }
    };

    // Cargar facturas
    const obtenerFacturas = async () => {
        try {
            setCargando(true);
            const response = await fetch(`${appsettings.apiUrl}Factura/Lista`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
                },
            });
            if (!response.ok) throw new Error("Error al cargar facturas");
            const data = await response.json();
            setFacturas(data);
        } catch (error) {
            console.error(error);
            Swal.fire("Error", "No se pudieron cargar las facturas", "error");
        } finally {
            setCargando(false);
        }
    };

    useEffect(() => {
        obtenerServicios();
        obtenerFacturas();
    }, []);

    // Función para cambiar el servicio seleccionado en una factura (opcional para edición)
    const handleServicioChange = (idFactura: number, nuevoIdServicio: number) => {
        setFacturas((prev) =>
            prev.map((factura) =>
                factura.idFactura === idFactura
                    ? { ...factura, idServicio: nuevoIdServicio }
                    : factura
            )
        );
    };

    if (cargando) {
        return (
            <Container className="mt-5 text-center">
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Cargando...</span>
                </div>
                <p>Cargando facturas...</p>
            </Container>
        );
    }

    return (
        <Container className="mt-5">
            <Row>
                <Col sm={{ size: 10, offset: 1 }}>
                    <h4>Lista de Facturas</h4>
                    <hr />
                    <Link className="btn btn-success mb-3" to="/nuevafactura">
                        Nueva Factura
                    </Link>

                    <Table bordered hover responsive>
                        <thead>
                            <tr>
                                <th>Fecha Factura</th>
                                <th>Servicio</th>
                                <th>Total Pago</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {facturas.length > 0 ? (
                                facturas.map((factura) => (
                                    <tr key={factura.idFactura}>
                                        <td>{format(new Date(factura.fechaFactura), "dd/MM/yyyy")}</td>
                                        <td>
                                            <Input
                                                type="select"
                                                value={factura.idServicio || ""}
                                                onChange={(e) =>
                                                    handleServicioChange(
                                                        factura.idFactura!,
                                                        Number(e.target.value)
                                                    )
                                                }
                                            >
                                                <option value="">-- Seleccione servicio --</option>
                                                {servicios.map((servicio) => (
                                                    <option key={servicio.idServicio} value={servicio.idServicio}>
                                                        {servicio.servicio1}
                                                    </option>
                                                ))}
                                            </Input>
                                        </td>
                                        <td>{factura.totalPago.toFixed(2)}</td>
                                        <td>
                                            <Link
                                                className="btn btn-primary me-2"
                                                to={`/editarfactura/${factura.idFactura}`}
                                            >
                                                Editar
                                            </Link>
                                            <Button
                                                color="danger"
                                            // Aquí puedes agregar función eliminar similar a ListaServicio
                                            // onClick={() => eliminarFactura(factura.idFactura!)}
                                            >
                                                Eliminar
                                            </Button>
                                            <Button color="info" >
                                                Ver Reporte
                                            </Button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={4} className="text-center">
                                        No hay facturas registradas
                                    </td>
                                </tr>
                            )}
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
    );
}
