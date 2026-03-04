<a href="/admin/orders" style="font-size: 0.85rem; text-decoration: underline; color: var(--color-gray-500);">&larr; Назад к заказам</a>

<h1 class="page-title mt-20">Заказ #<?= $order['id'] ?></h1>

<div style="display: grid; grid-template-columns: 1fr 1fr; gap: 40px;">
    <div>
        <h3 style="font-size: 0.85rem; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 15px;">Информация о заказе</h3>
        <table class="admin-table">
            <tr><td><strong>Клиент</strong></td><td><?= htmlspecialchars($order['first_name'] . ' ' . $order['last_name']) ?></td></tr>
            <tr><td><strong>Телефон</strong></td><td><?= htmlspecialchars($order['phone']) ?></td></tr>
            <tr><td><strong>Адрес</strong></td><td><?= htmlspecialchars($order['address']) ?></td></tr>
            <tr><td><strong>Сумма</strong></td><td><strong><?= number_format($order['total'], 0, '', ' ') ?>&#8381;</strong></td></tr>
            <tr><td><strong>Оплата</strong></td><td><?= htmlspecialchars($order['payment_method']) ?></td></tr>
            <tr><td><strong>Дата</strong></td><td><?= date('d.m.Y H:i', strtotime($order['created_at'])) ?></td></tr>
        </table>
    </div>

    <div>
        <h3 style="font-size: 0.85rem; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 15px;">Статус заказа</h3>
        <?php
        $statusLabels = ['new' => 'Новый', 'processing' => 'В обработке', 'shipped' => 'Отправлен', 'delivered' => 'Доставлен', 'cancelled' => 'Отменён'];
        ?>
        <p style="margin-bottom: 15px;">
            Текущий: <span class="order-card__status order-card__status--<?= $order['status'] ?>"><?= $statusLabels[$order['status']] ?></span>
        </p>
        <form method="POST" action="/admin/orders/<?= $order['id'] ?>/status" style="display: flex; gap: 10px; flex-wrap: wrap;">
            <?php foreach ($statusLabels as $key => $label): ?>
                <button type="submit" name="status" value="<?= $key ?>"
                        class="btn-admin <?= $order['status'] === $key ? 'btn-admin--primary' : '' ?>"><?= $label ?></button>
            <?php endforeach; ?>
        </form>
    </div>
</div>

<h3 style="font-size: 0.85rem; text-transform: uppercase; letter-spacing: 1px; margin: 30px 0 15px;">Товары в заказе</h3>

<table class="admin-table">
    <thead>
        <tr>
            <th>Товар</th>
            <th>Размер</th>
            <th>Кол-во</th>
            <th>Цена</th>
            <th>Итого</th>
        </tr>
    </thead>
    <tbody>
        <?php foreach ($items as $item): ?>
        <tr>
            <td>
                <?= htmlspecialchars($item['name']) ?>
                <?php if ($item['subtitle']): ?> <small>(<?= htmlspecialchars($item['subtitle']) ?>)</small><?php endif; ?>
            </td>
            <td><?= htmlspecialchars($item['size']) ?></td>
            <td><?= $item['quantity'] ?></td>
            <td><?= number_format($item['price'], 0, '', ' ') ?>&#8381;</td>
            <td><?= number_format($item['price'] * $item['quantity'], 0, '', ' ') ?>&#8381;</td>
        </tr>
        <?php endforeach; ?>
    </tbody>
</table>
