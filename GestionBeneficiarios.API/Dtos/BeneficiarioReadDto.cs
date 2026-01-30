namespace GestionBeneficiarios.API.Dtos;

public sealed class BeneficiarioReadDto
{
    public int Id { get; set; }
    public string Nombres { get; set; } = string.Empty;
    public string Apellidos { get; set; } = string.Empty;

    public int DocumentoIdentidadId { get; set; }
    public string NumeroDocumento { get; set; } = string.Empty;

    public DateTime FechaNacimiento { get; set; }
    public string Sexo { get; set; } = string.Empty;

    // Campos extra útiles para listar (porque tu SP hace join)
    public string? DocumentoNombre { get; set; }
    public string? DocumentoAbreviatura { get; set; }
    public string? Pais { get; set; }
}
