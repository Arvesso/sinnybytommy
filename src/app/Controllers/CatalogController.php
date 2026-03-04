<?php

namespace App\Controllers;

use App\Core\Controller;
use App\Models\Product;
use App\Models\Category;

class CatalogController extends Controller
{
    public function index(string $slug): void
    {
        $categoryModel = new Category();
        $productModel = new Product();

        $category = $categoryModel->getBySlug($slug);
        if (!$category) {
            http_response_code(404);
            $this->render('errors/404');
            return;
        }

        $products = $productModel->getByCategory($slug);

        $this->render('catalog/index', [
            'category' => $category,
            'products' => $products,
            'pageTitle' => $category['name'] . ' - TOMMYSINNY',
            'breadcrumbs' => [
                ['name' => 'Главная', 'url' => '/'],
                ['name' => $category['name'], 'url' => null],
            ],
        ]);
    }

    public function popular(): void
    {
        $productModel = new Product();
        $products = $productModel->getPopular();

        $this->render('catalog/index', [
            'category' => ['name' => 'Популярные товары', 'slug' => 'popular'],
            'products' => $products,
            'pageTitle' => 'Популярные товары - TOMMYSINNY',
            'breadcrumbs' => [
                ['name' => 'Главная', 'url' => '/'],
                ['name' => 'Популярные товары', 'url' => null],
            ],
        ]);
    }
}
