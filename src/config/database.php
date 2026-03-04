<?php

return [
    'host' => getenv('DB_HOST') ?: 'mysql',
    'port' => getenv('DB_PORT') ?: '3306',
    'database' => getenv('DB_NAME') ?: 'tommysinny',
    'username' => getenv('DB_USER') ?: 'sinny_user',
    'password' => getenv('DB_PASS') ?: 'sinny_password',
    'charset' => 'utf8mb4',
];
