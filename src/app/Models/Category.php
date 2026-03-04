<?php

namespace App\Models;

use App\Core\Database;

class Category
{
    private Database $db;

    public function __construct()
    {
        $this->db = Database::getInstance();
    }

    public function getAll(): array
    {
        return $this->db->fetchAll('SELECT * FROM categories ORDER BY sort_order ASC');
    }

    public function getBySlug(string $slug): ?array
    {
        return $this->db->fetch('SELECT * FROM categories WHERE slug = ?', [$slug]);
    }

    public function getById(int $id): ?array
    {
        return $this->db->fetch('SELECT * FROM categories WHERE id = ?', [$id]);
    }

    public function create(array $data): int
    {
        $this->db->query(
            'INSERT INTO categories (name, slug, sort_order) VALUES (?, ?, ?)',
            [$data['name'], $data['slug'], $data['sort_order'] ?? 0]
        );
        return (int) $this->db->lastInsertId();
    }

    public function update(int $id, array $data): void
    {
        $this->db->query(
            'UPDATE categories SET name = ?, slug = ?, sort_order = ? WHERE id = ?',
            [$data['name'], $data['slug'], $data['sort_order'] ?? 0, $id]
        );
    }

    public function delete(int $id): void
    {
        $this->db->query('DELETE FROM categories WHERE id = ?', [$id]);
    }

    public function getProductCount(int $categoryId): int
    {
        $result = $this->db->fetch(
            'SELECT COUNT(*) as cnt FROM products WHERE category_id = ? AND is_active = 1',
            [$categoryId]
        );
        return (int) $result['cnt'];
    }
}
