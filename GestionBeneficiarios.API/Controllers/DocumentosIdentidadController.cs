using Microsoft.AspNetCore.Mvc;
using GestionBeneficiarios.API.Data;
using GestionBeneficiarios.API.Dtos;

namespace GestionBeneficiarios.API.Controllers;

[ApiController]
[Route("api/documentos-identidad")]
public sealed class DocumentosIdentidadController : ControllerBase
{
    private readonly DocumentoIdentidadRepository _repo;

    public DocumentosIdentidadController(DocumentoIdentidadRepository repo)
    {
        _repo = repo;
    }

    [HttpGet]
    [ProducesResponseType(typeof(List<DocumentoIdentidadDto>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetActivos()
    {
        var data = await _repo.GetActivosAsync();
        return Ok(data);
    }
}
