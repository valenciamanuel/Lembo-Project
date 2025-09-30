CREATE DATABASE  IF NOT EXISTS `lembo` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `lembo`;
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
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `asociaciones`
--

LOCK TABLES `asociaciones` WRITE;
/*!40000 ALTER TABLE `asociaciones` DISABLE KEYS */;
INSERT INTO `asociaciones` VALUES (1,'asfdghh','sdfg',45273.00,58854.90,'2025-04-08','2025-04-09','gbhj','sensor3, wwww, tyuhj','sdfghj','eeee'),(3,'hgjk','efrgt',3456.00,4567.00,'2025-04-09','2025-04-10','cultivo1','sensor2','insumo1','ciclo1'),(5,'dsfghjkluryetw','coco',3501.00,4551.30,'2025-07-16','2025-08-01','gbhj','wwww, tyuhj, warestdyuiu','dfgh, gfh','eeee');
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
  `image` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=50 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ciclocultivo`
--

LOCK TABLES `ciclocultivo` WRITE;
/*!40000 ALTER TABLE `ciclocultivo` DISABLE KEYS */;
INSERT INTO `ciclocultivo` VALUES (41,'34','ntrtrfgdf','2025-09-30','2025-11-18','cbcgbegbbc','cbcgbqbc','inactivo','profil.png'),(42,'355','dfdsfsd','2025-09-19','2025-09-24','fgdfgh','hfhjygyg','inactivo','diagrama.drawio.png'),(43,'34545','rft','2025-09-25','2025-09-09','fgdfgh','cbcgbgbc','activo','diagrama.drawio.png'),(44,'1','Platanos','2025-09-16','2026-04-14','Crecimiento','Crecimiento del racimo si pilla','activo','diagrama.drawio.png'),(45,'1','Platanos','2025-09-16','2026-04-14','Crecimiento','Crecimiento del racimo si pilla','activo','diagrama.drawio.png'),(46,'1','Platanos','2025-09-16','2026-04-14','Crecimiento','Crecimiento del racimo si pilla','activo','diagrama.drawio.png'),(47,'1','Platanos','2025-09-16','2026-04-14','Crecimiento','Crecimiento del racimo si pilla','activo','diagrama.drawio.png'),(48,'1','Platanos','2025-09-17','2026-01-20','Crecimiento','Crecimiento del racimo si pilla','activo','diagrama.drawio.png'),(49,'1','Platanos','2025-09-11','2025-10-30','Crecimiento','Crecimiento','activo',NULL);
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
  `image` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `cultivoID` (`cultivoID`)
) ENGINE=InnoDB AUTO_INCREMENT=32 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cultivo`
--

