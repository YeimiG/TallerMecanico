using ApiTaller.Dpt;
using ApiTaller.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace WebAPICRUDL.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CargoController : ControllerBase
    {
        private readonly SistemaMecanicoContext dbContext;

        public CargoController(SistemaMecanicoContext _dbContext)
        {
            dbContext = _dbContext;
        }

        [HttpGet]
        [Route("Lista")]
        public async Task<IActionResult> Get()
        {
            var listaCargos = await dbContext.Cargos.ToListAsync();
            return StatusCode(StatusCodes.Status200OK, listaCargos);
        }

        [HttpGet]
        [Route("Obtener/{id:int}")]
        public async Task<IActionResult> Get(int id)
        {
            var cargo = await dbContext.Cargos
                .Include(c => c.Empleados)
                .FirstOrDefaultAsync(c => c.IdCargo == id);

            if (cargo == null)
            {
                return NotFound(new { mensaje = "Cargo no encontrado" });
            }

            return StatusCode(StatusCodes.Status200OK, cargo);
        }

        [HttpPost]
        [Route("Nuevo")]
        public async Task<IActionResult> Nuevo([FromBody] CargoDpto dto)
        {
            var nuevoCargo = new Cargo
            {
                Cargo1 = dto.Cargo1
            };

            await dbContext.Cargos.AddAsync(nuevoCargo);
            await dbContext.SaveChangesAsync();

            return StatusCode(StatusCodes.Status200OK, new { mensaje = "ok", idCargo = nuevoCargo.IdCargo });
        }

        [HttpPut]
        [Route("Editar")]
        public async Task<IActionResult> Editar([FromBody] CargoDpto dto)
        {
            try
            {
                if (dto == null)
                    return BadRequest(new { mensaje = "El objeto cargo no puede ser nulo" });

                var cargoExistente = await dbContext.Cargos.FindAsync(dto.IdCargo);

                if (cargoExistente == null)
                    return NotFound(new { mensaje = "Cargo no encontrado" });

                cargoExistente.Cargo1 = dto.Cargo1;

                await dbContext.SaveChangesAsync();

                return Ok(new { mensaje = "Cargo actualizado correctamente" });
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError,
                    new { mensaje = "Error al actualizar el cargo", error = ex.Message });
            }
        }

        [HttpDelete]
        [Route("Eliminar/{id:int}")]
        public async Task<IActionResult> Eliminar(int id)
        {
            var cargo = await dbContext.Cargos.FirstOrDefaultAsync(c => c.IdCargo == id);

            if (cargo == null)
            {
                return NotFound(new { mensaje = "Cargo no encontrado" });
            }

            dbContext.Cargos.Remove(cargo);
            await dbContext.SaveChangesAsync();

            return StatusCode(StatusCodes.Status200OK, new { mensaje = "Cargo eliminado" });
        }
    }
}

