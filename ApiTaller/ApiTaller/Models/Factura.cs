using System;
using System.Collections.Generic;

namespace ApiTaller.Models;

public partial class Factura
{
    public int IdFactura { get; set; }

    public DateOnly? FechaFactura { get; set; }

    public int? IdServicio { get; set; }

    public decimal? TotalPago { get; set; }

    public virtual Servicio? IdServicioNavigation { get; set; }
}
