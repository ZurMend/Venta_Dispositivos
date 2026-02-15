-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 15-02-2026 a las 18:51:22
-- Versión del servidor: 10.4.32-MariaDB
-- Versión de PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `techstoredb`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `orders`
--

CREATE TABLE `orders` (
  `id` bigint(20) NOT NULL,
  `user_id` bigint(20) NOT NULL,
  `total` decimal(12,2) NOT NULL,
  `status` enum('pending','confirmed','shipped','delivered') NOT NULL DEFAULT 'pending',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `orders`
--

INSERT INTO `orders` (`id`, `user_id`, `total`, `status`, `created_at`, `updated_at`) VALUES
(1001, 1, 1449.98, 'delivered', '2025-12-01 16:00:00', '2026-02-15 17:48:41'),
(1002, 2, 2409.96, 'shipped', '2025-12-15 20:30:00', '2026-02-15 17:48:41'),
(1003, 4, 1699.97, 'confirmed', '2026-01-05 15:15:00', '2026-02-15 17:48:41'),
(1004, 1, 349.99, 'pending', '2026-01-28 22:45:00', '2026-02-15 17:48:41'),
(1005, 5, 1469.98, 'delivered', '2026-02-01 17:20:00', '2026-02-15 17:48:41');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `order_items`
--

CREATE TABLE `order_items` (
  `id` bigint(20) NOT NULL,
  `order_id` bigint(20) NOT NULL,
  `product_id` bigint(20) NOT NULL,
  `product_name` varchar(255) NOT NULL,
  `quantity` int(11) NOT NULL DEFAULT 1,
  `price` decimal(10,2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `order_items`
--

INSERT INTO `order_items` (`id`, `order_id`, `product_id`, `product_name`, `quantity`, `price`) VALUES
(1, 1001, 1, 'iPhone 15 Pro Max', 1, 1199.99),
(2, 1001, 5, 'AirPods Pro 2', 1, 249.99),
(3, 1002, 6, 'NVIDIA RTX 4090', 1, 1599.99),
(4, 1002, 7, 'AMD Ryzen 9 7950X', 1, 549.99),
(5, 1002, 9, 'Corsair Vengeance DDR5 32GB', 2, 129.99),
(6, 1003, 8, 'Monitor LG UltraGear 27\" 4K', 2, 799.99),
(7, 1003, 11, 'Logitech MX Master 3S', 1, 99.99),
(8, 1004, 3, 'Sony WH-1000XM5', 1, 349.99),
(9, 1005, 2, 'Samsung Galaxy S24 Ultra', 1, 1299.99),
(10, 1005, 12, 'Teclado Mecanico Keychron Q1', 1, 169.99);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `products`
--

CREATE TABLE `products` (
  `id` bigint(20) NOT NULL,
  `name` varchar(255) NOT NULL,
  `description` text NOT NULL,
  `price` decimal(10,2) NOT NULL,
  `category` enum('electronics','pc') NOT NULL,
  `image` varchar(500) NOT NULL DEFAULT '/images/placeholder.jpg',
  `stock` int(11) NOT NULL DEFAULT 0,
  `brand` varchar(100) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `products`
--

INSERT INTO `products` (`id`, `name`, `description`, `price`, `category`, `image`, `stock`, `brand`, `created_at`, `updated_at`) VALUES
(1, 'iPhone 15 Pro Max', 'Smartphone con chip A17 Pro, pantalla Super Retina XDR de 6.7 pulgadas, sistema de camara triple de 48MP y cuerpo de titanio.', 1199.99, 'electronics', '/images/iphone.jpg', 25, 'Apple', '2026-02-15 17:48:41', '2026-02-15 17:48:41'),
(2, 'Samsung Galaxy S24 Ultra', 'Smartphone con procesador Snapdragon 8 Gen 3, pantalla Dynamic AMOLED 2X, S Pen integrado y camara de 200MP.', 1299.99, 'electronics', '/images/samsung.jpg', 18, 'Samsung', '2026-02-15 17:48:41', '2026-02-15 17:48:41'),
(3, 'Sony WH-1000XM5', 'Audifonos inalambricos premium con cancelacion de ruido adaptativa, 30 horas de bateria y audio de alta resolucion.', 349.99, 'electronics', '/images/sony-headphones.jpg', 40, 'Sony', '2026-02-15 17:48:41', '2026-02-15 17:48:41'),
(4, 'iPad Pro M4', 'Tablet con chip M4, pantalla Liquid Retina XDR de 12.9 pulgadas, compatible con Apple Pencil Pro.', 1099.99, 'electronics', '/images/ipad.jpg', 15, 'Apple', '2026-02-15 17:48:41', '2026-02-15 17:48:41'),
(5, 'AirPods Pro 2', 'Audifonos inalambricos con cancelacion activa de ruido, audio espacial y estuche con carga USB-C.', 249.99, 'electronics', '/images/airpods.jpg', 60, 'Apple', '2026-02-15 17:48:41', '2026-02-15 17:48:41'),
(6, 'NVIDIA RTX 4090', 'Tarjeta grafica con 24GB GDDR6X, arquitectura Ada Lovelace, ray tracing de tercera generacion y DLSS 3.', 1599.99, 'pc', '/images/rtx4090.jpg', 8, 'NVIDIA', '2026-02-15 17:48:41', '2026-02-15 17:48:41'),
(7, 'AMD Ryzen 9 7950X', 'Procesador de 16 nucleos y 32 hilos, arquitectura Zen 4, 5.7GHz de frecuencia maxima y soporte DDR5.', 549.99, 'pc', '/images/ryzen9.jpg', 20, 'AMD', '2026-02-15 17:48:41', '2026-02-15 17:48:41'),
(8, 'Monitor LG UltraGear 27\" 4K', 'Monitor gaming 4K UHD, 144Hz, 1ms de respuesta, HDR600, panel Nano IPS y compatibilidad G-Sync.', 799.99, 'pc', '/images/monitor-lg.jpg', 12, 'LG', '2026-02-15 17:48:41', '2026-02-15 17:48:41'),
(9, 'Corsair Vengeance DDR5 32GB', 'Kit de memoria RAM DDR5-6000MHz CL36, perfil Intel XMP 3.0, disipador de calor de aluminio.', 129.99, 'pc', '/images/ram-corsair.jpg', 50, 'Corsair', '2026-02-15 17:48:41', '2026-02-15 17:48:41'),
(10, 'Samsung 990 Pro 2TB NVMe', 'SSD NVMe M.2 con velocidades de lectura hasta 7,450MB/s, tecnologia V-NAND y controlador Samsung.', 179.99, 'pc', '/images/ssd-samsung.jpg', 35, 'Samsung', '2026-02-15 17:48:41', '2026-02-15 17:48:41'),
(11, 'Logitech MX Master 3S', 'Mouse inalambrico ergonomico con sensor de 8000 DPI, scroll MagSpeed, USB-C y conexion multi-dispositivo.', 99.99, 'pc', '/images/mouse-logitech.jpg', 45, 'Logitech', '2026-02-15 17:48:41', '2026-02-15 17:48:41'),
(12, 'Teclado Mecanico Keychron Q1', 'Teclado mecanico 75%, cuerpo de aluminio CNC, hot-swappable, compatible con Mac y Windows, retroiluminacion RGB.', 169.99, 'pc', '/images/keyboard-keychron.jpg', 22, 'Keychron', '2026-02-15 17:48:41', '2026-02-15 17:48:41');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `users`
--

CREATE TABLE `users` (
  `id` bigint(20) NOT NULL,
  `name` varchar(150) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` enum('client','admin') NOT NULL DEFAULT 'client',
  `phone` varchar(30) DEFAULT NULL,
  `address` varchar(500) DEFAULT NULL,
  `registered_at` date NOT NULL DEFAULT curdate(),
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `users`
--

INSERT INTO `users` (`id`, `name`, `email`, `password`, `role`, `phone`, `address`, `registered_at`, `created_at`, `updated_at`) VALUES
(1, 'Zuri Yamil', 'zuri@gmail.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'client', '+52 55 1234 5678', 'Av. Reforma 123, CDMX', '2025-08-15', '2026-02-15 17:48:40', '2026-02-15 17:48:40'),
(2, 'Fernando Rivas', 'fer@gmail.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'client', '+52 33 9876 5432', 'Calle Juarez 456, Guadalajara', '2025-09-02', '2026-02-15 17:48:40', '2026-02-15 17:48:40'),
(3, 'Admin TechStore', 'admin@techstore.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'admin', '+52 81 5555 1234', 'Oficinas Centrales', '2025-01-01', '2026-02-15 17:48:40', '2026-02-15 17:48:40'),
(4, 'Luis Rodriguez', 'luis@rogd.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'client', '+52 22 4567 8901', 'Blvd. Norte 789, Monterrey', '2025-10-10', '2026-02-15 17:48:40', '2026-02-15 17:48:40'),
(5, 'Ana Lopez', 'ana@example.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'client', '+52 44 3210 9876', 'Calle Sur 321, Puebla', '2025-11-20', '2026-02-15 17:48:40', '2026-02-15 17:48:40');

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `orders`
--
ALTER TABLE `orders`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_orders_user_id` (`user_id`),
  ADD KEY `idx_orders_status` (`status`),
  ADD KEY `idx_orders_created_at` (`created_at`);

--
-- Indices de la tabla `order_items`
--
ALTER TABLE `order_items`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_order_items_order_id` (`order_id`),
  ADD KEY `idx_order_items_product_id` (`product_id`);

--
-- Indices de la tabla `products`
--
ALTER TABLE `products`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_products_category` (`category`),
  ADD KEY `idx_products_brand` (`brand`),
  ADD KEY `idx_products_price` (`price`);

--
-- Indices de la tabla `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`),
  ADD KEY `idx_users_email` (`email`),
  ADD KEY `idx_users_role` (`role`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `orders`
--
ALTER TABLE `orders`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=1006;

--
-- AUTO_INCREMENT de la tabla `order_items`
--
ALTER TABLE `order_items`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT de la tabla `products`
--
ALTER TABLE `products`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT de la tabla `users`
--
ALTER TABLE `users`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `orders`
--
ALTER TABLE `orders`
  ADD CONSTRAINT `fk_orders_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Filtros para la tabla `order_items`
--
ALTER TABLE `order_items`
  ADD CONSTRAINT `fk_order_items_order` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_order_items_product` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
