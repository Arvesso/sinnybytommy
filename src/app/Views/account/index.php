<div class="container">
    <?php \App\Core\View::partial('breadcrumbs', ['breadcrumbs' => $breadcrumbs ?? []]); ?>

    <div class="account-section">
        <h2>Покупки</h2>

        <?php if (empty($orders)): ?>
            <div class="account-empty">
                Вы еще не оформили ни одного заказа
            </div>
        <?php else: ?>
            <div class="orders-list">
                <?php foreach ($orders as $order): ?>
                    <div class="order-card">
                        <div class="order-card__header">
                            <span class="order-card__id">Заказ #<?= $order['id'] ?> от <?= date('d.m.Y', strtotime($order['created_at'])) ?></span>
                            <?php
                            $statusLabels = [
                                'new' => 'Новый',
                                'processing' => 'В обработке',
                                'shipped' => 'Отправлен',
                                'delivered' => 'Доставлен',
                                'cancelled' => 'Отменён',
                            ];
                            ?>
                            <span class="order-card__status order-card__status--<?= $order['status'] ?>">
                                <?= $statusLabels[$order['status']] ?? $order['status'] ?>
                            </span>
                        </div>

                        <div class="order-card__items">
                            <?php foreach ($order['items'] as $item): ?>
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

                        <div class="order-card__total">
                            Итого: <?= number_format($order['total'], 0, '', ' ') ?>&#8381;
                        </div>
                    </div>
                <?php endforeach; ?>
            </div>
        <?php endif; ?>
    </div>
</div>
