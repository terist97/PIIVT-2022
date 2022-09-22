-- --------------------------------------------------------
-- Host:                         localhost
-- Server version:               10.4.14-MariaDB - mariadb.org binary distribution
-- Server OS:                    Win64
-- HeidiSQL Version:             11.2.0.6213
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


-- Dumping database structure for piivt_app
CREATE DATABASE IF NOT EXISTS `piivt_app` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci */;
USE `piivt_app`;

-- Dumping structure for table piivt_app.administrator
CREATE TABLE IF NOT EXISTS `administrator` (
  `administrator_id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `username` varchar(64) COLLATE utf8mb4_unicode_ci NOT NULL,
  `password_hash` varchar(128) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `is_active` tinyint(1) unsigned NOT NULL DEFAULT 1,
  PRIMARY KEY (`administrator_id`),
  UNIQUE KEY `uq_administrator_username` (`username`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table piivt_app.administrator: ~11 rows (approximately)
/*!40000 ALTER TABLE `administrator` DISABLE KEYS */;
INSERT INTO `administrator` (`administrator_id`, `username`, `password_hash`, `created_at`, `is_active`) VALUES
	(13, 'adminprijava', '$2b$10$zAerEMETqWxOncZd4tdzVOSdHobB2/8s14ujsiX4KK412QdiLTvUq', '2022-09-22 00:46:45', 1),
	(15, 'adminproba', '$2b$10$Bd0yvBeb7wtJnN.qHBCTYOHv1Q4.omQdTv3GhE0l35dcPRrzsmKOG', '2022-09-22 14:02:42', 1);
/*!40000 ALTER TABLE `administrator` ENABLE KEYS */;

-- Dumping structure for table piivt_app.category
CREATE TABLE IF NOT EXISTS `category` (
  `category_id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(32) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `photo_name` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `photo_path` text COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`category_id`),
  UNIQUE KEY `uq_category_name` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=29 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table piivt_app.category: ~8 rows (approximately)
/*!40000 ALTER TABLE `category` DISABLE KEYS */;
INSERT INTO `category` (`category_id`, `name`, `description`, `photo_name`, `photo_path`) VALUES
	(1, 'Bela Tehnika', 'Ovde se nalaze uredjaji koji pripadaju kategoriji bela tehnika, tu spadaju masine, frizideri, zamrzivaci.', 'df34d7ac-3eb2-439e-93f1-77ed4c0c1c50-bela.jpg', 'uploads/2022/09/df34d7ac-3eb2-439e-93f1-77ed4c0c1c50-bela.jpg'),
	(3, 'Klima uredjaji', 'Ovde se nalaze uredjaji koji pripadaju kategoriji klima uredjaji', 'b2710768-6d38-42c0-b595-b2c0f74cfed0-klima.png', 'uploads/2022/09/b2710768-6d38-42c0-b595-b2c0f74cfed0-klima.png'),
	(10, 'Mobilni telefoni', 'Ovde se nalaze uredjaji koji pripadaju kategoriji mobilni telefoni', '918afd19-5fc7-4f10-abe6-85450c5081c0-mobils.jpg', 'uploads/2022/09/918afd19-5fc7-4f10-abe6-85450c5081c0-mobils.jpg');
/*!40000 ALTER TABLE `category` ENABLE KEYS */;

