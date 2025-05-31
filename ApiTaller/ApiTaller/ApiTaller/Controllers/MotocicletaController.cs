using ApiTaller.Dpt;
using ApiTaller.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;


namespace WebAPICRUDL.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class MotocicletaController : ControllerBase
    {
        private readonly SistemaMecanicoContext dbContext;
        public MotocicletaController(SistemaMecanicoContext _dbContext)
        {
            dbContext = _dbContext;
        }
        [HttpGet]
        [Route("Lista")]
        public async Task<IActionResult> Get()
        {
            var listaMoto = await dbContext.Motocicleta.ToListAsync();
            return StatusCode(StatusCodes.Status200OK, listaMoto);
        }
        [HttpGet]
        [Route("Obtener/{id:int}")]
        public async Task<IActionResult> Get(int id)
        {
            var moto = await dbContext.Motocicleta.FirstOrDefaultAsync(c => c.IdMotocicleta == id);
            return StatusCode(StatusCodes.Status200OK, moto);
        }
        [HttpPost]
        [Route("Nuevo")]
        public async Task<IActionResult> Nuevo([FromBody] MotocicletaDpto dto)
        {
            try
            {
                // Validaciones...

                var nuevoMotocicleta = new Motocicletum
                {
                    Marca = dto.Marca,
                    Modelo = dto.Modelo,
                    Anio = dto.Anio,
                    IdCliente = dto.IdCliente
                };

                await dbContext.Motocicleta.AddAsync(nuevoMotocicleta);
                await dbContext.SaveChangesAsync();

                return Ok(new
                {
                    success = true,
                    message = "Moto registrada",
                    data = new
                    {
                        idMotocicleta = nuevoMotocicleta.IdMotocicleta,
                        idCliente = nuevoMotocicleta.IdCliente
                    }
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    success = false,
                    message = "Error interno",
                    error = ex.Message
                });
            }
        }


        [HttpPut]
        [Route("Editar")]
        public async Task<IActionResult> Editar([FromBody] MotocicletaDpto dto)
        {
            try
            {
                // Validar que el DTO no sea nulo
                if (dto == null)
                {
                    return BadRequest(new { mensaje = "El objeto cliente no puede ser nulo" });
                }

                // Buscar el cliente existente
                var motocicletaExistente = await dbContext.Motocicleta.FindAsync(dto.IdMotocicleta);

                if (motocicletaExistente == null)
                {
                    return NotFound(new { mensaje = "Moto no encontrado" });
                }

                // Actualizar solo las propiedades permitidas
                motocicletaExistente.Marca = dto.Marca;
                motocicletaExistente.Modelo = dto.Modelo;
                motocicletaExistente.Anio = dto.Anio;
                motocicletaExistente.IdCliente = dto.IdCliente;

                // No es necesario llamar a Update() porque EF ya está rastreando el objeto
                await dbContext.SaveChangesAsync();

                return Ok(new { mensaje = "Moto actualizado correctamente" });
            }
            catch (Exception ex)
            {
                // Loggear el error si tienes un sistema de logging
                return StatusCode(StatusCodes.Status500InternalServerError,
                    new { mensaje = "Error al actualizar el Moto", error = ex.Message });
            }
        }


        [HttpDelete]
        [Route("Eliminar/{id:int}")]
        public async Task<IActionResult> Eliminar(int id)
        {
            var moto = await dbContext.Motocicleta.FirstOrDefaultAsync(c => c.IdMotocicleta == id);

            if (moto == null)
            {
                return NotFound(new { mensaje = "Moto no encontrado" });
            }

            dbContext.Motocicleta.Remove(moto);
            await dbContext.SaveChangesAsync();

            return StatusCode(StatusCodes.Status200OK, new { mensaje = "Motocicleta eliminado" });
        }

    }
}