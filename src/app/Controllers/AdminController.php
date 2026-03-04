<?php

namespace App\Controllers;

use App\Core\Controller;
use App\Models\Product;
use App\Models\Category;
use App\Models\Order;
use App\Models\User;

class AdminController extends Controller
{
    public function __construct()
    {
        // Check admin access
    }

    private function checkAdmin(): void
    {
        if (!isset($_SESSION['user_id'])) {
            header('Location: /login');
            exit;
        }
        $user = $this->currentUser();
        if (!$user || !$user['is_admin']) {
            http_response_code(403);
            echo 'Access denied';
            exit;
        }
    }

    public function dashboard(): void
    {
        $this->checkAdmin();

        $productModel = new Product();
        $orderModel = new Order();
        $userModel = new User();

        $this->render('admin/dashboard', [
            'totalProducts' => $productModel->countAll(),
            'totalOrders' => $orderModel->countAll(),
            'totalUsers' => $userModel->countAll(),
            'totalRevenue' => $orderModel->totalRevenue(),
            'newOrders' => $orderModel->countByStatus('new'),
            'recentOrders' => array_slice($orderModel->getAll(), 0, 10),
            'pageTitle' => 'Админ-панель - TOMMYSINNY',
        ], 'admin');
    }

    // Products
    public function products(): void
    {
        $this->checkAdmin();
        $productModel = new Product();

        $this->render('admin/products/index', [
            'products' => $productModel->getAllAdmin(),
            'pageTitle' => 'Товары - Админ',
        ], 'admin');
    }

    public function productCreate(): void
    {
        $this->checkAdmin();
        $categoryModel = new Category();

        $this->render('admin/products/form', [
            'categories' => $categoryModel->getAll(),
            'product' => null,
            'pageTitle' => 'Новый товар - Админ',
        ], 'admin');
    }

    public function productStore(): void
    {
        $this->checkAdmin();
        $productModel = new Product();

        $slug = $this->generateSlug($_POST['name'] . ' ' . ($_POST['subtitle'] ?? ''));
        $imagePath = $this->handleImageUpload();

        $productId = $productModel->create([
            'category_id' => (int) $_POST['category_id'],
            'name' => trim($_POST['name']),
            'subtitle' => trim($_POST['subtitle'] ?? ''),
            'slug' => $slug,
            'price' => (float) $_POST['price'],
            'old_price' => !empty($_POST['old_price']) ? (float) $_POST['old_price'] : null,
            'description' => trim($_POST['description'] ?? ''),
            'image' => $imagePath ?: '/assets/images/products/placeholder.jpg',
            'is_popular' => isset($_POST['is_popular']) ? 1 : 0,
            'is_active' => isset($_POST['is_active']) ? 1 : 0,
        ]);

        // Add sizes
        if (!empty($_POST['sizes'])) {
            $sizes = explode(',', $_POST['sizes']);
            foreach ($sizes as $size) {
                $size = trim($size);
                if ($size) {
                    $productModel->addSize($productId, $size, (int) ($_POST['stock'] ?? 10));
                }
            }
        }

        $this->redirect('/admin/products');
    }

    public function productEdit(string $id): void
    {
        $this->checkAdmin();
        $productModel = new Product();
        $categoryModel = new Category();

        $product = $productModel->getById((int) $id);
        if (!$product) {
            $this->redirect('/admin/products');
            return;
        }

        $sizes = $productModel->getSizes((int) $id);

        $this->render('admin/products/form', [
            'categories' => $categoryModel->getAll(),
            'product' => $product,
            'sizes' => $sizes,
            'pageTitle' => 'Редактировать товар - Админ',
        ], 'admin');
    }

    public function productUpdate(string $id): void
    {
        $this->checkAdmin();
        $productModel = new Product();

        $data = [
            'category_id' => (int) $_POST['category_id'],
            'name' => trim($_POST['name']),
            'subtitle' => trim($_POST['subtitle'] ?? ''),
            'price' => (float) $_POST['price'],
            'old_price' => !empty($_POST['old_price']) ? (float) $_POST['old_price'] : null,
            'description' => trim($_POST['description'] ?? ''),
            'is_popular' => isset($_POST['is_popular']) ? 1 : 0,
            'is_active' => isset($_POST['is_active']) ? 1 : 0,
        ];

        $imagePath = $this->handleImageUpload();
        if ($imagePath) {
            $data['image'] = $imagePath;
        }

        $productModel->update((int) $id, $data);

        // Update sizes
        if (isset($_POST['sizes'])) {
            $productModel->deleteSizes((int) $id);
            $sizes = explode(',', $_POST['sizes']);
            foreach ($sizes as $size) {
                $size = trim($size);
                if ($size) {
                    $productModel->addSize((int) $id, $size, (int) ($_POST['stock'] ?? 10));
                }
            }
        }

        $this->redirect('/admin/products');
    }

