using System;
using System.Collections.Generic;

namespace ApiTaller.Models;

public partial class Empleado
{
    public int IdEmpleado { get; set; }

    public string? Nombres { get; set; }

    public string? Apellidos { get; set; }

    public int? Edad { get; set; }

    public string? Dui { get; set; }

    public string? Telefono { get; set; }

    public int? IdCargo { get; set; }

    public virtual Cargo? IdCargoNavigation { get; set; }

    public virtual ICollection<Servicio> Servicios { get; set; } = new List<Servicio>();
}
