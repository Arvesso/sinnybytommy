<?php

namespace App\Controllers;

use App\Core\Controller;
use App\Models\Product;

class ProductController extends Controller
{
    public function show(string $slug): void
    {
        $productModel = new Product();
        $product = $productModel->getBySlug($slug);

        if (!$product) {
            http_response_code(404);
            $this->render('errors/404');
            return;
        }

        $sizes = $productModel->getSizes($product['id']);
        $images = $productModel->getImages($product['id']);

        $this->render('product/show', [
            'product' => $product,
            'sizes' => $sizes,
            'images' => $images,
            'pageTitle' => $product['name'] . ' ' . ($product['subtitle'] ?? '') . ' - TOMMYSINNY',
            'breadcrumbs' => [
                ['name' => 'Главная', 'url' => '/'],
                ['name' => $product['category_name'], 'url' => '/catalog/' . $product['category_slug']],
                ['name' => $product['name'] . ' ' . ($product['subtitle'] ?? ''), 'url' => null],
            ],
        ]);
    }
}
