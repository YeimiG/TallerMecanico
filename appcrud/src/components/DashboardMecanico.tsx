import React, { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area
} from "recharts";

interface Totales {
  clientes: number;
  motos: number;
  servicios: number;
  ingresos: number;
}

interface Factura {
  idFactura: number;
  fechaFactura: string;
  totalPago: number;
  idServicio: number;
  idServicioNavigation?: {
    servicio1: string;
    precio: number;
  };
}

interface GraficoData {
  mes: string;
  ingresos: number;
  facturas: number;
}

interface ServicioData {
  servicio: string;
  cantidad: number;
  ingresos: number;
}

const DashboardMecanico: React.FC = () => {
  const [totales, setTotales] = useState<Totales>({
    clientes: 0,
    motos: 0,
    servicios: 0,
    ingresos: 0,
  });

  const [facturas, setFacturas] = useState<Factura[]>([]);
  const [loading, setLoading] = useState(true);
  const [datosGraficos, setDatosGraficos] = useState<GraficoData[]>([]);
  const [serviciosData, setServiciosData] = useState<ServicioData[]>([]);

  // Colores para los gráficos
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        
        
        const resTotales = await fetch("http://localhost:5000/api/dashboard/totales");
        if (resTotales.ok) {
          const dataTotales = await resTotales.json();
          setTotales(dataTotales);
        }

        const resFacturas = await fetch("http://localhost:5000/api/Factura/Lista");
        if (resFacturas.ok) {
          const dataFacturas = await resFacturas.json();
          setFacturas(dataFacturas);
          procesarDatosGraficos(dataFacturas);
        }
        
      } catch (error) {
        console.error("Error cargando datos:", error);
      } finally {
        setLoading(false);
      }
    };

    cargarDatos();
  }, []);

  const procesarDatosGraficos = (facturas: Factura[]) => {
    // Procesar datos por mes
    const facturasPorMes: { [key: string]: { ingresos: number; cantidad: number } } = {};
    
    facturas.forEach(factura => {
      if (factura.fechaFactura && factura.totalPago) {
        const fecha = new Date(factura.fechaFactura);
        const mesAno = `${fecha.getMonth() + 1}/${fecha.getFullYear()}`;
        
        if (!facturasPorMes[mesAno]) {
          facturasPorMes[mesAno] = { ingresos: 0, cantidad: 0 };
        }
        
        facturasPorMes[mesAno].ingresos += factura.totalPago;
        facturasPorMes[mesAno].cantidad += 1;
      }
    });

    // Convertir a array para gráficos
    const datosGrafico = Object.entries(facturasPorMes)
      .map(([mes, datos]) => ({
        mes,
        ingresos: datos.ingresos,
        facturas: datos.cantidad
      }))
      .sort((a, b) => {
        const [mesA, anoA] = a.mes.split('/').map(Number);
        const [mesB, anoB] = b.mes.split('/').map(Number);
        return new Date(anoA, mesA - 1).getTime() - new Date(anoB, mesB - 1).getTime();
      })
      .slice(-6); // Últimos 6 meses

    setDatosGraficos(datosGrafico);

    // Procesar datos de servicios
    const servicios: { [key: string]: { cantidad: number; ingresos: number } } = {};
    
    facturas.forEach(factura => {
      if (factura.idServicioNavigation) {
        const nombreServicio = factura.idServicioNavigation.servicio1 || `Servicio ${factura.idServicio}`;
        
        if (!servicios[nombreServicio]) {
          servicios[nombreServicio] = { cantidad: 0, ingresos: 0 };
        }
        
        servicios[nombreServicio].cantidad += 1;
        servicios[nombreServicio].ingresos += factura.totalPago || 0;
      }
    });

    const serviciosArray = Object.entries(servicios)
      .map(([servicio, datos]) => ({
        servicio,
        cantidad: datos.cantidad,
        ingresos: datos.ingresos
      }))
      .sort((a, b) => b.ingresos - a.ingresos)
      .slice(0, 5); // Top 5 servicios

    setServiciosData(serviciosArray);
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: "100vh" }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Cargando...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="d-flex" style={{ height: "100vh" }}>
      {/* Sidebar */}
      <div className="bg-dark text-white p-3" style={{ width: "250px" }}>
        <h4 className="text-center mb-4">🔧 Taller Mecánico</h4>
        <ul className="nav flex-column">
          <li className="nav-item mb-2">
            <a href="/listacliente" className="nav-link text-white d-flex align-items-center">
              👥 Clientes
            </a>
          </li>
          <li className="nav-item mb-2">
            <a href="/listamoto" className="nav-link text-white d-flex align-items-center">
              🏍️ Motocicletas
            </a>
          </li>
          <li className="nav-item mb-2">
            <a href="/listaservicio" className="nav-link text-white d-flex align-items-center">
              🔧 Servicios
            </a>
          </li>
          <li className="nav-item mb-2">
            <a href="/listaEmpleado" className="nav-link text-white d-flex align-items-center">
              👨‍💼 Empleados
            </a>
          </li>
          <li className="nav-item mb-2">
            <a href="/listaCargos" className="nav-link text-white d-flex align-items-center">
              💼 Cargos
            </a>
          </li>
          <li className="nav-item mb-2">
            <a href="/listaFactura" className="nav-link text-white d-flex align-items-center">
              🧾 Facturas
            </a>
          </li>
        </ul>
      </div>

      {/* Contenido principal */}
      <div className="flex-grow-1 p-4 bg-light" style={{ overflowY: "auto" }}>
        <div className="mb-4">
          <h2 className="text-primary fw-bold">📊 Dashboard Taller Mecánico</h2>
          <p className="text-muted">Resumen general de tu negocio</p>
        </div>

        {/* Cards de resumen */}
        <div className="row mb-4">
          <div className="col-md-3">
            <div className="card border-0 shadow-sm h-100">
              <div className="card-body text-center bg-primary text-white rounded">
                <div className="fs-1 mb-2">👥</div>
                <h6 className="card-title">Clientes</h6>
                <h3 className="fw-bold">{totales.clientes.toLocaleString()}</h3>
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="card border-0 shadow-sm h-100">
              <div className="card-body text-center bg-success text-white rounded">
                <div className="fs-1 mb-2">🏍️</div>
                <h6 className="card-title">Motocicletas</h6>
                <h3 className="fw-bold">{totales.motos.toLocaleString()}</h3>
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="card border-0 shadow-sm h-100">
              <div className="card-body text-center bg-warning text-white rounded">
                <div className="fs-1 mb-2">🔧</div>
                <h6 className="card-title">Servicios</h6>
                <h3 className="fw-bold">{totales.servicios.toLocaleString()}</h3>
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="card border-0 shadow-sm h-100">
              <div className="card-body text-center bg-danger text-white rounded">
                <div className="fs-1 mb-2">💰</div>
                <h6 className="card-title">Ingresos Totales</h6>
                <h3 className="fw-bold">${totales.ingresos.toLocaleString()}</h3>
              </div>
            </div>
          </div>
        </div>

        {/* Gráficos */}
        <div className="row">
          {/* Gráfico de ingresos por mes */}
          <div className="col-md-8">
            <div className="card border-0 shadow-sm mb-4">
              <div className="card-header bg-white border-0">
                <h5 className="card-title text-primary mb-0">
                  📈 Ingresos por Mes
                </h5>
              </div>
              <div className="card-body">
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={datosGraficos}>
                    <defs>
                      <linearGradient id="colorIngresos" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#0088FE" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#0088FE" stopOpacity={0.1}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis 
                      dataKey="mes" 
                      tick={{ fontSize: 12 }}
                      axisLine={{ stroke: '#e0e0e0' }}
                    />
                    <YAxis 
                      tick={{ fontSize: 12 }}
                      axisLine={{ stroke: '#e0e0e0' }}
                      tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
                    />
                    <Tooltip 
                      formatter={(value) => [`$${Number(value).toLocaleString()}`, 'Ingresos']}
                      labelStyle={{ color: '#333' }}
                      contentStyle={{ 
                        backgroundColor: 'white', 
                        border: '1px solid #e0e0e0',
                        borderRadius: '8px',
                        boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                      }}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="ingresos" 
                      stroke="#0088FE" 
                      strokeWidth={3}
                      fillOpacity={1} 
                      fill="url(#colorIngresos)" 
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Gráfico de servicios más populares */}
          <div className="col-md-4">
            <div className="card border-0 shadow-sm mb-4">
              <div className="card-header bg-white border-0">
                <h5 className="card-title text-primary mb-0">
                  🥧 Top Servicios
                </h5>
              </div>
              <div className="card-body">
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={serviciosData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ servicio, percent }) => 
                        `${servicio.slice(0, 10)}... ${(percent * 100).toFixed(0)}%`
                      }
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="cantidad"
                    >
                      {serviciosData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip 
                      formatter={(value, name, props) => [
                        `${value} servicios`, 
                        props.payload.servicio
                      ]}
                      contentStyle={{ 
                        backgroundColor: 'white', 
                        border: '1px solid #e0e0e0',
                        borderRadius: '8px',
                        boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>

        {/* Gráfico de cantidad de facturas */}
        <div className="row">
          <div className="col-md-6">
            <div className="card border-0 shadow-sm mb-4">
              <div className="card-header bg-white border-0">
                <h5 className="card-title text-primary mb-0">
                  📊 Facturas por Mes
                </h5>
              </div>
              <div className="card-body">
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={datosGraficos}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis 
                      dataKey="mes" 
                      tick={{ fontSize: 12 }}
                      axisLine={{ stroke: '#e0e0e0' }}
                    />
                    <YAxis 
                      tick={{ fontSize: 12 }}
                      axisLine={{ stroke: '#e0e0e0' }}
                    />
                    <Tooltip 
                      formatter={(value) => [`${value}`, 'Facturas']}
                      contentStyle={{ 
                        backgroundColor: 'white', 
                        border: '1px solid #e0e0e0',
                        borderRadius: '8px',
                        boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                      }}
                    />
                    <Bar 
                      dataKey="facturas" 
                      fill="#00C49F" 
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Lista de servicios con detalles */}
          <div className="col-md-6">
            <div className="card border-0 shadow-sm mb-4">
              <div className="card-header bg-white border-0">
                <h5 className="card-title text-primary mb-0">
                  📋 Detalle de Servicios
                </h5>
              </div>
              <div className="card-body">
                <div className="table-responsive">
                  <table className="table table-hover">
                    <thead className="table-light">
                      <tr>
                        <th>Servicio</th>
                        <th className="text-center">Cantidad</th>
                        <th className="text-end">Ingresos</th>
                      </tr>
                    </thead>
                    <tbody>
                      {serviciosData.map((servicio, index) => (
                        <tr key={index}>
                          <td>
                            <div className="d-flex align-items-center">
                              <div 
                                className="rounded-circle me-2" 
                                style={{
                                  width: '12px', 
                                  height: '12px', 
                                  backgroundColor: COLORS[index % COLORS.length]
                                }}
                              ></div>
                              <small>{servicio.servicio}</small>
                            </div>
                          </td>
                          <td className="text-center">
                            <span className="badge bg-primary">{servicio.cantidad}</span>
                          </td>
                          <td className="text-end fw-bold">
                            ${servicio.ingresos.toLocaleString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer informativo */}
        <div className="text-center text-muted mt-4">
          <small>
            ℹ️ Los datos se actualizan automáticamente. Última actualización: {new Date().toLocaleString()}
          </small>
        </div>
      </div>
    </div>
  );
};

export default DashboardMecanico;