<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><?= htmlspecialchars($pageTitle ?? 'TOMMYSINNY') ?></title>
    <link rel="stylesheet" href="/assets/css/style.css">
    <link rel="icon" type="image/svg+xml" href="/assets/images/favicon.svg">
</head>
<body>

<?php \App\Core\View::partial('header'); ?>

<main>
    <?= $content ?>
</main>

<?php \App\Core\View::partial('footer'); ?>

<script src="/assets/js/app.js"></script>
</body>
</html>
