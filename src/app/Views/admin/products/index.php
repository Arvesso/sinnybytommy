<div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 30px;">
    <h1 class="page-title" style="margin-bottom: 0;">Товары</h1>
    <a href="/admin/products/create" class="btn-admin btn-admin--primary">+ Добавить товар</a>
</div>

<table class="admin-table">
    <thead>
        <tr>
            <th>Фото</th>
            <th>Название</th>
            <th>Категория</th>
            <th>Цена</th>
            <th>Популярный</th>
            <th>Активный</th>
            <th>Действия</th>
        </tr>
    </thead>
    <tbody>
        <?php foreach ($products as $product): ?>
        <tr>
            <td>
                <?php if ($product['image'] && file_exists(__DIR__ . '/../../../../public' . $product['image'])): ?>
                    <img src="<?= htmlspecialchars($product['image']) ?>" class="admin-table__image" alt="">
                <?php else: ?>
                    <div class="admin-table__image" style="display: flex; align-items: center; justify-content: center; background: var(--color-gray-100); font-size: 0.6rem; color: var(--color-gray-400);">N/A</div>
                <?php endif; ?>
            </td>
            <td>
                <?= htmlspecialchars($product['name']) ?>
                <?php if ($product['subtitle']): ?>
                    <br><small style="color: var(--color-gray-500);"><?= htmlspecialchars($product['subtitle']) ?></small>
                <?php endif; ?>
            </td>
            <td><?= htmlspecialchars($product['category_name']) ?></td>
            <td><?= number_format($product['price'], 0, '', ' ') ?>&#8381;</td>
            <td><?= $product['is_popular'] ? 'Да' : '-' ?></td>
            <td><?= $product['is_active'] ? 'Да' : 'Нет' ?></td>
            <td>
                <div class="admin-actions">
                    <a href="/admin/products/edit/<?= $product['id'] ?>" class="btn-admin">Ред.</a>
                    <form method="POST" action="/admin/products/delete/<?= $product['id'] ?>" style="display:inline;">
                        <button type="submit" class="btn-admin btn-admin--danger">Удал.</button>
                    </form>
                </div>
            </td>
        </tr>
        <?php endforeach; ?>
    </tbody>
</table>
