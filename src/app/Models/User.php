<?php

namespace App\Models;

use App\Core\Database;

class User
{
    private Database $db;

    public function __construct()
    {
        $this->db = Database::getInstance();
    }

    public function findByPhone(string $phone): ?array
    {
        return $this->db->fetch('SELECT * FROM users WHERE phone = ?', [$phone]);
    }

    public function findById(int $id): ?array
    {
        return $this->db->fetch('SELECT * FROM users WHERE id = ?', [$id]);
    }

    public function create(array $data): int
    {
        $this->db->query(
            'INSERT INTO users (phone, first_name, last_name, email, password_hash) VALUES (?, ?, ?, ?, ?)',
            [
                $data['phone'],
                $data['first_name'] ?? null,
                $data['last_name'] ?? null,
                $data['email'] ?? null,
                password_hash($data['password'], PASSWORD_DEFAULT)
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
        $this->db->query('UPDATE users SET ' . implode(', ', $fields) . ' WHERE id = ?', $values);
    }

    public function getAll(): array
    {
        return $this->db->fetchAll('SELECT * FROM users ORDER BY created_at DESC');
    }

    public function countAll(): int
    {
        $result = $this->db->fetch('SELECT COUNT(*) as cnt FROM users');
        return (int) $result['cnt'];
    }
}
