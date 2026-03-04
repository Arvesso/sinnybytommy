<div class="container">
    <?php \App\Core\View::partial('breadcrumbs', ['breadcrumbs' => $breadcrumbs ?? []]); ?>

    <div class="checkout-layout">
        <div class="checkout-form">
            <h2>Заполните данные для оформления заказа</h2>

            <form method="POST" action="/checkout">
                <div class="checkout-form__group">
                    <label class="checkout-form__label">Имя</label>
                    <input type="text" name="first_name" class="checkout-form__input" required
                           value="<?= htmlspecialchars($user['first_name'] ?? '') ?>"
                           placeholder="Андрей">
                </div>

                <div class="checkout-form__group">
                    <label class="checkout-form__label">Фамилия</label>
                    <input type="text" name="last_name" class="checkout-form__input" required
                           value="<?= htmlspecialchars($user['last_name'] ?? '') ?>"
                           placeholder="Кремнев">
                </div>

                <div class="checkout-form__group">
                    <label class="checkout-form__label">Номер телефона</label>
                    <input type="tel" name="phone" class="checkout-form__input" required
                           value="<?= htmlspecialchars($user['phone'] ?? '') ?>"
                           placeholder="+7 908 885 33 33">
                </div>

                <div class="checkout-form__group">
                    <label class="checkout-form__label">Адрес</label>
                    <input type="text" name="address" class="checkout-form__input" required
                           placeholder="г. Чикаго ул. Крузак д. ТРАПА">
                </div>

                <div class="checkout-form__payment-info">
                    <div class="checkout-form__payment-title">Внимание: способы оплаты</div>
                    <p>Банковской картой, СБП, TPay, SberPay, иностранной картой и Долями</p>
                </div>

                <div class="checkout-footer">
                    <div>
                        <div class="checkout-footer__total"><?= number_format($total, 0, '', ' ') ?>&#8381;</div>
                        <div class="checkout-footer__note">*До вычета налогов</div>
                    </div>
                    <button type="submit" class="btn-continue" style="border: none; cursor: pointer;">Продолжить</button>
                </div>
            </form>
        </div>

        <div class="checkout-image">
            <div style="width: 100%; height: 100%; background: linear-gradient(180deg, #1a1a1a 0%, #000 100%); display: flex; align-items: center; justify-content: center;">
                <svg viewBox="0 0 100 60" fill="none" xmlns="http://www.w3.org/2000/svg" style="width: 40%; opacity: 0.3;">
                    <path d="M10 50C16 40 24 32 34 28C28 24 22 16 18 8C24 13 30 18 37 21C34 15 32 9 34 2C37 9 41 15 46 19C51 15 55 9 58 2C59 9 58 15 55 21C62 18 68 13 74 8C71 16 65 24 58 28C68 32 76 40 82 50" stroke="white" stroke-width="3" fill="none"/>
                    <circle cx="34" cy="16" r="3.5" fill="white"/>
                    <circle cx="58" cy="16" r="3.5" fill="white"/>
                </svg>
            </div>
        </div>
    </div>
</div>
