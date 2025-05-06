-- MySQL dump 10.13  Distrib 8.0.42, for Win64 (x86_64)
--
-- Host: localhost    Database: lembo
-- ------------------------------------------------------
-- Server version	9.3.0

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `asociaciones`
--

DROP TABLE IF EXISTS `asociaciones`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `asociaciones` (
  `id` int NOT NULL AUTO_INCREMENT,
  `responsable` varchar(30) NOT NULL,
  `nombre_asociacion` varchar(20) NOT NULL,
  `inversion` decimal(10,2) NOT NULL,
  `meta` decimal(10,2) NOT NULL,
  `iniico_produccion` date NOT NULL,
  `fin_produccion` date NOT NULL,
  `cultivo` varchar(20) NOT NULL,
  `sensores` text,
  `insumos` text,
  `ciclo_cultivo` varchar(20) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `asociaciones`
--

LOCK TABLES `asociaciones` WRITE;
/*!40000 ALTER TABLE `asociaciones` DISABLE KEYS */;
INSERT INTO `asociaciones` VALUES (1,'asfdghh','sdfg',45273.00,58854.90,'2025-04-08','2025-04-09','gbhj','sensor3, wwww, tyuhj','sdfghj','eeee'),(2,'fghj','dfghj',345.00,23456.00,'2025-04-05','2025-04-15','cultivo1','sensor1','insumo2','ciclo2'),(3,'hgjk','efrgt',3456.00,4567.00,'2025-04-09','2025-04-10','cultivo1','sensor2','insumo1','ciclo1');
/*!40000 ALTER TABLE `asociaciones` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ciclocultivo`
--

DROP TABLE IF EXISTS `ciclocultivo`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ciclocultivo` (
  `id` int NOT NULL AUTO_INCREMENT,
  `cicloID` varchar(50) NOT NULL,
  `cicloName` varchar(100) NOT NULL,
  `siembraDate` date NOT NULL,
  `cosechaDate` date NOT NULL,
  `news` text,
  `description` text,
  `state` enum('activo','inactivo') NOT NULL DEFAULT 'activo',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ciclocultivo`
--

LOCK TABLES `ciclocultivo` WRITE;
/*!40000 ALTER TABLE `ciclocultivo` DISABLE KEYS */;
INSERT INTO `ciclocultivo` VALUES (1,'111','eeee','2025-03-12','2025-03-19','ghgh','hghghj','activo'),(2,'111','eeee','2025-03-12','2025-03-19','ghgh','hghghj','activo'),(3,'123','ggg','2025-03-12','2025-03-19','ghgh','hghghj','activo'),(4,'222','lplpol','2025-02-27','2025-03-01','olopl','hbjvbn','inactivo'),(5,'5445','hjk','2025-05-02','2025-04-11','hjk','ghj','activo'),(6,'345678','asdfghjklgdfthyjgukhli','2025-05-01','2025-04-09','dgfnhmbn','fdghjklñ','activo'),(7,'345678','dfghjkl','2025-04-23','2025-04-09','sdfgjyuiopl','dfghijoijhugyftr','activo'),(8,'34567890','fgdhjkppojihugyjfhdg','2025-04-16','2025-04-08','sadfghtyuoipuiy','aerstdyu7y8u9','inactivo'),(9,'09876','rgthyj','2025-04-09','2025-04-09','dfghj','sdfgh','activo');
/*!40000 ALTER TABLE `ciclocultivo` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cultivo`
--

DROP TABLE IF EXISTS `cultivo`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cultivo` (
  `id` int NOT NULL AUTO_INCREMENT,
  `cultivoType` varchar(100) NOT NULL,
  `cultivoName` varchar(100) NOT NULL,
  `cultivoID` varchar(50) NOT NULL,
  `size` varchar(50) DEFAULT NULL,
  `location` varchar(255) DEFAULT NULL,
  `description` text,
  `state` enum('Activo','Inactivo') NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `cultivoID` (`cultivoID`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cultivo`
--

LOCK TABLES `cultivo` WRITE;
/*!40000 ALTER TABLE `cultivo` DISABLE KEYS */;
INSERT INTO `cultivo` VALUES (1,'huj','gbhj','gh','byhnj','gyhj','yhuj','Activo'),(2,'klKL','ujik','ikol','mk,l','kl','km','Inactivo'),(3,'ertgh','ser','2025-04-16','2025-04-09','gfvhj','yguhj','Activo'),(4,'dgfgyuhijsd','asdfghj','dszfxgchvjjk','zdxfchgvjbj','xcvbjnkm','gxdfchghj','Activo'),(5,'sdgfhjkgf','sdrftyguhi','szfdgxfhcyuhijk','szfdxgchjiokldxfcgv','szfdxghcvjbjnk','zxdfchgvjhbjnkml,','Inactivo'),(6,'dsfghjlkawsdrtfygiuho','dsfdgfhjgkhsdgfhj','s<adszfdgxfhjgykhul','aesrdtfyiguhiwesrd','astedyrfutgiohupji','szdgxfcvhedrtfyui','Activo'),(7,'dfg','dsfgh','34567564','234','sdafg','dwefrgt','Activo'),(8,'nose','zxczxczc','sd12334','20','sdad','asdad','Activo');
/*!40000 ALTER TABLE `cultivo` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `insumo`
--

DROP TABLE IF EXISTS `insumo`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `insumo` (
  `idInsumo` int NOT NULL AUTO_INCREMENT,
  `tipoInsumo` varchar(20) NOT NULL,
  `nombreInsumo` varchar(20) NOT NULL,
  `unidadMedida` varchar(10) NOT NULL,
  `cantidad` decimal(10,2) NOT NULL,
  `valorUnitario` decimal(10,2) NOT NULL,
  `valorTotal` decimal(10,2) NOT NULL,
  `descripcion` text,
  `estado` enum('activo','inactivo') NOT NULL DEFAULT 'activo',
  PRIMARY KEY (`idInsumo`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `insumo`
--

LOCK TABLES `insumo` WRITE;
/*!40000 ALTER TABLE `insumo` DISABLE KEYS */;
INSERT INTO `insumo` VALUES (1,'sdfgh','sdfghj','ertyui',3424.00,3456.00,11833344.00,'sdgfhgj','activo'),(2,'ergfth','dfsgh','sfdg',23456.00,3456.00,3456.00,'sdfgh','inactivo'),(3,'ety','gfh','erfhgh',3546.00,3456.00,345678.00,'fdgh','activo'),(4,'rtyuhk','sdfg','dsfg',345.00,345.00,456.00,'sdfgh','activo'),(5,'fdg','dfgh','sdfg',3456.00,45.00,4567.00,'sdfgh','activo');
/*!40000 ALTER TABLE `insumo` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `register`
--

DROP TABLE IF EXISTS `register`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `register` (
  `id` int NOT NULL AUTO_INCREMENT,
  `usertype` enum('superadmin','admin','personal','visitante') NOT NULL,
  `IDtype` enum('RC','TI','CC','PASAPORTE') NOT NULL,
  `IDnum` varchar(20) NOT NULL,
  `name` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `phone` varchar(15) NOT NULL,
  `password` varchar(255) NOT NULL,
  `fecha_registro` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `IDnum` (`IDnum`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=25 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `register`
--

LOCK TABLES `register` WRITE;
/*!40000 ALTER TABLE `register` DISABLE KEYS */;
INSERT INTO `register` VALUES (1,'superadmin','RC','21212','diomeds','qq@gmail.com','','ww','2025-03-30 19:14:10'),(2,'admin','TI','222','1','1@gmail.com','','www','2025-03-30 19:16:26'),(4,'superadmin','TI','11','man','123@gmail.com','444','cc','2025-03-30 19:24:22'),(5,'visitante','CC','11111','yo','valencia@gamiil.com','32332','pp','2025-03-30 19:31:35'),(8,'superadmin','TI','1234','el','mi@gmail.com','555','pp','2025-03-30 19:37:45'),(9,'admin','TI','456','fg','gbh@gmail.com','gth','gvbh','2025-04-05 18:03:56'),(10,'personal','RC','1231','yo','12345@gmail.com','567','hbj','2025-04-05 18:05:06'),(12,'personal','RC','2323','ti','4444@gmail.com','789','lll','2025-04-05 18:13:44'),(17,'personal','CC','789','mimo','aaaa@gmail.com','567','qp','2025-04-05 18:23:20'),(18,'admin','RC','34','enano','r@gmail.com','454','ppp','2025-04-05 19:02:17'),(20,'admin','PASAPORTE','786','tito','pele@gmail.com','5219','gh','2025-04-06 18:14:42'),(21,'visitante','RC','1324567','asfdghh','444444@gmail.com','3456789','ui','2025-04-08 06:08:08'),(22,'personal','RC','24356789','dsfghjkluryetw','valencia12@gamiil.com','34657899876','vih','2025-04-08 06:09:33'),(24,'admin','RC','756776','ccsdc','198@gmail.com','57644','wert','2025-04-21 23:40:10');
/*!40000 ALTER TABLE `register` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sensores`
--

DROP TABLE IF EXISTS `sensores`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `sensores` (
  `idSensor` int NOT NULL AUTO_INCREMENT,
  `tipoSensor` varchar(100) NOT NULL,
  `nombreSensor` varchar(100) NOT NULL,
  `unidadMedida` varchar(50) NOT NULL,
  `tiempoEscaneo` int NOT NULL,
  `descripcion` text,
  `estado` enum('Activo','Inactivo') NOT NULL,
  PRIMARY KEY (`idSensor`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sensores`
--

LOCK TABLES `sensores` WRITE;
/*!40000 ALTER TABLE `sensores` DISABLE KEYS */;
INSERT INTO `sensores` VALUES (1,'www','wwww','hnj',3,'hbnjmk','Activo'),(2,'tfygh','tyuhj','ghjk',67,'gyhj','Activo'),(3,'etsrydfu','wretyu','sadfgy',23456,'wetsrdyfu','Activo'),(4,'srdtfjyg','warestdyuiu','strdyfugih',2345678,'adsfghj','Activo'),(5,'ewrtyy','ewrytui','ewrtyu',34567,'dsfghjk','Activo'),(6,'dsfg','ewrty','wer',234,'sdefrgt','Activo');
/*!40000 ALTER TABLE `sensores` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `uso_insumo`
--

DROP TABLE IF EXISTS `uso_insumo`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `uso_insumo` (
  `id` int NOT NULL AUTO_INCREMENT,
  `fecha_uso` date NOT NULL,
  `cantidad` decimal(10,2) NOT NULL,
  `responsable` varchar(20) NOT NULL,
  `valor_unitario` decimal(10,2) NOT NULL,
  `valor_total` decimal(10,2) NOT NULL,
  `observaciones` text,
  `insumo` varchar(20) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `uso_insumo`
--

LOCK TABLES `uso_insumo` WRITE;
/*!40000 ALTER TABLE `uso_insumo` DISABLE KEYS */;
INSERT INTO `uso_insumo` VALUES (1,'2025-04-11',456.00,'dsfgh',345.00,345.00,'dsfg','insumo1'),(2,'2025-05-06',20.00,'carlos',3456.00,69120.00,'Uso en asociación: coco','sdfghj'),(3,'2025-05-06',12.00,'asfdghh',3456.00,41472.00,'Uso en asociación actualizada: sdfg','sdfghj');
/*!40000 ALTER TABLE `uso_insumo` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-05-06 14:12:01
