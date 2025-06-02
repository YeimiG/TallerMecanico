import { type ChangeEvent, type FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { type ICliente } from "../Interfaces/IClientes";
import { Container, Row, Col, Form, FormGroup, Label, Input, Button } from "reactstrap";
import { appsettings } from "../settings/appsettings";

const initialCliente: ICliente = {
    nombreCompleto: "",
    telefono: "",
    correo: "",
    direccion: ""
};

export function NuevoCliente() {
    const [cliente, setCliente] = useState<ICliente>(initialCliente);
    const navigate = useNavigate();

    const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setCliente(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const guardarCliente = async (e: FormEvent) => {
    e.preventDefault();

    try {
        if (!cliente.nombreCompleto || !cliente.telefono || !cliente.correo) {
            await Swal.fire({
                title: "Campos incompletos",
                text: "Por favor complete todos los campos requeridos",
                icon: "warning"
            });
            return;
        }

        const response = await fetch(`${appsettings.apiUrl}Cliente/Nuevo`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token') || ''}`
            },
            body: JSON.stringify(cliente)
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || "Error al guardar el cliente");
        }

        await Swal.fire({
            title: "Éxito",
            text: "Cliente guardado correctamente",
            icon: "success"
        });

        // Redirigir a nueva moto con el idCliente retornado
       navigate("/listacliente");

    } catch (error) {
        console.error("Error:", error);
        Swal.fire({
            title: "Error",
            text: error instanceof Error ? error.message : "Error al guardar el cliente",
            icon: "error"
        });
    }
};


    const volver = () => {
        navigate(-1);
    };

    return (
        <Container className="mt-5">
            <Row>
                <Col sm={{ size: 8, offset: 2 }}>
                    <h4>Nuevo Cliente</h4>
                    <hr />
                    <Form onSubmit={guardarCliente}>
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
                            <Button color="primary" type="submit" className="me-3">
                                Guardar
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