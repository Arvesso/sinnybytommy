SET NAMES utf8mb4;

-- Categories
INSERT INTO categories (name, slug, sort_order) VALUES
('Куртки и верхняя одежда', 'jackets', 1),
('Футболки', 't-shirts', 2),
('Худи', 'hoodies', 3),
('Штаны', 'pants', 4),
('Сумки и аксессуары', 'accessories', 5);

-- Products: Jackets
INSERT INTO products (category_id, name, subtitle, slug, price, old_price, image, is_popular, description) VALUES
(1, 'TommySinny ShadeV2 Puffer', 'White', 'shadev2-puffer-white', 15000.00, NULL, '/assets/images/products/puffer-white.jpg', 1, 'Мы, TOMMYSINNY, официально заявляем и гарантируем, что вся представленная в нашем магазине одежда и аксессуары изготовлены из высококачественных материалов. Под высоким качеством мы подразумеваем:\n\nЭкологичность и безопасность материалов для здоровья.\nСоответствие заявленному составу (хлопок, шерсть, лён и т.д.).\nПрочность, износостойкость и сохранение формы после стирки.\nТщательный контроль швов, фурнитуры и отделки.'),
(1, 'TommySinny ShadeV2 Puffer', 'Gray', 'shadev2-puffer-gray', 15000.00, NULL, '/assets/images/products/puffer-gray.jpg', 0, NULL),
(1, 'TommySinny ShadeV2 Puffer', 'Black Phantom', 'shadev2-puffer-black-phantom', 15000.00, NULL, '/assets/images/products/puffer-black-phantom.jpg', 0, NULL),
(1, 'TommySinny ShadeV2 Puffer', 'Midnight Blue', 'shadev2-puffer-midnight-blue', 15000.00, NULL, '/assets/images/products/puffer-midnight-blue.jpg', 1, NULL),
(1, 'TommySinny ShadeV2 Puffer', 'Black', 'shadev2-puffer-black', 10000.00, NULL, '/assets/images/products/puffer-black.jpg', 0, NULL),
(1, 'TommySinny ShadeV2 Puffer', 'Bordo', 'shadev2-puffer-bordo', 15000.00, NULL, '/assets/images/products/puffer-bordo.jpg', 1, NULL),
(1, 'TommySinny ShadeV2 Puffer', 'Toxic Green', 'shadev2-puffer-toxic-green', 15000.00, NULL, '/assets/images/products/puffer-toxic-green.jpg', 0, NULL),
(1, 'TommySinny ShadeV2 Puffer', 'Snake Ice', 'shadev2-puffer-snake-ice', 15000.00, NULL, '/assets/images/products/puffer-snake-ice.jpg', 0, NULL),
(1, 'TommySinny ShadeV2 Puffer', 'Hurricane', 'shadev2-puffer-hurricane', 19800.00, NULL, '/assets/images/products/puffer-hurricane.jpg', 0, NULL),
(1, 'TommySinny Puffa Bomber', 'Green', 'puffa-bomber-green', 15000.00, NULL, '/assets/images/products/bomber-green.jpg', 0, NULL),
(1, 'TommySinny Puffa Bomber', 'Black Classic', 'puffa-bomber-black', 15000.00, NULL, '/assets/images/products/bomber-black.jpg', 0, NULL);

-- Products: T-Shirts
INSERT INTO products (category_id, name, subtitle, slug, price, image, is_popular, description) VALUES
(2, 'TommySinny T-Shirt', 'Friendly Mexico', 'tshirt-friendly-mexico', 3500.00, '/assets/images/products/tshirt-mexico.jpg', 0, NULL),
(2, 'TommySinny T-Shirt', 'Friendly RUSSIA', 'tshirt-friendly-russia', 3500.00, '/assets/images/products/tshirt-russia.jpg', 0, NULL);

-- Products: Hoodies
INSERT INTO products (category_id, name, subtitle, slug, price, image, is_popular, description) VALUES
(3, 'TommySinny Balaclava Sherpa', 'Black', 'balaclava-sherpa-black', 7500.00, '/assets/images/products/sherpa-black.jpg', 0, NULL),
(3, 'TommySinny Balaclava Sherpa', 'Gray', 'balaclava-sherpa-gray', 7500.00, '/assets/images/products/sherpa-gray.jpg', 0, NULL),
(3, 'TommySinny Balaclava Sherpa', 'White', 'balaclava-sherpa-white', 7500.00, '/assets/images/products/sherpa-white.jpg', 0, NULL);

