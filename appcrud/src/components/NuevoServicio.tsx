import { type ChangeEvent, type FormEvent, useState, useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"
import Swal from "sweetalert2"
import { type IServicio } from "../Interfaces/IServicio"
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

const initialServicio: IServicio = {
    servicio: "",
    precio: 0,
    fechaEntrada: new Date(),
    idMotocicleta: undefined,
    idEmpleado: undefined,
    idServicio: 0
}

export function NuevoServicio() {
    const [servicio, setServicio] = useState<IServicio>(initialServicio)
    const [empleados, setEmpleados] = useState<Array<{ idEmpleado: number, nombreCompleto: string }>>([])
    const navigate = useNavigate()
    const { idMotocicleta } = useParams()

    useEffect(() => {
        if (idMotocicleta) {
            setServicio(prev => ({
                ...prev,
                idMotocicleta: Number(idMotocicleta)
            }))
        }
    }, [idMotocicleta])

   useEffect(() => {
    const fetchClientes = async () => {
      try {
        const response = await fetch(`${appsettings.apiUrl}Empleado/Lista`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
          },
        });

        if (!response.ok) {
          throw new Error("No se pudieron cargar los empleados");
        }

        const data = await response.json();
        console.log("Clientes cargados:", data); // Puedes quitarlo luego
        setEmpleados(data);
      } catch (error) {
        console.error("Error al cargar clientes:", error);
      }
    };

    fetchClientes();
  }, []);

    const handleInputChange = (event: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = event.target
        setServicio(prev => ({
            ...prev,
            [name]: name === "precio" || name === "idMotocicleta" || name === "idEmpleado"
                ? Number(value)
                : value
        }))
    }

    const handleDateChange = (event: ChangeEvent<HTMLInputElement>) => {
        setServicio(prev => ({
            ...prev,
            fechaEntrada: new Date(event.target.value)
        }))
    }

    const guardarServicio = async (e: FormEvent) => {
        e.preventDefault()

        try {
            if (!servicio.servicio || !servicio.fechaEntrada || !servicio.idMotocicleta) {
                await Swal.fire({
                    title: "Campos incompletos",
                    text: "Por favor complete todos los campos requeridos",
                    icon: "warning"
                })
                return
            }

            const response = await fetch(`${appsettings.apiUrl}Servicio/Nuevo`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token') || ''}`
                },
                body: JSON.stringify(servicio)
            })

            if (!response.ok) {
                const errorData = await response.json()
                throw new Error(errorData.message || "Error al guardar el servicio")
            }

            await Swal.fire({
                title: "Éxito",
                text: "Servicio creado correctamente",
                icon: "success"
            })

            navigate("/listaservicios")

        } catch (error) {
            console.error("Error:", error)
            Swal.fire({
                title: "Error",
                text: error instanceof Error ? error.message : "Error al guardar el servicio",
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
                    <h4>Nuevo Servicio</h4>
                    <hr />
                    <Form onSubmit={guardarServicio}>
                        <FormGroup>
                            <Label>Nombre del Servicio</Label>
                            <Input
                                type="text"
                                name="servicio"
                                onChange={handleInputChange}
                                value={servicio.servicio}
                                required
                            />
                        </FormGroup>
                        <FormGroup>
                            <Label>Precio</Label>
                            <Input
                                type="number"
                                name="precio"
                                onChange={handleInputChange}
                                value={servicio.precio}
                                step="0.01"
                            />
                        </FormGroup>
                        <FormGroup>
                            <Label>Fecha de Entrada</Label>
                            <Input
                                type="datetime-local"
                                name="fechaEntrada"
                                onChange={handleDateChange}
                                value={servicio.fechaEntrada.toISOString().slice(0, 16)}
                                required
                            />
                        </FormGroup>
                        <FormGroup>
                            <Label>ID Motocicleta</Label>
                            <Input
                                type="number"
                                name="idMotocicleta"
                                onChange={handleInputChange}
                                value={servicio.idMotocicleta || ""}
                                readOnly={!!idMotocicleta}
                            />
                        </FormGroup>
                        <FormGroup>
                            <Label for="idEmpleado">Empleado</Label>
                            <Input
                                type="select"
                                name="idEmpleado"
                                id="idEmpleado"
                                onChange={handleInputChange}
                                value={servicio.idEmpleado ?? ""}
                                required
                            >
                                <option value="">Seleccione el empleado</option>
                                {empleados.map((empleado) => (
                                    <option key={empleado.idEmpleado} value={empleado.idEmpleado}>
                                        {empleado.nombreCompleto}
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
