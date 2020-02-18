-- phpMyAdmin SQL Dump
-- version 4.8.0
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: 18-Fev-2020 às 05:10
-- Versão do servidor: 10.1.31-MariaDB
-- PHP Version: 7.2.4

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `lendy`
--

-- --------------------------------------------------------

--
-- Estrutura da tabela `offer`
--

CREATE TABLE `offer` (
  `id` int(11) NOT NULL,
  `active` tinyint(1) NOT NULL,
  `from_user` int(11) NOT NULL,
  `value` float NOT NULL,
  `fee` float NOT NULL,
  `days` int(11) NOT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Estrutura da tabela `request`
--

CREATE TABLE `request` (
  `id` int(11) NOT NULL,
  `active` tinyint(1) NOT NULL,
  `from_user` int(11) NOT NULL,
  `value` float NOT NULL,
  `fee` float NOT NULL,
  `days` int(11) NOT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Estrutura da tabela `user`
--

CREATE TABLE `user` (
  `id` int(11) NOT NULL,
  `name` varchar(64) DEFAULT NULL,
  `email` varchar(64) DEFAULT NULL,
  `cpf` varchar(11) DEFAULT NULL,
  `password` varchar(64) DEFAULT NULL,
  `token` varchar(32) DEFAULT NULL,
  `reset_token` varchar(64) DEFAULT NULL,
  `status` int(11) DEFAULT '0',
  `type` int(11) DEFAULT NULL,
  `addr_country` varchar(32) DEFAULT NULL,
  `addr_state` varchar(32) DEFAULT NULL,
  `addr_city` varchar(32) DEFAULT NULL,
  `addr_neighborhood` varchar(32) DEFAULT NULL,
  `addr_cep` int(8) DEFAULT NULL,
  `addr_street` varchar(32) DEFAULT NULL,
  `addr_number` int(8) DEFAULT NULL,
  `addr_complement` varchar(32) DEFAULT NULL,
  `rating` float DEFAULT NULL,
  `max_offers` int(11) DEFAULT NULL,
  `image` blob,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  `last_login` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `offer`
--
ALTER TABLE `offer`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `request`
--
ALTER TABLE `request`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `id` (`id`),
  ADD UNIQUE KEY `cpf` (`cpf`),
  ADD UNIQUE KEY `email` (`email`),
  ADD UNIQUE KEY `email_2` (`email`,`cpf`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `offer`
--
ALTER TABLE `offer`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `request`
--
ALTER TABLE `request`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=25;

--
-- AUTO_INCREMENT for table `user`
--
ALTER TABLE `user`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=31;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