LOCK TABLES `cultivo` WRITE;
/*!40000 ALTER TABLE `cultivo` DISABLE KEYS */;
INSERT INTO `cultivo` VALUES (1,'huj','gbhj','gh','byhnj','gyhj','yhuj','Activo',NULL),(2,'klKL','ujik','ikol','mk,l','kl','km','Inactivo',NULL),(3,'ertgh','ser','2025-04-16','2025-04-09','gfvhj','yguhj','Activo',NULL),(4,'dgfgyuhijsd','asdfghj','dszfxgchvjjk','zdxfchgvjbj','xcvbjnkm','gxdfchghj','Activo',NULL),(5,'sdgfhjkgf','sdrftyguhi','szfdgxfhcyuhijk','szfdxgchjiokldxfcgv','szfdxghcvjbjnk','zxdfchgvjhbjnkml,','Inactivo',NULL),(6,'dsfghjlkawsdrtfygiuho','dsfdgfhjgkhsdgfhj','s<adszfdgxfhjgykhul','aesrdtfyiguhiwesrd','astedyrfutgiohupji','szdgxfcvhedrtfyui','Activo',NULL),(7,'dfg','dsfgh','34567564','234','sdafg','dwefrgt','Activo',NULL),(8,'nose','zxczxczc','sd12334','20','sdad','asdad','Activo',NULL),(10,'nose','cocococo','1312321312','20','2sadad','dadwdadasd','Activo',NULL),(11,'nose','31123','312313','23123','12323','12312313','Inactivo',NULL),(12,'132313213123','pepe','23131asd','123123asda','123213','asdadad','Activo',NULL),(13,'Tin','rtr','2445','12324','eetrhht','gfdhdhgfhfgfh','Inactivo',NULL),(15,'Plata','Dinero','4000000000','0000001','Top secreat','W','Inactivo',NULL),(17,'gfgfttffuvy','rrrrrrr','01','45332','Mi casa','uzted vssabbbe','Activo',NULL),(18,'pwww','ñllkkh','0456','99999','Wao','Rau','Activo',NULL),(19,'gggggggg','wwwwwwwe','890008','22222222222','rikiti','rawkit','Activo',NULL),(20,'ooooooooooooooooooooooopli','ññññññññññññññññññññññññññññ','89999999999999999999','tyruykukuku ukuk ','uulkliluiñloiññ','ññññññññññññññññññññññññññññ','Activo',NULL),(21,'pppppppppppppppppppppp','lllllllllllllllllllllllllllllll','86666666666666666666','5566666666666666666','ggggggggggggggggggghhgj','mmmmmmmmmmmmmmmmmmmm','Activo',NULL),(22,'ññññññññññññññññññññññññññññññññññññññññññññññññññññññññ','mmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmm','99999999999999999999999999999999999','44444444444444444444444444444444','sffarrsrydty',' hgyjgyfyfyf6','Activo',NULL),(23,'dddddddddddddddddddddddddddddddddddd','wwwwwqqqqqqqqqqqqqqqqqqqqqq','1111111111111111111111111111','11111111111111111111111111111111111111','xcxxc','xxxbxbb','Activo',NULL),(24,'bbvvvvvvvvvvvvvvvvvvvv','rrrrrrrrrrrrrrrrrrrrrrrrrrrr','67777777777777777','zzzzzzzzzzzzzzzzzzzzzzzzzzzzz','hhhhhhhhhhhhhhhhhh','ccccccccccccccccaaaaaaaaaaw','Activo',NULL),(25,'oooooooooooooooooooooooooop','jjjjjjjjjjjjjjjjjjju','77777777755','111124344444444','xxxxxxxxxxxxz','bbbbbbbbbbbbbn','Activo',NULL),(26,'ghdddddddd','fhddddddddddddd','786867769','546547654','ghfhgh','hgfbgngng','Activo',NULL),(27,'fhdfhfdhfd','fdhdfhdhfdhh','5556757657','000000000000000000002','cfxgfhfh','vbcbvcbvcn','Inactivo',NULL),(28,'fgfdghfdhfd','hdfhfhgfhgf','657658566856','686587568','jgngfjfgjf','23214141343','Inactivo',NULL),(29,'yyyyyyyyyyyyyyyyyyyyyyyyyyyy','yyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyy','2134325235','42534634634636','gdfhdhd','fgggggggggggggggggg','Inactivo','apple-pro-display-xdr-abstract_5120x2880_xtrafondos.com.jpg'),(30,'Cereales Conflei','Avena','2','100MTS','Lote 1, Bajo el barranco','Nada que añadir','Activo',NULL),(31,'nose','zxczxczc','sdasdzxczxc','20','ninguna','asdad','Activo','cultivo-1759252543996.png');
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
  `image` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`idInsumo`)
) ENGINE=InnoDB AUTO_INCREMENT=54 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `insumo`
--

