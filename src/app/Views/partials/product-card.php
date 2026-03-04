<a href="/product/<?= htmlspecialchars($product['slug']) ?>" class="product-card">
    <div class="product-card__image">
        <?php if ($product['image'] && file_exists(__DIR__ . '/../../../public' . $product['image'])): ?>
            <img src="<?= htmlspecialchars($product['image']) ?>" alt="<?= htmlspecialchars($product['name']) ?>" loading="lazy">
        <?php else: ?>
            <div class="product-placeholder"><?= htmlspecialchars($product['name']) ?></div>
        <?php endif; ?>
    </div>
    <div class="product-card__name"><?= htmlspecialchars($product['name']) ?></div>
    <?php if (!empty($product['subtitle'])): ?>
        <div class="product-card__subtitle"><?= htmlspecialchars($product['subtitle']) ?></div>
    <?php endif; ?>
    <div class="product-card__price">
        <?= number_format($product['price'], 0, '', ' ') ?><span style="font-family: Arial">&#8381;</span>
        <?php if (!empty($product['old_price'])): ?>
            <span class="product-card__old-price"><?= number_format($product['old_price'], 0, '', ' ') ?>&#8381;</span>
        <?php endif; ?>
    </div>
</a>
