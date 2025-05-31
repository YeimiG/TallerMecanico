using ApiTaller.Dpt;
using ApiTaller.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace WebAPICRUDL.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class FacturaController : ControllerBase
    {
        private readonly SistemaMecanicoContext dbContext;

        public FacturaController(SistemaMecanicoContext _dbContext)
        {
            dbContext = _dbContext;
        }

        [HttpGet]
        [Route("Lista")]
        public async Task<IActionResult> Get()
        {
            var listaFacturas = await dbContext.Facturas
                .Include(f => f.IdServicioNavigation)
                .ToListAsync();

            return StatusCode(StatusCodes.Status200OK, listaFacturas);
        }

        [HttpGet]
        [Route("Obtener/{id:int}")]
        public async Task<IActionResult> Get(int id)
        {
            var factura = await dbContext.Facturas
                .Include(f => f.IdServicioNavigation)
                .FirstOrDefaultAsync(f => f.IdFactura == id);

            if (factura == null)
            {
                return NotFound(new { mensaje = "Factura no encontrada" });
            }

            return StatusCode(StatusCodes.Status200OK, factura);
        }

        [HttpPost]
        [Route("Nuevo")]
        public async Task<IActionResult> Nuevo([FromBody] FacturaDpto dto)
        {
            var nuevaFactura = new Factura
            {
                FechaFactura = dto.FechaFactura,
                IdServicio = dto.IdServicio,
                TotalPago = dto.TotalPago
            };

            await dbContext.Facturas.AddAsync(nuevaFactura);
            await dbContext.SaveChangesAsync();

            return StatusCode(StatusCodes.Status200OK, new { mensaje = "ok", idFactura = nuevaFactura.IdFactura });
        }

        [HttpPut]
        [Route("Editar")]
        public async Task<IActionResult> Editar([FromBody] FacturaDpto dto)
        {
            try
            {
                if (dto == null)
                    return BadRequest(new { mensaje = "El objeto factura no puede ser nulo" });

                var facturaExistente = await dbContext.Facturas.FindAsync(dto.IdFactura);

                if (facturaExistente == null)
                    return NotFound(new { mensaje = "Factura no encontrada" });

                facturaExistente.FechaFactura = dto.FechaFactura;
                facturaExistente.IdServicio = dto.IdServicio;
                facturaExistente.TotalPago = dto.TotalPago;

                await dbContext.SaveChangesAsync();

                return Ok(new { mensaje = "Factura actualizada correctamente" });
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError,
                    new { mensaje = "Error al actualizar la factura", error = ex.Message });
            }
        }

        [HttpDelete]
        [Route("Eliminar/{id:int}")]
        public async Task<IActionResult> Eliminar(int id)
        {
            var factura = await dbContext.Facturas.FirstOrDefaultAsync(f => f.IdFactura == id);

            if (factura == null)
            {
                return NotFound(new { mensaje = "Factura no encontrada" });
            }

            dbContext.Facturas.Remove(factura);
            await dbContext.SaveChangesAsync();

            return StatusCode(StatusCodes.Status200OK, new { mensaje = "Factura eliminada" });
        }
        [HttpGet("Reporte/{id}")]
        public async Task<IActionResult> ObtenerReporteFactura(int id)
        {
            var reporte = await (from f in dbContext.Facturas
                                 join s in dbContext.Servicios on f.IdServicio equals s.IdServicio
                                 join m in dbContext.Motocicleta on s.IdMotocicleta equals m.IdMotocicleta
                                 join c in dbContext.Clientes on m.IdCliente equals c.IdCliente
                                 where f.IdFactura == id
                                 select new ReporteFacturasDpto
                                 {
                                     IdFactura = f.IdFactura,
                                     FechaFactura = f.FechaFactura ?? DateOnly.FromDateTime(DateTime.Today),
                                     NombreCliente = c.NombreCompleto,
                                     TelefonoCliente = c.Telefono,
                                     MarcaMoto = m.Marca,
                                     ModeloMoto = m.Modelo,
                                     DescripcionServicio = s.Servicio1,
                                     PrecioServicio = s.Precio ?? 0,
                                     TotalPago = f.TotalPago ?? 0
                                 }).FirstOrDefaultAsync();

            if (reporte == null)
                return NotFound(new { mensaje = "Reporte no encontrado" });

            return Ok(reporte);
        }

    }
}

