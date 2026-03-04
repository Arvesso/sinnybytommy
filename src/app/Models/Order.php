<?php

namespace App\Models;

use App\Core\Database;

class Order
{
    private Database $db;

    public function __construct()
    {
        $this->db = Database::getInstance();
    }

    public function create(array $data): int
    {
        $this->db->query(
            'INSERT INTO orders (user_id, first_name, last_name, phone, address, total, payment_method)
             VALUES (?, ?, ?, ?, ?, ?, ?)',
            [
                $data['user_id'] ?? null,
                $data['first_name'],
                $data['last_name'],
                $data['phone'],
                $data['address'],
                $data['total'],
                $data['payment_method'] ?? 'card'
            ]
        );
        return (int) $this->db->lastInsertId();
    }

    public function addItem(int $orderId, array $item): void
    {
        $this->db->query(
            'INSERT INTO order_items (order_id, product_id, size, quantity, price) VALUES (?, ?, ?, ?, ?)',
            [$orderId, $item['product_id'], $item['size'], $item['quantity'], $item['price']]
        );
    }

    public function getByUser(int $userId): array
    {
        return $this->db->fetchAll(
            'SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC',
            [$userId]
        );
    }

    public function getById(int $id): ?array
    {
        return $this->db->fetch('SELECT * FROM orders WHERE id = ?', [$id]);
    }

    public function getItems(int $orderId): array
    {
        return $this->db->fetchAll(
            'SELECT oi.*, p.name, p.subtitle, p.image, p.slug
             FROM order_items oi
             JOIN products p ON oi.product_id = p.id
             WHERE oi.order_id = ?',
            [$orderId]
        );
    }

    public function getAll(): array
    {
        return $this->db->fetchAll(
            'SELECT o.*,
                    (SELECT COUNT(*) FROM order_items WHERE order_id = o.id) as items_count
             FROM orders o
             ORDER BY o.created_at DESC'
        );
    }

    public function updateStatus(int $id, string $status): void
    {
        $this->db->query('UPDATE orders SET status = ? WHERE id = ?', [$status, $id]);
    }

    public function countAll(): int
    {
        $result = $this->db->fetch('SELECT COUNT(*) as cnt FROM orders');
        return (int) $result['cnt'];
    }

    public function countByStatus(string $status): int
    {
        $result = $this->db->fetch('SELECT COUNT(*) as cnt FROM orders WHERE status = ?', [$status]);
        return (int) $result['cnt'];
    }

    public function totalRevenue(): float
    {
        $result = $this->db->fetch("SELECT COALESCE(SUM(total), 0) as total FROM orders WHERE status != 'cancelled'");
        return (float) $result['total'];
    }
}
