<?php

namespace App\Controllers;

use App\Core\Controller;
use App\Models\Cart;

class CartController extends Controller
{
    public function index(): void
    {
        $items = Cart::getItemsWithProducts();
        $total = Cart::getTotal();

        $this->render('cart/index', [
            'items' => $items,
            'total' => $total,
            'pageTitle' => 'Корзина - TOMMYSINNY',
            'breadcrumbs' => [
                ['name' => 'Главная', 'url' => '/'],
                ['name' => 'Корзина', 'url' => null],
            ],
        ]);
    }

    public function add(): void
    {
        $productId = (int) ($_POST['product_id'] ?? 0);
        $size = $_POST['size'] ?? '';
        $quantity = (int) ($_POST['quantity'] ?? 1);

        if ($productId && $size) {
            Cart::add($productId, $size, $quantity);
        }

        if (!empty($_SERVER['HTTP_X_REQUESTED_WITH']) && strtolower($_SERVER['HTTP_X_REQUESTED_WITH']) === 'xmlhttprequest') {
            $this->json([
                'success' => true,
                'count' => Cart::getCount(),
                'total' => Cart::getTotal(),
            ]);
        } else {
            $this->redirect('/cart');
        }
    }

    public function remove(): void
    {
        $key = $_POST['key'] ?? '';
        if ($key) {
            Cart::remove($key);
        }

        if (!empty($_SERVER['HTTP_X_REQUESTED_WITH']) && strtolower($_SERVER['HTTP_X_REQUESTED_WITH']) === 'xmlhttprequest') {
            $this->json([
                'success' => true,
                'count' => Cart::getCount(),
                'total' => Cart::getTotal(),
            ]);
        } else {
            $this->redirect('/cart');
        }
    }

    public function update(): void
    {
        $key = $_POST['key'] ?? '';
        $quantity = (int) ($_POST['quantity'] ?? 1);

        if ($key) {
            Cart::updateQuantity($key, $quantity);
        }

        $this->json([
            'success' => true,
            'count' => Cart::getCount(),
            'total' => Cart::getTotal(),
        ]);
    }

    public function count(): void
    {
        $this->json(['count' => Cart::getCount()]);
    }
}
