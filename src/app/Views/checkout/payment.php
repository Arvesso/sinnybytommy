<div class="container">
    <?php \App\Core\View::partial('breadcrumbs', ['breadcrumbs' => $breadcrumbs ?? []]); ?>

    <div class="checkout-layout">
        <div class="checkout-form">
            <h2>Оплатить картой</h2>

            <form method="POST" action="/checkout/pay/<?= $order['id'] ?>">
                <div class="checkout-form__group">
                    <label class="checkout-form__label">Номер карты</label>
                    <input type="text" name="card_number" class="checkout-form__input" required
                           placeholder="2200 0000 0000 1111" maxlength="19">
                </div>

                <div class="checkout-form__group">
                    <label class="checkout-form__label">Срок</label>
                    <input type="text" name="card_expiry" class="checkout-form__input" required
                           placeholder="10/30" maxlength="5">
                </div>

                <div class="checkout-form__group">
                    <label class="checkout-form__label">Имя</label>
                    <input type="text" name="card_name" class="checkout-form__input" required
                           placeholder="ANDREY KREMNEV" style="text-transform: uppercase;">
                </div>

                <div class="checkout-form__group">
                    <label class="checkout-form__label">Код</label>
                    <input type="password" name="card_cvv" class="checkout-form__input" required
                           placeholder="000" maxlength="3">
                </div>

                <div class="checkout-footer">
                    <div class="checkout-footer__total"><?= number_format($order['total'], 0, '', ' ') ?>&#8381;</div>
                    <button type="submit" class="btn-continue" style="border: none; cursor: pointer;">Оплатить</button>
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
