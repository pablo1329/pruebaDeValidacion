-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 19-06-2026 a las 17:43:09
-- Versión del servidor: 10.4.25-MariaDB
-- Versión de PHP: 8.1.10

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `admecon`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `categoria_gasto`
--

CREATE TABLE `categoria_gasto` (
  `ID_CATEGORIA_GASTO` int(11) NOT NULL,
  `CATEGORIA` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_spanish_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish2_ci;

--
-- Volcado de datos para la tabla `categoria_gasto`
--

INSERT INTO `categoria_gasto` (`ID_CATEGORIA_GASTO`, `CATEGORIA`) VALUES
(1, 'COMIDA'),
(2, 'ALMACEN'),
(3, 'SERVICIO'),
(4, 'TARJETA DE CREDITO'),
(5, 'INDUMENTARIA'),
(6, 'MEDICAMENTOS'),
(7, 'JUGUETES/RECREACION'),
(8, 'SERV. AUTOMOTOR'),
(9, 'ARTÍCULO DE OFICINA'),
(10, 'OTRO');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `gasto`
--

CREATE TABLE `gasto` (
  `ID_GASTO` int(11) NOT NULL,
  `FECHA` date NOT NULL,
  `FK_GASTO_CATEGORIA_GASTO` int(2) NOT NULL,
  `FK_GASTO_ORIGEN_INGRESO` int(11) NOT NULL,
  `IMPORTE` float NOT NULL,
  `DETALLE` varchar(150) CHARACTER SET utf8mb4 COLLATE utf8mb4_spanish_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish2_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `ingreso`
--

CREATE TABLE `ingreso` (
  `ID_INGRESO` int(11) NOT NULL,
  `FECHA` date NOT NULL,
  `IMPORTE` decimal(12,2) NOT NULL,
  `FK_INGRESO_ORIGEN_INGRESO` int(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish2_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `origen_ingreso`
--

CREATE TABLE `origen_ingreso` (
  `ID_ORIGEN` int(11) NOT NULL,
  `ORIGEN` varchar(25) COLLATE utf8mb4_spanish2_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish2_ci;

--
-- Volcado de datos para la tabla `origen_ingreso`
--

INSERT INTO `origen_ingreso` (`ID_ORIGEN`, `ORIGEN`) VALUES
(1, 'Guzman Carol Isabel'),
(2, 'Britez Pablo Fernando'),
(3, 'Alquiler');

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `categoria_gasto`
--
ALTER TABLE `categoria_gasto`
  ADD PRIMARY KEY (`ID_CATEGORIA_GASTO`);

--
-- Indices de la tabla `gasto`
--
ALTER TABLE `gasto`
  ADD PRIMARY KEY (`ID_GASTO`),
  ADD KEY `ID_CATEGORIA_GASTO` (`FK_GASTO_CATEGORIA_GASTO`),
  ADD KEY `FK_GASTO_ORIGEN_INGRESO` (`FK_GASTO_ORIGEN_INGRESO`);

--
-- Indices de la tabla `ingreso`
--
ALTER TABLE `ingreso`
  ADD PRIMARY KEY (`ID_INGRESO`),
  ADD KEY `FK_INGRESO_ORIGEN_INGRESO` (`FK_INGRESO_ORIGEN_INGRESO`);

--
-- Indices de la tabla `origen_ingreso`
--
ALTER TABLE `origen_ingreso`
  ADD PRIMARY KEY (`ID_ORIGEN`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `categoria_gasto`
--
ALTER TABLE `categoria_gasto`
  MODIFY `ID_CATEGORIA_GASTO` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT de la tabla `gasto`
--
ALTER TABLE `gasto`
  MODIFY `ID_GASTO` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `ingreso`
--
ALTER TABLE `ingreso`
  MODIFY `ID_INGRESO` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT de la tabla `origen_ingreso`
--
ALTER TABLE `origen_ingreso`
  MODIFY `ID_ORIGEN` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `gasto`
--
ALTER TABLE `gasto`
  ADD CONSTRAINT `FK_GASTO_CATEGORIA_GASTO` FOREIGN KEY (`FK_GASTO_CATEGORIA_GASTO`) REFERENCES `categoria_gasto` (`ID_CATEGORIA_GASTO`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `FK_GASTO_ORIGEN_INGRESO` FOREIGN KEY (`FK_GASTO_ORIGEN_INGRESO`) REFERENCES `origen_ingreso` (`ID_ORIGEN`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Filtros para la tabla `ingreso`
--
ALTER TABLE `ingreso`
  ADD CONSTRAINT `FK_INGRESO_ORIGEN_INGRESO` FOREIGN KEY (`FK_INGRESO_ORIGEN_INGRESO`) REFERENCES `origen_ingreso` (`ID_ORIGEN`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
