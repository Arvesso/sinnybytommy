<h1 class="page-title">Категории</h1>

<!-- Add category form -->
<div style="margin-bottom: 30px; padding: 20px; border: 1px solid var(--color-gray-200);">
    <h3 style="font-size: 0.85rem; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 15px;">Добавить категорию</h3>
    <form method="POST" action="/admin/categories/create" style="display: flex; gap: 10px; align-items: flex-end;">
        <div>
            <label class="admin-form__label">Название</label>
            <input type="text" name="name" class="admin-form__input" required placeholder="Новая категория" style="width: 250px;">
        </div>
        <div>
            <label class="admin-form__label">Порядок</label>
            <input type="number" name="sort_order" class="admin-form__input" value="0" style="width: 80px;">
        </div>
        <button type="submit" class="btn-admin btn-admin--primary">Добавить</button>
    </form>
</div>

<!-- Categories list -->
<table class="admin-table">
    <thead>
        <tr>
            <th>ID</th>
            <th>Название</th>
            <th>Slug</th>
            <th>Порядок</th>
            <th>Действия</th>
        </tr>
    </thead>
    <tbody>
        <?php foreach ($categories as $cat): ?>
        <tr>
            <td><?= $cat['id'] ?></td>
            <td>
                <form method="POST" action="/admin/categories/edit/<?= $cat['id'] ?>" style="display: flex; gap: 5px;">
                    <input type="text" name="name" class="admin-form__input" value="<?= htmlspecialchars($cat['name']) ?>" style="width: 200px;">
                    <input type="text" name="slug" class="admin-form__input" value="<?= htmlspecialchars($cat['slug']) ?>" style="width: 150px;">
                    <input type="number" name="sort_order" class="admin-form__input" value="<?= $cat['sort_order'] ?>" style="width: 60px;">
                    <button type="submit" class="btn-admin">Сохр.</button>
                </form>
            </td>
            <td></td>
            <td></td>
            <td>
                <form method="POST" action="/admin/categories/delete/<?= $cat['id'] ?>" style="display: inline;">
                    <button type="submit" class="btn-admin btn-admin--danger">Удалить</button>
                </form>
            </td>
        </tr>
        <?php endforeach; ?>
    </tbody>
</table>
