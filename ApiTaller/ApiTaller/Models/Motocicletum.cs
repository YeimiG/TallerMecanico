using System;
using System.Collections.Generic;

namespace ApiTaller.Models;

public partial class Motocicletum
{
    public int IdMotocicleta { get; set; }

    public string? Marca { get; set; }

    public string? Modelo { get; set; }

    public int? Anio { get; set; }

    public int? IdCliente { get; set; }

    public virtual Cliente? IdClienteNavigation { get; set; }

    public virtual ICollection<Servicio> Servicios { get; set; } = new List<Servicio>();
}
