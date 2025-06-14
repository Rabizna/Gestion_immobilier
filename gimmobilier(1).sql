-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Hôte : 127.0.0.1:3306
-- Généré le : jeu. 23 mai 2024 à 09:03
-- Version du serveur : 8.0.33
-- Version de PHP : 8.2.13

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de données : `gimmobilier`
--

-- --------------------------------------------------------

--
-- Structure de la table `achat`
--

DROP TABLE IF EXISTS `achat`;
CREATE TABLE IF NOT EXISTS `achat` (
  `id` int NOT NULL,
  `TypeAchat` int DEFAULT NULL,
  `DateAchat` date DEFAULT NULL,
  `NumCli` int DEFAULT NULL,
  `NumLog` int DEFAULT NULL,
  KEY `NumLog` (`NumLog`),
  KEY `NumCli` (`NumCli`),
  KEY `fk_type_achat` (`TypeAchat`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Déchargement des données de la table `achat`
--

INSERT INTO `achat` (`id`, `TypeAchat`, `DateAchat`, `NumCli`, `NumLog`) VALUES
(0, 1, '2024-02-02', 1, 1);

-- --------------------------------------------------------

--
-- Structure de la table `agence`
--

DROP TABLE IF EXISTS `agence`;
CREATE TABLE IF NOT EXISTS `agence` (
  `CodeAg` int NOT NULL AUTO_INCREMENT,
  `LibAg` char(50) NOT NULL,
  `CodePro` int DEFAULT NULL,
  PRIMARY KEY (`CodeAg`),
  KEY `CodePro` (`CodePro`)
) ENGINE=MyISAM AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Déchargement des données de la table `agence`
--

INSERT INTO `agence` (`CodeAg`, `LibAg`, `CodePro`) VALUES
(2, 'Agence Antanifotsy', 1);

-- --------------------------------------------------------

--
-- Structure de la table `cite`
--

DROP TABLE IF EXISTS `cite`;
CREATE TABLE IF NOT EXISTS `cite` (
  `CodeCite` int NOT NULL,
  `LibCite` char(50) DEFAULT NULL,
  `CodeAg` int DEFAULT NULL,
  PRIMARY KEY (`CodeCite`),
  KEY `CodeAg` (`CodeAg`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Déchargement des données de la table `cite`
--

INSERT INTO `cite` (`CodeCite`, `LibCite`, `CodeAg`) VALUES
(1, 'Soanierana', 1),
(2, 'Antanifotsy', 1);

-- --------------------------------------------------------

--
-- Structure de la table `client`
--

DROP TABLE IF EXISTS `client`;
CREATE TABLE IF NOT EXISTS `client` (
  `NumCli` int NOT NULL,
  `NomCli` char(50) DEFAULT NULL,
  `PrenomCli` char(150) DEFAULT NULL,
  `AdresseCli` char(50) DEFAULT NULL,
  PRIMARY KEY (`NumCli`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Déchargement des données de la table `client`
--

INSERT INTO `client` (`NumCli`, `NomCli`, `PrenomCli`, `AdresseCli`) VALUES
(1, 'Boto', 'Léonid', 'Soanerana');

-- --------------------------------------------------------

--
-- Structure de la table `logement`
--

DROP TABLE IF EXISTS `logement`;
CREATE TABLE IF NOT EXISTS `logement` (
  `NumLog` int NOT NULL AUTO_INCREMENT,
  `PrixLog` float(10,2) NOT NULL,
  `ImageLog` char(150) DEFAULT NULL,
  `codeCite` int DEFAULT NULL,
  `terrain` float DEFAULT NULL,
  `NomLog` char(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `description` text,
  PRIMARY KEY (`NumLog`),
  KEY `codeCite` (`codeCite`),
  KEY `NumTe` (`terrain`)
) ENGINE=MyISAM AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Déchargement des données de la table `logement`
--

INSERT INTO `logement` (`NumLog`, `PrixLog`, `ImageLog`, `codeCite`, `terrain`, `NomLog`, `description`) VALUES
(1, 10000000.00, NULL, 1, 2500, 'Maison blanche', NULL);

-- --------------------------------------------------------

--
-- Structure de la table `payment`
--

DROP TABLE IF EXISTS `payment`;
CREATE TABLE IF NOT EXISTS `payment` (
  `CodePay` int NOT NULL,
  `MontantPay` float(10,2) DEFAULT NULL,
  `ModePay` char(50) DEFAULT NULL,
  PRIMARY KEY (`CodePay`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Structure de la table `province`
--

DROP TABLE IF EXISTS `province`;
CREATE TABLE IF NOT EXISTS `province` (
  `CodePro` int NOT NULL,
  `LibPro` char(50) NOT NULL,
  PRIMARY KEY (`CodePro`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Déchargement des données de la table `province`
--

INSERT INTO `province` (`CodePro`, `LibPro`) VALUES
(1, 'Fianarantsoa'),
(2, 'Antananarivo'),
(3, 'Toliara'),
(4, 'Antsiranana'),
(5, 'Mahajanga'),
(6, 'Toamasina');

-- --------------------------------------------------------

--
-- Structure de la table `terrain`
--

DROP TABLE IF EXISTS `terrain`;
CREATE TABLE IF NOT EXISTS `terrain` (
  `NumTer` int NOT NULL,
  `super` char(50) DEFAULT NULL,
  PRIMARY KEY (`NumTer`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Déchargement des données de la table `terrain`
--

INSERT INTO `terrain` (`NumTer`, `super`) VALUES
(1, '200000');

-- --------------------------------------------------------

--
-- Structure de la table `type_achat`
--

DROP TABLE IF EXISTS `type_achat`;
CREATE TABLE IF NOT EXISTS `type_achat` (
  `id` int DEFAULT NULL,
  `LibAchat` char(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Déchargement des données de la table `type_achat`
--

INSERT INTO `type_achat` (`id`, `LibAchat`) VALUES
(1, 'Comptant'),
(2, 'Crédit');
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
