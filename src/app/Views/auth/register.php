<div class="container">
    <?php \App\Core\View::partial('breadcrumbs', ['breadcrumbs' => $breadcrumbs ?? []]); ?>

    <div class="auth-layout">
        <div class="auth-form">
            <h2>Завершите регистрацию</h2>

            <?php if (!empty($error)): ?>
                <div class="auth-error"><?= htmlspecialchars($error) ?></div>
            <?php endif; ?>

            <form method="POST" action="/register">
                <div class="auth-form__group">
                    <label class="auth-form__label">Номер телефона</label>
                    <input type="tel" name="phone" class="auth-form__input" required
                           value="<?= htmlspecialchars($phone ?? '') ?>"
                           placeholder="+7 908 885 47 92">
                </div>

                <div class="auth-form__group">
                    <label class="auth-form__label">Имя</label>
                    <input type="text" name="first_name" class="auth-form__input" required
                           value="<?= htmlspecialchars($first_name ?? '') ?>"
                           placeholder="Андрей">
                </div>

                <div class="auth-form__group">
                    <label class="auth-form__label">Фамилия</label>
                    <input type="text" name="last_name" class="auth-form__input" required
                           value="<?= htmlspecialchars($last_name ?? '') ?>"
                           placeholder="Кремнев">
                </div>

                <div class="auth-form__group">
                    <label class="auth-form__label">Пароль</label>
                    <input type="password" name="password" class="auth-form__input" required
                           placeholder="Придумайте пароль" minlength="6">
                </div>

                <div class="auth-form__consent">
                    Нажимая кнопку Далее, я подтверждаю, что прочитал(-а) и принимаю условия покупки и полезную информацию об использовании моих персональных данных, изложенную в политике конфиденциальности.
                </div>

                <label class="auth-form__checkbox-label">
                    <input type="checkbox" name="newsletter">
                    Я хочу получать информацию о новинках Tommysinny по электронной почте.
                </label>

                <button type="submit" class="btn-auth">Продолжить</button>
            </form>

            <div class="auth-links">
                Уже есть аккаунт? <a href="/login">Войти</a>
            </div>
        </div>

        <div class="auth-image">
            <div style="width: 100%; height: 100%; background: linear-gradient(135deg, #2c3e50 0%, #000 100%); display: flex; align-items: center; justify-content: center;">
                <svg viewBox="0 0 100 60" fill="none" xmlns="http://www.w3.org/2000/svg" style="width: 50%; opacity: 0.2;">
                    <path d="M10 50C16 40 24 32 34 28C28 24 22 16 18 8C24 13 30 18 37 21C34 15 32 9 34 2C37 9 41 15 46 19C51 15 55 9 58 2C59 9 58 15 55 21C62 18 68 13 74 8C71 16 65 24 58 28C68 32 76 40 82 50" stroke="white" stroke-width="3" fill="none"/>
                    <circle cx="34" cy="16" r="3.5" fill="white"/>
                    <circle cx="58" cy="16" r="3.5" fill="white"/>
                </svg>
            </div>
        </div>
    </div>
</div>
