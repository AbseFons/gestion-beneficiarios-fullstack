using System.Data;
using Microsoft.Data.SqlClient;
using GestionBeneficiarios.API.Dtos;

namespace GestionBeneficiarios.API.Data;

public sealed class BeneficiarioRepository
{
    private readonly string _connectionString;

    public BeneficiarioRepository(IConfiguration configuration)
    {
        _connectionString = configuration.GetConnectionString("DefaultConnection")
            ?? throw new InvalidOperationException("No se encontró ConnectionStrings:DefaultConnection en appsettings.json");
    }

    public async Task<List<BeneficiarioReadDto>> GetAllAsync()
    {
        var result = new List<BeneficiarioReadDto>();

        await using var conn = new SqlConnection(_connectionString);
        await conn.OpenAsync();

        await using var cmd = new SqlCommand("dbo.Beneficiario_GetAll", conn);
        cmd.CommandType = CommandType.StoredProcedure;

        await using var reader = await cmd.ExecuteReaderAsync();
        while (await reader.ReadAsync())
        {
            result.Add(MapReadDtoFromGetAll(reader));
        }

        return result;
    }

    public async Task<BeneficiarioReadDto?> GetByIdAsync(int id)
    {
        await using var conn = new SqlConnection(_connectionString);
        await conn.OpenAsync();

        await using var cmd = new SqlCommand("dbo.Beneficiario_GetById", conn);
        cmd.CommandType = CommandType.StoredProcedure;
        cmd.Parameters.Add(new SqlParameter("@Id", SqlDbType.Int) { Value = id });

        await using var reader = await cmd.ExecuteReaderAsync();
        if (!await reader.ReadAsync())
            return null;

        // Este SP no trae join; devolvemos DTO base
        return new BeneficiarioReadDto
        {
            Id = reader.GetInt32(reader.GetOrdinal("Id")),
            Nombres = reader.GetString(reader.GetOrdinal("Nombres")),
            Apellidos = reader.GetString(reader.GetOrdinal("Apellidos")),
            DocumentoIdentidadId = reader.GetInt32(reader.GetOrdinal("DocumentoIdentidadId")),
            NumeroDocumento = reader.GetString(reader.GetOrdinal("NumeroDocumento")),
            FechaNacimiento = reader.GetDateTime(reader.GetOrdinal("FechaNacimiento")),
            Sexo = reader.GetString(reader.GetOrdinal("Sexo")),
            DocumentoNombre = reader.IsDBNull(reader.GetOrdinal("DocumentoNombre"))
        ? null
        : reader.GetString(reader.GetOrdinal("DocumentoNombre")),
            DocumentoAbreviatura = reader.IsDBNull(reader.GetOrdinal("DocumentoAbreviatura"))
        ? null
        : reader.GetString(reader.GetOrdinal("DocumentoAbreviatura")),
            Pais = reader.IsDBNull(reader.GetOrdinal("Pais"))
        ? null
        : reader.GetString(reader.GetOrdinal("Pais"))
        };
    }

    public async Task<int> CreateAsync(BeneficiarioCreateDto dto)
    {
        await using var conn = new SqlConnection(_connectionString);
        await conn.OpenAsync();

        await using var cmd = new SqlCommand("dbo.Beneficiario_Create", conn);
        cmd.CommandType = CommandType.StoredProcedure;

        cmd.Parameters.Add(new SqlParameter("@Nombres", SqlDbType.VarChar, 100) { Value = dto.Nombres.Trim() });
        cmd.Parameters.Add(new SqlParameter("@Apellidos", SqlDbType.VarChar, 100) { Value = dto.Apellidos.Trim() });
        cmd.Parameters.Add(new SqlParameter("@DocumentoIdentidadId", SqlDbType.Int) { Value = dto.DocumentoIdentidadId });
        cmd.Parameters.Add(new SqlParameter("@NumeroDocumento", SqlDbType.VarChar, 20) { Value = dto.NumeroDocumento.Trim() });

        cmd.Parameters.Add(new SqlParameter("@FechaNacimiento", SqlDbType.Date) { Value = dto.FechaNacimiento.Date });

        cmd.Parameters.Add(new SqlParameter("@Sexo", SqlDbType.Char, 1) { Value = dto.Sexo.Trim().ToUpperInvariant() });

        var scalar = await cmd.ExecuteScalarAsync();
        if (scalar is null || scalar == DBNull.Value)
            throw new InvalidOperationException("El SP dbo.Beneficiario_Create no devolvió el Id.");

        return Convert.ToInt32(scalar);
    }

