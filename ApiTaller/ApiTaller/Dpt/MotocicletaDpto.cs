using ApiTaller.Models;

namespace ApiTaller.Dpt
{
    public class MotocicletaDpto
    {

        public int IdMotocicleta { get; set; }

        public string? Marca { get; set; }

        public string? Modelo { get; set; }

        public int? Anio { get; set; }

        public int? IdCliente { get; set; }
    }
}
