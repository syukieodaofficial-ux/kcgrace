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

// Facebook Page Plugin loader and Follow/Share handlers
(function(){
    const pageUrl = 'https://www.facebook.com/profile.php?id=61581987389724';

    function loadFbSDK() {
        if (window.FB) {
            try { FB.XFBML.parse(); } catch(e){}
            return;
        }
        const script = document.createElement('script');
        script.async = true;
        script.defer = true;
        script.crossOrigin = 'anonymous';
        script.src = 'https://connect.facebook.net/en_US/sdk.js#xfbml=1&version=v16.0';
        script.onload = () => { if (window.FB) { try { FB.XFBML.parse(); } catch(e){} } };
        document.body.appendChild(script);
    }

    // Load SDK when the section scrolls into view to improve performance
    const fbSection = document.getElementById('latest-updates');
    if (fbSection) {
        const obs = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    loadFbSDK();
                    obs.disconnect();
                }
            });
        }, { root: null, threshold: 0.1 });
        obs.observe(fbSection);
    }

    // Share button opens Facebook share dialog in a popup
    const shareBtn = document.getElementById('shareBtn');
    if (shareBtn) {
        shareBtn.addEventListener('click', (e) => {
            e.preventDefault();
            const shareUrl = 'https://www.facebook.com/sharer/sharer.php?u=' + encodeURIComponent(pageUrl);
            const w = 720, h = 560;
            const left = (screen.width/2)-(w/2);
            const top = (screen.height/2)-(h/2);
            window.open(shareUrl, 'fbshare', `width=${w},height=${h},top=${top},left=${left},resizable=yes`);
        });
    }

    // Follow button opens the page (users can follow/like there)
    const followBtn = document.getElementById('followBtn');
    if (followBtn) {
        followBtn.addEventListener('click', (e) => {
            e.preventDefault();
            window.open(pageUrl, '_blank', 'noopener');
        });
    }

    // If FB doesn't load after a short delay, show a fallback link
    setTimeout(() => {
        const feedContainer = document.getElementById('fbFeedContainer');
        if (feedContainer && !window.FB) {
            const fallback = document.createElement('div');
            fallback.className = 'p-6 text-center text-slate-300';
            fallback.innerHTML = `<p>Facebook feed could not be loaded automatically. <a href="${pageUrl}" target="_blank" rel="noopener noreferrer" class="text-[#D4AF37] underline">Visit our Facebook page</a> to see the latest updates.</p>`;
            // Only append fallback if the feed-wrapper is empty or still not parsed
            const wrapper = feedContainer.querySelector('.feed-wrapper');
            if (wrapper) wrapper.appendChild(fallback);
        }
    }, 3000);

})();
