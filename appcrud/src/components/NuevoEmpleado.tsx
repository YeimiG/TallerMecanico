import { useEffect, useState, type ChangeEvent, type FormEvent } from "react"
import { useNavigate } from "react-router-dom"
import Swal from "sweetalert2"
import { Container, Row, Col, Form, FormGroup, Label, Input, Button } from "reactstrap"
import { appsettings } from "../settings/appsettings"
import type { IEmpleados } from "../Interfaces/IEmpleados"
import type { ICargo } from "../Interfaces/ICargo"

const initialEmpleado: IEmpleados = {
    Nombres: "",
    Apellidos: "",
    Edad: 0,
    Dui: "",
    telefono: "",
    IdCargo: undefined
}

export function NuevoEmpleado() {
    const [empleado, setEmpleado] = useState<IEmpleados>(initialEmpleado)
    const [cargos, setCargos] = useState<ICargo[]>([])
    const navigate = useNavigate()

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

    const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target
        setEmpleado(prev => ({
            ...prev,
            [name]: name === "Edad" || name === "IdCargo" ? Number(value) : value
        }))
    }

    const guardarEmpleado = async (e: FormEvent) => {
        e.preventDefault()

        if (!empleado.Nombres || !empleado.Apellidos || !empleado.Dui || !empleado.telefono || !empleado.IdCargo) {
            await Swal.fire({
                title: "Campos incompletos",
                text: "Por favor complete todos los campos requeridos",
                icon: "warning"
            })
            return
        }

        try {
            const response = await fetch(`${appsettings.apiUrl}Empleado/Nuevo`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem("token") || ""}`
                },
                body: JSON.stringify(empleado)
            })

            const data = await response.json()

            if (!response.ok) {
                throw new Error(data.message || "Error al guardar el empleado")
            }

            await Swal.fire({
                title: "Éxito",
                text: "Empleado guardado correctamente",
                icon: "success"
            })

            navigate("/listaEmpleado")
        } catch (error) {
            console.error("Error:", error)
            Swal.fire({
                title: "Error",
                text: error instanceof Error ? error.message : "Error al guardar el empleado",
                icon: "error"
            })
        }
    }

    const volver = () => {
        navigate(-1)
    }

    return (
        <Container className="mt-5">
            <Row>
                <Col sm={{ size: 8, offset: 2 }}>
                    <h4>Nuevo Empleado</h4>
                    <hr />
                    <Form onSubmit={guardarEmpleado}>
                        <FormGroup>
                            <Label>Nombres</Label>
                            <Input
                                type="text"
                                name="Nombres"
                                value={empleado.Nombres}
                                onChange={handleInputChange}
                                required
                            />
                        </FormGroup>
                        <FormGroup>
                            <Label>Apellidos</Label>
                            <Input
                                type="text"
                                name="Apellidos"
                                value={empleado.Apellidos}
                                onChange={handleInputChange}
                                required
                            />
                        </FormGroup>
                        <FormGroup>
                            <Label>Edad</Label>
                            <Input
                                type="number"
                                name="Edad"
                                value={empleado.Edad}
                                onChange={handleInputChange}
                                required
                                min={18}
                            />
                        </FormGroup>
                        <FormGroup>
                            <Label>DUI</Label>
                            <Input
                                type="text"
                                name="Dui"
                                value={empleado.Dui}
                                onChange={handleInputChange}
                                required
                            />
                        </FormGroup>
                        <FormGroup>
                            <Label>Teléfono</Label>
                            <Input
                                type="tel"
                                name="telefono"
                                value={empleado.telefono}
                                onChange={handleInputChange}
                                required
                            />
                        </FormGroup>
                        <FormGroup>
                            <Label>Cargo</Label>
                            <Input
                                type="select"
                                name="IdCargo"
                                value={empleado.IdCargo ?? ""}
                                onChange={handleInputChange}
                                required
                            >
                                <option value="">Seleccione un cargo</option>
                                {cargos.map(c => (
                                    <option key={c.idCargo} value={c.idCargo}>
                                        {c.cargo1}
                                    </option>
                                ))}
                            </Input>
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
    )
}
