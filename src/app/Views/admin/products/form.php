<h1 class="page-title"><?= $product ? 'Редактировать товар' : 'Новый товар' ?></h1>

<form method="POST" action="<?= $product ? '/admin/products/edit/' . $product['id'] : '/admin/products/create' ?>" enctype="multipart/form-data" class="admin-form">
    <div class="admin-form__group">
        <label class="admin-form__label">Категория</label>
        <select name="category_id" class="admin-form__select" required>
            <?php foreach ($categories as $cat): ?>
                <option value="<?= $cat['id'] ?>" <?= ($product && $product['category_id'] == $cat['id']) ? 'selected' : '' ?>>
                    <?= htmlspecialchars($cat['name']) ?>
                </option>
            <?php endforeach; ?>
        </select>
    </div>

    <div class="admin-form__group">
        <label class="admin-form__label">Название</label>
        <input type="text" name="name" class="admin-form__input" required
               value="<?= htmlspecialchars($product['name'] ?? '') ?>"
               placeholder="TommySinny ShadeV2 Puffer">
    </div>

    <div class="admin-form__group">
        <label class="admin-form__label">Подзаголовок (цвет/вариант)</label>
        <input type="text" name="subtitle" class="admin-form__input"
               value="<?= htmlspecialchars($product['subtitle'] ?? '') ?>"
               placeholder="White">
    </div>

    <div class="admin-form__group">
        <label class="admin-form__label">Цена (&#8381;)</label>
        <input type="number" name="price" class="admin-form__input" required step="0.01"
               value="<?= $product['price'] ?? '' ?>"
               placeholder="15000">
    </div>

    <div class="admin-form__group">
        <label class="admin-form__label">Старая цена (&#8381;, необязательно)</label>
        <input type="number" name="old_price" class="admin-form__input" step="0.01"
               value="<?= $product['old_price'] ?? '' ?>"
               placeholder="20000">
    </div>

    <div class="admin-form__group">
        <label class="admin-form__label">Изображение</label>
        <input type="file" name="image" class="admin-form__input" accept="image/*">
        <?php if ($product && $product['image']): ?>
            <small style="color: var(--color-gray-500);">Текущее: <?= htmlspecialchars($product['image']) ?></small>
        <?php endif; ?>
    </div>

    <div class="admin-form__group">
        <label class="admin-form__label">Размеры (через запятую)</label>
        <input type="text" name="sizes" class="admin-form__input"
               value="<?= !empty($sizes) ? implode(', ', array_column($sizes, 'size_name')) : 'S, M, L, XL' ?>"
               placeholder="S, M, L, XL">
    </div>

    <div class="admin-form__group">
        <label class="admin-form__label">Остаток на размер</label>
        <input type="number" name="stock" class="admin-form__input" value="10" placeholder="10">
    </div>

    <div class="admin-form__group">
        <label class="admin-form__label">Описание</label>
        <textarea name="description" class="admin-form__textarea"><?= htmlspecialchars($product['description'] ?? '') ?></textarea>
    </div>

    <div class="admin-form__group">
        <label class="admin-form__checkbox">
            <input type="checkbox" name="is_popular" <?= ($product && $product['is_popular']) ? 'checked' : '' ?>>
            Популярный товар
        </label>
    </div>

    <div class="admin-form__group">
        <label class="admin-form__checkbox">
            <input type="checkbox" name="is_active" <?= (!$product || $product['is_active']) ? 'checked' : '' ?>>
            Активный (отображается на сайте)
        </label>
    </div>

    <div style="display: flex; gap: 10px; margin-top: 20px;">
        <button type="submit" class="btn-admin btn-admin--primary">Сохранить</button>
        <a href="/admin/products" class="btn-admin">Отмена</a>
    </div>
</form>
