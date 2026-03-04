<div class="container">
    <?php \App\Core\View::partial('breadcrumbs', ['breadcrumbs' => $breadcrumbs ?? []]); ?>

    <div class="product-detail">
        <div class="product-detail__gallery">
            <div class="product-detail__main-image">
                <?php if ($product['image'] && file_exists(__DIR__ . '/../../../public' . $product['image'])): ?>
                    <img src="<?= htmlspecialchars($product['image']) ?>" alt="<?= htmlspecialchars($product['name']) ?>">
                <?php else: ?>
                    <div class="product-placeholder"><?= htmlspecialchars($product['name']) ?></div>
                <?php endif; ?>
            </div>
        </div>

        <div class="product-detail__info">
            <h1 class="product-detail__name">
                <?= htmlspecialchars($product['name']) ?>
                <?php if ($product['subtitle']): ?>
                    <?= htmlspecialchars($product['subtitle']) ?>
                <?php endif; ?>
            </h1>

            <div class="product-detail__price">
                <?= number_format($product['price'], 0, '', ' ') ?><span style="font-family: Arial">&#8381;</span>
            </div>

            <form id="add-to-cart-form" method="POST" action="/cart/add">
                <input type="hidden" name="product_id" value="<?= $product['id'] ?>">

                <?php if (!empty($sizes)): ?>
                    <div class="product-detail__size-label">Размер</div>
                    <select name="size" class="product-detail__size-select" required>
                        <?php foreach ($sizes as $size): ?>
                            <option value="<?= htmlspecialchars($size['size_name']) ?>"><?= htmlspecialchars(mb_strtoupper($size['size_name'])) ?></option>
                        <?php endforeach; ?>
                    </select>
                <?php else: ?>
                    <input type="hidden" name="size" value="one size">
                <?php endif; ?>

                <button type="submit" class="btn-add-to-cart">Добавить в корзину</button>
            </form>

            <?php if (!empty($product['description'])): ?>
                <div class="product-detail__description">
                    <h3>Внимание!</h3>
                    <p><?= nl2br(htmlspecialchars($product['description'])) ?></p>
                </div>
            <?php else: ?>
                <div class="product-detail__description">
                    <h3>Внимание!</h3>
                    <p>Мы, TOMMYSINNY, официально заявляем и гарантируем, что вся представленная в нашем магазине одежда и аксессуары изготовлены из высококачественных материалов. Под высоким качеством мы подразумеваем:

Экологичность и безопасность материалов для здоровья.
Соответствие заявленному составу (хлопок, шерсть, лён и т.д.).
Прочность, износостойкость и сохранение формы после стирки.
Тщательный контроль швов, фурнитуры и отделки.</p>
                </div>
            <?php endif; ?>
        </div>
    </div>
</div>
