using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;

namespace ApiTaller.Models;

public partial class SistemaMecanicoContext : DbContext
{
    public SistemaMecanicoContext()
    {
    }

    public SistemaMecanicoContext(DbContextOptions<SistemaMecanicoContext> options)
        : base(options)
    {
    }

    public virtual DbSet<Cargo> Cargos { get; set; }

    public virtual DbSet<Cliente> Clientes { get; set; }

    public virtual DbSet<Empleado> Empleados { get; set; }

    public virtual DbSet<Factura> Facturas { get; set; }

    public virtual DbSet<Motocicletum> Motocicleta { get; set; }

    public virtual DbSet<Servicio> Servicios { get; set; }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
    {
        
    }


    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Cargo>(entity =>
        {
            entity.HasKey(e => e.IdCargo).HasName("PK__Cargos__3D0E29B8B333F371");

            entity.Property(e => e.IdCargo).HasColumnName("idCargo");
            entity.Property(e => e.Cargo1)
                .HasMaxLength(50)
                .IsUnicode(false)
                .HasColumnName("cargo");
        });

        modelBuilder.Entity<Cliente>(entity =>
        {
            entity.HasKey(e => e.IdCliente).HasName("PK__Cliente__885457EE16E39B30");

            entity.ToTable("Cliente");

            entity.Property(e => e.IdCliente).HasColumnName("idCliente");
            entity.Property(e => e.Correo)
                .HasMaxLength(100)
                .IsUnicode(false)
                .HasColumnName("correo");
            entity.Property(e => e.Direccion)
                .HasMaxLength(200)
                .IsUnicode(false)
                .HasColumnName("direccion");
            entity.Property(e => e.NombreCompleto)
                .HasMaxLength(100)
                .IsUnicode(false)
                .HasColumnName("nombreCompleto");
            entity.Property(e => e.Telefono)
                .HasMaxLength(15)
                .IsUnicode(false)
                .HasColumnName("telefono");
        });

        modelBuilder.Entity<Empleado>(entity =>
        {
            entity.HasKey(e => e.IdEmpleado).HasName("PK__Empleado__5295297CA9F45373");

            entity.ToTable("Empleado");

            entity.Property(e => e.IdEmpleado).HasColumnName("idEmpleado");
            entity.Property(e => e.Apellidos)
                .HasMaxLength(50)
                .IsUnicode(false)
                .HasColumnName("apellidos");
            entity.Property(e => e.Dui)
                .HasMaxLength(10)
                .IsUnicode(false)
                .HasColumnName("DUI");
            entity.Property(e => e.Edad).HasColumnName("edad");
            entity.Property(e => e.IdCargo).HasColumnName("idCargo");
            entity.Property(e => e.Nombres)
                .HasMaxLength(50)
                .IsUnicode(false)
                .HasColumnName("nombres");
            entity.Property(e => e.Telefono)
                .HasMaxLength(15)
                .IsUnicode(false)
                .HasColumnName("telefono");

            entity.HasOne(d => d.IdCargoNavigation).WithMany(p => p.Empleados)
                .HasForeignKey(d => d.IdCargo)
                .HasConstraintName("FK__Empleado__idCarg__3E52440B");
        });

        modelBuilder.Entity<Factura>(entity =>
        {
            entity.HasKey(e => e.IdFactura).HasName("PK__Factura__3CD5687EE6DFA4ED");

            entity.ToTable("Factura");

            entity.Property(e => e.IdFactura).HasColumnName("idFactura");
            entity.Property(e => e.FechaFactura).HasColumnName("fechaFactura");
            entity.Property(e => e.IdServicio).HasColumnName("idServicio");
            entity.Property(e => e.TotalPago)
                .HasColumnType("decimal(10, 2)")
                .HasColumnName("totalPago");

            entity.HasOne(d => d.IdServicioNavigation).WithMany(p => p.Facturas)
                .HasForeignKey(d => d.IdServicio)
                .HasConstraintName("FK__Factura__idServi__44FF419A");
        });

        modelBuilder.Entity<Motocicletum>(entity =>
        {
            entity.HasKey(e => e.IdMotocicleta).HasName("PK__Motocicl__EE98DCEB0890C22A");

            entity.Property(e => e.IdMotocicleta).HasColumnName("idMotocicleta");
            entity.Property(e => e.Anio).HasColumnName("anio");
            entity.Property(e => e.IdCliente).HasColumnName("idCliente");
            entity.Property(e => e.Marca)
                .HasMaxLength(50)
                .IsUnicode(false)
                .HasColumnName("marca");
            entity.Property(e => e.Modelo)
                .HasMaxLength(50)
                .IsUnicode(false)
                .HasColumnName("modelo");

            entity.HasOne(d => d.IdClienteNavigation).WithMany(p => p.Motocicleta)
                .HasForeignKey(d => d.IdCliente)
                .HasConstraintName("FK__Motocicle__idCli__398D8EEE");
        });

        modelBuilder.Entity<Servicio>(entity =>
        {
            entity.HasKey(e => e.IdServicio).HasName("PK__Servicio__CEB9811902FA7EDE");

            entity.ToTable("Servicio");

            entity.Property(e => e.IdServicio).HasColumnName("idServicio");
            entity.Property(e => e.FechaEntrada).HasColumnName("fechaEntrada");
            entity.Property(e => e.IdEmpleado).HasColumnName("idEmpleado");
            entity.Property(e => e.IdMotocicleta).HasColumnName("idMotocicleta");
            entity.Property(e => e.Precio)
                .HasColumnType("decimal(10, 2)")
                .HasColumnName("precio");
            entity.Property(e => e.Servicio1)
                .HasMaxLength(100)
                .IsUnicode(false)
                .HasColumnName("servicio");

            entity.HasOne(d => d.IdEmpleadoNavigation).WithMany(p => p.Servicios)
                .HasForeignKey(d => d.IdEmpleado)
                .HasConstraintName("FK__Servicio__idEmpl__4222D4EF");

            entity.HasOne(d => d.IdMotocicletaNavigation).WithMany(p => p.Servicios)
                .HasForeignKey(d => d.IdMotocicleta)
                .HasConstraintName("FK__Servicio__idMoto__412EB0B6");
        });

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}
