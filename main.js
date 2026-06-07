// Initialize Animations
AOS.init({ once: true });

// Initialize Icons
lucide.createIcons();

// Auto-update copyright year
const yearEl = document.getElementById('currentYear');
if (yearEl) yearEl.textContent = new Date().getFullYear();

// Scroll Progress
window.onscroll = function() {
    let winScroll = document.body.scrollTop || document.documentElement.scrollTop;
    let height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    let scrolled = (winScroll / height) * 100;
    const bar = document.getElementById("scrollBar");
    if (bar) bar.style.width = scrolled + "%";
};

// Particles Configuration
if (typeof particlesJS !== 'undefined') {
    particlesJS('particles-js', {
        "particles": {
            "number": { "value": 50, "density": { "enable": true, "value_area": 1000 } },
            "color": { "value": "#D4AF37" },
            "shape": { "type": "circle" },
            "opacity": { "value": 0.2, "random": false },
            "size": { "value": 3, "random": true },
            "line_linked": { "enable": true, "distance": 150, "color": "#D4AF37", "opacity": 0.1, "width": 1 },
            "move": { "enable": true, "speed": 2, "direction": "none", "random": false, "straight": false, "out_mode": "out", "bounce": false }
        },
        "interactivity": { "detect_on": "canvas", "events": { "onhover": { "enable": true, "mode": "repulse" }, "onclick": { "enable": true, "mode": "push" }, "resize": true } }
    });
}

// Mobile navigation toggle
(function(){
    const toggle = document.getElementById('navToggle');
    const menu = document.getElementById('mobileMenu');
    if (toggle && menu) {
        toggle.addEventListener('click', () => {
            const isOpen = !menu.classList.contains('hidden');
            menu.classList.toggle('hidden');
            toggle.setAttribute('aria-expanded', String(!isOpen));
        });
    }
})();

// Smooth Scroll for Nav (also close mobile menu)
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const target = this.getAttribute('href');
        if (!target || target === '#') return;
        e.preventDefault();
        const el = document.querySelector(target);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
        const menu = document.getElementById('mobileMenu');
        const toggle = document.getElementById('navToggle');
        if (menu && !menu.classList.contains('hidden')) {
            menu.classList.add('hidden');
            if (toggle) toggle.setAttribute('aria-expanded', 'false');
        }
    });
});

// Fetch and render Facebook Feed from JSON
async function loadFacebookFeed() {
    const container = document.getElementById('fb-feed-content');
    if (!container) return;

    try {
        const response = await fetch('fb-feed.json');
        if (!response.ok) throw new Error('Feed not found');
        const data = await response.json();

        if (data.posts && data.posts.length > 0) {
            container.innerHTML = data.posts.map(post => {
                const date = new Date(post.created_time).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric'
                });
                const pictureHtml = post.full_picture ? `<img src="${post.full_picture}" alt="Update picture" class="w-full h-56 object-cover rounded-xl mb-4 border border-white/5 shadow-lg">` : '';
                const shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(post.permalink_url || data.url)}`;
                
                return `
                    <div class="p-5 rounded-2xl bg-white/5 border border-white/10 hover:border-[#D4AF37]/40 transition-all duration-500 group shadow-xl">
                        <div class="flex items-center justify-between mb-2">
                            <span class="text-[10px] font-bold text-[#D4AF37] uppercase tracking-widest">Update</span>
                            <span class="text-[10px] text-slate-500">${date}</span>
                        </div>
                        ${pictureHtml}
                        <p class="text-sm text-slate-300 leading-relaxed whitespace-pre-wrap group-hover:text-white transition-colors">${post.message || "Tignan ang orihinal na post para sa detalye."}</p>
                        <div class="flex items-center justify-between mt-5 pt-4 border-t border-white/5">
                            <a href="${post.permalink_url || data.url}" target="_blank" class="text-[10px] font-bold text-[#D4AF37] uppercase tracking-wider hover:underline flex items-center transition-all">
                                View Post <i data-lucide="external-link" class="w-3 h-3 ml-1"></i>
                            </a>
                            <a href="${shareUrl}" target="_blank" class="text-[10px] font-bold text-slate-400 uppercase tracking-wider hover:text-white transition flex items-center">
                                <i data-lucide="share-2" class="w-3 h-3 mr-1"></i> Share
                            </a>
                        </div>
                    </div>
                `;
            }).join('');
            
            // Re-initialize icons for dynamic content
            if (window.lucide) window.lucide.createIcons();
        } else {
            container.innerHTML = '<p class="text-slate-400 text-sm italic p-4 text-center">Walang makitang updates sa ngayon.</p>';
        }
    } catch (error) {
        console.warn('Facebook feed could not be loaded:', error.message);
        container.innerHTML = '<p class="text-slate-400 text-sm italic p-4 text-center">Bisitahin ang aming <a href="https://www.facebook.com/profile.php?id=61581987389724" target="_blank" class="text-[#D4AF37] hover:underline">social media</a> para sa pinakabagong updates.</p>';
    }
}

// Initialize feed on load
loadFacebookFeed();
