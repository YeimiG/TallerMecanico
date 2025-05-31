namespace ApiTaller.Dpt
{
    public class FacturaDpto
    {
        public int IdFactura { get; set; }

        public DateOnly? FechaFactura { get; set; }

        public int? IdServicio { get; set; }

        public decimal? TotalPago { get; set; }
    }
}
