<!-- Hero Section -->
<section class="hero">
    <div class="hero__bg"></div>
    <div class="hero__pattern"></div>
    <div class="hero__content">
        <div class="hero__logo">
            <svg viewBox="0 0 600 80" fill="none" xmlns="http://www.w3.org/2000/svg">
                <!-- Left dragon -->
                <g transform="translate(20, 10) scale(0.9)">
                    <path d="M5 55C10 45 18 35 28 32C22 28 16 20 13 12C18 16 25 22 32 25C29 19 28 12 29 5C32 12 36 18 41 22C46 18 50 12 53 5C54 12 53 19 50 25C57 22 64 16 69 12C66 20 60 28 54 32C62 35 72 45 77 55" stroke="white" stroke-width="2.5" fill="none"/>
                    <circle cx="28" cy="18" r="3" fill="white"/>
                    <circle cx="54" cy="18" r="3" fill="white"/>
                </g>
                <!-- Text -->
                <text x="300" y="55" text-anchor="middle" fill="white" font-family="Helvetica Neue, Arial, sans-serif" font-size="42" font-weight="700" letter-spacing="8">TOMMYSINNY</text>
                <!-- Right dragon (mirrored) -->
                <g transform="translate(520, 10) scale(0.9)">
                    <path d="M5 55C10 45 18 35 28 32C22 28 16 20 13 12C18 16 25 22 32 25C29 19 28 12 29 5C32 12 36 18 41 22C46 18 50 12 53 5C54 12 53 19 50 25C57 22 64 16 69 12C66 20 60 28 54 32C62 35 72 45 77 55" stroke="white" stroke-width="2.5" fill="none"/>
                    <circle cx="28" cy="18" r="3" fill="white"/>
                    <circle cx="54" cy="18" r="3" fill="white"/>
                </g>
            </svg>
        </div>
    </div>
</section>

<!-- Popular Products -->
<section class="section">
    <div class="container">
        <h2 class="section__title">Популярные товары</h2>
        <?php if (!empty($popularProducts)): ?>
            <div class="products-grid">
                <?php foreach (array_slice($popularProducts, 0, 6) as $product): ?>
                    <?php \App\Core\View::partial('product-card', ['product' => $product]); ?>
                <?php endforeach; ?>
            </div>
            <div class="text-center mt-40">
                <a href="/popular" class="btn-continue">Смотреть все</a>
            </div>
        <?php else: ?>
            <p class="text-center" style="color: var(--color-gray-400);">Товары скоро появятся</p>
        <?php endif; ?>
    </div>
</section>

<!-- Lookbook -->
<section class="lookbook">
    <div class="container">
        <h2 class="section__title">Лукбук</h2>
        <div class="lookbook__grid">
            <?php if (!empty($lookbookImages)): ?>
                <?php foreach ($lookbookImages as $img): ?>
                    <div class="lookbook__item">
                        <img src="<?= htmlspecialchars($img['image_path']) ?>" alt="Lookbook" loading="lazy">
                    </div>
                <?php endforeach; ?>
            <?php else: ?>
                <?php for ($i = 0; $i < 4; $i++): ?>
                    <div class="lookbook__item">
                        <div class="product-placeholder" style="aspect-ratio: 3/4;">LOOKBOOK</div>
                    </div>
                <?php endfor; ?>
            <?php endif; ?>
        </div>
    </div>
</section>

<!-- About -->
<section class="section">
    <div class="container">
        <div class="about-section">
            <div class="about-section__logo">
                <svg viewBox="0 0 100 60" fill="none" xmlns="http://www.w3.org/2000/svg" style="width: 70%;">
                    <path d="M10 50C16 40 24 32 34 28C28 24 22 16 18 8C24 13 30 18 37 21C34 15 32 9 34 2C37 9 41 15 46 19C51 15 55 9 58 2C59 9 58 15 55 21C62 18 68 13 74 8C71 16 65 24 58 28C68 32 76 40 82 50" stroke="white" stroke-width="3" fill="none"/>
                    <circle cx="34" cy="16" r="3.5" fill="white"/>
                    <circle cx="58" cy="16" r="3.5" fill="white"/>
                </svg>
            </div>
            <div class="about-section__text">
                <h2>О бренде</h2>
                <p>TOMMYSINNY — авторский fashion-бренд, создающий уникальную одежду и аксессуары. Каждое изделие — это сочетание современного уличного стиля и высокого качества материалов. Мы гарантируем экологичность, прочность и безупречный внешний вид каждой вещи из нашей коллекции.</p>
            </div>
        </div>
    </div>
</section>

<!-- Celebrities -->
<section class="celebrities">
    <div class="container">
        <h2 class="section__title">Селебрити</h2>
        <div class="celebrities__grid">
            <?php if (!empty($celebrities)): ?>
                <?php foreach ($celebrities as $celeb): ?>
                    <div class="celebrities__item">
                        <img src="<?= htmlspecialchars($celeb['image_path']) ?>" alt="<?= htmlspecialchars($celeb['name'] ?? 'Celebrity') ?>" loading="lazy">
                    </div>
                <?php endforeach; ?>
            <?php else: ?>
                <?php for ($i = 0; $i < 4; $i++): ?>
                    <div class="celebrities__item" style="background: var(--color-gray-200);">
                        <div class="product-placeholder" style="height: 100%;">CELEBRITY</div>
                    </div>
                <?php endfor; ?>
            <?php endif; ?>
        </div>
    </div>
</section>
