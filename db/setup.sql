IF DB_ID('GestionBeneficiariosDB') IS NULL
BEGIN
    CREATE DATABASE GestionBeneficiariosDB;
END
GO

USE GestionBeneficiariosDB;
GO

CREATE TABLE dbo.DocumentoIdentidad (
    Id            INT IDENTITY(1,1) PRIMARY KEY,
    Nombre        VARCHAR(50)  NOT NULL,
    Abreviatura   VARCHAR(10)  NOT NULL,
    Pais          VARCHAR(50)  NOT NULL,
    Longitud      INT          NOT NULL,
    SoloNumeros   BIT          NOT NULL,
    Activo        BIT          NOT NULL DEFAULT 1
);
GO

CREATE UNIQUE INDEX UX_DocumentoIdentidad_Pais_Abreviatura
ON dbo.DocumentoIdentidad (Pais, Abreviatura);
GO

CREATE TABLE dbo.Beneficiario (
    Id                   INT IDENTITY(1,1) PRIMARY KEY,
    Nombres              VARCHAR(100) NOT NULL,
    Apellidos            VARCHAR(100) NOT NULL,
    DocumentoIdentidadId INT          NOT NULL,
    NumeroDocumento      VARCHAR(20)  NOT NULL,
    FechaNacimiento      DATE         NOT NULL,
    Sexo                 CHAR(1)      NOT NULL,
    CONSTRAINT FK_Beneficiario_DocumentoIdentidad
        FOREIGN KEY (DocumentoIdentidadId) REFERENCES dbo.DocumentoIdentidad(Id),
    CONSTRAINT CK_Beneficiario_Sexo
        CHECK (Sexo IN ('M','F'))
);
GO

CREATE INDEX IX_Beneficiario_DocId_Num
ON dbo.Beneficiario (DocumentoIdentidadId, NumeroDocumento);
GO

USE GestionBeneficiariosDB;
GO

INSERT INTO dbo.DocumentoIdentidad (Nombre, Abreviatura, Pais, Longitud, SoloNumeros, Activo)
VALUES 
('Documento Nacional de Identidad', 'DNI', 'Perú', 8, 1, 1),
('Carné de Extranjería', 'CE', 'Perú', 9, 0, 1),
('Pasaporte', 'PAS', 'Perú', 9, 0, 1),
('Registro Único de Contribuyentes', 'RUC', 'Perú', 11, 1, 1),

('Documento Nacional de Identidad', 'DNI', 'España', 8, 1, 1),
('Número de Identidad de Extranjero', 'NIE', 'España', 9, 0, 1),
('Pasaporte', 'PAS', 'España', 9, 0, 1),

('Documento Nacional de Identidad', 'DNI', 'Chile', 9, 1, 1),
('Rol Único Nacional', 'RUN', 'Chile', 9, 1, 0), -- inactivo
('Pasaporte', 'PAS', 'Chile', 9, 0, 1),

('Documento Nacional de Identidad', 'DNI', 'Argentina', 8, 1, 1),
('Pasaporte', 'PAS', 'Argentina', 9, 0, 1),

('Cédula de Ciudadanía', 'CC', 'Colombia', 10, 1, 1),
('Cédula de Extranjería', 'CE', 'Colombia', 7, 0, 1),
('Pasaporte', 'PAS', 'Colombia', 9, 0, 1),

('Cédula de Identidad', 'CI', 'Bolivia', 7, 1, 1),
('Pasaporte', 'PAS', 'Bolivia', 9, 0, 1),

('Cédula de Identidad', 'CI', 'Ecuador', 10, 1, 1),
('Pasaporte', 'PAS', 'Ecuador', 9, 0, 1);
GO

USE GestionBeneficiariosDB;
GO

