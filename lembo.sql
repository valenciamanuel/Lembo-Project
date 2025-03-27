CREATE DATABASE lembo;

USE lembo;

CREATE TABLE register (
    id INT AUTO_INCREMENT PRIMARY KEY,
    tipoUsuario ENUM('superadmin', 'admin', 'personal', 'visitante') NOT NULL,
    tipoDocumento ENUM('RC', 'TI', 'CC', 'PASAPORTE') NOT NULL,
    numeroDocumento VARCHAR(20) NOT NULL,
    nombre VARCHAR(100) NOT NULL,
    correo VARCHAR(100) NOT NULL,
    confirmarCorreo VARCHAR(100) NOT NULL,
    telefono VARCHAR(15) NOT NULL,
    CONSTRAINT chk_correo CHECK (correo = confirmarCorreo)
);

CREATE TABLE sensores (
    id INT AUTO_INCREMENT PRIMARY KEY,
    tipoSensor VARCHAR(50) NOT NULL,
    idSensor INT NOT NULL,
    nombreSensor VARCHAR(100) NOT NULL,
    unidadMedida VARCHAR(50) NOT NULL,
    tiempoEscaneo INT NOT NULL,
    descripcion TEXT,
    estado ENUM('activo', 'inactivo') NOT NULL
);

CREATE TABLE cultivos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    tipoCultivo VARCHAR(50) NOT NULL,
    nombreCultivo VARCHAR(100) NOT NULL,
    idCultivo VARCHAR(50) UNIQUE NOT NULL,
    tamano VARCHAR(50) NOT NULL,
    ubicacion VARCHAR(100) NOT NULL,
    descripcion TEXT,
    estado ENUM('activo', 'inactivo') NOT NULL
);
