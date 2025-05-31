using ApiTaller.Dpt;
using ApiTaller.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;


namespace WebAPICRUDL.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ClienteController : ControllerBase
    {
        private readonly SistemaMecanicoContext dbContext;
        public ClienteController(SistemaMecanicoContext _dbContext)
        {
            dbContext = _dbContext;
        }
        [HttpGet]
        [Route("Lista")]
        public async Task<IActionResult> Get()
        {
            var listaCliente = await dbContext.Clientes.ToListAsync();
            return StatusCode(StatusCodes.Status200OK, listaCliente);
        }
        [HttpGet]
        [Route("Obtener/{id:int}")]
        public async Task<IActionResult> Get(int id)
        {
            var cliente = await dbContext.Clientes.FirstOrDefaultAsync(c => c.IdCliente == id);
            return StatusCode(StatusCodes.Status200OK, cliente);
        }
        [HttpPost]
        [Route("Nuevo")]
        public async Task<IActionResult> Nuevo([FromBody] ClienteDpto dto)
        {
            var nuevoCliente = new Cliente
            {
                NombreCompleto = dto.NombreCompleto,
                Telefono = dto.Telefono,
                Correo = dto.Correo,
                Direccion = dto.Direccion
            };

            await dbContext.Clientes.AddAsync(nuevoCliente);
            await dbContext.SaveChangesAsync();

            return StatusCode(StatusCodes.Status200OK, new { mensaje = "ok", idCliente = nuevoCliente.IdCliente });
        }


        [HttpPut]
        [Route("Editar")]
        public async Task<IActionResult> Editar([FromBody] ClienteDpto dto)
        {
            try
            {
                // Validar que el DTO no sea nulo
                if (dto == null)
                {
                    return BadRequest(new { mensaje = "El objeto cliente no puede ser nulo" });
                }

                // Buscar el cliente existente
                var clienteExistente = await dbContext.Clientes.FindAsync(dto.IdCliente);

                if (clienteExistente == null)
                {
                    return NotFound(new { mensaje = "Cliente no encontrado" });
                }

                // Actualizar solo las propiedades permitidas
                clienteExistente.NombreCompleto = dto.NombreCompleto;
                clienteExistente.Telefono = dto.Telefono;
                clienteExistente.Correo = dto.Correo;
                clienteExistente.Direccion = dto.Direccion;

                // No es necesario llamar a Update() porque EF ya está rastreando el objeto
                await dbContext.SaveChangesAsync();

                return Ok(new { mensaje = "Cliente actualizado correctamente" });
            }
            catch (Exception ex)
            {
                // Loggear el error si tienes un sistema de logging
                return StatusCode(StatusCodes.Status500InternalServerError,
                    new { mensaje = "Error al actualizar el cliente", error = ex.Message });
            }
        }


        [HttpDelete]
        [Route("Eliminar/{id:int}")]
        public async Task<IActionResult> Eliminar(int id)
        {
            var cliente = await dbContext.Clientes.FirstOrDefaultAsync(c => c.IdCliente == id);

            if (cliente == null)
            {
                return NotFound(new { mensaje = "Cliente no encontrado" });
            }

            dbContext.Clientes.Remove(cliente);
            await dbContext.SaveChangesAsync();

            return StatusCode(StatusCodes.Status200OK, new { mensaje = "Cliente eliminado" });
        }

    }
}