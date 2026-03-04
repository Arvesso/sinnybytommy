<div class="container">
    <?php \App\Core\View::partial('breadcrumbs', ['breadcrumbs' => $breadcrumbs ?? []]); ?>

    <?php if (empty($items)): ?>
        <div class="cart-empty">
            <h2>Ваша корзина пуста</h2>
            <p>Добавленные изделия будут показаны здесь</p>
            <a href="/" class="btn-continue">За покупками</a>
        </div>
    <?php else: ?>
        <div class="cart-items">
            <?php foreach ($items as $key => $item): ?>
                <div class="cart-item">
                    <div class="cart-item__image">
                        <?php if ($item['product']['image'] && file_exists(__DIR__ . '/../../../public' . $item['product']['image'])): ?>
                            <img src="<?= htmlspecialchars($item['product']['image']) ?>" alt="<?= htmlspecialchars($item['product']['name']) ?>">
                        <?php else: ?>
                            <div class="product-placeholder"><?= htmlspecialchars($item['product']['name']) ?></div>
                        <?php endif; ?>
                    </div>
                    <div class="cart-item__name"><?= htmlspecialchars($item['product']['name']) ?></div>
                    <?php if ($item['product']['subtitle']): ?>
                        <div class="cart-item__subtitle"><?= htmlspecialchars($item['product']['subtitle']) ?></div>
                    <?php endif; ?>
                    <div class="cart-item__price"><?= number_format($item['product']['price'], 0, '', ' ') ?>&#8381;</div>
                    <div class="cart-item__size-row">
                        <span>Размер</span>
                        <span><?= htmlspecialchars($item['size']) ?></span>
                    </div>
                    <div class="cart-item__quantity-row">
                        <button class="cart-item__qty-btn" data-key="<?= htmlspecialchars($key) ?>" data-action="minus">-</button>
                        <span class="cart-item__qty-value"><?= $item['quantity'] ?></span>
                        <button class="cart-item__qty-btn" data-key="<?= htmlspecialchars($key) ?>" data-action="plus">+</button>
                    </div>
                    <button class="cart-item__remove" data-key="<?= htmlspecialchars($key) ?>">Удалить</button>
                </div>
            <?php endforeach; ?>
        </div>

        <div class="cart-footer">
            <div>
                <div class="cart-footer__total"><?= number_format($total, 0, '', ' ') ?>&#8381;</div>
                <div class="cart-footer__note">*До вычета налогов</div>
            </div>
            <a href="/checkout" class="btn-continue">Продолжить</a>
        </div>
    <?php endif; ?>
</div>
