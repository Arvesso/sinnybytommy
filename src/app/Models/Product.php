<?php

namespace App\Models;

use App\Core\Database;

class Product
{
    private Database $db;

    public function __construct()
    {
        $this->db = Database::getInstance();
    }

    public function getAll(int $limit = 100): array
    {
        return $this->db->fetchAll(
            'SELECT p.*, c.name AS category_name, c.slug AS category_slug
             FROM products p
             JOIN categories c ON p.category_id = c.id
             WHERE p.is_active = 1
             ORDER BY p.created_at DESC
             LIMIT ?',
            [$limit]
        );
    }

    public function getByCategory(string $categorySlug): array
    {
        return $this->db->fetchAll(
            'SELECT p.*, c.name AS category_name, c.slug AS category_slug
             FROM products p
             JOIN categories c ON p.category_id = c.id
             WHERE c.slug = ? AND p.is_active = 1
             ORDER BY p.id ASC',
            [$categorySlug]
        );
    }

    public function getPopular(): array
    {
        return $this->db->fetchAll(
            'SELECT p.*, c.name AS category_name, c.slug AS category_slug
             FROM products p
             JOIN categories c ON p.category_id = c.id
             WHERE p.is_popular = 1 AND p.is_active = 1
             ORDER BY p.id ASC'
        );
    }

    public function getBySlug(string $slug): ?array
    {
        return $this->db->fetch(
            'SELECT p.*, c.name AS category_name, c.slug AS category_slug
             FROM products p
             JOIN categories c ON p.category_id = c.id
             WHERE p.slug = ? AND p.is_active = 1',
            [$slug]
        );
    }

    public function getById(int $id): ?array
    {
        return $this->db->fetch(
            'SELECT p.*, c.name AS category_name, c.slug AS category_slug
             FROM products p
             JOIN categories c ON p.category_id = c.id
             WHERE p.id = ?',
            [$id]
        );
    }

    public function getSizes(int $productId): array
    {
        return $this->db->fetchAll(
            'SELECT * FROM product_sizes WHERE product_id = ? ORDER BY FIELD(size_name, "XS", "S", "M", "L", "XL", "XXL", "one size")',
            [$productId]
        );
    }

    public function getImages(int $productId): array
    {
        return $this->db->fetchAll(
            'SELECT * FROM product_images WHERE product_id = ? ORDER BY sort_order ASC',
            [$productId]
        );
    }

    public function search(string $query): array
    {
        $term = '%' . $query . '%';
        return $this->db->fetchAll(
            'SELECT p.*, c.name AS category_name, c.slug AS category_slug
             FROM products p
             JOIN categories c ON p.category_id = c.id
             WHERE p.is_active = 1 AND (p.name LIKE ? OR p.subtitle LIKE ? OR c.name LIKE ?)
             ORDER BY p.name ASC',
            [$term, $term, $term]
        );
    }

    public function create(array $data): int
    {
        $this->db->query(
            'INSERT INTO products (category_id, name, subtitle, slug, price, old_price, description, image, is_popular, is_active)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
            [
                $data['category_id'], $data['name'], $data['subtitle'] ?? null,
                $data['slug'], $data['price'], $data['old_price'] ?? null,
                $data['description'] ?? null, $data['image'], $data['is_popular'] ?? 0, $data['is_active'] ?? 1
            ]
        );
        return (int) $this->db->lastInsertId();
    }

    public function update(int $id, array $data): void
    {
        $fields = [];
        $values = [];
        foreach ($data as $key => $value) {
            $fields[] = "{$key} = ?";
            $values[] = $value;
        }
        $values[] = $id;
        $this->db->query(
            'UPDATE products SET ' . implode(', ', $fields) . ' WHERE id = ?',
            $values
        );
    }

    public function delete(int $id): void
    {
        $this->db->query('DELETE FROM products WHERE id = ?', [$id]);
    }

    public function countAll(): int
    {
        $result = $this->db->fetch('SELECT COUNT(*) as cnt FROM products WHERE is_active = 1');
        return (int) $result['cnt'];
    }

    public function getAllAdmin(): array
    {
        return $this->db->fetchAll(
            'SELECT p.*, c.name AS category_name FROM products p JOIN categories c ON p.category_id = c.id ORDER BY p.id DESC'
        );
    }

    public function addSize(int $productId, string $sizeName, int $stock = 0): void
    {
        $this->db->query(
            'INSERT INTO product_sizes (product_id, size_name, stock) VALUES (?, ?, ?)',
            [$productId, $sizeName, $stock]
        );
    }

    public function deleteSizes(int $productId): void
    {
        $this->db->query('DELETE FROM product_sizes WHERE product_id = ?', [$productId]);
    }
}
