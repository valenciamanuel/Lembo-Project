-- MySQL dump 10.13  Distrib 8.0.41, for Win64 (x86_64)
--
-- Host: localhost    Database: lembo
-- ------------------------------------------------------
-- Server version	8.0.41

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
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-05-06 13:52:29
