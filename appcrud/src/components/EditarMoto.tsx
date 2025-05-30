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
  Spinner,
} from "reactstrap";
import { appsettings } from "../settings/appsettings";
import { type IMoto } from "../Interfaces/IMotos";
import { type ICliente } from "../Interfaces/IClientes";

const initialMoto: IMoto = {
  idMotocicleta: 0,
  marca: "",
  modelo: "",
  anio: 0,
  idCliente: undefined,
};

export function EditarMoto() {
  const [moto, setMoto] = useState<IMoto>(initialMoto);
  const [clientes, setClientes] = useState<ICliente[]>([]);
  const [cargando, setCargando] = useState(true);
  const [errorCarga, setErrorCarga] = useState("");
  const navigate = useNavigate();
  const { id } = useParams();

  // Cargar moto y clientes al iniciar
  useEffect(() => {
    const fetchData = async () => {
      try {
        setCargando(true);
        setErrorCarga("");

        // Validar ID
        if (!id || isNaN(Number(id))) {
          throw new Error("ID de motocicleta inválido");
        }

        // Cargar clientes
        const clientesResponse = await fetch(`${appsettings.apiUrl}Cliente/Lista`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
          },
        });

        if (!clientesResponse.ok) {
          throw new Error("No se pudieron cargar los clientes");
        }
        const clientesData = await clientesResponse.json();
        setClientes(clientesData);

        // Cargar datos de la moto
        const motoResponse = await fetch(`${appsettings.apiUrl}Motocicleta/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
          },
        });

        if (!motoResponse.ok) {
          throw new Error("No se pudo cargar la motocicleta");
        }

        const motoData = await motoResponse.json();
        
        // Validar datos recibidos
        if (!motoData.idMotocicleta || !motoData.marca || !motoData.modelo) {
          throw new Error("Datos de motocicleta incompletos");
        }
        
        setMoto(motoData);
      } catch (error) {
        console.error("Error al cargar datos:", error);
        setErrorCarga(error instanceof Error ? error.message : "Error desconocido");
      } finally {
        setCargando(false);
      }
    };

    fetchData();
  }, [id]);

  const handleInputChange = (event: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = event.target;

    setMoto((prev) => ({
      ...prev,
      [name]: name === "anio" || name === "idCliente" || name === "idMotocicleta" 
        ? Number(value) 
        : value,
    }));
  };

  const actualizarMoto = async (e: FormEvent) => {
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

      // Mostrar loader
      Swal.fire({
        title: "Guardando...",
        allowOutsideClick: false,
        didOpen: () => Swal.showLoading()
      });
      
      const response = await fetch(`${appsettings.apiUrl}Motocicleta/Editar`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
        },
        body: JSON.stringify(moto),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Error al actualizar la moto");
      }

      await Swal.fire({
        title: "Éxito",
        text: "Motocicleta actualizada correctamente",
        icon: "success",
      });

      navigate("/listamoto");
    } catch (error) {
      console.error("Error:", error);
      Swal.fire({
        title: "Error",
        text:
          error instanceof Error
            ? error.message
            : "Error al actualizar la motocicleta",
        icon: "error",
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
        <p className="mt-2">Cargando datos de la motocicleta...</p>
      </Container>
    );
  }

  if (errorCarga) {
    return (
      <Container className="mt-5 text-center">
        <div className="alert alert-danger">
          <h5>Error al cargar la motocicleta</h5>
          <p>{errorCarga}</p>
          <Button color="secondary" onClick={() => navigate("/listamoto")}>
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
          <h4>Editar Motocicleta</h4>
          <hr />
          <Form onSubmit={actualizarMoto}>
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