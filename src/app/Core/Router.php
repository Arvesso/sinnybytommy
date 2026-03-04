<?php

namespace App\Core;

class Router
{
    private array $routes = [];

    public function get(string $path, string $controller, string $method): void
    {
        $this->routes['GET'][$path] = ['controller' => $controller, 'method' => $method];
    }

    public function post(string $path, string $controller, string $method): void
    {
        $this->routes['POST'][$path] = ['controller' => $controller, 'method' => $method];
    }

    public function dispatch(string $uri, string $method): void
    {
        $uri = parse_url($uri, PHP_URL_PATH);
        $uri = rtrim($uri, '/') ?: '/';

        // Check exact match first
        if (isset($this->routes[$method][$uri])) {
            $route = $this->routes[$method][$uri];
            $this->callAction($route['controller'], $route['method']);
            return;
        }

        // Check parameterized routes
        foreach ($this->routes[$method] ?? [] as $routePath => $route) {
            $pattern = preg_replace('/\{([a-zA-Z_]+)\}/', '(?P<$1>[^/]+)', $routePath);
            $pattern = '#^' . $pattern . '$#';

            if (preg_match($pattern, $uri, $matches)) {
                $params = array_filter($matches, 'is_string', ARRAY_FILTER_USE_KEY);
                $this->callAction($route['controller'], $route['method'], $params);
                return;
            }
        }

        // 404
        http_response_code(404);
        View::render('errors/404');
    }

    private function callAction(string $controllerClass, string $method, array $params = []): void
    {
        $controller = new $controllerClass();
        call_user_func_array([$controller, $method], $params);
    }
}