    public function productDelete(string $id): void
    {
        $this->checkAdmin();
        $productModel = new Product();
        $productModel->delete((int) $id);
        $this->redirect('/admin/products');
    }

    // Orders
    public function orders(): void
    {
        $this->checkAdmin();
        $orderModel = new Order();

        $this->render('admin/orders/index', [
            'orders' => $orderModel->getAll(),
            'pageTitle' => 'Заказы - Админ',
        ], 'admin');
    }

    public function orderDetail(string $id): void
    {
        $this->checkAdmin();
        $orderModel = new Order();
        $order = $orderModel->getById((int) $id);
        $items = $orderModel->getItems((int) $id);

        $this->render('admin/orders/detail', [
            'order' => $order,
            'items' => $items,
            'pageTitle' => 'Заказ #' . $id . ' - Админ',
        ], 'admin');
    }

    public function orderStatus(string $id): void
    {
        $this->checkAdmin();
        $status = $_POST['status'] ?? '';
        $valid = ['new', 'processing', 'shipped', 'delivered', 'cancelled'];

        if (in_array($status, $valid)) {
            $orderModel = new Order();
            $orderModel->updateStatus((int) $id, $status);
        }

        $this->redirect('/admin/orders/' . $id);
    }

    // Categories
    public function categories(): void
    {
        $this->checkAdmin();
        $categoryModel = new Category();

        $this->render('admin/categories/index', [
            'categories' => $categoryModel->getAll(),
            'pageTitle' => 'Категории - Админ',
        ], 'admin');
    }

    public function categoryStore(): void
    {
        $this->checkAdmin();
        $categoryModel = new Category();

        $categoryModel->create([
            'name' => trim($_POST['name']),
            'slug' => $this->generateSlug($_POST['name']),
            'sort_order' => (int) ($_POST['sort_order'] ?? 0),
        ]);

        $this->redirect('/admin/categories');
    }

    public function categoryUpdate(string $id): void
    {
        $this->checkAdmin();
        $categoryModel = new Category();

        $categoryModel->update((int) $id, [
            'name' => trim($_POST['name']),
            'slug' => trim($_POST['slug']),
            'sort_order' => (int) ($_POST['sort_order'] ?? 0),
        ]);

        $this->redirect('/admin/categories');
    }

    public function categoryDelete(string $id): void
    {
        $this->checkAdmin();
        $categoryModel = new Category();
        $categoryModel->delete((int) $id);
        $this->redirect('/admin/categories');
    }

    // Helpers
    private function generateSlug(string $text): string
    {
        $slug = mb_strtolower($text);
        $slug = preg_replace('/[^a-z0-9\-\s]/u', '', $slug);
        $slug = preg_replace('/[\s\-]+/', '-', $slug);
        $slug = trim($slug, '-');
        return $slug ?: 'product-' . time();
    }

    private function handleImageUpload(): ?string
    {
        if (empty($_FILES['image']) || $_FILES['image']['error'] !== UPLOAD_ERR_OK) {
            return null;
        }

        $uploadDir = __DIR__ . '/../../public/assets/images/products/';
        if (!is_dir($uploadDir)) {
            mkdir($uploadDir, 0755, true);
        }

        $ext = pathinfo($_FILES['image']['name'], PATHINFO_EXTENSION);
        $allowed = ['jpg', 'jpeg', 'png', 'webp', 'gif'];
        if (!in_array(strtolower($ext), $allowed)) {
            return null;
        }

        $filename = uniqid('prod_') . '.' . strtolower($ext);
        $destination = $uploadDir . $filename;

        if (move_uploaded_file($_FILES['image']['tmp_name'], $destination)) {
            return '/assets/images/products/' . $filename;
        }

        return null;
    }
}
