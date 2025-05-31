
using ApiTaller.Dpt;
using ApiTaller.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace WebAPICRUDL.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class EmpleadoController : ControllerBase
    {
        private readonly SistemaMecanicoContext dbContext;

        public EmpleadoController(SistemaMecanicoContext _dbContext)
        {
            dbContext = _dbContext;
        }

        [HttpGet]
        [Route("Lista")]
        public async Task<IActionResult> Get()
        {
            var listaEmpleados = await dbContext.Empleados.ToListAsync();
            return StatusCode(StatusCodes.Status200OK, listaEmpleados);
        }

        [HttpGet]
        [Route("Obtener/{id:int}")]
        public async Task<IActionResult> Get(int id)
        {
            var empleado = await dbContext.Empleados.FirstOrDefaultAsync(e => e.IdEmpleado == id);
            return StatusCode(StatusCodes.Status200OK, empleado);
        }

        [HttpPost]
        [Route("Nuevo")]
        public async Task<IActionResult> Nuevo([FromBody] EmpleadoDpto dto)
        {
            var nuevoEmpleado = new Empleado
            {
                Nombres = dto.Nombres,
                Apellidos = dto.Apellidos,
                Edad = dto.Edad,
                Dui = dto.Dui,
                Telefono = dto.Telefono,
                IdCargo = dto.IdCargo
            };

            await dbContext.Empleados.AddAsync(nuevoEmpleado);
            await dbContext.SaveChangesAsync();

            return StatusCode(StatusCodes.Status200OK, new { mensaje = "ok", idEmpleado = nuevoEmpleado.IdEmpleado });
        }

        [HttpPut]
        [Route("Editar")]
        public async Task<IActionResult> Editar([FromBody] EmpleadoDpto dto)
        {
            try
            {
                if (dto == null)
                {
                    return BadRequest(new { mensaje = "El objeto empleado no puede ser nulo" });
                }

                var empleadoExistente = await dbContext.Empleados.FindAsync(dto.IdEmpleado);

                if (empleadoExistente == null)
                {
                    return NotFound(new { mensaje = "Empleado no encontrado" });
                }

                empleadoExistente.Nombres = dto.Nombres;
                empleadoExistente.Apellidos = dto.Apellidos;
                empleadoExistente.Edad = dto.Edad;
                empleadoExistente.Dui = dto.Dui;
                empleadoExistente.Telefono = dto.Telefono;
                empleadoExistente.IdCargo = dto.IdCargo;

                await dbContext.SaveChangesAsync();

                return Ok(new { mensaje = "Empleado actualizado correctamente" });
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError,
                    new { mensaje = "Error al actualizar el empleado", error = ex.Message });
            }
        }

        [HttpDelete]
        [Route("Eliminar/{id:int}")]
        public async Task<IActionResult> Eliminar(int id)
        {
            var empleado = await dbContext.Empleados.FirstOrDefaultAsync(e => e.IdEmpleado == id);

            if (empleado == null)
            {
                return NotFound(new { mensaje = "Empleado no encontrado" });
            }

            dbContext.Empleados.Remove(empleado);
            await dbContext.SaveChangesAsync();

            return StatusCode(StatusCodes.Status200OK, new { mensaje = "Empleado eliminado" });
        }
    }
}
