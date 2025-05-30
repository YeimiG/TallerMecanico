import { useState, type ChangeEvent, type FormEvent, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import {
  Container,
  Row,
  Col,
  Form,
  FormGroup,
  Label,
  Input,
  Button,
} from "reactstrap";
import { appsettings } from "../settings/appsettings";
import { type IMoto } from "../Interfaces/IMotos";
import { type ICliente } from "../Interfaces/IClientes"; // Asegúrate que este está bien importado

const initialMoto: IMoto = {
  marca: "",
  modelo: "",
  anio: 0,
  idCliente: undefined,
};

export function NuevaMoto() {
  const [moto, setMoto] = useState<IMoto>(initialMoto);
  const [clientes, setClientes] = useState<ICliente[]>([]); // <- NUEVO
  const navigate = useNavigate();
  const { idCliente } = useParams();

  // Cargar clientes al iniciar
  useEffect(() => {
    const fetchClientes = async () => {
      try {
        const response = await fetch(`${appsettings.apiUrl}Cliente/Lista`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
          },
        });

        if (!response.ok) {
          throw new Error("No se pudieron cargar los clientes");
        }

        const data = await response.json();
        console.log("Clientes cargados:", data); // Puedes quitarlo luego
        setClientes(data);
      } catch (error) {
        console.error("Error al cargar clientes:", error);
      }
    };

    fetchClientes();
  }, []);

  // Si viene por URL, asigna el idCliente
  useEffect(() => {
    if (idCliente) {
      setMoto((prev) => ({ ...prev, idCliente: Number(idCliente) }));
    }
  }, [idCliente]);

  const handleInputChange = (event: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = event.target;

    setMoto((prev) => ({
      ...prev,
      [name]: name === "anio" || name === "idCliente" ? Number(value) : value,
    }));
  };

  const guardarMoto = async (e: FormEvent) => {
    e.preventDefault();

    try {
      if (!moto.marca || !moto.modelo || !moto.anio || !moto.idCliente) {
        await Swal.fire({
          title: "Campos incompletos",
          text: "Por favor complete todos los campos requeridos",
          icon: "warning",
        });
        return;
      }

      const response = await fetch(`${appsettings.apiUrl}Motocicleta/Nuevo`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
        },
        body: JSON.stringify(moto),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Error al guardar la moto");
      }

      const data = await response.json();
      await Swal.fire({
        title: "Éxito",
        text: "Motocicleta registrada correctamente",
        icon: "success",
      });

      navigate(
        "/listamoto"
      );
    } catch (error) {
      console.error("Error:", error);
      Swal.fire({
        title: "Error",
        text:
          error instanceof Error
            ? error.message
            : "Error al guardar la motocicleta",
        icon: "error",
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
          <h4>Nueva Motocicleta</h4>
          <hr />
          <Form onSubmit={guardarMoto}>
            <FormGroup>
              <Label>Marca</Label>
              <Input
                type="text"
                name="marca"
                onChange={handleInputChange}
                value={moto.marca}
                required
              />
            </FormGroup>
            <FormGroup>
              <Label>Modelo</Label>
              <Input
                type="text"
                name="modelo"
                onChange={handleInputChange}
                value={moto.modelo}
                required
              />
            </FormGroup>
            <FormGroup>
              <Label>Año</Label>
              <Input
                type="number"
                name="anio"
                onChange={handleInputChange}
                value={moto.anio}
                required
              />
            </FormGroup>

            <FormGroup>
              <Label for="idCliente">Cliente</Label>
              <Input
                type="select"
                name="idCliente"
                id="idCliente"
                onChange={handleInputChange}
                value={moto.idCliente ?? ""}
                required
              >
                <option value="">Seleccione un cliente</option>
                {clientes.map((cliente) => (
                  <option key={cliente.idCliente} value={cliente.idCliente}>
                    {cliente.nombreCompleto}
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
  );
}
