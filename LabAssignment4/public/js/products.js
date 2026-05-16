// ─── Products Page JS ────────────────────────────────────────

// Mobile filter sidebar toggle
const toggleFiltersBtn = document.getElementById('toggle-filters');
const filtersSidebar   = document.getElementById('filters-sidebar');

if (toggleFiltersBtn && filtersSidebar) {
    toggleFiltersBtn.addEventListener('click', () => {
        filtersSidebar.classList.toggle('open');
        toggleFiltersBtn.innerHTML = filtersSidebar.classList.contains('open')
            ? '<i class="fas fa-times"></i> Close Filters'
            : '<i class="fas fa-sliders-h"></i> Filters';
    });
}

// ─── Category Chip → auto-submit ─────────────────────────────
const chipInputs = document.querySelectorAll('.chip input[type="radio"]');
chipInputs.forEach(input => {
    input.addEventListener('change', () => {
        // Update active class
        document.querySelectorAll('.chip').forEach(c => c.classList.remove('active'));
        input.closest('.chip').classList.add('active');
        // Auto-submit form
        document.getElementById('filter-form').submit();
    });
});

// ─── Search – debounce auto-submit ──────────────────────────
const searchInput = document.getElementById('search-input');
if (searchInput) {
    let debounceTimer;
    searchInput.addEventListener('input', () => {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => {
            document.getElementById('filter-form').submit();
        }, 600);
    });
}

// ─── Wishlist heart animation ─────────────────────────────────
document.querySelectorAll('.wishlist-btn').forEach(btn => {
    btn.addEventListener('click', function () {
        this.style.color = this.style.color === 'rgb(224, 92, 92)' ? '' : '#e05c5c';
        this.title = this.style.color ? 'Remove from Wishlist' : 'Add to Wishlist';
    });
});

// ─── Clear Filters ────────────────────────────────────────────
function clearFilters() {
    window.location.href = '/products';
}

// ─── Add to Cart – Flash Feedback ────────────────────────────
document.querySelectorAll('.add-to-cart-btn').forEach(btn => {
    btn.addEventListener('click', function () {
        const original = this.innerHTML;
        this.innerHTML = '<i class="fas fa-check"></i> Added!';
        this.style.background = '#4caf50';
        setTimeout(() => {
            this.innerHTML = original;
            this.style.background = '';
        }, 800);
    });
});

// ─── Scroll-reveal animation ──────────────────────────────────
const cards = document.querySelectorAll('.product-card');
const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, idx) => {
        if (entry.isIntersecting) {
            entry.target.style.animationDelay = `${(idx % 8) * 0.06}s`;
            entry.target.classList.add('revealed');
            observer.unobserve(entry.target);
        }
    });
}, { threshold: 0.1 });

cards.forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(20px)';
    card.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
    observer.observe(card);
});

// Add revealed class styling dynamically
const style = document.createElement('style');
style.textContent = `.product-card.revealed { opacity: 1 !important; transform: translateY(0) !important; }`;
document.head.appendChild(style);
