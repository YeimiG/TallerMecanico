using ApiTaller.Models;

namespace ApiTaller.Dpt
{
    public class EmpleadoDpto
    {
        public int IdEmpleado { get; set; }

        public string? Nombres { get; set; }

        public string? Apellidos { get; set; }

        public int? Edad { get; set; }

        public string? Dui { get; set; }

        public string? Telefono { get; set; }

        public int? IdCargo { get; set; }
    }
}
