using System;
using System.Collections.Generic;

namespace ApiTaller.Models;

public partial class Servicio
{
    public int IdServicio { get; set; }

    public string? Servicio1 { get; set; }

    public decimal? Precio { get; set; }

    public DateOnly? FechaEntrada { get; set; }

    public int? IdMotocicleta { get; set; }

    public int? IdEmpleado { get; set; }

    public virtual ICollection<Factura> Facturas { get; set; } = new List<Factura>();

    public virtual Empleado? IdEmpleadoNavigation { get; set; }

    public virtual Motocicletum? IdMotocicletaNavigation { get; set; }
}
