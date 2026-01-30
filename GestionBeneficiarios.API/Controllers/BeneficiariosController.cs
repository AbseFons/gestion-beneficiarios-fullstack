using Microsoft.AspNetCore.Mvc;
using GestionBeneficiarios.API.Data;
using GestionBeneficiarios.API.Dtos;
using Microsoft.Data.SqlClient;

namespace GestionBeneficiarios.API.Controllers;

[ApiController]
[Route("api/beneficiarios")]
public sealed class BeneficiariosController : ControllerBase
{
    private readonly BeneficiarioRepository _repo;

    public BeneficiariosController(BeneficiarioRepository repo)
    {
        _repo = repo;
    }

    [HttpGet]
    [ProducesResponseType(typeof(List<BeneficiarioReadDto>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetAll()
    {
        var data = await _repo.GetAllAsync();
        return Ok(data);
    }

    [HttpGet("{id:int}")]
    [ProducesResponseType(typeof(BeneficiarioReadDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetById(int id)
    {
        var item = await _repo.GetByIdAsync(id);
        return item is null ? NotFound() : Ok(item);
    }

    [HttpPost]
    [ProducesResponseType(typeof(BeneficiarioReadDto), StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> Create([FromBody] BeneficiarioCreateDto dto)
    {
        try
        {
            var id = await _repo.CreateAsync(dto);
            var created = await _repo.GetByIdAsync(id);
            return CreatedAtAction(nameof(GetById), new { id }, created);
        }
        catch (SqlException ex)
        {
            return BadRequest(new { message = ex.Message });
        }

    }

    [HttpPut("{id:int}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> Update(int id, [FromBody] BeneficiarioUpdateDto dto)
    {
        var updated = await _repo.UpdateAsync(id, dto);
        return updated ? NoContent() : NotFound();
    }

    [HttpDelete("{id:int}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> Delete(int id)
    {
        var deleted = await _repo.DeleteAsync(id);
        return deleted ? NoContent() : NotFound();
    }
}