    public async Task<bool> UpdateAsync(int id, BeneficiarioUpdateDto dto)
    {
        await using var conn = new SqlConnection(_connectionString);
        await conn.OpenAsync();

        await using var cmd = new SqlCommand("dbo.Beneficiario_Update", conn);
        cmd.CommandType = CommandType.StoredProcedure;

        cmd.Parameters.Add(new SqlParameter("@Id", SqlDbType.Int) { Value = id });
        cmd.Parameters.Add(new SqlParameter("@Nombres", SqlDbType.VarChar, 100) { Value = dto.Nombres.Trim() });
        cmd.Parameters.Add(new SqlParameter("@Apellidos", SqlDbType.VarChar, 100) { Value = dto.Apellidos.Trim() });
        cmd.Parameters.Add(new SqlParameter("@DocumentoIdentidadId", SqlDbType.Int) { Value = dto.DocumentoIdentidadId });
        cmd.Parameters.Add(new SqlParameter("@NumeroDocumento", SqlDbType.VarChar, 20) { Value = dto.NumeroDocumento.Trim() });
        cmd.Parameters.Add(new SqlParameter("@FechaNacimiento", SqlDbType.Date) { Value = dto.FechaNacimiento.Date });
        cmd.Parameters.Add(new SqlParameter("@Sexo", SqlDbType.Char, 1) { Value = dto.Sexo.Trim().ToUpperInvariant() });

        var scalar = await cmd.ExecuteScalarAsync();
        var rows = (scalar is null || scalar == DBNull.Value) ? 0 : Convert.ToInt32(scalar);

        return rows > 0;
    }

    public async Task<bool> DeleteAsync(int id)
    {
        await using var conn = new SqlConnection(_connectionString);
        await conn.OpenAsync();

        await using var cmd = new SqlCommand("dbo.Beneficiario_Delete", conn);
        cmd.CommandType = CommandType.StoredProcedure;
        cmd.Parameters.Add(new SqlParameter("@Id", SqlDbType.Int) { Value = id });

        var scalar = await cmd.ExecuteScalarAsync();
        var rows = (scalar is null || scalar == DBNull.Value) ? 0 : Convert.ToInt32(scalar);

        return rows > 0;
    }

    private static BeneficiarioReadDto MapReadDtoFromGetAll(SqlDataReader reader)
    {
        // GetAll trae join + alias
        return new BeneficiarioReadDto
        {
            Id = reader.GetInt32(reader.GetOrdinal("Id")),
            Nombres = reader.GetString(reader.GetOrdinal("Nombres")),
            Apellidos = reader.GetString(reader.GetOrdinal("Apellidos")),
            DocumentoIdentidadId = reader.GetInt32(reader.GetOrdinal("DocumentoIdentidadId")),
            NumeroDocumento = reader.GetString(reader.GetOrdinal("NumeroDocumento")),
            FechaNacimiento = reader.GetDateTime(reader.GetOrdinal("FechaNacimiento")),
            Sexo = reader.GetString(reader.GetOrdinal("Sexo")),
            DocumentoNombre = reader.GetString(reader.GetOrdinal("DocumentoNombre")),
            DocumentoAbreviatura = reader.GetString(reader.GetOrdinal("DocumentoAbreviatura")),
            Pais = reader.GetString(reader.GetOrdinal("Pais"))
        };
    }
}
