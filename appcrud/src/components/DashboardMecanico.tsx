import { useEffect, useState } from "react";
import { Link } from "react-router-dom"; // Asegúrate de tener react-router-dom instalado

export default function Dashboard() {
  const [totales, setTotales] = useState({
    clientes: 0,
    motos: 0,
    servicios: 0,
    ingresos: 0,
  });

  useEffect(() => {
    fetch("http://localhost:5000/api/dashboard/totales")
      .then((res) => res.json())
      .then((data) => setTotales(data))
      .catch((err) => console.error("Error cargando totales:", err));
  }, []);

  return (
    <div className="d-flex" style={{ height: "100vh" }}>
      {/* Sidebar */}
      <div className="bg-dark text-white p-3" style={{ width: "250px" }}>
        <h4 className="text-center mb-4">Menú</h4>
        <ul className="nav flex-column">
          <li className="nav-item mb-2">
            <Link to="/listacliente" className="nav-link text-white">
              Clientes
            </Link>
          </li>
          <li className="nav-item mb-2">
            <Link to="/listamoto" className="nav-link text-white">
              Motocicletas
            </Link>
          </li>
          <li className="nav-item mb-2">
            <Link to="/listaservicio" className="nav-link text-white">
              Servicios
            </Link>
          </li>
           <li className="nav-item mb-2">
            <Link to="/listaEmpleado" className="nav-link text-white">
              Empleados
            </Link>
          </li>
            <li className="nav-item mb-2">
            <Link to="/listaCargos" className="nav-link text-white">
              Cargos
            </Link>
          </li>
            <li className="nav-item mb-2">
            <Link to="/listaEmpleado" className="nav-link text-white">
              Factura
            </Link>
          </li>
        </ul>
      </div>

      {/* Contenido principal */}
      <div className="flex-grow-1 p-4">
        <h2 className="mb-4">Dashboard Taller Mecánico</h2>
        <div className="row">
          <div className="col-md-3">
            <div className="card text-white bg-primary mb-3">
              <div className="card-header">Clientes</div>
              <div className="card-body">
                <h5 className="card-title">{totales.clientes}</h5>
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="card text-white bg-success mb-3">
              <div className="card-header">Motos</div>
              <div className="card-body">
                <h5 className="card-title">{totales.motos}</h5>
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="card text-white bg-warning mb-3">
              <div className="card-header">Servicios</div>
              <div className="card-body">
                <h5 className="card-title">{totales.servicios}</h5>
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="card text-white bg-danger mb-3">
              <div className="card-header">Ingresos</div>
              <div className="card-body">
                <h5 className="card-title">${totales.ingresos}</h5>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
