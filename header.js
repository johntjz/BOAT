// header.js — D1–D6 Auto-Normalizer, Smart Asset Resolver, Ledger Hydrator & Bolt-On Engine
(function () {
    const STORAGE_KEY = 'baywing_lang';
    const MEDIA_FOLDER = 'assets/';

    window.getSiteLang = function () {
        const u = new URLSearchParams(window.location.search).get('lang');
        if (u === 'tc' || u === 'en') { localStorage.setItem(STORAGE_KEY, u); return u; }
        return localStorage.getItem(STORAGE_KEY) || 'en';
    };

    window.setSiteLang = function (lang) {
        localStorage.setItem(STORAGE_KEY, lang);
        window.applySiteTranslations(lang);
        window.hydrateCompactLedgers(lang);
        window.dispatchEvent(new CustomEvent('baywing:langchange', { detail: { lang } }));
    };

    // 1. Global EF-150 -> D6 Sanitizer (Scrubs SITE_DATA & DOM automatically)
    function normalizeEf150ToD6(str) {
        if (typeof str !== 'string') return str;
        return str
            .replace(/AM-EF150-FS-2026/g, 'AM-D6-FS-2026')
            .replace(/BAYWING\s+EF-150/g, 'BAYWING-D6')
            .replace(/EF-150/g, 'D6')
            .replace(/EF150/g, 'D6');
    }

    function scrubObjectToD6(obj) {
        if (!obj || typeof obj !== 'object') return;
        Object.keys(obj).forEach(k => {
            if (typeof obj[k] === 'string') obj[k] = normalizeEf150ToD6(obj[k]);
            else if (typeof obj[k] === 'object') scrubObjectToD6(obj[k]);
        });
    }

    const NAV_I18N = {
        en: {
            hdr_sub: 'HK & GBA Electric Hydrofoil & 22kV Water-Airport Hub',
            'nav_index.html': '01. Master Plan',
            'nav_routes-calculator.html': '02. 28 Routes & OPEX',
            'nav_engineering-rd.html': '03. R&D Blueprints',
            'nav_digital-twin.html': '04. Digital Twin',
            'nav_capital-stakeholders.html': '05. 22kV Hub & Capital',
            hdr_dd_btn: 'Quick Jump ▾',
            hdr_dd_hke: '📁 21/10 HKE Walkover Archive',
            hdr_dd_term: '🏛️ +7.0mPD 22kV Terminal CAD',
            hdr_dd_clp: '🔌 HKE + CLP Dual-Grid Twin',
            hdr_dd_fmea: '🛡️ DNV HSC FMEA Matrix',
            hdr_dd_logs: '📋 14 Stakeholder Logs',
            ftr_archive_link: '21/10 HKE Walkover Archive ↗',
            ftr_copy: 'AERO-MARINE SYSTEMS LIMITED © 2026 // BAYWING D1–D6 FLEET (ALL FIGURES IN HKD)'
        },
        tc: {
            hdr_sub: '香港及大灣區純電水翼船及 22kV 水上機場樞紐',
            'nav_index.html': '01. 十年藍圖',
            'nav_routes-calculator.html': '02. 28條航線及成本',
            'nav_engineering-rd.html': '03. 工程藍圖',
            'nav_digital-twin.html': '04. 數字孿生庫',
            'nav_capital-stakeholders.html': '05. 22kV 碼頭及創投',
            hdr_dd_btn: '快速導覽 ▾',
            hdr_dd_hke: '📁 21/10 港燈現場勘察存檔',
            hdr_dd_term: '🏛️ +7.0mPD 22kV 碼頭工程圖',
            hdr_dd_clp: '🔌 港燈+中電跨海調度孿生',
            hdr_dd_fmea: '🛡️ DNV 高速船 FMEA 驗證',
            hdr_dd_logs: '📋 14項官方機構來往紀錄',
            ftr_archive_link: '港燈現場勘察存檔 (21/10) ↗',
            ftr_copy: 'AERO-MARINE SYSTEMS LIMITED © 2026 // BAYWING D1–D6 船隊（所有金額均以港幣 HKD 計算）'
        }
    };

    window.applySiteTranslations = function (lang) {
        if (window.SITE_DATA) scrubObjectToD6(window.SITE_DATA);
        const activeLang = lang || window.getSiteLang();
        const merged = Object.assign(
            {},
            (window.SITE_DATA && window.SITE_DATA.i18n && window.SITE_DATA.i18n[activeLang]) || {},
            NAV_I18N[activeLang] || NAV_I18N.en,
            (window.PAGE_I18N && window.PAGE_I18N[activeLang]) || {}
        );

        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.getAttribute('data-i18n');
            if (merged[key] !== undefined) el.textContent = normalizeEf150ToD6(merged[key]);
        });

        const btnEn = document.getElementById('hdr-lang-en');
        const btnTc = document.getElementById('hdr-lang-tc');
        if (btnEn && btnTc) {
            btnEn.className = activeLang === 'en' ? 'px-2.5 py-1 rounded bg-tech-cyan text-slate-950 font-bold text-xs' : 'px-2.5 py-1 rounded text-zinc-400 hover:text-white text-xs';
            btnTc.className = activeLang === 'tc' ? 'px-2.5 py-1 rounded bg-tech-cyan text-slate-950 font-bold text-xs' : 'px-2.5 py-1 rounded text-zinc-400 hover:text-white text-xs';
        }
    };

    // 2. Centralized Compact Ledger Hydrator (Populates [data-compact-ledger] from SITE_DATA.ledgers)
    window.hydrateCompactLedgers = function (lang) {
        const activeLang = lang || window.getSiteLang();
        const ledgers = (window.SITE_DATA && window.SITE_DATA.ledgers) || {};
        document.querySelectorAll('[data-compact-ledger]').forEach(el => {
            const key = el.getAttribute('data-compact-ledger');
            const entry = ledgers[key];
            if (!entry) return;
            const html = typeof entry === 'function' ? entry(activeLang) : (entry[activeLang] || entry.en || entry);
            if (html) el.innerHTML = normalizeEf150ToD6(html);
        });
        chainAllMultimedia();
    };

    // 3. Smart Media Path & D6.jpg <-> ef150.jpg Fallback Resolver
    function normalizeMediaPath(rawPath) {
        if (!rawPath || rawPath.startsWith('http') || rawPath.startsWith('data:') || rawPath.startsWith('#')) return rawPath;
        const clean = rawPath.replace(/^\.\//, '');
        if (clean.startsWith(MEDIA_FOLDER)) return clean;
        if (/\.(jpe?g|png|mp4|webm|webp)$/i.test(clean)) return MEDIA_FOLDER + clean;
        return rawPath;
    }

    function chainAllMultimedia() {
        document.querySelectorAll('img[src], video[src], source[src]').forEach(el => {
            const raw = el.getAttribute('src');
            const target = normalizeMediaPath(raw);
            if (target !== raw) el.setAttribute('src', target);

            if (el.tagName === 'IMG' && !el.dataset.fallbackWired) {
                el.dataset.fallbackWired = '1';
                el.addEventListener('error', function () {
                    const cur = this.getAttribute('src') || '';
                    if (cur.includes('D6.jpg')) {
                        this.setAttribute('src', MEDIA_FOLDER + 'ef150.jpg');
                    } else if (cur.startsWith(MEDIA_FOLDER)) {
                        this.setAttribute('src', cur.slice(MEDIA_FOLDER.length));
                    }
                });
            }
        });
    }

    const BAYWING_SVG_LOGO = `
    <svg viewBox="0 0 36 36" class="w-9 h-9 shrink-0" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="1" y="1" width="34" height="34" rx="8" fill="#071324" stroke="#00f2ff" stroke-width="1.5" stroke-opacity="0.6"/>
        <path d="M 6 14 L 24 11 L 31 14 L 26 16.5 L 7 16.5 Z" fill="#00f2ff"/>
        <line x1="12" y1="16.5" x2="11" y2="27" stroke="#00f2ff" stroke-width="2.2" stroke-linecap="round"/>
        <line x1="24" y1="16.5" x2="23" y2="27" stroke="#00f2ff" stroke-width="2.2" stroke-linecap="round"/>
        <path d="M 7 27.5 L 15 27.5 M 19 27.5 L 28 27.5" stroke="#10b981" stroke-width="2.6" stroke-linecap="round"/>
        <path d="M 5 21.5 Q 11 19.5 18 21.5 T 31 21.5" stroke="#38bdf8" stroke-width="1.2" stroke-dasharray="2,2" stroke-opacity="0.85"/>
    </svg>`;

    class SiteHeader extends HTMLElement {
        connectedCallback() {
            const path = window.location.pathname.split('/').pop() || 'index.html';
            const navItems = [
                { href: 'index.html', key: 'nav_index.html', label: '01. Master Plan' },
                { href: 'routes-calculator.html', key: 'nav_routes-calculator.html', label: '02. 28 Routes & OPEX' },
                { href: 'engineering-rd.html', key: 'nav_engineering-rd.html', label: '03. R&D Blueprints' },
                { href: 'digital-twin.html', key: 'nav_digital-twin.html', label: '04. Digital Twin' },
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
                        <a href="index.html" class="flex items-center gap-2.5 shrink-0 group">
                            ${BAYWING_SVG_LOGO}
                            <div>
                                <div class="flex items-center gap-1.5">
                                    <span class="font-mono font-extrabold text-white text-sm tracking-wider group-hover:text-tech-cyan">BAYWING</span>
                                    <span class="font-mono text-[10px] px-1.5 py-0.5 rounded bg-zinc-900 border border-zinc-700 text-tech-cyan">D1–D6 FLEET</span>
                                </div>
                                <div class="text-[10px] font-mono text-zinc-400 hidden 2xl:block" data-i18n="hdr_sub">HK & GBA Electric Hydrofoil & 22kV Hub</div>
                            </div>
                        </a>
                        <nav class="hidden lg:flex items-center gap-1 font-mono text-[11px]">
                            ${linksHtml}
                            <div class="relative group">
                                <button type="button" class="px-2.5 py-1.5 rounded-md bg-zinc-900 border border-zinc-700 text-tech-emerald font-bold hover:border-tech-emerald whitespace-nowrap" data-i18n="hdr_dd_btn">Quick Jump ▾</button>
                                <div class="absolute right-0 mt-1 w-64 rounded-xl bg-[#0c1017] border border-zinc-700 shadow-2xl py-2 hidden group-hover:block z-50 font-mono text-xs">
                                    <a href="capital-stakeholders.html#walkover-archive" class="block px-4 py-2 text-tech-emerald hover:bg-zinc-900 font-bold" data-i18n="hdr_dd_hke">📁 21/10 HKE Walkover Archive</a>
                                    <a href="capital-stakeholders.html#water-airport-master" class="block px-4 py-2 text-zinc-300 hover:bg-zinc-900 hover:text-white" data-i18n="hdr_dd_term">🏛️ +7.0mPD 22kV Terminal CAD</a>
                                    <a href="digital-twin.html#clp-hke-sync" class="block px-4 py-2 text-zinc-300 hover:bg-zinc-900 hover:text-white" data-i18n="hdr_dd_clp">🔌 HKE + CLP Dual-Grid Twin</a>
                                    <a href="digital-twin.html#dnv-fmea-twin" class="block px-4 py-2 text-zinc-300 hover:bg-zinc-900 hover:text-white" data-i18n="hdr_dd_fmea">🛡️ DNV HSC FMEA Matrix</a>
                                    <a href="capital-stakeholders.html#comms-log" class="block px-4 py-2 text-zinc-300 hover:bg-zinc-900 hover:text-white" data-i18n="hdr_dd_logs">📋 14 Stakeholder Logs</a>
                                </div>
                            </div>
                        </nav>
                        <div class="flex items-center gap-2 shrink-0 font-mono">
                            <span class="hidden sm:inline-block px-2 py-1 rounded bg-zinc-900 border border-zinc-700 text-tech-emerald text-[10px] font-bold">HKD</span>
                            <div class="inline-flex items-center bg-zinc-900 border border-zinc-700 rounded-lg p-0.5">
                                <button id="hdr-lang-en" onclick="window.setSiteLang('en')" type="button" class="px-2.5 py-1 rounded bg-tech-cyan text-slate-950 font-bold text-xs">EN</button>
                                <button id="hdr-lang-tc" onclick="window.setSiteLang('tc')" type="button" class="px-2.5 py-1 rounded text-zinc-400 hover:text-white text-xs">繁</button>
                            </div>
                        </div>
                    </div>
                </div>
            </header>`;
            window.applySiteTranslations(window.getSiteLang());
        }
    }

    class SiteFooter extends HTMLElement {
        connectedCallback() {
            const existing = document.querySelectorAll('site-footer');
            if (existing.length > 1 && existing[0] !== this) { this.style.display = 'none'; return; }
            this.innerHTML = `
            <footer class="mt-auto bg-[#07090d] border-t border-zinc-800/80 py-8 font-mono text-xs text-zinc-500">
                <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div data-i18n="ftr_copy">AERO-MARINE SYSTEMS LIMITED © 2026 // BAYWING D1–D6 FLEET (ALL FIGURES IN HKD)</div>
                    <div class="flex flex-wrap items-center gap-4 text-[11px]">
                        <a href="index.html" class="hover:text-white" data-i18n="nav_index.html">01. Master Plan</a>
                        <a href="routes-calculator.html" class="hover:text-white" data-i18n="nav_routes-calculator.html">02. 28 Routes & OPEX</a>
                        <a href="engineering-rd.html" class="hover:text-white" data-i18n="nav_engineering-rd.html">03. R&D Blueprints</a>
                        <a href="digital-twin.html" class="hover:text-white" data-i18n="nav_digital-twin.html">04. Digital Twin</a>
                        <a href="capital-stakeholders.html" class="hover:text-white" data-i18n="nav_capital-stakeholders.html">05. 22kV Hub & Capital</a>
                    </div>
                </div>
            </footer>`;
            window.applySiteTranslations(window.getSiteLang());
        }
    }

    customElements.define('site-header', SiteHeader);
    customElements.define('site-footer', SiteFooter);

    // 4. Mount BAYWING_BOLTONS & Hydrate Ledgers on DOMContentLoaded
    document.addEventListener('DOMContentLoaded', () => {
        window.applySiteTranslations(window.getSiteLang());
        window.hydrateCompactLedgers(window.getSiteLang());

        const path = (window.location.pathname || '').toLowerCase();
        const pageKey = path.includes('capital') ? 'capital' : path.includes('twin') ? 'twin' : path.includes('rd') ? 'rd' : path.includes('routes') ? 'routes' : 'index';
        const mainEl = document.querySelector('main');

        if (mainEl && Array.isArray(window.BAYWING_BOLTONS)) {
            window.BAYWING_BOLTONS.filter(b => b.pages && (b.pages.includes(pageKey) || b.pages.includes('all'))).forEach(item => {
                if (document.getElementById(item.id)) return;
                const wrap = document.createElement('div');
                wrap.innerHTML = normalizeEf150ToD6(typeof item.renderHtml === 'function' ? item.renderHtml() : item.html);
                const sec = wrap.firstElementChild;
                if (!sec) return;

                if (pageKey === 'twin' && item.twinDomain && typeof DOMAIN_TREE !== 'undefined') {
                    const dKey = item.twinDomain.key;
                    if (!DOMAIN_TREE[dKey]) {
                        DOMAIN_TREE[dKey] = { title: item.twinDomain.title, mods: [] };
                        const grid = document.getElementById('tier1-domain-grid') || document.getElementById('dom-btn-cfd')?.parentElement;
                        if (grid && !document.getElementById(`dom-btn-${dKey}`)) {
                            const btn = document.createElement('button');
                            btn.id = `dom-btn-${dKey}`;
                            btn.setAttribute('onclick', `selectDomain('${dKey}')`);
                            btn.className = 'p-2.5 rounded-xl bg-zinc-950 border border-tech-emerald/50 text-tech-emerald hover:border-tech-cyan text-left transition-all';
                            btn.innerHTML = `<span class="text-[10px] block opacity-75">${item.twinDomain.badge}</span><span class="font-bold block truncate">${item.twinDomain.shortLabel}</span>`;
                            grid.appendChild(btn);
                        }
                    }
                    if (!DOMAIN_TREE[dKey].mods.some(m => m.id === item.modId)) {
                        DOMAIN_TREE[dKey].mods.push({ id: item.modId, label: item.navLabel });
                    }
                    sec.style.display = 'none';
                }
                mainEl.appendChild(sec);
                if (typeof item.onMount === 'function') setTimeout(() => item.onMount(), 50);
            });
        }
        chainAllMultimedia();
    });
})();
