<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><?= htmlspecialchars($pageTitle ?? 'Админ - TOMMYSINNY') ?></title>
    <link rel="stylesheet" href="/assets/css/style.css">
</head>
<body>

<header class="admin-header">
    <div class="container">
        <div class="admin-header__inner">
            <a href="/admin" class="admin-header__title">TOMMYSINNY Admin</a>
            <nav class="admin-header__nav">
                <a href="/admin" class="<?= ($_SERVER['REQUEST_URI'] === '/admin') ? 'active' : '' ?>">Dashboard</a>
                <a href="/admin/products" class="<?= str_starts_with($_SERVER['REQUEST_URI'], '/admin/products') ? 'active' : '' ?>">Товары</a>
                <a href="/admin/orders" class="<?= str_starts_with($_SERVER['REQUEST_URI'], '/admin/orders') ? 'active' : '' ?>">Заказы</a>
                <a href="/admin/categories" class="<?= str_starts_with($_SERVER['REQUEST_URI'], '/admin/categories') ? 'active' : '' ?>">Категории</a>
                <a href="/" target="_blank">Сайт</a>
                <a href="/logout">Выход</a>
            </nav>
        </div>
    </div>
</header>

<div class="admin-content">
    <div class="container">
        <?= $content ?>
    </div>
</div>

<script src="/assets/js/app.js"></script>
</body>
</html>
