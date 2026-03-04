<?php

namespace App\Controllers;

use App\Core\Controller;
use App\Models\Cart;
use App\Models\Order;

class CheckoutController extends Controller
{
    public function index(): void
    {
        $items = Cart::getItemsWithProducts();
        if (empty($items)) {
            $this->redirect('/cart');
            return;
        }

        $total = Cart::getTotal();
        $user = $this->currentUser();

        $this->render('checkout/index', [
            'items' => $items,
            'total' => $total,
            'user' => $user,
            'pageTitle' => 'Оформление заказа - TOMMYSINNY',
            'breadcrumbs' => [
                ['name' => 'Главная', 'url' => '/'],
                ['name' => 'Корзина', 'url' => '/cart'],
                ['name' => 'Оформление заказа', 'url' => null],
            ],
        ]);
    }

    public function process(): void
    {
        $items = Cart::getItemsWithProducts();
        if (empty($items)) {
            $this->redirect('/cart');
            return;
        }

        $firstName = trim($_POST['first_name'] ?? '');
        $lastName = trim($_POST['last_name'] ?? '');
        $phone = trim($_POST['phone'] ?? '');
        $address = trim($_POST['address'] ?? '');

        if (!$firstName || !$lastName || !$phone || !$address) {
            $this->redirect('/checkout');
            return;
        }

        $total = Cart::getTotal();

        $orderModel = new Order();
        $orderId = $orderModel->create([
            'user_id' => $_SESSION['user_id'] ?? null,
            'first_name' => $firstName,
            'last_name' => $lastName,
            'phone' => $phone,
            'address' => $address,
            'total' => $total,
            'payment_method' => 'card',
        ]);

        foreach ($items as $item) {
            $orderModel->addItem($orderId, [
                'product_id' => $item['product_id'],
                'size' => $item['size'],
                'quantity' => $item['quantity'],
                'price' => $item['product']['price'],
            ]);
        }

        $this->redirect('/checkout/payment/' . $orderId);
    }

    public function payment(string $id): void
    {
        $orderModel = new Order();
        $order = $orderModel->getById((int) $id);

        if (!$order) {
            $this->redirect('/cart');
            return;
        }

        $this->render('checkout/payment', [
            'order' => $order,
            'pageTitle' => 'Оплата - TOMMYSINNY',
            'breadcrumbs' => [
                ['name' => 'Главная', 'url' => '/'],
                ['name' => 'Корзина', 'url' => '/cart'],
                ['name' => 'Оформление заказа', 'url' => null],
            ],
        ]);
    }

    public function pay(string $id): void
    {
        $orderModel = new Order();
        $order = $orderModel->getById((int) $id);

        if (!$order) {
            $this->redirect('/cart');
            return;
        }

        // Simulate payment processing
        $orderModel->updateStatus((int) $id, 'processing');
        Cart::clear();

        $this->redirect('/checkout/success/' . $id);
    }

    public function success(string $id): void
    {
        $orderModel = new Order();
        $order = $orderModel->getById((int) $id);
        $items = $order ? $orderModel->getItems((int) $id) : [];

        $this->render('checkout/success', [
            'order' => $order,
            'items' => $items,
            'pageTitle' => 'Заказ оформлен - TOMMYSINNY',
            'breadcrumbs' => [
                ['name' => 'Главная', 'url' => '/'],
                ['name' => 'Заказ оформлен', 'url' => null],
            ],
        ]);
    }
}