CREATE OR ALTER PROCEDURE dbo.DocumentoIdentidad_GetActivos
AS
BEGIN
    SET NOCOUNT ON;

    SELECT Id, Nombre, Abreviatura, Pais, Longitud, SoloNumeros, Activo
    FROM dbo.DocumentoIdentidad
    WHERE Activo = 1
    ORDER BY Pais, Nombre;
END
GO

CREATE OR ALTER PROCEDURE dbo.Beneficiario_GetAll
AS
BEGIN
    SET NOCOUNT ON;

    SELECT
        b.Id, b.Nombres, b.Apellidos, b.DocumentoIdentidadId,
        b.NumeroDocumento, b.FechaNacimiento, b.Sexo,
        di.Nombre AS DocumentoNombre, di.Abreviatura AS DocumentoAbreviatura, di.Pais
    FROM dbo.Beneficiario b
    INNER JOIN dbo.DocumentoIdentidad di ON di.Id = b.DocumentoIdentidadId
    ORDER BY b.Id DESC;
END
GO

CREATE OR ALTER PROCEDURE dbo.Beneficiario_GetById
    @Id INT
AS
BEGIN
    SET NOCOUNT ON;

    SELECT
        b.Id, b.Nombres, b.Apellidos, b.DocumentoIdentidadId,
        b.NumeroDocumento, b.FechaNacimiento, b.Sexo,
        di.Nombre AS DocumentoNombre, di.Abreviatura AS DocumentoAbreviatura, di.Pais
    FROM dbo.Beneficiario b
    INNER JOIN dbo.DocumentoIdentidad di ON di.Id = b.DocumentoIdentidadId
    WHERE b.Id = @Id;
END
GO

CREATE OR ALTER PROCEDURE dbo.Beneficiario_Create
    @Nombres              VARCHAR(100),
    @Apellidos            VARCHAR(100),
    @DocumentoIdentidadId INT,
    @NumeroDocumento      VARCHAR(20),
    @FechaNacimiento      DATE,
    @Sexo                 CHAR(1)
AS
BEGIN
    SET NOCOUNT ON;

    IF EXISTS (
        SELECT 1
        FROM dbo.Beneficiario
        WHERE DocumentoIdentidadId = @DocumentoIdentidadId
          AND NumeroDocumento = @NumeroDocumento
    )
    BEGIN
        THROW 51000, 'Ya existe un beneficiario registrado con este documento de identidad.', 1;
    END

    INSERT INTO dbo.Beneficiario
    (Nombres, Apellidos, DocumentoIdentidadId, NumeroDocumento, FechaNacimiento, Sexo)
    VALUES
    (@Nombres, @Apellidos, @DocumentoIdentidadId, @NumeroDocumento, @FechaNacimiento, @Sexo);

    SELECT CAST(SCOPE_IDENTITY() AS INT) AS Id;
END
GO

CREATE OR ALTER PROCEDURE dbo.Beneficiario_Create
    @Id                   INT,
    @Nombres              VARCHAR(100),
    @Apellidos            VARCHAR(100),
    @DocumentoIdentidadId INT,
    @NumeroDocumento      VARCHAR(20),
    @FechaNacimiento      DATE,
    @Sexo                 CHAR(1)
AS
BEGIN
    SET NOCOUNT ON;

    UPDATE dbo.Beneficiario
    SET
        Nombres = @Nombres,
        Apellidos = @Apellidos,
        DocumentoIdentidadId = @DocumentoIdentidadId,
        NumeroDocumento = @NumeroDocumento,
        FechaNacimiento = @FechaNacimiento,
        Sexo = @Sexo
    WHERE Id = @Id;

    SELECT @@ROWCOUNT AS RowsAffected;
END
GO

CREATE OR ALTER PROCEDURE dbo.Beneficiario_Delete
    @Id INT
AS
BEGIN
    SET NOCOUNT ON;

    DELETE FROM dbo.Beneficiario
    WHERE Id = @Id;

    SELECT @@ROWCOUNT AS RowsAffected;
END
GO
