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

function App() {

  return (
    <BrowserRouter>
      <Routes>
       <Route path="/" element={<Dashboard />} />
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
      </Routes>
    </BrowserRouter>
  )
}

export default App
