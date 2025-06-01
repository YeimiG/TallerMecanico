import { BrowserRouter, Route, Routes } from "react-router-dom"
import { EditarCliente } from "./components/EditarCliente"
import { NuevoCliente } from "./components/NuevoCliente" 
import { ListaCliente } from "./components/ListaCliente"
import { ListaMoto } from "./components/ListaMoto"
import { ListaServicio } from "./components/ListaServicio"
import { NuevaMoto } from "./components/NuevoMoto"

import Dashboard from "./components/DashboardMecanico"
import { EditarMoto } from "./components/EditarMoto"
import { NuevoServicio } from "./components/NuevoServicio"
import { ListaEmpleado } from "./components/ListaEmpleados"
import { NuevoCargo } from "./components/NuevoCargo"
import { ListaCargos } from "./components/ListaCargo"
import { NuevoEmpleado } from "./components/NuevoEmpleado"
import { ListaFactura } from "./components/ListaFactura"
import Login from "./components/Login"
import Dashboard2 from "./components/DashboardRecepcion"
import { ListaCliente2 } from "./components/ListaCliente2"
import { ListaMoto2 } from "./components/ListaMoto2"
import { NuevoCliente2 } from "./components/NuevoCliente2"
import { NuevaMoto2 } from "./components/NuevoMoto2"
import { ListaServicio2 } from "./components/ListaServicio2"
import { NuevoServicio2 } from "./components/NuevoServicio2"

function App() {

  return (
    <BrowserRouter>
      <Routes>
       <Route path="/" element={<Login />} />
        <Route path="/listacliente" element={<ListaCliente />} />
        <Route path="/editarcliente/:id" element={<EditarCliente />} />
        <Route path="/nuevocliente" element={<NuevoCliente />} />
        <Route path="/listamoto" element={<ListaMoto />} />
        <Route path="/nuevamoto" element={<NuevaMoto />} />
        <Route path="/editarmoto/:id" element={<EditarMoto />} />
        <Route path="/listaservicio" element={<ListaServicio />} />
        <Route path="/nuevoservicio/:idMotocicleta" element={<NuevoServicio />} />
        <Route path="/listaEmpleado" element={<ListaEmpleado />} />
        <Route path="/nuevoempleado" element={<NuevoEmpleado />} />
        <Route path="/listaCargos" element={<ListaCargos />} />
        <Route path="/nuevocargo" element={<NuevoCargo />} />
        <Route path="/listaFactura" element={<ListaFactura />} />
        <Route path="/dashboard" element={<Dashboard />} />

        //** Recepcion rutas */
        <Route path="/dashboard2" element={<Dashboard2 />} />
        <Route path="/listacliente2" element={<ListaCliente2 />} />
        <Route path="/editarcliente/:id" element={<EditarCliente />} />
        <Route path="/nuevocliente2" element={<NuevoCliente2 />} />
        <Route path="/listamoto2" element={<ListaMoto2 />} />
        <Route path="/nuevamoto2" element={<NuevaMoto2 />} />
        <Route path="/editarmoto/:id" element={<EditarMoto />} />
        <Route path="/listaservicio2" element={<ListaServicio2 />} />
        <Route path="/nuevoservicio2/:idMotocicleta" element={<NuevoServicio2 />} />
        <Route path="/listaFactura" element={<ListaFactura />} />

      </Routes>
    </BrowserRouter>
  )
}

export default App
