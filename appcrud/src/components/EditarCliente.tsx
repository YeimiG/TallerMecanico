import { type ChangeEvent, useEffect, useState } from "react";
import { appsettings } from "../settings/appsettings";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import { type ICliente } from "../Interfaces/IClientes";
import { Container, Row, Col, Form, FormGroup, Label, Input, Button, Spinner } from "reactstrap";

const initialCliente: ICliente = {
    idCliente: 0,
    nombreCompleto: "",
    telefono: "",
    correo: "",
    direccion: ""
};

export function EditarCliente() {
    const { id } = useParams<{ id: string }>();
    const [cliente, setCliente] = useState<ICliente>(initialCliente);
    const [cargando, setCargando] = useState(true);
    const [errorCarga, setErrorCarga] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        const obtenerCliente = async () => {
            try {
                setCargando(true);
                setErrorCarga("");
                
                // Validar ID
                if (!id || isNaN(Number(id))) {
                    throw new Error("ID de cliente inválido");
                }

                // Configurar timeout
                const controller = new AbortController();
                const timeoutId = setTimeout(() => controller.abort(), 8000);

                // Realizar petición
                const response = await fetch(`${appsettings.apiUrl}Cliente/Obtener/${id}`, {
                    signal: controller.signal,
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token') || ''}`
                    }
                });

                clearTimeout(timeoutId);

                if (!response.ok) {
                    const errorData = await response.json().catch(() => ({}));
                    throw new Error(errorData.message || `Error ${response.status}`);
                }

                const data = await response.json();
                
                // Validar estructura de datos
                if (!data.idCliente || !data.nombreCompleto) {
                    throw new Error("Estructura de datos incorrecta");
                }

                setCliente(data);
                
            } catch (error) {
                console.error("Error al obtener cliente:", error);
                setErrorCarga(error instanceof Error ? error.message : "Error desconocido");
            } finally {
                setCargando(false);
            }
        };

        obtenerCliente();
    }, [id]);

    const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setCliente(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const guardarCliente = async () => {
        try {
            // Validación de campos
            if (!cliente.nombreCompleto || !cliente.telefono || !cliente.correo) {
                await Swal.fire({
                    title: "Campos incompletos",
                    text: "Por favor complete todos los campos requeridos",
                    icon: "warning"
                });
                return;
            }

            // Mostrar loader
            Swal.fire({
                title: "Guardando...",
                allowOutsideClick: false,
                didOpen: () => Swal.showLoading()
            });

            // Configurar timeout
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 8000);

            // Realizar petición
            const response = await fetch(`${appsettings.apiUrl}Cliente/Editar`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token') || ''}`
                },
                body: JSON.stringify(cliente),
                signal: controller.signal
            });

            clearTimeout(timeoutId);

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || `Error ${response.status}`);
            }

            // Éxito
            await Swal.fire({
                title: "Éxito",
                text: "Cliente actualizado correctamente",
                icon: "success"
            });
            
            navigate("/clientes");
            
        } catch (error) {
            console.error("Error al guardar cliente:", error);
            
            let mensaje = "Error al conectar con el servidor";
            if (error instanceof Error) {
                if (error.name === "AbortError") {
                    mensaje = "El servidor no respondió a tiempo";
                } else {
                    mensaje = error.message;
                }
            }

            Swal.fire({
                title: "Error",
                text: mensaje,
                icon: "error"
            });
        }
    };

    const volver = () => {
        navigate(-1);
    };

    if (cargando) {
        return (
            <Container className="mt-5 text-center">
                <Spinner color="primary" />
                <p className="mt-2">Cargando datos del cliente...</p>
            </Container>
        );
    }

    if (errorCarga) {
        return (
            <Container className="mt-5 text-center">
                <div className="alert alert-danger">
                    <h5>Error al cargar el cliente</h5>
                    <p>{errorCarga}</p>
                    <Button color="secondary" onClick={() => navigate("/clientes")}>
                        Volver a la lista
                    </Button>
                </div>
            </Container>
        );
    }

    return (
        <Container className="mt-5">
            <Row>
                <Col sm={{ size: 8, offset: 2 }}>
                    <h4>Editar Cliente</h4>
                    <hr />
                    <Form>
                        <FormGroup>
                            <Label>Nombre Completo</Label>
                            <Input
                                type="text"
                                name="nombreCompleto"
                                onChange={handleInputChange}
                                value={cliente.nombreCompleto}
                                required
                            />
                        </FormGroup>
                        <FormGroup>
                            <Label>Teléfono</Label>
                            <Input
                                type="tel"
                                name="telefono"
                                onChange={handleInputChange}
                                value={cliente.telefono}
                                required
                            />
                        </FormGroup>
                        <FormGroup>
                            <Label>Correo</Label>
                            <Input
                                type="email"
                                name="correo"
                                onChange={handleInputChange}
                                value={cliente.correo}
                                required
                            />
                        </FormGroup>
                        <FormGroup>
                            <Label>Dirección</Label>
                            <Input
                                type="text"
                                name="direccion"
                                onChange={handleInputChange}
                                value={cliente.direccion}
                            />
                        </FormGroup>
                        <div className="mt-4">
                            <Button color="primary" className="me-3" onClick={guardarCliente}>
                                Guardar Cambios
                            </Button>
                            <Button color="secondary" onClick={volver}>
                                Volver
                            </Button>
                        </div>
                    </Form>
                </Col>
            </Row>
        </Container>
    );
}