-- Products: Pants
INSERT INTO products (category_id, name, subtitle, slug, price, image, is_popular, description) VALUES
(4, 'TommySinny SweatPants', 'Black Lions', 'sweatpants-black-lions', 6000.00, '/assets/images/products/pants-black-lions.jpg', 0, NULL),
(4, 'TommySinny SweatPants', 'Gray Lions', 'sweatpants-gray-lions', 6000.00, '/assets/images/products/pants-gray-lions.jpg', 0, NULL),
(4, 'TommySinny SweatPants', 'Gray Classic Logo', 'sweatpants-gray-classic', 6000.00, '/assets/images/products/pants-gray-classic.jpg', 0, NULL),
(4, 'TommySinny SweatPants', 'Black Classic Logo', 'sweatpants-black-classic', 6000.00, '/assets/images/products/pants-black-classic.jpg', 0, NULL),
(4, 'TommySinny SweatPants', 'SweetGray Lions', 'sweatpants-sweetgray-lions', 6000.00, '/assets/images/products/pants-sweetgray-lions.jpg', 0, NULL);

-- Products: Accessories
INSERT INTO products (category_id, name, subtitle, slug, price, image, is_popular, description) VALUES
(5, 'TommySinny Camo Square Bag', 'Red', 'camo-bag-red', 5500.00, '/assets/images/products/bag-red.jpg', 0, NULL),
(5, 'TommySinny Camo Square Bag', 'White', 'camo-bag-white', 5500.00, '/assets/images/products/bag-white.jpg', 0, NULL),
(5, 'TommySinny Camo Square Bag', 'Gray', 'camo-bag-gray', 5500.00, '/assets/images/products/bag-gray.jpg', 0, NULL),
(5, 'TommySinny Monogramma Scarf', 'Black', 'monogramma-scarf-black', 4000.00, '/assets/images/products/scarf-black.jpg', 1, NULL),
(5, 'TommySinny Monogramma Scarf', 'Gray', 'monogramma-scarf-gray', 4000.00, '/assets/images/products/scarf-gray.jpg', 1, NULL),
(5, 'TommySinny Hat', 'White Camo', 'hat-white-camo', 3000.00, '/assets/images/products/hat-white-camo.jpg', 0, NULL),
(5, 'TommySinny Hat', 'Drak Red', 'hat-drak-red', 3000.00, '/assets/images/products/hat-drak-red.jpg', 1, NULL),
(5, 'TommySinny Hat', 'Lion Red', 'hat-lion-red', 3000.00, '/assets/images/products/hat-lion-red.jpg', 0, NULL),
(5, 'TommySinny Hat', 'Black Camo', 'hat-black-camo', 3000.00, '/assets/images/products/hat-black-camo.jpg', 0, NULL),
(5, 'TommySinny Hat', 'Drak Blue', 'hat-drak-blue', 3000.00, '/assets/images/products/hat-drak-blue.jpg', 1, NULL),
(5, 'TommySinny Hat', 'Beige', 'hat-beige', 3000.00, '/assets/images/products/hat-beige.jpg', 1, NULL);

-- Product Sizes for Jackets (S, M, L, XL)
INSERT INTO product_sizes (product_id, size_name, stock)
SELECT p.id, s.size_name, 10
FROM products p
CROSS JOIN (
    SELECT 'S' AS size_name UNION ALL SELECT 'M' UNION ALL SELECT 'L' UNION ALL SELECT 'XL'
) s
WHERE p.category_id = 1;

-- Product Sizes for T-Shirts (S, M, L, XL)
INSERT INTO product_sizes (product_id, size_name, stock)
SELECT p.id, s.size_name, 10
FROM products p
CROSS JOIN (
    SELECT 'S' AS size_name UNION ALL SELECT 'M' UNION ALL SELECT 'L' UNION ALL SELECT 'XL'
) s
WHERE p.category_id = 2;

-- Product Sizes for Hoodies (S, M, L, XL)
INSERT INTO product_sizes (product_id, size_name, stock)
SELECT p.id, s.size_name, 10
FROM products p
CROSS JOIN (
    SELECT 'S' AS size_name UNION ALL SELECT 'M' UNION ALL SELECT 'L' UNION ALL SELECT 'XL'
) s
WHERE p.category_id = 3;

-- Product Sizes for Pants (S, M, L, XL)
INSERT INTO product_sizes (product_id, size_name, stock)
SELECT p.id, s.size_name, 10
FROM products p
CROSS JOIN (
    SELECT 'S' AS size_name UNION ALL SELECT 'M' UNION ALL SELECT 'L' UNION ALL SELECT 'XL'
) s
WHERE p.category_id = 4;

-- Product Sizes for Accessories (One Size)
INSERT INTO product_sizes (product_id, size_name, stock)
SELECT p.id, 'one size', 20
FROM products p
WHERE p.category_id = 5;

-- Admin user (password: admin123)
INSERT INTO users (phone, first_name, last_name, password_hash, is_admin) VALUES
('+79001234567', 'Admin', 'TommySinny', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 1);
