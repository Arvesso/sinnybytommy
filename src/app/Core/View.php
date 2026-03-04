<?php

namespace App\Core;

class View
{
    public static function render(string $view, array $data = [], string $layout = 'main'): void
    {
        extract($data);

        $viewPath = __DIR__ . '/../Views/' . $view . '.php';

        if (!file_exists($viewPath)) {
            http_response_code(500);
            echo "View not found: {$view}";
            return;
        }

        ob_start();
        require $viewPath;
        $content = ob_get_clean();

        $layoutPath = __DIR__ . '/../Views/layouts/' . $layout . '.php';
        if (file_exists($layoutPath)) {
            require $layoutPath;
        } else {
            echo $content;
        }
    }

    public static function partial(string $partial, array $data = []): void
    {
        extract($data);
        $path = __DIR__ . '/../Views/partials/' . $partial . '.php';
        if (file_exists($path)) {
            require $path;
        }
    }
}
