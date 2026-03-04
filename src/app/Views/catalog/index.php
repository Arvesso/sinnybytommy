<div class="container">
    <?php \App\Core\View::partial('breadcrumbs', ['breadcrumbs' => $breadcrumbs ?? []]); ?>

    <?php if (!empty($products)): ?>
        <div class="products-grid <?= count($products) <= 2 ? 'products-grid--two' : '' ?>">
            <?php foreach ($products as $product): ?>
                <?php \App\Core\View::partial('product-card', ['product' => $product]); ?>
            <?php endforeach; ?>
        </div>
    <?php else: ?>
        <div class="cart-empty">
            <h2>Товары скоро появятся</h2>
            <p>В этой категории пока нет товаров</p>
            <a href="/" class="btn-continue">На главную</a>
        </div>
    <?php endif; ?>
</div>
