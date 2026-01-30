using System.ComponentModel.DataAnnotations;

namespace GestionBeneficiarios.API.Dtos;

public sealed class BeneficiarioUpdateDto
{
    [Required, StringLength(100)]
    public string Nombres { get; set; } = string.Empty;

    [Required, StringLength(100)]
    public string Apellidos { get; set; } = string.Empty;

    [Required]
    public int DocumentoIdentidadId { get; set; }

    [Required, StringLength(20)]
    public string NumeroDocumento { get; set; } = string.Empty;

    [Required]
    public DateTime FechaNacimiento { get; set; }

    [Required, RegularExpression("^[MF]$")]
    public string Sexo { get; set; } = string.Empty;
}
