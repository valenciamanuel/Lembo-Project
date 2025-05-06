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
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-05-06 13:52:29
