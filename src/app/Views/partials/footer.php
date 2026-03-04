<?php $footerCategories = (new \App\Models\Category())->getAll(); ?>

<footer class="footer">
    <div class="container">
        <div class="footer__inner">
            <div class="footer__logo-col">
                <a href="/" class="logo" style="color: #fff;">
                    <svg class="logo__dragon" viewBox="0 0 60 35" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M5 30C8 25 12 20 18 18C14 15 10 10 8 5C12 8 17 12 22 14C20 10 19 5 20 1C22 6 25 10 29 13C33 10 36 6 38 1C39 5 38 10 36 14C41 12 46 8 50 5C48 10 44 15 40 18C46 20 50 25 53 30" stroke="white" stroke-width="2" fill="none"/>
                        <circle cx="18" cy="10" r="2" fill="white"/>
                        <circle cx="40" cy="10" r="2" fill="white"/>
                    </svg>
                    <svg class="logo__dragon" viewBox="0 0 60 35" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M5 30C8 25 12 20 18 18C14 15 10 10 8 5C12 8 17 12 22 14C20 10 19 5 20 1C22 6 25 10 29 13C33 10 36 6 38 1C39 5 38 10 36 14C41 12 46 8 50 5C48 10 44 15 40 18C46 20 50 25 53 30" stroke="white" stroke-width="2" fill="none"/>
                        <circle cx="18" cy="10" r="2" fill="white"/>
                        <circle cx="40" cy="10" r="2" fill="white"/>
                    </svg>
                    <svg class="logo__dragon" viewBox="0 0 60 35" fill="none" xmlns="http://www.w3.org/2000/svg" style="transform: scaleX(-1)">
                        <path d="M5 30C8 25 12 20 18 18C14 15 10 10 8 5C12 8 17 12 22 14C20 10 19 5 20 1C22 6 25 10 29 13C33 10 36 6 38 1C39 5 38 10 36 14C41 12 46 8 50 5C48 10 44 15 40 18C46 20 50 25 53 30" stroke="white" stroke-width="2" fill="none"/>
                        <circle cx="18" cy="10" r="2" fill="white"/>
                        <circle cx="40" cy="10" r="2" fill="white"/>
                    </svg>
                </a>
            </div>

            <div class="footer__column">
                <h4>Каталог</h4>
                <ul>
                    <?php foreach ($footerCategories as $cat): ?>
                        <li><a href="/catalog/<?= htmlspecialchars($cat['slug']) ?>"><?= htmlspecialchars($cat['name']) ?></a></li>
                    <?php endforeach; ?>
                    <li><a href="/popular">Популярные товары</a></li>
                </ul>
            </div>

            <div class="footer__column">
                <h4>Карта сайта</h4>
                <ul>
                    <li><a href="/login">Войти в личный кабинет</a></li>
                    <li><a href="/cart">Корзина</a></li>
                </ul>
            </div>
        </div>
    </div>
</footer>
