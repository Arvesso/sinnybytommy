<h1 class="page-title">Заказы</h1>

<?php if (!empty($orders)): ?>
<table class="admin-table">
    <thead>
        <tr>
            <th>#</th>
            <th>Клиент</th>
            <th>Телефон</th>
            <th>Адрес</th>
            <th>Товаров</th>
            <th>Сумма</th>
            <th>Статус</th>
            <th>Дата</th>
            <th></th>
        </tr>
    </thead>
    <tbody>
        <?php
        $statusLabels = ['new' => 'Новый', 'processing' => 'В обработке', 'shipped' => 'Отправлен', 'delivered' => 'Доставлен', 'cancelled' => 'Отменён'];
        ?>
        <?php foreach ($orders as $order): ?>
        <tr>
            <td><?= $order['id'] ?></td>
            <td><?= htmlspecialchars($order['first_name'] . ' ' . $order['last_name']) ?></td>
            <td><?= htmlspecialchars($order['phone']) ?></td>
            <td style="max-width: 200px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;"><?= htmlspecialchars($order['address']) ?></td>
            <td><?= $order['items_count'] ?></td>
            <td><?= number_format($order['total'], 0, '', ' ') ?>&#8381;</td>
            <td><span class="order-card__status order-card__status--<?= $order['status'] ?>"><?= $statusLabels[$order['status']] ?? $order['status'] ?></span></td>
            <td><?= date('d.m.Y', strtotime($order['created_at'])) ?></td>
            <td><a href="/admin/orders/<?= $order['id'] ?>" class="btn-admin">Открыть</a></td>
        </tr>
        <?php endforeach; ?>
    </tbody>
</table>
<?php else: ?>
<p style="color: var(--color-gray-400);">Заказов пока нет</p>
<?php endif; ?>
