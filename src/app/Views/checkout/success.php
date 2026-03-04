<div class="container">
    <?php \App\Core\View::partial('breadcrumbs', ['breadcrumbs' => $breadcrumbs ?? []]); ?>

    <div class="cart-empty">
        <h2>Заказ оформлен!</h2>
        <p>Ваш заказ #<?= $order['id'] ?? '' ?> успешно оплачен и принят в обработку.</p>

        <?php if (!empty($items)): ?>
            <div class="cart-items" style="justify-content: center; margin-top: 30px;">
                <?php foreach ($items as $item): ?>
                    <div class="cart-item">
                        <div class="cart-item__image">
                            <?php if ($item['image'] && file_exists(__DIR__ . '/../../../public' . $item['image'])): ?>
                                <img src="<?= htmlspecialchars($item['image']) ?>" alt="">
                            <?php else: ?>
                                <div class="product-placeholder"><?= htmlspecialchars($item['name']) ?></div>
                            <?php endif; ?>
                        </div>
                        <div class="cart-item__name"><?= htmlspecialchars($item['name']) ?></div>
                        <?php if ($item['subtitle']): ?>
                            <div class="cart-item__subtitle"><?= htmlspecialchars($item['subtitle']) ?></div>
                        <?php endif; ?>
                        <div class="cart-item__price"><?= number_format($item['price'], 0, '', ' ') ?>&#8381;</div>
                        <div class="cart-item__size-row">
                            <span>Размер</span>
                            <span><?= htmlspecialchars($item['size']) ?></span>
                        </div>
                    </div>
                <?php endforeach; ?>
            </div>
        <?php endif; ?>

        <div style="margin-top: 30px;">
            <?php if (isset($_SESSION['user_id'])): ?>
                <a href="/account" class="btn-continue">Личный кабинет</a>
            <?php else: ?>
                <a href="/" class="btn-continue">На главную</a>
            <?php endif; ?>
        </div>
    </div>
</div>
