CREATE DATABASE  IF NOT EXISTS `test` ;
USE `test`;

DROP TABLE IF EXISTS `client`;
CREATE TABLE `client` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(45) DEFAULT NULL,
  `address` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1244 DEFAULT CHARSET=utf8;

DROP TABLE IF EXISTS `product`;
CREATE TABLE `product` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(45) DEFAULT NULL,
  `quantity` int(11) ,
  `price` real(9) , --real sau double , in sql am selectat double 
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1244 DEFAULT CHARSET=utf8;

DROP TABLE IF EXISTS `orderi`; --daca puneam order dadea eroare ,ca era variabila folosita
CREATE TABLE `orderi` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nameclient` varchar(45) DEFAULT NULL,
  `nameproduct` varchar(45) DEFAULT NULL,
  `quantity` int(11) 
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1244 DEFAULT CHARSET=utf8;

DROP TABLE IF EXISTS `bill`;
CREATE TABLE `bill` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nameclient` varchar(45) DEFAULT NULL,
  `nameproduct` varchar(45) DEFAULT NULL,
  `quantity` int(11) ,
  `totalprice` real(9) ,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1244 DEFAULT CHARSET=utf8;


UNLOCK TABLES;