-- Dumping structure for table piivt_app.item
CREATE TABLE IF NOT EXISTS `item` (
  `item_id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(128) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `category_id` int(10) unsigned NOT NULL,
  `price` decimal(10,2) unsigned NOT NULL,
  `is_active` tinyint(1) unsigned NOT NULL DEFAULT 1,
  `photo_name` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `photo_path` text COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`item_id`),
  UNIQUE KEY `uq_item_name_category_id` (`name`,`category_id`),
  KEY `fk_item_category_id` (`category_id`),
  CONSTRAINT `fk_item_category_id` FOREIGN KEY (`category_id`) REFERENCES `category` (`category_id`) ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=86 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table piivt_app.item: ~27 rows (approximately)
/*!40000 ALTER TABLE `item` DISABLE KEYS */;
INSERT INTO `item` (`item_id`, `name`, `description`, `category_id`, `price`, `is_active`, `photo_name`, `photo_path`) VALUES
	(5, 'HISENSE AST-12UW4RVED', 'Hisense klima uredjaj AST-12UW4RVED\nInverter\nSerija NOBLE PLUS\nModel spoljne jednice: AST-12UW4RVED\nModel unutrašnje jedinice: AST-12UW4RVED\n\nEnergetska klasa hlađenje A++\nEnergetska klasa grejanje A+\n\nEER 3.5\nCOP 3.90\nSEER 6,1\nSCOP 4.0\nKapacitet grejanja (kW) 4.20 (1.00 - 4.30)\nKapacitet Hlađenja (kW) 3.50 (1.00 - 4.10)\nNominalni kapacitet 12000 BTU', 3, 24440.00, 1, 'aed3d872-6aa7-4868-987e-49f9193a74de-klima2.jpg', 'uploads/2022/09/aed3d872-6aa7-4868-987e-49f9193a74de-klima2.jpg'),
	(6, 'GREE Inverter Pular Eco', 'Opseg radne temperature:\nGrejanje: Od -15°C do +24°C\nHlađenje: Od +18°C do +43°C\nSamodijagnostika\nTurbo funkcija\nAuto-restart\nTajmer\nAutomatski režim rada\nOpcija zaključavanja\nInteligentno zamrzavanje\n7 brzina rada\nZaštita od visokog i niskog napona', 3, 45000.00, 1, '13449577-a305-48c5-ad90-66b903c78f0d-klima3.png', 'uploads/2022/09/13449577-a305-48c5-ad90-66b903c78f0d-klima3.png'),
	(23, 'Indesit masina', 'Ovo je neka stavkasafsa Ovo je neka stavkasafsa Ovo je neka stavkasafsa Ovo je neka stavkasafsa', 1, 27000.00, 0, '5437c092-ffe1-4ebe-b523-f954af50b876-masina.png', 'uploads/2022/09/5437c092-ffe1-4ebe-b523-f954af50b876-masina.png'),
	(33, 'Hisense Expert smart', 'Lider u prodaji elektronske robe široke potrošnje. Tehnomanija u ponudi ima više od 20.000 artikala uz mogućnost plaćanja na 24 rate bez kamate. Više na tehnomanija.rs Više', 3, 60200.00, 0, 'f79e0ab5-5e2e-43a6-8576-d1b99175be52-klima5.jpg', 'uploads/2022/09/f79e0ab5-5e2e-43a6-8576-d1b99175be52-klima5.jpg'),
	(37, 'Poco x3 Pro', 'Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old. Richard McClintock, a Latin professor at Hampden-Sydney College in Virginia, looked up one of the more obscure Latin words, consectetur, from a Lorem Ipsum passage, and going through the cites of the word in classical literature, discovered the undoubtable source. Lorem Ipsum \n\n', 10, 35500.00, 0, '62a0b2ee-c256-4579-9bfb-e49db21adbd9-pocox3.jpg', 'uploads/2022/09/62a0b2ee-c256-4579-9bfb-e49db21adbd9-pocox3.jpg'),
	(38, 'Xiaomi Redmi note 11 pro', 'Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old. Richard McClintock, a Latin professor at Hampden-Sydney College in Virginia, looked up one of the more obscure Latin words, consectetur, from a Lorem Ipsum passage, ', 10, 32000.00, 0, '9f84d9f6-9143-4ad3-866c-64edb96e246b-pocox3.jpg', 'uploads/2022/09/9f84d9f6-9143-4ad3-866c-64edb96e246b-pocox3.jpg'),
	(85, 'Redmi note 10 Pro', 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the . ', 10, 20000.00, 1, '2c22ddba-d2cc-4903-a199-5e0f2a519ee6-redmi103.png', 'uploads/2022/09/2c22ddba-d2cc-4903-a199-5e0f2a519ee6-redmi103.png');
/*!40000 ALTER TABLE `item` ENABLE KEYS */;

-- Dumping structure for table piivt_app.order
CREATE TABLE IF NOT EXISTS `order` (
  `order_id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `forename` varchar(32) COLLATE utf8mb4_unicode_ci NOT NULL,
  `surname` varchar(32) COLLATE utf8mb4_unicode_ci NOT NULL,
  `address` varchar(32) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(32) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`order_id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table piivt_app.order: ~2 rows (approximately)
/*!40000 ALTER TABLE `order` DISABLE KEYS */;
INSERT INTO `order` (`order_id`, `created_at`, `forename`, `surname`, `address`, `email`) VALUES
	(1, '2022-09-12 13:11:02', 'Strahinja', 'Mladenovic', 'Kumodraska 68', 'strahinj@gmail.com'),
	(2, '2022-09-12 13:11:32', 'Veljko', 'Mladenovic', 'Cetinjska 44', 'veljabreee@gmail.com'),
	(8, '2022-09-22 01:15:06', 'Strahinja', 'Mladenovic', 'Kumodraska 68, Beograd', 'strahinj@gmail.com');
/*!40000 ALTER TABLE `order` ENABLE KEYS */;

-- Dumping structure for table piivt_app.order_item
CREATE TABLE IF NOT EXISTS `order_item` (
  `order_id` int(10) unsigned NOT NULL,
  `item_id` int(10) unsigned NOT NULL,
  KEY `fk_order_item_item_id` (`item_id`) USING BTREE,
  KEY `fk_order_item_order_id` (`order_id`) USING BTREE,
  CONSTRAINT `fk_order_item_item_id` FOREIGN KEY (`item_id`) REFERENCES `item` (`item_id`) ON UPDATE CASCADE,
  CONSTRAINT `fk_order_item_order_id` FOREIGN KEY (`order_id`) REFERENCES `order` (`order_id`) ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table piivt_app.order_item: ~2 rows (approximately)
/*!40000 ALTER TABLE `order_item` DISABLE KEYS */;
INSERT INTO `order_item` (`order_id`, `item_id`) VALUES
	(1, 33),
	(1, 23),
	(1, 5);
/*!40000 ALTER TABLE `order_item` ENABLE KEYS */;

/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
