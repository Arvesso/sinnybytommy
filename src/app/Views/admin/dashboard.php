<h1 class="page-title">Dashboard</h1>

<div class="admin-stats">
    <div class="admin-stat-card">
        <div class="admin-stat-card__value"><?= $totalProducts ?></div>
        <div class="admin-stat-card__label">Товаров</div>
    </div>
    <div class="admin-stat-card">
        <div class="admin-stat-card__value"><?= $totalOrders ?></div>
        <div class="admin-stat-card__label">Заказов</div>
    </div>
    <div class="admin-stat-card">
        <div class="admin-stat-card__value"><?= $newOrders ?></div>
        <div class="admin-stat-card__label">Новых заказов</div>
    </div>
    <div class="admin-stat-card">
        <div class="admin-stat-card__value"><?= number_format($totalRevenue, 0, '', ' ') ?>&#8381;</div>
        <div class="admin-stat-card__label">Выручка</div>
    </div>
</div>

<h2 class="page-title" style="font-size: 1rem;">Последние заказы</h2>

<?php if (!empty($recentOrders)): ?>
<table class="admin-table">
    <thead>
        <tr>
            <th>#</th>
            <th>Клиент</th>
            <th>Телефон</th>
            <th>Сумма</th>
            <th>Статус</th>
            <th>Дата</th>
            <th></th>
        </tr>
    </thead>
    <tbody>
        <?php foreach ($recentOrders as $order): ?>
        <tr>
            <td><?= $order['id'] ?></td>
            <td><?= htmlspecialchars($order['first_name'] . ' ' . $order['last_name']) ?></td>
            <td><?= htmlspecialchars($order['phone']) ?></td>
            <td><?= number_format($order['total'], 0, '', ' ') ?>&#8381;</td>
            <td>
                <?php
                $statusLabels = ['new' => 'Новый', 'processing' => 'В обработке', 'shipped' => 'Отправлен', 'delivered' => 'Доставлен', 'cancelled' => 'Отменён'];
                ?>
                <span class="order-card__status order-card__status--<?= $order['status'] ?>"><?= $statusLabels[$order['status']] ?? $order['status'] ?></span>
            </td>
            <td><?= date('d.m.Y H:i', strtotime($order['created_at'])) ?></td>
            <td><a href="/admin/orders/<?= $order['id'] ?>" class="btn-admin">Открыть</a></td>
        </tr>
        <?php endforeach; ?>
    </tbody>
</table>
<?php else: ?>
<p style="color: var(--color-gray-400);">Заказов пока нет</p>
<?php endif; ?>
