<?php

namespace App\Controllers;

use App\Core\Controller;
use App\Models\Product;
use App\Models\Category;
use App\Core\Database;

class HomeController extends Controller
{
    public function index(): void
    {
        $productModel = new Product();
        $categoryModel = new Category();

        $popularProducts = $productModel->getPopular();
        $categories = $categoryModel->getAll();

        $db = Database::getInstance();
        $lookbookImages = $db->fetchAll('SELECT * FROM lookbook_images ORDER BY sort_order ASC');
        $celebrities = $db->fetchAll('SELECT * FROM celebrities ORDER BY sort_order ASC');

        $this->render('home/index', [
            'popularProducts' => $popularProducts,
            'categories' => $categories,
            'lookbookImages' => $lookbookImages,
            'celebrities' => $celebrities,
            'pageTitle' => 'TOMMYSINNY - Авторский Fashion Бренд',
        ]);
    }
}
