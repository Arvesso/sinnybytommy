<?php

namespace App\Controllers;

use App\Core\Controller;
use App\Models\User;

class AuthController extends Controller
{
    private function normalizePhone(string $phone): string
    {
        $digits = preg_replace('/\D/', '', $phone);
        if (strlen($digits) === 11 && ($digits[0] === '7' || $digits[0] === '8')) {
            $digits = '7' . substr($digits, 1);
        }
        return '+' . $digits;
    }

    public function login(): void
    {
        if ($this->isLoggedIn()) {
            $this->redirect('/account');
            return;
        }

        $this->render('auth/login', [
            'pageTitle' => 'Войти - TOMMYSINNY',
            'breadcrumbs' => [
                ['name' => 'Главная', 'url' => '/'],
                ['name' => 'Личный кабинет', 'url' => '/account'],
                ['name' => 'Регистрация', 'url' => null],
            ],
        ]);
    }

    public function loginProcess(): void
    {
        $phone = $this->normalizePhone(trim($_POST['phone'] ?? ''));
        $password = $_POST['password'] ?? '';

        if (!$phone || !$password) {
            $this->render('auth/login', [
                'error' => 'Заполните все поля',
                'phone' => $phone,
                'pageTitle' => 'Войти - TOMMYSINNY',
                'breadcrumbs' => [
                    ['name' => 'Главная', 'url' => '/'],
                    ['name' => 'Личный кабинет', 'url' => '/account'],
                    ['name' => 'Регистрация', 'url' => null],
                ],
            ]);
            return;
        }

        $userModel = new User();
        $user = $userModel->findByPhone($phone);

        if (!$user || !password_verify($password, $user['password_hash'])) {
            $this->render('auth/login', [
                'error' => 'Неверный номер телефона или пароль',
                'phone' => $phone,
                'pageTitle' => 'Войти - TOMMYSINNY',
                'breadcrumbs' => [
                    ['name' => 'Главная', 'url' => '/'],
                    ['name' => 'Личный кабинет', 'url' => '/account'],
                    ['name' => 'Регистрация', 'url' => null],
                ],
            ]);
            return;
        }

        $_SESSION['user_id'] = $user['id'];
        $this->redirect('/account');
    }

    public function register(): void
    {
        if ($this->isLoggedIn()) {
            $this->redirect('/account');
            return;
        }

        $this->render('auth/register', [
            'pageTitle' => 'Регистрация - TOMMYSINNY',
            'breadcrumbs' => [
                ['name' => 'Главная', 'url' => '/'],
                ['name' => 'Личный кабинет', 'url' => '/account'],
                ['name' => 'Регистрация', 'url' => null],
            ],
        ]);
    }

    public function registerProcess(): void
    {
        $phone = $this->normalizePhone(trim($_POST['phone'] ?? ''));
        $firstName = trim($_POST['first_name'] ?? '');
        $lastName = trim($_POST['last_name'] ?? '');
        $password = $_POST['password'] ?? '';

        if (!$phone || !$firstName || !$lastName || !$password) {
            $this->render('auth/register', [
                'error' => 'Заполните все поля',
                'phone' => $phone,
                'first_name' => $firstName,
                'last_name' => $lastName,
                'pageTitle' => 'Регистрация - TOMMYSINNY',
                'breadcrumbs' => [
                    ['name' => 'Главная', 'url' => '/'],
                    ['name' => 'Личный кабинет', 'url' => '/account'],
                    ['name' => 'Регистрация', 'url' => null],
                ],
            ]);
            return;
        }

        $userModel = new User();
        $existing = $userModel->findByPhone($phone);

        if ($existing) {
            $this->render('auth/register', [
                'error' => 'Пользователь с таким номером уже существует',
                'phone' => $phone,
                'first_name' => $firstName,
                'last_name' => $lastName,
                'pageTitle' => 'Регистрация - TOMMYSINNY',
                'breadcrumbs' => [
                    ['name' => 'Главная', 'url' => '/'],
                    ['name' => 'Личный кабинет', 'url' => '/account'],
                    ['name' => 'Регистрация', 'url' => null],
                ],
            ]);
            return;
        }

        $userId = $userModel->create([
            'phone' => $phone,
            'first_name' => $firstName,
            'last_name' => $lastName,
            'password' => $password,
        ]);

        $_SESSION['user_id'] = $userId;
        $this->redirect('/account');
    }

    public function logout(): void
    {
        unset($_SESSION['user_id']);
        session_destroy();
        $this->redirect('/');
    }
}
