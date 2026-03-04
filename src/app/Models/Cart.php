<?php

namespace App\Models;

class Cart
{
    public static function init(): void
    {
        if (!isset($_SESSION['cart'])) {
            $_SESSION['cart'] = [];
        }
    }

    public static function add(int $productId, string $size, int $quantity = 1): void
    {
        self::init();
        $key = $productId . '_' . $size;

        if (isset($_SESSION['cart'][$key])) {
            $_SESSION['cart'][$key]['quantity'] += $quantity;
        } else {
            $_SESSION['cart'][$key] = [
                'product_id' => $productId,
                'size' => $size,
                'quantity' => $quantity,
            ];
        }
    }

    public static function remove(string $key): void
    {
        self::init();
        unset($_SESSION['cart'][$key]);
    }

    public static function updateQuantity(string $key, int $quantity): void
    {
        self::init();
        if (isset($_SESSION['cart'][$key])) {
            if ($quantity <= 0) {
                unset($_SESSION['cart'][$key]);
            } else {
                $_SESSION['cart'][$key]['quantity'] = $quantity;
            }
        }
    }

    public static function getItems(): array
    {
        self::init();
        return $_SESSION['cart'];
    }

    public static function getItemsWithProducts(): array
    {
        self::init();
        if (empty($_SESSION['cart'])) {
            return [];
        }

        $productModel = new Product();
        $items = [];

        foreach ($_SESSION['cart'] as $key => $item) {
            $product = $productModel->getById($item['product_id']);
            if ($product) {
                $items[$key] = array_merge($item, [
                    'product' => $product,
                    'total' => $product['price'] * $item['quantity'],
                ]);
            }
        }

        return $items;
    }

    public static function getTotal(): float
    {
        $items = self::getItemsWithProducts();
        $total = 0;
        foreach ($items as $item) {
            $total += $item['total'];
        }
        return $total;
    }

    public static function getCount(): int
    {
        self::init();
        $count = 0;
        foreach ($_SESSION['cart'] as $item) {
            $count += $item['quantity'];
        }
        return $count;
    }

    public static function clear(): void
    {
        $_SESSION['cart'] = [];
    }
}