LOCK TABLES `insumo` WRITE;
/*!40000 ALTER TABLE `insumo` DISABLE KEYS */;
INSERT INTO `insumo` VALUES (1,'sdfgh','sdfghj','ertyui',3414.00,3456.00,11798784.00,'sdgfhgj','activo','1759252153608.png'),(2,'ergfth','dfsgh','sfdg',23456.00,3456.00,3456.00,'sdfgh','activo',NULL),(3,'ety','gfh','erfhgh',3542.00,3456.00,12241152.00,'fdgh','inactivo',NULL),(4,'rtyuhk','sdfg','dsfg',345.00,345.00,456.00,'sdfgh','activo',NULL),(5,'fdg','dfgh','sdfg',3449.00,45.00,155205.00,'sdfgh','activo',NULL),(6,'sdadzxc','cocoa','cm',7.00,20.00,140.00,'d12dasd','activo',NULL),(7,'Fertilizante','quinnua23123','kg',1233.00,123.00,151659.00,'ninguna','activo',NULL),(8,'nose','coco','cm',122.00,20.00,12.00,'123asd','activo',NULL),(9,'Abono','abionos','KG',2001.00,45000.00,45456456.00,'sffsafsa','inactivo',NULL),(10,'Abono','asaa','kg',446.00,200000.00,89200000.00,'Ahi suave','inactivo',NULL),(11,'Cualquiera','Nombre','Kg',10.00,10.00,20.00,'Ñajara','inactivo',NULL),(12,'Cualquiera','Nombre','Kg',10.00,10.00,20.00,'Ñajara','inactivo',NULL),(13,'Cualquiera','Nombre','Kg',10.00,10.00,20.00,'Ñajara','inactivo',NULL),(14,'Cualquiera','Nombre','Kg',10.00,10.00,20.00,'Ñajara','inactivo',NULL),(15,'Cualquiera','Nombre','Kg',10.00,10.00,20.00,'Ñajara','inactivo',NULL),(16,'Cualquiera','Nombre','Kg',10.00,10.00,20.00,'Ñajara','inactivo',NULL),(17,'noom,','ggjhj','kh',23.00,12.00,44.00,'gjkhhf','activo',NULL),(18,'noom,','ggjhj','kh',23.00,12.00,44.00,'gjkhhf','activo',NULL),(19,'noom,','ggjhj','kh',23.00,12.00,44.00,'gjkhhf','activo',NULL),(20,'noom,','ggjhj','kh',23.00,12.00,44.00,'gjkhhf','activo',NULL),(21,'noom,','ggjhj','kh',23.00,12.00,44.00,'gjkhhf','activo',NULL),(22,'noom,','ggjhj','kh',23.00,12.00,44.00,'gjkhhf','activo',NULL),(23,'trhth','hjfjgj','kg',23.00,23.00,778768.00,'fhgjgfhjjf','activo',NULL),(24,'trhth','hjfjgj','kg',23.00,23.00,778768.00,'fhgjgfhjjf','activo',NULL),(25,'trhth','hjfjgj','kg',23.00,23.00,778768.00,'fhgjgfhjjf','activo',NULL),(26,'trhth','hjfjgj','kg',23.00,23.00,778768.00,'fhgjgfhjjf','activo',NULL),(27,'trhth','hjfjgj','kg',23.00,23.00,778768.00,'fhgjgfhjjf','activo',NULL),(28,'trhth','hjfjgj','kg',23.00,23.00,778768.00,'fhgjgfhjjf','activo',NULL),(29,'trhth','hjfjgj','kg',23.00,23.00,778768.00,'fhgjgfhjjf','activo',NULL),(30,'trhth','hjfjgj','kg',23.00,23.00,778768.00,'fhgjgfhjjf','activo',NULL),(31,'trhth','hjfjgj','kg',23.00,23.00,778768.00,'fhgjgfhjjf','activo',NULL),(32,'tthfjf','yfjfyjfy','kgh',677.00,656.00,979878.00,'hvhmnv','activo',NULL),(33,'tthfjf','yfjfyjfy','kgh',677.00,656.00,979878.00,'hvhmnv','activo',NULL),(34,'tthfjf','yfjfyjfy','kgh',677.00,656.00,979878.00,'hvhmnv','activo',NULL),(35,'tthfjf','yfjfyjfy','kgh',677.00,656.00,979878.00,'hvhmnv','activo',NULL),(36,'tthfjf','yfjfyjfy','kgh',677.00,656.00,979878.00,'hvhmnv','activo',NULL),(37,'tthfjf','yfjfyjfy','kgh',677.00,656.00,979878.00,'hvhmnv','activo',NULL),(38,'tthfjf','yfjfyjfy','kgh',677.00,656.00,979878.00,'hvhmnv','activo',NULL),(39,'kk','ttyjh','kg',8.00,2.00,15.00,'hgjkhkjkjhkhjk','activo',NULL),(40,'kk','ttyjh','kg',8.00,2.00,15.00,'hgjkhkjkjhkhjk','activo',NULL),(41,'kk','ttyjh','kg',8.00,2.00,15.00,'hgjkhkjkjhkhjk','activo',NULL),(42,'kk','ttyjh','kg',8.00,2.00,15.00,'hgjkhkjkjhkhjk','activo',NULL),(43,'kk','ttyjh','kg',8.00,2.00,15.00,'hgjkhkjkjhkhjk','activo',NULL),(44,'kk','ttyjh','kg',8.00,2.00,15.00,'hgjkhkjkjhkhjk','activo',NULL),(45,'kk','ttyjh','kg',8.00,2.00,15.00,'hgjkhkjkjhkhjk','activo',NULL),(46,'jghjhg','hjhhgghkhgk','kg',10.00,10.00,56.00,'hgjghjg','activo',NULL),(47,'ghjjh','kgk','kg',2324234.00,565464.00,645645.00,'ghggjggjh','activo',NULL),(48,'hjhgjjgh','jhkhjkjh','kj',768.00,786.00,768678.00,'hghhgg','activo',NULL),(49,'gfhgf','hfghfgh','kg',24242.00,45435.00,656765.00,'ghghfg','activo',NULL),(50,'asdasd','asadasd','cm',123123.00,123213.00,13213.00,'dzxczxc','activo','1759221108175.png'),(51,'12asds','dad123','dasdad',20.00,123123.00,123.00,'asdas','activo','1759221528659.png'),(52,'chocolate','asdad','cm',1233.00,12312.00,123134.00,'zcxczc','activo','1759249148485.png'),(53,'chocolate','quinnua','cm',1222.00,123.00,233.00,'23123123','activo','1759251797972.png');
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
) ENGINE=InnoDB AUTO_INCREMENT=32 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `register`
--

