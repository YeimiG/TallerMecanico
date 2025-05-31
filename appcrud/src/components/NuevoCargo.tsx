import { type ChangeEvent, type FormEvent, useState } from "react"
import { useNavigate } from "react-router-dom"
import Swal from "sweetalert2"
import { type ICargo } from "../Interfaces/ICargo"
import {
    Container,
    Row,
    Col,
    Form,
    FormGroup,
    Label,
    Input,
    Button
} from "reactstrap"
import { appsettings } from "../settings/appsettings"

const initialCargo: ICargo = {
    cargo1: ""
}

export function NuevoCargo() {
    const [cargo, setCargo] = useState<ICargo>(initialCargo)
    const navigate = useNavigate()

    const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target
        setCargo(prev => ({
            ...prev,
            [name]: value
        }))
    }

    const guardarCargo = async (e: FormEvent) => {
        e.preventDefault()

        try {
            if (!cargo.cargo1.trim()) {
                await Swal.fire({
                    title: "Campo obligatorio",
                    text: "Por favor escriba un nombre para el cargo",
                    icon: "warning"
                })
                return
            }

            const response = await fetch(`${appsettings.apiUrl}Cargo/Nuevo`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token') || ''}`
                },
                body: JSON.stringify(cargo)
            })

            const data = await response.json()

            if (!response.ok) {
                throw new Error(data.message || "Error al guardar el cargo")
            }

            await Swal.fire({
                title: "Éxito",
                text: "Cargo guardado correctamente",
                icon: "success"
            })

            navigate("/listacargos") // Cambia esta ruta si necesitas otra

        } catch (error) {
            console.error("Error:", error)
            Swal.fire({
                title: "Error",
                text: error instanceof Error ? error.message : "Error al guardar el cargo",
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
                    <h4>Nuevo Cargo</h4>
                    <hr />
                    <Form onSubmit={guardarCargo}>
                        <FormGroup>
                            <Label>Nombre del Cargo</Label>
                            <Input
                                type="text"
                                name="cargo1"
                                onChange={handleInputChange}
                                value={cargo.cargo1}
                                required
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
    )
}
