-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 27-08-2026 a las 17:34:31
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
  `DIA` int(2) NOT NULL,
  `MES` int(2) NOT NULL,
  `AÑO` int(4) NOT NULL,
  `FK_GASTO_CATEGORIA_GASTO` int(2) NOT NULL,
  `FK_GASTO_SALDO` int(11) NOT NULL,
  `IMPORTE` float NOT NULL,
  `DETALLE` varchar(150) CHARACTER SET utf8mb4 COLLATE utf8mb4_spanish_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish2_ci;

--
-- Volcado de datos para la tabla `gasto`
--

INSERT INTO `gasto` (`ID_GASTO`, `DIA`, `MES`, `AÑO`, `FK_GASTO_CATEGORIA_GASTO`, `FK_GASTO_SALDO`, `IMPORTE`, `DETALLE`) VALUES
(1, 19, 8, 2026, 1, 42, 10, '100g queso cremoso'),
(2, 20, 8, 2026, 1, 43, 25, '1 doc. de empanada'),
(3, 20, 8, 2026, 10, 43, 23, 'Siempre vivie, coco rallado, anís, canela, clavo de olor'),
(4, 1, 8, 2026, 1, 43, 14, '1 chocolate block grande'),
(5, 1, 8, 2026, 2, 43, 25, 'alimento de gato, verduras'),
(6, 1, 8, 2026, 2, 43, 6, '1 Aquarius'),
(7, 1, 8, 2026, 8, 43, 12, 'Nafta');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `ingreso`
--

CREATE TABLE `ingreso` (
  `ID_INGRESO` int(11) NOT NULL,
  `IMPORTE` decimal(12,2) NOT NULL,
  `FK_INGRESO_ORIGEN_INGRESO` int(1) NOT NULL,
  `DIA` int(2) NOT NULL,
  `MES` int(2) NOT NULL,
  `AÑO` int(4) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish2_ci;

--
-- Volcado de datos para la tabla `ingreso`
--

INSERT INTO `ingreso` (`ID_INGRESO`, `IMPORTE`, `FK_INGRESO_ORIGEN_INGRESO`, `DIA`, `MES`, `AÑO`) VALUES
(246, '108.00', 1, 1, 8, 2026),
(247, '108.00', 2, 1, 8, 2026),
(248, '108.00', 3, 1, 8, 2026);

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
(1, 'Carol'),
(2, 'Pablo'),
(3, 'Alquiler');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `saldo`
--

CREATE TABLE `saldo` (
  `ID_SALDO` int(11) NOT NULL,
  `IMPORTE` decimal(12,2) NOT NULL,
  `FK_SALDO_INGRESO` int(11) NOT NULL,
  `FK_SALDO_ORIGEN_INGRESO` int(11) NOT NULL,
  `DIA` int(2) NOT NULL,
  `MES` int(2) NOT NULL,
  `AÑO` int(4) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `saldo`
--

INSERT INTO `saldo` (`ID_SALDO`, `IMPORTE`, `FK_SALDO_INGRESO`, `FK_SALDO_ORIGEN_INGRESO`, `DIA`, `MES`, `AÑO`) VALUES
(42, '98.00', 246, 1, 19, 8, 2026),
(43, '3.00', 247, 2, 1, 8, 2026),
(44, '108.00', 248, 3, 1, 8, 2026);

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
  ADD KEY `ID_GASTO` (`FK_GASTO_SALDO`);

--
-- Indices de la tabla `ingreso`
--
ALTER TABLE `ingreso`
  ADD PRIMARY KEY (`ID_INGRESO`),
  ADD UNIQUE KEY `uq_origen_mes_anio` (`FK_INGRESO_ORIGEN_INGRESO`,`MES`,`AÑO`);

--
-- Indices de la tabla `origen_ingreso`
--
ALTER TABLE `origen_ingreso`
  ADD PRIMARY KEY (`ID_ORIGEN`);

--
-- Indices de la tabla `saldo`
--
ALTER TABLE `saldo`
  ADD PRIMARY KEY (`ID_SALDO`),
  ADD UNIQUE KEY `uc_saldo_fecha_origen` (`FK_SALDO_ORIGEN_INGRESO`,`DIA`,`MES`,`AÑO`),
  ADD KEY `ID_ORIGEN_INGRESO` (`FK_SALDO_ORIGEN_INGRESO`),
  ADD KEY `ID_INGRESO` (`FK_SALDO_INGRESO`) USING BTREE;

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
  MODIFY `ID_GASTO` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT de la tabla `ingreso`
--
ALTER TABLE `ingreso`
  MODIFY `ID_INGRESO` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=249;

--
-- AUTO_INCREMENT de la tabla `origen_ingreso`
--
ALTER TABLE `origen_ingreso`
  MODIFY `ID_ORIGEN` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT de la tabla `saldo`
--
ALTER TABLE `saldo`
  MODIFY `ID_SALDO` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=45;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `gasto`
--
ALTER TABLE `gasto`
  ADD CONSTRAINT `FK_GASTO_CATEGORIA_GASTO` FOREIGN KEY (`FK_GASTO_CATEGORIA_GASTO`) REFERENCES `categoria_gasto` (`ID_CATEGORIA_GASTO`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `FK_GASTO_SALDO` FOREIGN KEY (`FK_GASTO_SALDO`) REFERENCES `saldo` (`ID_SALDO`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Filtros para la tabla `ingreso`
--
ALTER TABLE `ingreso`
  ADD CONSTRAINT `FK_INGRESO_ORIGEN_INGRESO` FOREIGN KEY (`FK_INGRESO_ORIGEN_INGRESO`) REFERENCES `origen_ingreso` (`ID_ORIGEN`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Filtros para la tabla `saldo`
--
ALTER TABLE `saldo`
  ADD CONSTRAINT `FK_SALDO_INGRESO` FOREIGN KEY (`FK_SALDO_INGRESO`) REFERENCES `ingreso` (`ID_INGRESO`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `FK_SALDO_ORIGEN_INGRESO` FOREIGN KEY (`FK_SALDO_ORIGEN_INGRESO`) REFERENCES `origen_ingreso` (`ID_ORIGEN`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