LOCK TABLES `register` WRITE;
/*!40000 ALTER TABLE `register` DISABLE KEYS */;
INSERT INTO `register` VALUES (1,'superadmin','RC','21212','diomeds','qq@gmail.com','','Jorki4073','2025-03-30 19:14:10'),(2,'admin','TI','222','1','1@gmail.com','','www','2025-03-30 19:16:26'),(4,'superadmin','TI','11','man','123@gmail.com','444','cc','2025-03-30 19:24:22'),(5,'visitante','CC','11111','yo','valencia@gamiil.com','32332','pp','2025-03-30 19:31:35'),(8,'superadmin','TI','1234','el','mi@gmail.com','555','pp','2025-03-30 19:37:45'),(9,'admin','TI','456','fg','gbh@gmail.com','gth','gvbh','2025-04-05 18:03:56'),(10,'personal','RC','1231','yo','12345@gmail.com','567','hbj','2025-04-05 18:05:06'),(12,'personal','RC','2323','ti','4444@gmail.com','789','lll','2025-04-05 18:13:44'),(17,'personal','CC','789','mimo','aaaa@gmail.com','567','qp','2025-04-05 18:23:20'),(18,'admin','RC','34','enano','r@gmail.com','454','ppp','2025-04-05 19:02:17'),(20,'admin','PASAPORTE','786','tito','pele@gmail.com','5219','gh','2025-04-06 18:14:42'),(21,'visitante','RC','1324567','asfdghh','444444@gmail.com','3456789','ui','2025-04-08 06:08:08'),(22,'personal','RC','24356789','dsfghjkluryetw','valencia12@gamiil.com','34657899876','vih','2025-04-08 06:09:33'),(24,'admin','RC','756776','ccsdc','198@gmail.com','57644','wert','2025-04-21 23:40:10'),(25,'admin','CC','3131321','3123213','3312313@gams','213123','123123','2025-07-11 05:14:27'),(27,'admin','CC','1137059587','jordan valencia patiño','jordanvalenciap@gmail.com','3011186124','Jorki4073','2025-07-11 05:21:28'),(29,'admin','CC','1137059589','sdadadasd','jordanvalencia@gmail.com','3011186124','123123asd','2025-07-11 05:40:33'),(30,'admin','CC','232432423','Jose','info@gmail.com','3218456067','123456789','2025-09-16 16:36:55'),(31,'admin','RC','107788542','Yankee','yanke@gmail.com','3218456964','123456789','2025-09-16 16:48:57');
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
  `image` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`idSensor`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sensores`
--

LOCK TABLES `sensores` WRITE;
/*!40000 ALTER TABLE `sensores` DISABLE KEYS */;
INSERT INTO `sensores` VALUES (1,'www','wwww','hnj',3,'hbnjmk','Inactivo',NULL),(2,'tfygh','tyuhj','ghjk',67,'gyhj','Activo',NULL),(3,'etsrydfu','wretyu','sadfgy',23456,'wetsrdyfu','Activo',NULL),(4,'srdtfjyg','warestdyuiu','strdyfugih',2345678,'adsfghj','Activo',NULL),(5,'ewrtyy','ewrytui','ewrtyu',34567,'dsfghjk','Activo',NULL),(6,'dsfg','ewrty','wer',234,'sdefrgt','Activo',NULL),(7,'Sensor','WAT','F°',12,'eeeeeeeeeeee','Inactivo',NULL),(8,'Sensor3','WATer','F°',89,'JUUUUUUUU','Inactivo',NULL),(9,'asdasd','asdasd','cm',123123,'asdasd','Activo','1759220833380.png');
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
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `uso_insumo`
--

LOCK TABLES `uso_insumo` WRITE;
/*!40000 ALTER TABLE `uso_insumo` DISABLE KEYS */;
INSERT INTO `uso_insumo` VALUES (1,'2025-09-24',456.00,'dsfgh',345.00,345.00,'dsfgs','Nombre'),(2,'2025-05-06',20.00,'carlos',3456.00,69120.00,'Uso en asociación: coco','sdfghj'),(3,'2025-05-06',12.00,'asfdghh',3456.00,41472.00,'Uso en asociación actualizada: sdfg','sdfghj'),(4,'2025-07-09',1.00,'dsfghjkluryetw',45.00,45.00,'Uso en asociación: coco','dfgh'),(5,'2025-07-09',10.00,'asfdghh',3456.00,34560.00,'Uso en asociación: sdfgdddadzzz','sdfghj'),(6,'2025-07-11',1.00,'dsfghjkluryetw',45.00,45.00,'Uso en asociación: coco','dfgh'),(7,'2025-07-11',1.00,'dsfghjkluryetw',3456.00,3456.00,'Uso en asociación: coco','gfh'),(8,'2025-07-11',3.00,'1',45.00,135.00,'Uso en asociación: coco','dfgh'),(9,'2025-07-11',1.00,'1',3456.00,3456.00,'Uso en asociación: coco','gfh'),(10,'2025-07-11',1.00,'1',45.00,45.00,'Uso en asociación: coco','dfgh'),(11,'2025-07-11',1.00,'1',3456.00,3456.00,'Uso en asociación: coco','gfh'),(12,'2025-07-11',12.00,'1',20.00,240.00,'Uso en asociación: coco','cocoa'),(13,'2025-07-11',1.00,'1',45.00,45.00,'Uso en asociación: coco','dfgh'),(14,'2025-07-11',1.00,'1',3456.00,3456.00,'Uso en asociación: coco','gfh'),(15,'2025-07-11',1.00,'1',20.00,20.00,'Uso en asociación: coco','cocoa'),(16,'2025-09-29',200.00,'dsfgh',23.00,123.00,'asdzxczxc','Nombre');
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

-- Dump completed on 2025-09-30 12:34:01
