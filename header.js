// header.js — Custom Vector Hydrofoil SVG Logo, Dropdown Menu & Zero-Scrollbar Navigation Bar
(function () {
    const STORAGE_KEY = 'baywing_lang';

    window.getSiteLang = function () {
        const urlParams = new URLSearchParams(window.location.search);
        const urlLang = urlParams.get('lang');
        if (urlLang === 'tc' || urlLang === 'en') {
            localStorage.setItem(STORAGE_KEY, urlLang);
            return urlLang;
        }
        return localStorage.getItem(STORAGE_KEY) || 'en';
    };

    window.setSiteLang = function (lang) {
        localStorage.setItem(STORAGE_KEY, lang);
        window.applySiteTranslations(lang);
        window.dispatchEvent(new CustomEvent('baywing:langchange', { detail: { lang } }));
    };

    const NAV_I18N = {
        en: {
            hdr_sub: 'HK & GBA Electric Hydrofoil & 22kV Hub',
            'nav_index.html': '01. Master Plan',
            'nav_routes-calculator.html': '02. 28 Routes & OPEX',
            'nav_engineering-rd.html': '03. R&D Blueprints',
            'nav_digital-twin.html': '04. Digital Twin (16)',
            'nav_capital-stakeholders.html': '05. 22kV Hub & Capital',
            hdr_dd_btn: 'Quick Jump ▾',
            hdr_dd_hke: '📁 21/10 HKE Walkover Sheet',
            hdr_dd_term: '🏛️ +7.0mPD 22kV Terminal CAD',
            hdr_dd_clp: '🔌 HKE + CLP Dual-Grid Twin (M13)',
            hdr_dd_fmea: '🛡️ DNV HSC FMEA Matrix (M15)',
             hdr_dd_logs: '📋 12 Stakeholder Logs',
            ftr_archive_link: 'Archived HKE Walkover Sheet (21/10) ↗',
            ftr_copy: 'AERO-MARINE SYSTEMS LIMITED © 2026 // HONG KONG & GREATER BAY AREA (ALL FIGURES IN HKD)'
        },
        tc: {
            hdr_sub: '香港及大灣區純電水翼船及 22kV 樞紐',
            'nav_index.html': '01. 十年藍圖',
            'nav_routes-calculator.html': '02. 28條航線及成本',
            'nav_engineering-rd.html': '03. 工程藍圖',
            'nav_digital-twin.html': '04. 數字孿生庫 (16)',
            'nav_capital-stakeholders.html': '05. 22kV 碼頭及創投',
            hdr_dd_btn: '快速導覽 ▾',
            hdr_dd_hke: '📁 21/10 港燈現場勘察單',
            hdr_dd_term: '🏛️ +7.0mPD 22kV 碼頭工程圖',
            hdr_dd_clp: '🔌 港燈+中電跨海調度孿生 (M13)',
            hdr_dd_fmea: '🛡️ DNV 高速船 FMEA 驗證 (M15)',
            hdr_dd_logs: '📋 12項官方機構來往紀錄',
            ftr_archive_link: '港燈現場勘察決策單存檔 (21/10) ↗',
            ftr_copy: 'AERO-MARINE SYSTEMS LIMITED © 2026 // 香港及粵港澳大灣區（所有金額均以港幣 HKD 計算）'
        }
    };

    window.applySiteTranslations = function (lang) {
        const activeLang = lang || window.getSiteLang();
        const sharedDict = (window.SITE_DATA && window.SITE_DATA.i18n && window.SITE_DATA.i18n[activeLang]) || {};
        const navDict = NAV_I18N[activeLang] || NAV_I18N.en;
        const pageDict = (window.PAGE_I18N && window.PAGE_I18N[activeLang]) || {};
        const merged = Object.assign({}, sharedDict, navDict, pageDict);

        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.getAttribute('data-i18n');
            if (merged[key] !== undefined) {
                el.textContent = merged[key];
            }
        });

        const btnEn = document.getElementById('hdr-lang-en');
        const btnTc = document.getElementById('hdr-lang-tc');
        if (btnEn && btnTc) {
            btnEn.className = activeLang === 'en'
                ? 'px-2.5 py-1 rounded bg-tech-cyan text-slate-950 font-bold transition-all text-xs'
                : 'px-2.5 py-1 rounded text-zinc-400 hover:text-white transition-all text-xs';
            btnTc.className = activeLang === 'tc'
                ? 'px-2.5 py-1 rounded bg-tech-cyan text-slate-950 font-bold transition-all text-xs'
                : 'px-2.5 py-1 rounded text-zinc-400 hover:text-white transition-all text-xs';
        }
    };

    // Custom Geometric Vector Hydrofoil Emblem (Replaces Windows Orange Lightning Emoji)
    const BAYWING_SVG_LOGO = `
    <svg viewBox="0 0 36 36" class="w-9 h-9 shrink-0" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="1" y="1" width="34" height="34" rx="8" fill="#071324" stroke="#00f2ff" stroke-width="1.5" stroke-opacity="0.6"/>
        <!-- Sleek Foil-Borne Hull -->
        <path d="M 6 14 L 24 11 L 31 14 L 26 16.5 L 7 16.5 Z" fill="#00f2ff"/>
        <!-- Fore & Aft Submerged T-Foil Struts -->
        <line x1="12" y1="16.5" x2="11" y2="27" stroke="#00f2ff" stroke-width="2.2" stroke-linecap="round"/>
        <line x1="24" y1="16.5" x2="23" y2="27" stroke="#00f2ff" stroke-width="2.2" stroke-linecap="round"/>
        <!-- Submerged Hydrofoil Wings -->
        <path d="M 7 27.5 L 15 27.5 M 19 27.5 L 28 27.5" stroke="#10b981" stroke-width="2.6" stroke-linecap="round"/>
        <!-- Decoupled Waterline Wave -->
        <path d="M 5 21.5 Q 11 19.5 18 21.5 T 31 21.5" stroke="#38bdf8" stroke-width="1.2" stroke-dasharray="2,2" stroke-opacity="0.85"/>
    </svg>`;

    class SiteHeader extends HTMLElement {
        connectedCallback() {
            const path = window.location.pathname.split('/').pop() || 'index.html';
            const navItems = [
                { href: 'index.html', key: 'nav_index.html', label: '01. Master Plan' },
                { href: 'routes-calculator.html', key: 'nav_routes-calculator.html', label: '02. 28 Routes & OPEX' },
                { href: 'engineering-rd.html', key: 'nav_engineering-rd.html', label: '03. R&D Blueprints' },
                { href: 'digital-twin.html', key: 'nav_digital-twin.html', label: '04. Digital Twin (16)' },
                { href: 'capital-stakeholders.html', key: 'nav_capital-stakeholders.html', label: '05. 22kV Hub & Capital' }
            ];

            const linksHtml = navItems.map(item => {
                const isActive = path === item.href || (path === '' && item.href === 'index.html');
                const cls = isActive
                    ? 'px-2.5 py-1.5 rounded-md bg-zinc-800/90 text-tech-cyan border border-tech-cyan/40 font-bold whitespace-nowrap'
                    : 'px-2.5 py-1.5 rounded-md text-zinc-300 hover:text-white hover:bg-zinc-900 whitespace-nowrap transition-colors';
                return `<a href="${item.href}" class="${cls}" data-i18n="${item.key}">${item.label}</a>`;
            }).join('');

            this.innerHTML = `
            <header class="fixed top-0 left-0 right-0 z-50 bg-[#090b0f]/95 backdrop-blur-md border-b border-zinc-800/90">
                <div class="max-w-7xl mx-auto px-3 sm:px-6">
                    <div class="h-16 flex items-center justify-between gap-2">
                        <!-- Left Brand with Custom Vector Hydrofoil Emblem -->
                        <a href="index.html" class="flex items-center gap-2.5 shrink-0 group">
                            ${BAYWING_SVG_LOGO}
                            <div>
                                <div class="flex items-center gap-1.5">
                                    <span class="font-mono font-extrabold text-white text-sm tracking-wider group-hover:text-tech-cyan transition-colors">BAYWING</span>
                                    <span class="font-mono text-[10px] px-1.5 py-0.5 rounded bg-zinc-900 border border-zinc-700 text-tech-cyan">D1–D5 / d6</span>
                                </div>
                                <div class="text-[10px] font-mono text-zinc-400 hidden 2xl:block" data-i18n="hdr_sub">HK & GBA Electric Hydrofoil & 22kV Hub</div>
                            </div>
                        </a>

                        <!-- Center Navigation Links (Zero Scrollbar — Fits Cleanly on Desktop) -->
                        <nav class="hidden lg:flex items-center gap-1 font-mono text-[11px]">
                            ${linksHtml}
                            <!-- Clean Dropdown Menu for Quick Jumps & HKE Archive -->
                            <div class="relative group">
                                <button type="button" class="px-2.5 py-1.5 rounded-md bg-zinc-900 border border-zinc-700 text-tech-emerald font-bold hover:border-tech-emerald whitespace-nowrap flex items-center gap-1" data-i18n="hdr_dd_btn">
                                    Quick Jump ▾
                                </button>
                                <div class="absolute right-0 mt-1 w-64 rounded-xl bg-[#0c1017] border border-zinc-700 shadow-2xl py-2 hidden group-hover:block z-50 font-mono text-xs">
                                    <a href="hke-walkover-handout.html" class="block px-4 py-2 text-tech-emerald hover:bg-zinc-900 font-bold" data-i18n="hdr_dd_hke">📁 21/10 HKE Walkover Sheet</a>
                                    <a href="capital-stakeholders.html#terminal-spec" class="block px-4 py-2 text-zinc-300 hover:bg-zinc-900 hover:text-white" data-i18n="hdr_dd_term">🏛️ +7.0mPD 22kV Terminal CAD</a>
                                    <a href="digital-twin.html#clp-hke-sync" class="block px-4 py-2 text-zinc-300 hover:bg-zinc-900 hover:text-white" data-i18n="hdr_dd_clp">🔌 HKE + CLP Dual-Grid Twin (M13)</a>
                                    <a href="digital-twin.html#dnv-fmea-twin" class="block px-4 py-2 text-zinc-300 hover:bg-zinc-900 hover:text-white" data-i18n="hdr_dd_fmea">🛡️ DNV HSC FMEA Matrix (M15)</a>
                                    <a href="capital-stakeholders.html#comms-log" class="block px-4 py-2 text-zinc-300 hover:bg-zinc-900 hover:text-white" data-i18n="hdr_dd_logs">📋 12 Stakeholder Logs</a>
                                </div>
                            </div>
                        </nav>

                        <!-- Right Controls: Always Pinned & Visible at 100% Zoom -->
                        <div class="flex items-center gap-2 shrink-0 font-mono">
                            <span class="hidden sm:inline-block px-2 py-1 rounded bg-zinc-900 border border-zinc-700 text-tech-emerald text-[10px] font-bold">HKD</span>
                            <div class="inline-flex items-center bg-zinc-900 border border-zinc-700 rounded-lg p-0.5">
                                <button id="hdr-lang-en" onclick="window.setSiteLang('en')" type="button" class="px-2.5 py-1 rounded bg-tech-cyan text-slate-950 font-bold text-xs">EN</button>
                                <button id="hdr-lang-tc" onclick="window.setSiteLang('tc')" type="button" class="px-2.5 py-1 rounded text-zinc-400 hover:text-white text-xs">繁</button>
                            </div>
                        </div>
                    </div>

                    <!-- Mobile / Tablet Compact Select Dropdown (Zero Horizontal Drag Bar) -->
                    <div class="flex lg:hidden items-center justify-between gap-2 py-2 border-t border-zinc-800/80 font-mono text-xs">
                        <select onchange="if(this.value) window.location.href=this.value" class="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-1.5 text-white font-mono text-xs outline-none">
                            <option value="index.html" ${path === 'index.html' ? 'selected' : ''}>01. Master Plan & Fleet</option>
                            <option value="routes-calculator.html" ${path === 'routes-calculator.html' ? 'selected' : ''}>02. 28 Routes & OPEX Simulator</option>
                            <option value="engineering-rd.html" ${path === 'engineering-rd.html' ? 'selected' : ''}>03. R&D CAD Blueprints</option>
                            <option value="digital-twin.html" ${path === 'digital-twin.html' ? 'selected' : ''}>04. Phase 0 Digital Twin (16 Modules)</option>
                            <option value="capital-stakeholders.html" ${path === 'capital-stakeholders.html' ? 'selected' : ''}>05. 22kV Hub, Capital & 12 Logs</option>
                            <option value="hke-walkover-handout.html" ${path === 'hke-walkover-handout.html' ? 'selected' : ''}>📁 Archived 21/10 HKE Walkover Sheet</option>
                        </select>
                    </div>
                </div>
            </header>`;
            window.applySiteTranslations(window.getSiteLang());
        }
    }

    class SiteFooter extends HTMLElement {
        connectedCallback() {
            // Prevent duplicate footer rendering if multiple <site-footer> tags accidentally exist
            const existingFooters = document.querySelectorAll('site-footer');
            if (existingFooters.length > 1 && existingFooters[0] !== this) {
                this.style.display = 'none';
                return;
            }
            this.innerHTML = `
            <footer class="mt-auto bg-[#07090d] border-t border-zinc-800/80 py-8 font-mono text-xs text-zinc-500">
                <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div data-i18n="ftr_copy">AERO-MARINE SYSTEMS LIMITED © 2026 // HONG KONG & GREATER BAY AREA (ALL FIGURES IN HKD)</div>
                    <div class="flex flex-wrap items-center gap-4 text-[11px]">
                        <a href="index.html" class="hover:text-white" data-i18n="nav_index.html">01. Master Plan</a>
                        <a href="routes-calculator.html" class="hover:text-white" data-i18n="nav_routes-calculator.html">02. 28 Routes & OPEX</a>
                        <a href="engineering-rd.html" class="hover:text-white" data-i18n="nav_engineering-rd.html">03. R&D Blueprints</a>
                        <a href="digital-twin.html" class="hover:text-white" data-i18n="nav_digital-twin.html">04. Digital Twin (16)</a>
                        <a href="capital-stakeholders.html" class="hover:text-white" data-i18n="nav_capital-stakeholders.html">05. 22kV Hub & Capital</a>
                        <a href="hke-walkover-handout.html" class="text-tech-emerald hover:underline" data-i18n="ftr_archive_link">Archived HKE Walkover Sheet (21/10) ↗</a>
                    </div>
                </div>
            </footer>`;
            window.applySiteTranslations(window.getSiteLang());
        }
    }

    customElements.define('site-header', SiteHeader);
    customElements.define('site-footer', SiteFooter);
})();
// ============================================================================
// BAYWING AUTO-ASSET PATH RESOLVER & PLUG-AND-PLAY BOLT-ON ENGINE
// Paste at the bottom of header.js — works across all pages automatically
// ============================================================================
(function initBaywingCoreUpgrades() {
    const MEDIA_FOLDER = 'assets/';
    const KNOWN_MEDIA = new Set([
        'D1.jpg', 'D1vid.mp4', 'D2.jpg', 'd6.jpg',
        'IMG_1594.jpeg', 'IMG_1595.jpeg', 'IMG_1596.jpeg'
    ]);

    function normalizeMediaPath(rawPath) {
        if (!rawPath || rawPath.startsWith('http') || rawPath.startsWith('data:') || rawPath.startsWith('#')) return rawPath;
        const clean = rawPath.replace(/^\.\//, '');
        if (clean.startsWith(MEDIA_FOLDER)) return clean;
        if (KNOWN_MEDIA.has(clean) || /\.(jpe?g|png|mp4|webm|webp)$/i.test(clean)) {
            return MEDIA_FOLDER + clean;
        }
        return rawPath;
    }

    function chainAllMultimedia() {
        // 1. Rewrite <img> and <source>/<video> src attributes
        document.querySelectorAll('img[src], video[src], source[src]').forEach(el => {
            const raw = el.getAttribute('src');
            const target = normalizeMediaPath(raw);
            if (target !== raw) el.setAttribute('src', target);

            // Graceful fallback to root if file hasn't been dragged into assets/ yet
            if (el.tagName === 'IMG' && !el.dataset.fallbackWired) {
                el.dataset.fallbackWired = '1';
                el.addEventListener('error', function () {
                    const cur = this.getAttribute('src') || '';
                    if (cur.startsWith(MEDIA_FOLDER)) {
                        this.setAttribute('src', cur.slice(MEDIA_FOLDER.length));
                    }
                }, { once: true });
            }
        });

        // 2. Rewrite <a> links pointing to full-size JPEGs/MP4s
        document.querySelectorAll('a[href]').forEach(a => {
            const raw = a.getAttribute('href');
            if (raw && /\.(jpe?g|png|mp4)$/i.test(raw) && !raw.startsWith(MEDIA_FOLDER) && !raw.startsWith('http')) {
                a.setAttribute('href', normalizeMediaPath(raw));
            }
        });
    }

    // 3. Auto-discover any bolted-on <section data-bolton-nav="Label"> pasted before </main>
    function registerBoltOnSections() {
        const jumpBar = document.getElementById('hero-jump-bar');
        if (!jumpBar) return;
        document.querySelectorAll('main > section[id][data-bolton-nav]').forEach(sec => {
            const secId = sec.id;
            if (jumpBar.querySelector(`a[href="#${secId}"]`)) return;
            const pill = document.createElement('a');
            pill.href = `#${secId}`;
            pill.className = sec.getAttribute('data-bolton-class') ||
                'px-3 py-1.5 rounded bg-tech-cyan/15 border border-tech-cyan/50 text-tech-cyan font-bold hover:bg-tech-cyan/25';
            pill.textContent = sec.getAttribute('data-bolton-nav');
            jumpBar.appendChild(pill);
        });
    }

    document.addEventListener('DOMContentLoaded', () => {
        chainAllMultimedia();
        registerBoltOnSections();
    });
})();
// ============================================================================
// BAYWING ZERO-REGEN DECLARATIVE DESIGN ENGINE (APPEND TO BOTTOM OF header.js)
// Automatically mounts new visual showcase components from window.BAYWING_BOLTONS
// onto index.html, engineering-rd.html, digital-twin.html, routes-calculator.html,
// and capital-stakeholders.html without editing or regenerating HTML files.
// ============================================================================
(function initBaywingDesignEngine() {
    window.BAYWING_BOLTONS = window.BAYWING_BOLTONS || [];

    function getActivePageKey() {
        const path = (window.location.pathname || '').toLowerCase();
        if (path.includes('capital-stakeholders')) return 'capital';
        if (path.includes('digital-twin')) return 'twin';
        if (path.includes('engineering-rd')) return 'rd';
        if (path.includes('routes-calculator')) return 'routes';
        return 'index';
    }

    function mountBoltonComponents() {
        const pageKey = getActivePageKey();
        const mainEl = document.querySelector('main');
        if (!mainEl) return;

        // 1. Mount page-targeted sections into <main>
        const items = window.BAYWING_BOLTONS.filter(item =>
            item.pages && (item.pages.includes(pageKey) || item.pages.includes('all'))
        );

        items.forEach(item => {
            if (document.getElementById(item.id)) return;
            const wrapper = document.createElement('div');
            wrapper.innerHTML = typeof item.renderHtml === 'function' ? item.renderHtml() : item.html;
            const sectionEl = wrapper.firstElementChild;
            if (!sectionEl) return;

            // If on digital-twin.html and item specifies a domain, register into DOMAIN_TREE
            if (pageKey === 'twin' && item.twinDomain && typeof DOMAIN_TREE !== 'undefined') {
                const dKey = item.twinDomain.key;
                if (!DOMAIN_TREE[dKey]) {
                    DOMAIN_TREE[dKey] = { title: item.twinDomain.title, mods: [] };
                    const domBtnGrid = document.getElementById('dom-btn-cfd')?.parentElement;
                    if (domBtnGrid && !document.getElementById(`dom-btn-${dKey}`)) {
                        const btn = document.createElement('button');
                        btn.id = `dom-btn-${dKey}`; btn.setAttribute('onclick', `selectDomain('${dKey}')`);
                        btn.className = 'p-2.5 rounded-xl bg-zinc-950 border border-tech-emerald/50 text-tech-emerald hover:border-tech-cyan text-left transition-all';
                        btn.innerHTML = `<span class="text-[10px] block opacity-75">${item.twinDomain.badge}</span><span class="font-bold block truncate">${item.twinDomain.shortLabel}</span>`;
                        domBtnGrid.appendChild(btn);
                    }
                }
                if (!DOMAIN_TREE[dKey].mods.some(m => m.id === item.modId)) {
                    DOMAIN_TREE[dKey].mods.push({ id: item.modId, label: item.navLabel });
                }
                sectionEl.style.display = 'none';
            }

            mainEl.appendChild(sectionEl);

            // Auto-add jump pill to capital-stakeholders.html #hero-jump-bar
            if (pageKey === 'capital' && item.navLabel) {
                const jumpBar = document.getElementById('hero-jump-bar');
                if (jumpBar && !jumpBar.querySelector(`a[href="#${item.id}"]`)) { const a = document.createElement('a'); a.href = `#${item.id}`;
                    a.className = 'px-3 py-1.5 rounded bg-tech-cyan/15 border border-tech-cyan/50 text-tech-cyan font-bold hover:bg-tech-cyan/25';
                    a.textContent = item.navLabel;
                    jumpBar.appendChild(a);
                }
            }

            if (typeof item.onMount === 'function') {
                setTimeout(() => item.onMount(), 50);
            }
        });

        // 2. Also auto-discover any inline <section data-bolton-nav="..."> on capital-stakeholders.html
        const jumpBar = document.getElementById('hero-jump-bar');
        if (jumpBar) {
            document.querySelectorAll('section[data-bolton-nav]').forEach(sec => {
                const lbl = sec.getAttribute('data-bolton-nav');
                if (sec.id && lbl && !jumpBar.querySelector(`a[href="#${sec.id}"]`)) { const a = document.createElement('a'); a.href = `#${sec.id}`;
                    a.className = 'px-3 py-1.5 rounded bg-zinc-900 border border-tech-emerald/50 text-tech-emerald font-bold hover:border-tech-cyan';
                    a.textContent = lbl;
                    jumpBar.appendChild(a);
                }
            });
        }

        renderFloatingDemoLauncher(pageKey);
    }

    // Floating quick-jump drawer for HKSTP assessors to inspect new design components anywhere
    function renderFloatingDemoLauncher(pageKey) {
        if (document.getElementById('hkstp-demo-dock')) return;
        const dock = document.createElement('div');
        dock.id = 'hkstp-demo-dock';
        dock.className = 'fixed bottom-4 right-4 z-50 font-mono text-xs';
        dock.innerHTML = `
            <div id="hkstp-dock-panel" class="hidden mb-2 w-80 sm:w-96 rounded-2xl bg-[#070b12]/95 backdrop-blur-md border-2 border-tech-cyan/60 shadow-2xl p-4 space-y-3 text-zinc-200">
                <div class="flex items-center justify-between border-b border-zinc-800 pb-2">
                    <span class="text-tech-cyan font-bold uppercase tracking-wider">⚡ HKSTP JAN 2027 DEMO DECK</span>
                    <button onclick="document.getElementById('hkstp-dock-panel').classList.add('hidden')" class="text-zinc-400 hover:text-white">✕</button>
                </div>
                <p class="text-[11px] text-zinc-400 font-sans leading-relaxed">
                    Jump directly to live interactive design components across the repository:
                </p>
                <div class="space-y-1.5 max-h-64 overflow-y-auto pr-1">
                    <a href="engineering-rd.html#bolton-cabin-cad" class="block p-2 rounded-lg bg-zinc-900/90 border border-zinc-800 hover:border-tech-cyan">
                        <span class="text-tech-cyan font-bold block">01. Multi-Deck Cabin & Evacuation CAD</span>
                        <span class="text-[10px] text-zinc-400">engineering-rd.html • 3-Layer SVG Blueprint</span>
                    </a>
                    <a href="digital-twin.html#mod-m34" onclick="if(window.selectDomain){selectDomain('hkstp','m34');}" class="block p-2 rounded-lg bg-zinc-900/90 border border-zinc-800 hover:border-tech-emerald">
                        <span class="text-tech-emerald font-bold block">02. HKSTP 18-Mo Gate & Cavitation Sim</span>
                        <span class="text-[10px] text-zinc-400">digital-twin.html • Domain 10 Workbench</span>
                    </a>
                    <a href="capital-stakeholders.html#bolton-statutory-map" class="block p-2 rounded-lg bg-zinc-900/90 border border-zinc-800 hover:border-tech-amber">
                        <span class="text-tech-amber font-bold block">03. Cap. 127 & Dual-Utility Statutory Map</span>
                        <span class="text-[10px] text-zinc-400">capital-stakeholders.html • Interactive Flow</span>
                    </a>
                    <a href="routes-calculator.html#bolton-msi-comfort" class="block p-2 rounded-lg bg-zinc-900/90 border border-zinc-800 hover:border-purple-400">
                        <span class="text-purple-400 font-bold block">04. ISO 2631-1 Seasickness & Wave Sim</span>
                        <span class="text-[10px] text-zinc-400">routes-calculator.html & index.html</span>
                    </a>
                </div>
            </div>
            <button onclick="document.getElementById('hkstp-dock-panel').classList.toggle('hidden')" class="px-4 py-2.5 rounded-full bg-zinc-950/95 border-2 border-tech-cyan text-tech-cyan hover:bg-tech-cyan hover:text-slate-950 font-bold shadow-lg flex items-center gap-2 transition-all ml-auto">
                <span class="w-2 h-2 rounded-full bg-tech-emerald animate-ping"></span>
                <span>🧭 HKSTP Demo Switcher</span>
            </button>
        `;
        document.body.appendChild(dock);
    }

    document.addEventListener('DOMContentLoaded', () => {
        setTimeout(mountBoltonComponents, 80);
    });
})();
