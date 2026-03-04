<?php

namespace App\Core;

class Controller
{
    protected function render(string $view, array $data = [], string $layout = 'main'): void
    {
        View::render($view, $data, $layout);
    }

    protected function redirect(string $url): void
    {
        header('Location: ' . $url);
        exit;
    }

    protected function json(array $data, int $code = 200): void
    {
        http_response_code($code);
        header('Content-Type: application/json');
        echo json_encode($data, JSON_UNESCAPED_UNICODE);
        exit;
    }

    protected function isLoggedIn(): bool
    {
        return isset($_SESSION['user_id']);
    }

    protected function currentUser(): ?array
    {
        if (!$this->isLoggedIn()) {
            return null;
        }
        $db = Database::getInstance();
        return $db->fetch('SELECT * FROM users WHERE id = ?', [$_SESSION['user_id']]);
    }

    protected function requireAuth(): void
    {
        if (!$this->isLoggedIn()) {
            $this->redirect('/login');
        }
    }

    protected function requireAdmin(): void
    {
        $user = $this->currentUser();
        if (!$user || !$user['is_admin']) {
            http_response_code(403);
            echo 'Access denied';
            exit;
        }
    }
}
