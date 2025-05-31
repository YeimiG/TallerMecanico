using System;
using System.Collections.Generic;

namespace ApiTaller.Models;

public partial class Cliente
{
    public int IdCliente { get; set; }

    public string? NombreCompleto { get; set; }

    public string? Telefono { get; set; }

    public string? Correo { get; set; }

    public string? Direccion { get; set; }

    public virtual ICollection<Motocicletum> Motocicleta { get; set; } = new List<Motocicletum>();
}
