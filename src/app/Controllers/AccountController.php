<?php

namespace App\Controllers;

use App\Core\Controller;
use App\Models\Order;

class AccountController extends Controller
{
    public function index(): void
    {
        $this->requireAuth();

        $user = $this->currentUser();
        $orderModel = new Order();
        $orders = $orderModel->getByUser($user['id']);

        $ordersWithItems = [];
        foreach ($orders as $order) {
            $order['items'] = $orderModel->getItems($order['id']);
            $ordersWithItems[] = $order;
        }

        $this->render('account/index', [
            'user' => $user,
            'orders' => $ordersWithItems,
            'pageTitle' => 'Личный кабинет - TOMMYSINNY',
            'breadcrumbs' => [
                ['name' => 'Главная', 'url' => '/'],
                ['name' => 'Личный кабинет', 'url' => null],
            ],
        ]);
    }

    public function order(string $id): void
    {
        $this->requireAuth();

        $orderModel = new Order();
        $order = $orderModel->getById((int) $id);

        if (!$order || $order['user_id'] != $_SESSION['user_id']) {
            $this->redirect('/account');
            return;
        }

        $items = $orderModel->getItems((int) $id);

        $this->render('account/order', [
            'order' => $order,
            'items' => $items,
            'pageTitle' => 'Заказ #' . $id . ' - TOMMYSINNY',
            'breadcrumbs' => [
                ['name' => 'Главная', 'url' => '/'],
                ['name' => 'Личный кабинет', 'url' => '/account'],
                ['name' => 'Заказ #' . $id, 'url' => null],
            ],
        ]);
    }
}
