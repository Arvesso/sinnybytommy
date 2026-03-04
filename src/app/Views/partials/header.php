<?php
$categories = (new \App\Models\Category())->getAll();
$cartCount = \App\Models\Cart::getCount();
$user = isset($_SESSION['user_id']) ? (new \App\Models\User())->findById($_SESSION['user_id']) : null;
?>

<div class="mobile-menu__overlay"></div>
<nav class="mobile-menu">
    <div class="mobile-menu__nav">
        <a href="/" class="mobile-menu__link">Главная</a>
        <?php foreach ($categories as $cat): ?>
            <a href="/catalog/<?= htmlspecialchars($cat['slug']) ?>" class="mobile-menu__link"><?= htmlspecialchars($cat['name']) ?></a>
        <?php endforeach; ?>
        <a href="/popular" class="mobile-menu__link">Популярные товары</a>
        <a href="/cart" class="mobile-menu__link">Корзина</a>
        <?php if ($user): ?>
            <a href="/account" class="mobile-menu__link">Личный кабинет</a>
            <a href="/logout" class="mobile-menu__link">Выход</a>
        <?php else: ?>
            <a href="/login" class="mobile-menu__link">Войти в кабинет</a>
        <?php endif; ?>
    </div>
</nav>

<header class="header">
    <div class="container">
        <div class="header__inner">
            <div class="header__left">
                <button class="hamburger" aria-label="Меню">
                    <span></span>
                    <span></span>
                    <span></span>
                </button>
                <a href="/" class="logo">
                    <svg class="logo__dragon" viewBox="0 0 60 35" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M5 30C8 25 12 20 18 18C14 15 10 10 8 5C12 8 17 12 22 14C20 10 19 5 20 1C22 6 25 10 29 13C33 10 36 6 38 1C39 5 38 10 36 14C41 12 46 8 50 5C48 10 44 15 40 18C46 20 50 25 53 30" stroke="black" stroke-width="2" fill="none"/>
                        <circle cx="18" cy="10" r="2" fill="black"/>
                        <circle cx="40" cy="10" r="2" fill="black"/>
                    </svg>
                    TOMMYSINNY
                    <svg class="logo__dragon" viewBox="0 0 60 35" fill="none" xmlns="http://www.w3.org/2000/svg" style="transform: scaleX(-1)">
                        <path d="M5 30C8 25 12 20 18 18C14 15 10 10 8 5C12 8 17 12 22 14C20 10 19 5 20 1C22 6 25 10 29 13C33 10 36 6 38 1C39 5 38 10 36 14C41 12 46 8 50 5C48 10 44 15 40 18C46 20 50 25 53 30" stroke="black" stroke-width="2" fill="none"/>
                        <circle cx="18" cy="10" r="2" fill="black"/>
                        <circle cx="40" cy="10" r="2" fill="black"/>
                    </svg>
                </a>
            </div>

            <div class="header__right">
                <div class="header__search">
                    <input type="text" class="header__search-input" placeholder="ПОИСК" aria-label="Поиск">
                </div>
                <?php if ($user): ?>
                    <a href="/account" class="header__link"><?= htmlspecialchars(mb_strtoupper($user['first_name'])) ?></a>
                <?php else: ?>
                    <a href="/login" class="header__link">Войти в кабинет</a>
                <?php endif; ?>
                <a href="/cart" class="header__link header__cart-link">
                    Корзина
                    <span class="header__cart-count" style="<?= $cartCount > 0 ? '' : 'display:none' ?>"><?= $cartCount ?></span>
                </a>
            </div>
        </div>
    </div>
</header>
