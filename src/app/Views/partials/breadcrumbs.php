<?php if (!empty($breadcrumbs)): ?>
<div class="breadcrumbs">
    <div class="breadcrumbs__list">
        <?php foreach ($breadcrumbs as $i => $crumb): ?>
            <?php if ($i > 0): ?>
                <span class="breadcrumbs__separator">-</span>
            <?php endif; ?>
            <span class="breadcrumbs__item">
                <?php if ($crumb['url']): ?>
                    <a href="<?= htmlspecialchars($crumb['url']) ?>" class="breadcrumbs__link"><?= htmlspecialchars($crumb['name']) ?></a>
                <?php else: ?>
                    <span class="breadcrumbs__current"><?= htmlspecialchars($crumb['name']) ?></span>
                <?php endif; ?>
            </span>
        <?php endforeach; ?>
    </div>
</div>
<?php endif; ?>
