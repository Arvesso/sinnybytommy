<?php

namespace App\Controllers;

use App\Core\Controller;
use App\Models\Product;

class SearchController extends Controller
{
    public function index(): void
    {
        $query = trim($_GET['q'] ?? '');
        $products = [];

        if ($query) {
            $productModel = new Product();
            $products = $productModel->search($query);
        }

        $this->render('search/results', [
            'query' => $query,
            'products' => $products,
            'pageTitle' => 'Поиск: ' . htmlspecialchars($query) . ' - TOMMYSINNY',
            'breadcrumbs' => [
                ['name' => 'Главная', 'url' => '/'],
                ['name' => 'Поиск', 'url' => null],
            ],
        ]);
    }
}
