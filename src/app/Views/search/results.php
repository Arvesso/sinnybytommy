<div class="container">
    <?php \App\Core\View::partial('breadcrumbs', ['breadcrumbs' => $breadcrumbs ?? []]); ?>

    <h1 class="page-title">
        <?php if ($query): ?>
            Результаты поиска: &laquo;<?= htmlspecialchars($query) ?>&raquo;
        <?php else: ?>
            Поиск
        <?php endif; ?>
    </h1>

    <?php if ($query && !empty($products)): ?>
        <div class="search-results__count">
            Найдено товаров: <?= count($products) ?>
        </div>
        <div class="products-grid">
            <?php foreach ($products as $product): ?>
                <?php \App\Core\View::partial('product-card', ['product' => $product]); ?>
            <?php endforeach; ?>
        </div>
    <?php elseif ($query): ?>
        <div class="search-empty">
            <p>По запросу &laquo;<?= htmlspecialchars($query) ?>&raquo; ничего не найдено</p>
            <p style="margin-top: 10px;">Попробуйте изменить запрос</p>
        </div>
    <?php else: ?>
        <div class="search-empty">
            <p>Введите запрос для поиска товаров</p>
        </div>
    <?php endif; ?>
</div>
