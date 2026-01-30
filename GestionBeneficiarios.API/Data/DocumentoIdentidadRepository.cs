using System.Data;
using Microsoft.Data.SqlClient;
using GestionBeneficiarios.API.Dtos;

namespace GestionBeneficiarios.API.Data;

public sealed class DocumentoIdentidadRepository
{
    private readonly string _connectionString;

    public DocumentoIdentidadRepository(IConfiguration configuration)
    {
        _connectionString = configuration.GetConnectionString("DefaultConnection")
            ?? throw new InvalidOperationException("No se encontró ConnectionStrings:DefaultConnection en appsettings.json");
    }

    public async Task<List<DocumentoIdentidadDto>> GetActivosAsync()
    {
        var result = new List<DocumentoIdentidadDto>();

        await using var conn = new SqlConnection(_connectionString);
        await conn.OpenAsync();

        await using var cmd = new SqlCommand("dbo.DocumentoIdentidad_GetActivos", conn);
        cmd.CommandType = CommandType.StoredProcedure;

        await using var reader = await cmd.ExecuteReaderAsync();
        while (await reader.ReadAsync())
        {
            // Importante: leemos por nombre de columna para evitar rompernos si cambia el orden del SELECT
            result.Add(new DocumentoIdentidadDto
            {
                Id = reader.GetInt32(reader.GetOrdinal("Id")),
                Nombre = reader.GetString(reader.GetOrdinal("Nombre")),
                Abreviatura = reader.GetString(reader.GetOrdinal("Abreviatura")),
                Pais = reader.GetString(reader.GetOrdinal("Pais")),
                Longitud = reader.GetInt32(reader.GetOrdinal("Longitud")),
                SoloNumeros = reader.GetBoolean(reader.GetOrdinal("SoloNumeros")),
                Activo = reader.GetBoolean(reader.GetOrdinal("Activo"))
            });
        }

        return result;
    }
}
