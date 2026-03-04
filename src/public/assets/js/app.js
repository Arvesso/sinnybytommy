document.addEventListener('DOMContentLoaded', function () {
    // ============================================
    // Hamburger Menu
    // ============================================
    const hamburger = document.querySelector('.hamburger');
    const mobileMenu = document.querySelector('.mobile-menu');
    const overlay = document.querySelector('.mobile-menu__overlay');

    if (hamburger) {
        hamburger.addEventListener('click', function () {
            hamburger.classList.toggle('active');
            mobileMenu.classList.toggle('active');
            overlay.classList.toggle('active');
            document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
        });
    }

    if (overlay) {
        overlay.addEventListener('click', function () {
            hamburger.classList.remove('active');
            mobileMenu.classList.remove('active');
            overlay.classList.remove('active');
            document.body.style.overflow = '';
        });
    }

    // ============================================
    // Header Scroll Effect
    // ============================================
    const header = document.querySelector('.header');
    if (header) {
        window.addEventListener('scroll', function () {
            header.classList.toggle('scrolled', window.scrollY > 10);
        });
    }

    // ============================================
    // Add to Cart
    // ============================================
    const addToCartForm = document.getElementById('add-to-cart-form');
    if (addToCartForm) {
        addToCartForm.addEventListener('submit', function (e) {
            e.preventDefault();
            const formData = new FormData(this);
            const btn = this.querySelector('.btn-add-to-cart');
            const originalText = btn.textContent;

            btn.disabled = true;
            btn.textContent = 'ДОБАВЛЕНО';

            fetch('/cart/add', {
                method: 'POST',
                body: formData,
                headers: {
                    'X-Requested-With': 'XMLHttpRequest'
                }
            })
            .then(r => r.json())
            .then(data => {
                if (data.success) {
                    updateCartCount(data.count);
                    showToast('Товар добавлен в корзину');
                }
                setTimeout(() => {
                    btn.disabled = false;
                    btn.textContent = originalText;
                }, 1500);
            })
            .catch(() => {
                btn.disabled = false;
                btn.textContent = originalText;
            });
        });
    }

    // ============================================
    // Cart Operations
    // ============================================
    document.querySelectorAll('.cart-item__remove').forEach(btn => {
        btn.addEventListener('click', function () {
            const key = this.dataset.key;
            removeFromCart(key, this.closest('.cart-item'));
        });
    });

    document.querySelectorAll('.cart-item__qty-btn').forEach(btn => {
        btn.addEventListener('click', function () {
            const key = this.dataset.key;
            const action = this.dataset.action;
            const qtyEl = this.parentElement.querySelector('.cart-item__qty-value');
            let qty = parseInt(qtyEl.textContent);

            if (action === 'plus') qty++;
            else if (action === 'minus' && qty > 1) qty--;
            else if (action === 'minus' && qty <= 1) {
                removeFromCart(key, this.closest('.cart-item'));
                return;
            }

            qtyEl.textContent = qty;
            updateCartQuantity(key, qty);
        });
    });

    function removeFromCart(key, element) {
        fetch('/cart/remove', {
            method: 'POST',
            body: new URLSearchParams({ key: key }),
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'X-Requested-With': 'XMLHttpRequest'
            }
        })
        .then(r => r.json())
        .then(data => {
            if (data.success) {
                if (element) {
                    element.style.opacity = '0';
                    element.style.transform = 'scale(0.9)';
                    element.style.transition = 'all 0.3s';
                    setTimeout(() => {
                        element.remove();
                        updateCartCount(data.count);
                        updateCartTotal(data.total);
                        if (data.count === 0) location.reload();
                    }, 300);
                }
            }
        });
    }

    function updateCartQuantity(key, quantity) {
        fetch('/cart/update', {
            method: 'POST',
            body: new URLSearchParams({ key: key, quantity: quantity }),
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'X-Requested-With': 'XMLHttpRequest'
            }
        })
        .then(r => r.json())
        .then(data => {
            if (data.success) {
                updateCartCount(data.count);
                updateCartTotal(data.total);
            }
        });
    }

    function updateCartCount(count) {
        const el = document.querySelector('.header__cart-count');
        if (el) {
            el.textContent = count;
            el.style.display = count > 0 ? 'flex' : 'none';
        }
    }

    function updateCartTotal(total) {
        const el = document.querySelector('.cart-footer__total');
        if (el) {
            el.textContent = formatPrice(total);
        }
    }

    // ============================================
    // Search
    // ============================================
    const searchInput = document.querySelector('.header__search-input');
    if (searchInput) {
        searchInput.addEventListener('keydown', function (e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                const query = this.value.trim();
                if (query) {
                    window.location.href = '/search?q=' + encodeURIComponent(query);
                }
            }
        });
    }

    // ============================================
    // Toast Notifications
    // ============================================
    function showToast(message) {
        let toast = document.querySelector('.toast');
        if (!toast) {
            toast = document.createElement('div');
            toast.className = 'toast';
            document.body.appendChild(toast);
        }
        toast.textContent = message;
        toast.classList.add('show');
        setTimeout(() => toast.classList.remove('show'), 2500);
    }

    // ============================================
    // Price Formatter
    // ============================================
    function formatPrice(price) {
        return new Intl.NumberFormat('ru-RU').format(price) + '\u20BD';
    }

    // ============================================
    // Phone mask
    // ============================================
    document.querySelectorAll('input[type="tel"]').forEach(input => {
        input.addEventListener('input', function () {
            let val = this.value.replace(/\D/g, '');
            if (val.length > 0 && val[0] !== '7' && val[0] !== '8') {
                val = '7' + val;
            }
            if (val.length > 11) val = val.substring(0, 11);
            if (val.length > 0) {
                let formatted = '+7';
                if (val.length > 1) formatted += ' ' + val.substring(1, 4);
                if (val.length > 4) formatted += ' ' + val.substring(4, 7);
                if (val.length > 7) formatted += ' ' + val.substring(7, 9);
                if (val.length > 9) formatted += ' ' + val.substring(9, 11);
                this.value = formatted;
            }
        });
    });

    // ============================================
    // Admin: confirm delete
    // ============================================
    document.querySelectorAll('.btn-admin--danger').forEach(btn => {
        btn.addEventListener('click', function (e) {
            if (!confirm('Вы уверены?')) {
                e.preventDefault();
            }
        });
    });
});
