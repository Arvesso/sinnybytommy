<?php

session_start();

// Autoloader
spl_autoload_register(function (string $class) {
    $prefix = 'App\\';
    $baseDir = __DIR__ . '/../app/';

    if (strncmp($prefix, $class, strlen($prefix)) !== 0) {
        return;
    }

    $relativeClass = substr($class, strlen($prefix));
    $file = $baseDir . str_replace('\\', '/', $relativeClass) . '.php';

    if (file_exists($file)) {
        require $file;
    }
});

use App\Core\Router;
use App\Controllers\HomeController;
use App\Controllers\CatalogController;
use App\Controllers\ProductController;
use App\Controllers\CartController;
use App\Controllers\CheckoutController;
use App\Controllers\AuthController;
use App\Controllers\AccountController;
use App\Controllers\SearchController;
use App\Controllers\AdminController;

$router = new Router();

// Public routes
$router->get('/', HomeController::class, 'index');
$router->get('/catalog/{slug}', CatalogController::class, 'index');
$router->get('/popular', CatalogController::class, 'popular');
$router->get('/product/{slug}', ProductController::class, 'show');

// Cart
$router->get('/cart', CartController::class, 'index');
$router->post('/cart/add', CartController::class, 'add');
$router->post('/cart/remove', CartController::class, 'remove');
$router->post('/cart/update', CartController::class, 'update');
$router->get('/cart/count', CartController::class, 'count');

// Checkout
$router->get('/checkout', CheckoutController::class, 'index');
$router->post('/checkout', CheckoutController::class, 'process');
$router->get('/checkout/payment/{id}', CheckoutController::class, 'payment');
$router->post('/checkout/pay/{id}', CheckoutController::class, 'pay');
$router->get('/checkout/success/{id}', CheckoutController::class, 'success');

// Auth
$router->get('/login', AuthController::class, 'login');
$router->post('/login', AuthController::class, 'loginProcess');
$router->get('/register', AuthController::class, 'register');
$router->post('/register', AuthController::class, 'registerProcess');
$router->get('/logout', AuthController::class, 'logout');

// Account
$router->get('/account', AccountController::class, 'index');
$router->get('/account/order/{id}', AccountController::class, 'order');

// Search
$router->get('/search', SearchController::class, 'index');

// Admin
$router->get('/admin', AdminController::class, 'dashboard');
$router->get('/admin/products', AdminController::class, 'products');
$router->get('/admin/products/create', AdminController::class, 'productCreate');
$router->post('/admin/products/create', AdminController::class, 'productStore');
$router->get('/admin/products/edit/{id}', AdminController::class, 'productEdit');
$router->post('/admin/products/edit/{id}', AdminController::class, 'productUpdate');
$router->post('/admin/products/delete/{id}', AdminController::class, 'productDelete');
$router->get('/admin/orders', AdminController::class, 'orders');
$router->get('/admin/orders/{id}', AdminController::class, 'orderDetail');
$router->post('/admin/orders/{id}/status', AdminController::class, 'orderStatus');
$router->get('/admin/categories', AdminController::class, 'categories');
$router->post('/admin/categories/create', AdminController::class, 'categoryStore');
$router->post('/admin/categories/edit/{id}', AdminController::class, 'categoryUpdate');
$router->post('/admin/categories/delete/{id}', AdminController::class, 'categoryDelete');

// Dispatch
$router->dispatch($_SERVER['REQUEST_URI'], $_SERVER['REQUEST_METHOD']);
