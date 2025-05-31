namespace ApiTaller.Dpt
{
    public class ReporteFacturasDpto
    {
        public int IdFactura { get; set; }
        public DateOnly FechaFactura { get; set; }
        public string NombreCliente { get; set; }
        public string TelefonoCliente { get; set; }
        public string MarcaMoto { get; set; }
        public string ModeloMoto { get; set; }
        public string DescripcionServicio { get; set; }
        public decimal PrecioServicio { get; set; }
        public decimal TotalPago { get; set; }
    }
}
