<div class="container">
    <?php \App\Core\View::partial('breadcrumbs', ['breadcrumbs' => $breadcrumbs ?? []]); ?>

    <?php
    $statusLabels = ['new' => 'Новый', 'processing' => 'В обработке', 'shipped' => 'Отправлен', 'delivered' => 'Доставлен', 'cancelled' => 'Отменён'];
    ?>

    <div class="account-section">
        <h2>Заказ #<?= $order['id'] ?></h2>

        <p style="margin-bottom: 10px;">
            Дата: <?= date('d.m.Y H:i', strtotime($order['created_at'])) ?>
        </p>
        <p style="margin-bottom: 10px;">
            Статус: <span class="order-card__status order-card__status--<?= $order['status'] ?>"><?= $statusLabels[$order['status']] ?? $order['status'] ?></span>
        </p>
        <p style="margin-bottom: 10px;">
            Адрес: <?= htmlspecialchars($order['address']) ?>
        </p>
        <p style="margin-bottom: 20px;">
            <strong>Сумма: <?= number_format($order['total'], 0, '', ' ') ?>&#8381;</strong>
        </p>

        <div class="cart-items">
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

        <div style="margin-top: 30px;">
            <a href="/account" class="btn-continue">Назад к заказам</a>
        </div>
    </div>
</div>
