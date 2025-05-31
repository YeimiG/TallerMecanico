using ApiTaller.Dpt;
using ApiTaller.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace WebAPICRUDL.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ServicioController : ControllerBase
    {
        private readonly SistemaMecanicoContext dbContext;

        public ServicioController(SistemaMecanicoContext _dbContext)
        {
            dbContext = _dbContext;
        }

        [HttpGet]
        [Route("Lista")]
        public async Task<IActionResult> Get()
        {
            var listaServicios = await dbContext.Servicios
    .Include(s => s.IdEmpleadoNavigation)
    .Include(s => s.IdMotocicletaNavigation)
    .Select(s => new {
        s.IdServicio,
        Servicio1 = s.Servicio1,
        s.Precio,
        s.FechaEntrada,
        Empleado = s.IdEmpleadoNavigation == null ? null : new
        {
            s.IdEmpleadoNavigation.IdEmpleado,
            s.IdEmpleadoNavigation.Nombres
        },
        Motocicleta = s.IdMotocicletaNavigation == null ? null : new
        {
            s.IdMotocicletaNavigation.IdMotocicleta,
            s.IdMotocicletaNavigation.Modelo
        }
    })
    .ToListAsync();

            return Ok(listaServicios);
        }


        [HttpGet]
        [Route("Obtener/{id:int}")]
        public async Task<IActionResult> Get(int id)
        {
            var servicio = await dbContext.Servicios
                .Include(s => s.IdEmpleadoNavigation)
                .Include(s => s.IdMotocicletaNavigation)
                .FirstOrDefaultAsync(s => s.IdServicio == id);

            if (servicio == null)
            {
                return NotFound(new { mensaje = "Servicio no encontrado" });
            }

            return StatusCode(StatusCodes.Status200OK, servicio);
        }

        [HttpPost]
        [Route("Nuevo")]
        public async Task<IActionResult> Nuevo([FromBody] ServicioDpto dto)
        {
            var nuevoServicio = new Servicio
            {
                Servicio1 = dto.Servicio1,
                Precio = dto.Precio,
                FechaEntrada = dto.FechaEntrada,
                IdMotocicleta = dto.IdMotocicleta,
                IdEmpleado = dto.IdEmpleado
            };

            await dbContext.Servicios.AddAsync(nuevoServicio);
            await dbContext.SaveChangesAsync();

            return StatusCode(StatusCodes.Status200OK, new { mensaje = "ok", idServicio = nuevoServicio.IdServicio });
        }

        [HttpPut]
        [Route("Editar")]
        public async Task<IActionResult> Editar([FromBody] ServicioDpto dto)
        {
            try
            {
                if (dto == null)
                {
                    return BadRequest(new { mensaje = "El objeto servicio no puede ser nulo" });
                }

                var servicioExistente = await dbContext.Servicios.FindAsync(dto.IdServicio);

                if (servicioExistente == null)
                {
                    return NotFound(new { mensaje = "Servicio no encontrado" });
                }

                servicioExistente.Servicio1 = dto.Servicio1;
                servicioExistente.Precio = dto.Precio;
                servicioExistente.FechaEntrada = dto.FechaEntrada;
                servicioExistente.IdMotocicleta = dto.IdMotocicleta;
                servicioExistente.IdEmpleado = dto.IdEmpleado;

                await dbContext.SaveChangesAsync();

                return Ok(new { mensaje = "Servicio actualizado correctamente" });
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError,
                    new { mensaje = "Error al actualizar el servicio", error = ex.Message });
            }
        }

        [HttpDelete]
        [Route("Eliminar/{id:int}")]
        public async Task<IActionResult> Eliminar(int id)
        {
            var servicio = await dbContext.Servicios.FirstOrDefaultAsync(s => s.IdServicio == id);

            if (servicio == null)
            {
                return NotFound(new { mensaje = "Servicio no encontrado" });
            }

            dbContext.Servicios.Remove(servicio);
            await dbContext.SaveChangesAsync();

            return StatusCode(StatusCodes.Status200OK, new { mensaje = "Servicio eliminado" });
        }
    }
}

