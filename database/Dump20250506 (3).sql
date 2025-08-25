-- Crear base de datos y usarla
CREATE DATABASE IF NOT EXISTS lembo;
USE lembo;

-- Tabla asociaciones
DROP TABLE IF EXISTS asociaciones;
CREATE TABLE asociaciones (
  id INT AUTO_INCREMENT PRIMARY KEY,
  responsable VARCHAR(30) NOT NULL,
  nombre_asociacion VARCHAR(20) NOT NULL,
  inversion DECIMAL(10,2) NOT NULL,
  meta DECIMAL(10,2) NOT NULL,
  iniico_produccion DATE NOT NULL,
  fin_produccion DATE NOT NULL,
  cultivo VARCHAR(20) NOT NULL,
  sensores TEXT,
  insumos TEXT,
  ciclo_cultivo VARCHAR(20) NOT NULL
);

INSERT INTO asociaciones VALUES
(1,'asfdghh','sdfg',45273.00,58854.90,'2025-04-08','2025-04-09','gbhj','sensor3, wwww, tyuhj','sdfghj','eeee'),
(3,'hgjk','efrgt',3456.00,4567.00,'2025-04-09','2025-04-10','cultivo1','sensor2','insumo1','ciclo1'),
(5,'dsfghjkluryetw','coco',3501.00,4551.30,'2025-07-16','2025-08-01','gbhj','wwww, tyuhj, warestdyuiu','dfgh, gfh','eeee');

-- Tabla ciclocultivo
DROP TABLE IF EXISTS ciclocultivo;
CREATE TABLE ciclocultivo (
  id INT AUTO_INCREMENT PRIMARY KEY,
  cicloID VARCHAR(50) NOT NULL,
  cicloName VARCHAR(100) NOT NULL,
  siembraDate DATE NOT NULL,
  cosechaDate DATE NOT NULL,
  news TEXT,
  description TEXT,
  state ENUM('activo','inactivo') NOT NULL DEFAULT 'activo'
);

INSERT INTO ciclocultivo VALUES
(1,'111','eeee','2025-03-12','2025-03-19','ghgh','hghghj','activo'),
(2,'111','eeee','2025-03-12','2025-03-19','ghgh','hghghj','activo'),
(3,'123','ggg','2025-03-12','2025-03-19','ghgh','hghghj','activo');

-- Tabla cultivo
DROP TABLE IF EXISTS cultivo;
CREATE TABLE cultivo (
  id INT AUTO_INCREMENT PRIMARY KEY,
  cultivoType VARCHAR(100) NOT NULL,
  cultivoName VARCHAR(100) NOT NULL,
  cultivoID VARCHAR(50) NOT NULL UNIQUE,
  size VARCHAR(50),
  location VARCHAR(255),
  description TEXT,
  state ENUM('Activo','Inactivo') NOT NULL
);

INSERT INTO cultivo VALUES
(1,'huj','gbhj','gh','byhnj','gyhj','yhuj','Activo'),
(2,'klKL','ujik','ikol','mk,l','kl','km','Inactivo');

-- Tabla insumo
DROP TABLE IF EXISTS insumo;
CREATE TABLE insumo (
  idInsumo INT AUTO_INCREMENT PRIMARY KEY,
  tipoInsumo VARCHAR(20) NOT NULL,
  nombreInsumo VARCHAR(20) NOT NULL,
  unidadMedida VARCHAR(10) NOT NULL,
  cantidad DECIMAL(10,2) NOT NULL,
  valorUnitario DECIMAL(10,2) NOT NULL,
  valorTotal DECIMAL(10,2) NOT NULL,
  descripcion TEXT,
  estado ENUM('activo','inactivo') NOT NULL DEFAULT 'activo'
);

INSERT INTO insumo VALUES
(1,'sdfgh','sdfghj','ertyui',3414.00,3456.00,11798784.00,'sdgfhgj','activo'),
(2,'ergfth','dfsgh','sfdg',23456.00,3456.00,3456.00,'sdfgh','inactivo');

-- Tabla register
DROP TABLE IF EXISTS register;
CREATE TABLE register (
  id INT AUTO_INCREMENT PRIMARY KEY,
  usertype ENUM('superadmin','admin','personal','visitante') NOT NULL,
  IDtype ENUM('RC','TI','CC','PASAPORTE') NOT NULL,
  IDnum VARCHAR(20) NOT NULL UNIQUE,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) NOT NULL UNIQUE,
  phone VARCHAR(15) NOT NULL,
  password VARCHAR(255) NOT NULL,
  fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO register VALUES
(1,'superadmin','RC','21212','diomeds','qq@gmail.com','','ww','2025-03-30 19:14:10'),
(2,'admin','TI','222','1','1@gmail.com','','www','2025-03-30 19:16:26');

-- Tabla sensores
DROP TABLE IF EXISTS sensores;
CREATE TABLE sensores (
  idSensor INT AUTO_INCREMENT PRIMARY KEY,
  tipoSensor VARCHAR(100) NOT NULL,
  nombreSensor VARCHAR(100) NOT NULL,
  unidadMedida VARCHAR(50) NOT NULL,
  tiempoEscaneo INT NOT NULL,
  descripcion TEXT,
  estado ENUM('Activo','Inactivo') NOT NULL
);

INSERT INTO sensores VALUES
(1,'www','wwww','hnj',3,'hbnjmk','Activo'),
(2,'tfygh','tyuhj','ghjk',67,'gyhj','Activo');

-- Tabla uso_insumo
DROP TABLE IF EXISTS uso_insumo;
CREATE TABLE uso_insumo (
  id INT AUTO_INCREMENT PRIMARY KEY,
  fecha_uso DATE NOT NULL,
  cantidad DECIMAL(10,2) NOT NULL,
  responsable VARCHAR(20) NOT NULL,
  valor_unitario DECIMAL(10,2) NOT NULL,
  valor_total DECIMAL(10,2) NOT NULL,
  observaciones TEXT,
  insumo VARCHAR(20) NOT NULL
);

INSERT INTO uso_insumo VALUES
(1,'2025-04-11',456.00,'dsfgh',345.00,345.00,'dsfg','insumo1'),
(2,'2025-05-06',20.00,'carlos',3456.00,69120.00,'Uso en asociación: coco','sdfghj');
