// config
const GITHUB_USERNAME = 'Mirvo19';
const DISCORD_WEBHOOK = 'https://discord.com/api/webhooks/1474425538889383986/7ahK2vLKl6raNluy6E-mIETr3GGGYa891vkLkYd1FgdLObsSVeBhNHfLYIRqO2JmwE8c';

// boot messages shown during the loading screen
const bootMessages = [
    { text: 'GHIMIRE SYSTEMS INC. BIOS v2.26.02.20', type: 'info', delay: 80 },
    { text: 'Copyright (C) 2026 Samir Ghimire. All Rights Reserved.', type: 'dim', delay: 60 },
    { text: '', type: 'dim', delay: 30 },
    { text: 'CPU: SAMIR-CORE i9 @ 3.6GHz (Full Stack Edition)', type: 'ok', delay: 80 },
    { text: 'RAM: 16GB DDR5 (HTML5 + CSS3 + JS + Python + NodeJS)', type: 'ok', delay: 80 },
    { text: 'GPU: Creative Engine v4.2  ENABLED', type: 'ok', delay: 70 },
    { text: '', type: 'dim', delay: 20 },
    { text: 'Scanning storage devices...', type: 'dim', delay: 100 },
    { text: '[OK] SSD-0: github.com/Mirvo19  6 projects detected', type: 'ok', delay: 120 },
    { text: '[OK] SSD-1: skills.db  loaded 20 modules', type: 'ok', delay: 80 },
    { text: '', type: 'dim', delay: 20 },
    { text: 'Initializing network stack...', type: 'dim', delay: 90 },
    { text: '[OK] GitHub API interface  READY', type: 'ok', delay: 80 },
    { text: '[OK] Email port  OPEN (unonown97@gmail.com)', type: 'ok', delay: 80 },
    { text: '', type: 'dim', delay: 20 },
    { text: 'Loading BIOS configuration...', type: 'dim', delay: 80 },
    { text: '[OK] Main menu  loaded', type: 'ok', delay: 60 },
    { text: '[OK] About module  loaded', type: 'ok', delay: 60 },
    { text: '[OK] Skills module  loaded', type: 'ok', delay: 60 },
    { text: '[OK] Projects module  loaded', type: 'ok', delay: 60 },
    { text: '[OK] Contact module  loaded', type: 'ok', delay: 60 },
    { text: '[!!] Coffee level: CRITICALLY LOW', type: 'warn', delay: 270 },
    { text: '', type: 'dim', delay: 30 },
    { text: 'System ready. Entering BIOS Setup Utility...', type: 'info', delay: 80 },
];

// tracks if boot is complete
let booted = false;

// plays the boot sequence animation
function runBootSequence() {
    const bootLog    = document.getElementById('boot-log');
    const bootFill   = document.getElementById('boot-fill');
    const bootPct    = document.getElementById('boot-pct');
    const bootScreen = document.getElementById('boot-screen');

    const total = bootMessages.length;
    let idx = 0;

    function showNext() {
        if (booted) return;
        if (idx >= total) {
            setTimeout(finishBoot, 400);
            return;
        }

        const msg      = bootMessages[idx++];
        const progress = Math.round((idx / total) * 100);

        if (msg.text !== '') {
            const line = document.createElement('div');
            line.className   = `boot-log-line ${msg.type}`;
            line.textContent = msg.text;
            bootLog.appendChild(line);
            bootLog.scrollTop = bootLog.scrollHeight;
        }

        bootFill.style.width = progress + '%';
        bootPct.textContent  = progress + '%';

        setTimeout(showNext, msg.delay);
    }

    showNext();

    const skipBoot = () => { if (!booted) finishBoot(); };
    document.addEventListener('keydown', skipBoot, { once: true });
    bootScreen.addEventListener('click', skipBoot, { once: true });
}

// completes boot and shows the main ui
function finishBoot() {
    if (booted) return;
    booted = true;

    document.getElementById('boot-fill').style.width = '100%';
    document.getElementById('boot-pct').textContent  = '100%';

    const bootScreen = document.getElementById('boot-screen');
    const biosMain   = document.getElementById('bios-main');

    bootScreen.classList.add('fade-out');
    setTimeout(() => {
        bootScreen.style.display = 'none';
        biosMain.classList.remove('hidden');
        startClock();
        updateCurrentDate();
        initUptimeCounter();
        runHudSequence();
    }, 650);
}

// Plotter-style HUD construct — fully sequential, maximum granularity
// Every visible sub-element gets its own draw animation
function runHudSequence() {
    const grid = document.getElementById('hud-grid');
    if (grid) grid.classList.add('active');

    const tl = [];
    let t = 120;

    function q(el, hudType, gap) {
        if (!el) return;
        el.setAttribute('data-hud', hudType);
        tl.push({ el, delay: t });
        t += gap;
    }

    // ───── 1. HEADER — border draws, then each inner piece ─────
    const header = document.querySelector('.bios-header');
    q(header, 'header', 90);

    // Header-left zone
    q(header?.querySelector('.header-left'), 'header-left', 55);
    // Individual header children
    q(header?.querySelector('.header-brand'), 'hud-brand', 48);
    q(header?.querySelector('.header-sep'),   'hud-flash', 28);
    q(header?.querySelector('.header-date'),  'hud-date',  40);

    // Header-right zone
    q(header?.querySelector('.header-right'),  'header-right', 48);
    const statusEl = header?.querySelector('.header-status');
    q(statusEl, 'hud-status', 32);
    const statusDot = statusEl?.querySelector('.status-dot');
    q(statusDot, 'hud-statusdot', 20);

    // ───── 2. NAV — border draws, then icon+label of each tab ─────
    const nav = document.querySelector('.bios-nav');
    q(nav, 'nav', 80);

    document.querySelectorAll('.nav-tab').forEach(tab => {
        const icon = tab.querySelector('.tab-icon');
        if (icon) q(icon, 'hud-tabicon', 20);
        q(tab, 'nav-tab', 35);
    });

    document.querySelectorAll('.nav-keys .key-hint').forEach(h => {
        q(h, 'hud-keyhint', 26);
    });
    t += 35;

    // ───── 3. LEFT PANEL — border traces in ─────
    const leftPanel = document.querySelector('.left-panel');
    q(leftPanel, 'left-panel', 85);

    // ───── 4. MAIN SECTION — deep granularity ─────
    const mainSection = document.getElementById('section-main');
    if (mainSection) {
        // Title bars — icon then text
        mainSection.querySelectorAll('.section-title-bar').forEach(el => {
            const icon = el.querySelector('.section-icon');
            if (icon) q(icon, 'hud-titleicon', 18);
            q(el, 'title-bar', 44);
        });

        // Info rows — key traces in, then value traces in
        mainSection.querySelectorAll('.info-row').forEach(el => {
            const key = el.querySelector('.info-key');
            const val = el.querySelector('.info-val');
            if (key) q(key, 'hud-infokey', 22);
            if (val) q(val, 'hud-infoval', 24);
        });
        t += 18;

        // Separator lines — drawn left to right
        mainSection.querySelectorAll('.separator-line').forEach(el => {
            q(el, 'hud-electric', 36);
        });

        // Stat grid — each box constructs itself individually as a whole unit
        mainSection.querySelectorAll('.stat-box').forEach(box => {
            q(box, 'hud-statbox', 60);
        });
        t += 20;

        // Activity log — each entry draws itself in from left as one unit
        mainSection.querySelectorAll('.log-entry').forEach(entry => {
            q(entry, 'hud-logentry', 42);
        });
    }
    t += 40;

    // ───── 5. RIGHT PANEL — border traces in ─────
    const rightPanel = document.querySelector('.right-panel');
    q(rightPanel, 'right-panel', 85);

    // ───── 6. RIGHT PANEL — skip section container, animate only children ─────
    document.querySelectorAll('.right-section').forEach(section => {
        // Section border
        q(section, 'right-section', 30);

        // Title bar — icon then text
        const title = section.querySelector('.section-title-bar');
        if (title) {
            const icon = title.querySelector('.section-icon') || title.querySelector('.small');
            q(title, 'right-title', 24);
        }

        // Clock — each digit group traced
        const clock = section.querySelector('.clock-display');
        if (clock) q(clock, 'clock', 28);

        // Date line
        const dateLine = section.querySelector('.date-display');
        if (dateLine) q(dateLine, 'hud-date', 24);

        // CPU bars — label then bar, each separately
        section.querySelectorAll('.mini-bar-row').forEach(el => {
            const lbl = el.querySelector('span');
            const bar = el.querySelector('.mini-fill-wrap');
            if (lbl) q(lbl, 'hud-minilabel', 18);
            if (bar) q(bar, 'hud-minibar', 18);
        });

        // Memory map — label then bar
        section.querySelectorAll('.mem-row').forEach(el => {
            const lbl = el.querySelector('.mem-label');
            const bar = el.querySelector('.mem-bar');
            if (lbl) q(lbl, 'hud-memlabel', 14);
            if (bar) q(bar, 'hud-membar', 18);
        });

        // Boot sequence items
        section.querySelectorAll('.seq-item').forEach(el => {
            q(el, 'hud-seq', 20);
        });

        // Key bindings — kbd then text
        section.querySelectorAll('.key-item').forEach(el => {
            el.querySelectorAll('kbd').forEach(k => q(k, 'hud-kbd', 14));
            q(el, 'hud-keyitem', 18);
        });

        // Dev notice
        const notice = section.querySelector('.dev-notice-box');
        if (notice) {
            const dot = notice.querySelector('.blink-dot');
            if (dot) q(dot, 'hud-statusdot', 14);
            q(notice, 'hud-notice', 30);
        }

        t += 14;
    });

    // ───── 7. FOOTER — border draws up, then each child span ─────
    const footer = document.querySelector('.bios-footer');
    q(footer, 'footer', 85);

    // Footer left — each child separately
    const fLeft = footer?.querySelector('.footer-left');
    if (fLeft) {
        q(fLeft, 'footer-child', 40);
        const esteregg = fLeft.querySelector('.esteregg');
        if (esteregg) q(esteregg, 'hud-brand', 26);
        const fsep = fLeft.querySelector('.footer-sep');
        if (fsep) q(fsep, 'hud-flash', 18);
        // version span (last child span)
        const spans = fLeft.querySelectorAll(':scope > span:not(.footer-sep)');
        spans.forEach(s => q(s, 'hud-footspan', 20));
    }

    // Footer right — then each key-hint
    const fRight = footer?.querySelector('.footer-right');
    if (fRight) q(fRight, 'footer-child', 32);
    footer?.querySelectorAll('.footer-right .key-hint').forEach(h => {
        q(h, 'hud-keyhint', 22);
    });

    // ═══ EXECUTE ENTIRE TIMELINE ═══
    tl.forEach(step => {
        setTimeout(() => step.el.classList.add('hud-visible'), step.delay);
    });

    // init BIOS features after everything is revealed
    setTimeout(() => initBIOS(), t + 200);
}

// runs once after the HUD sequence finishes
function initBIOS() {
    initTabs();
    initTypingEffect();
    fetchGitHubProjects();
    initContactForm();
    initKeyboardNav();
    initFKeys();
    initHamburger();
}

// updates the live clock every second
function startClock() {
    const days   = ['SUN','MON','TUE','WED','THU','FRI','SAT'];
    const months = ['JAN','FEB','MAR','APR','MAY','JUN','JUL','AUG','SEP','OCT','NOV','DEC'];

    function tick() {
        const now = new Date();
        const hh  = String(now.getHours()).padStart(2, '0');
        const mm  = String(now.getMinutes()).padStart(2, '0');
        const ss  = String(now.getSeconds()).padStart(2, '0');
        const dateStr = `${days[now.getDay()]} ${String(now.getDate()).padStart(2,'0')} ${months[now.getMonth()]} ${now.getFullYear()}`;

        const clock = document.getElementById('live-clock');
        if (clock) clock.textContent = `${hh}:${mm}:${ss}`;

        const hd   = document.getElementById('live-date');
        const side = document.getElementById('live-date-side');
        if (hd)   hd.textContent   = dateStr;
        if (side) side.textContent = dateStr;
    }

    tick();
    setInterval(tick, 1000);
}

// sets the current date text in the main section
function updateCurrentDate() {
    const el = document.getElementById('current-date');
    if (el) {
        el.textContent = new Date().toLocaleDateString('en-US', {
            year: 'numeric', month: 'long', day: 'numeric'
        }).toUpperCase();
    }
}

// counts uptime since page load
function initUptimeCounter() {
    const start = Date.now();
    function tick() {
        const s  = Math.floor((Date.now() - start) / 1000);
        const hh = String(Math.floor(s / 3600)).padStart(2, '0');
        const mm = String(Math.floor((s % 3600) / 60)).padStart(2, '0');
        const ss = String(s % 60).padStart(2, '0');
        const el = document.getElementById('uptime-counter');
        if (el) el.textContent = `${hh}:${mm}:${ss}`;
    }
    tick();
    setInterval(tick, 1000);
}

// toggles the mobile hamburger menu
function initHamburger() {
    const btn  = document.getElementById('hamburger');
    const tabs = document.getElementById('nav-tabs');
    if (!btn || !tabs) return;

    btn.addEventListener('click', () => {
        btn.classList.toggle('open');
        tabs.classList.toggle('open');
    });
}

// tab order and current index
const TAB_NAMES = ['main', 'about', 'skills', 'projects', 'contact'];
let currentTabIdx = 0;

// adds click listeners to nav tabs
function initTabs() {
    document.querySelectorAll('.nav-tab').forEach(tab => {
        tab.addEventListener('click', () => switchTab(tab.dataset.section));
    });
}

// switches to the given tab by name
function switchTab(name) {
    if (!TAB_NAMES.includes(name)) return;

    document.querySelectorAll('.nav-tab').forEach(t =>
        t.classList.toggle('active', t.dataset.section === name)
    );
    document.querySelectorAll('.bios-section').forEach(s =>
        s.classList.toggle('active', s.id === `section-${name}`)
    );

    // close mobile menu on tab switch
    const hamburger = document.getElementById('hamburger');
    const navTabs   = document.getElementById('nav-tabs');
    if (hamburger) hamburger.classList.remove('open');
    if (navTabs)   navTabs.classList.remove('open');

    // run fast construct animation on the incoming section
    animateSectionIn(name);

    if (name === 'skills')   setTimeout(animateSkillBars, 400);
    if (name === 'projects') ensureProjectsLoaded();
}

// all tab-hud CSS class names we use
const TAB_HUD_CLASSES = ['tab-hud-target','tab-hud-visible',
    't-title','t-titleicon','t-row','t-infokey','t-infoval','t-bio',
    't-flagstatus','t-flagname','t-skillname','t-skillbar','t-skillpct',
    't-grouplabel','t-chip','t-form','t-formlabel','t-forminput',
    't-btn','t-sep','t-block','t-flag','t-skill',
    't-statbox','t-logentry','t-projstat'];

// Deeply granular plotter-style construct animation for tab content
function animateSectionIn(name) {
    const section = document.getElementById(`section-${name}`);
    if (!section) return;

    // clean up previous animation classes
    section.querySelectorAll('.tab-hud-target').forEach(el => {
        el.classList.remove(...TAB_HUD_CLASSES);
    });

    // collect every element to animate, in DOM order, deeply
    const targets = [];

    function walk(parent) {
        const kids = parent.children;
        for (let i = 0; i < kids.length; i++) {
            const el = kids[i];
            const cl = el.classList;

            // section title bars → icon then text
            if (cl.contains('section-title-bar')) {
                const icon = el.querySelector('.section-icon');
                if (icon) targets.push({ el: icon, type: 't-titleicon' });
                targets.push({ el, type: 't-title' });
            }
            // separator lines
            else if (cl.contains('separator-line')) {
                targets.push({ el, type: 't-sep' });
            }
            // info-table → each row split into key + val
            else if (cl.contains('info-table')) {
                el.querySelectorAll('.info-row').forEach(r => {
                    const key = r.querySelector('.info-key');
                    const val = r.querySelector('.info-val');
                    if (key) targets.push({ el: key, type: 't-infokey' });
                    if (val) targets.push({ el: val, type: 't-infoval' });
                });
            }
            // about two-col layout and columns — recurse so children animate normally
            else if (cl.contains('about-two-col') || cl.contains('about-col-bio') || cl.contains('about-col-flags')) {
                walk(el);
            }
            // contact layout and columns — recurse so children animate normally
            else if (cl.contains('contact-layout') || cl.contains('contact-col-info') || cl.contains('contact-col-form')) {
                walk(el);
            }
            // projects header bar — each proj-stat constructs individually
            else if (cl.contains('projects-header-bar')) {
                el.querySelectorAll('.proj-stat').forEach(stat => {
                    targets.push({ el: stat, type: 't-projstat' });
                });
            }
            // bio block → each bio-line
            else if (cl.contains('bio-block')) {
                el.querySelectorAll('.bio-line').forEach(r =>
                    targets.push({ el: r, type: 't-bio' })
                );
            }
            // flags grid → each flag split into status + name
            else if (cl.contains('flags-grid')) {
                el.querySelectorAll('.flag-item').forEach(r => {
                    const st = r.querySelector('.flag-status');
                    const nm = r.querySelector('.flag-name');
                    if (st) targets.push({ el: st, type: 't-flagstatus' });
                    if (nm) targets.push({ el: nm, type: 't-flagname' });
                });
            }
            // skill rows → each entry split into name, bar, pct
            else if (cl.contains('skill-rows')) {
                el.querySelectorAll('.skill-entry').forEach(r => {
                    const nm  = r.querySelector('.skill-name');
                    const bar = r.querySelector('.skill-bar-wrap');
                    const pct = r.querySelector('.skill-pct');
                    if (nm)  targets.push({ el: nm,  type: 't-skillname' });
                    if (bar) targets.push({ el: bar, type: 't-skillbar' });
                    if (pct) targets.push({ el: pct, type: 't-skillpct' });
                });
            }
            // tools grid → each group label then each chip
            else if (cl.contains('tools-grid')) {
                el.querySelectorAll('.tool-group').forEach(group => {
                    const label = group.querySelector('.tool-group-label');
                    if (label) targets.push({ el: label, type: 't-grouplabel' });
                    group.querySelectorAll('.tool-chip').forEach(chip =>
                        targets.push({ el: chip, type: 't-chip' })
                    );
                });
            }
            // projects list → each project-entry
            else if (cl.contains('projects-list')) {
                el.querySelectorAll('.project-entry').forEach(r =>
                    targets.push({ el: r, type: 't-block' })
                );
            }
            // contact form → split into label + input, buttons separate
            else if (cl.contains('bios-form')) {
                el.querySelectorAll('.form-row').forEach(r => {
                    if (r.classList.contains('form-submit-row')) {
                        r.querySelectorAll('.bios-btn').forEach(btn =>
                            targets.push({ el: btn, type: 't-btn' })
                        );
                    } else {
                        const lbl = r.querySelector('.form-label');
                        const inp = r.querySelector('.bios-input');
                        if (lbl) targets.push({ el: lbl, type: 't-formlabel' });
                        if (inp) targets.push({ el: inp, type: 't-forminput' });
                    }
                });
            }
            // link buttons → each button
            else if (cl.contains('link-buttons')) {
                el.querySelectorAll('.bios-btn').forEach(btn =>
                    targets.push({ el: btn, type: 't-btn' })
                );
            }
            // projects status line
            else if (cl.contains('projects-status')) {
                targets.push({ el, type: 't-bio' });
            }
            // projects footer
            else if (cl.contains('projects-footer')) {
                el.querySelectorAll('.bios-btn').forEach(btn =>
                    targets.push({ el: btn, type: 't-btn' })
                );
            }
            // stat grid → each box constructs itself individually as a whole unit
            else if (cl.contains('stat-grid')) {
                el.querySelectorAll('.stat-box').forEach(box => {
                    targets.push({ el: box, type: 't-statbox' });
                });
            }
            // activity log → each entry draws itself in as a whole unit
            else if (cl.contains('activity-log')) {
                el.querySelectorAll('.log-entry').forEach(entry => {
                    targets.push({ el: entry, type: 't-logentry' });
                });
            }
            // process list → each row constructs as a whole unit
            else if (cl.contains('process-list')) {
                el.querySelectorAll('.process-row').forEach(row => {
                    targets.push({ el: row, type: 't-logentry' });
                });
            }
            // channel list → each row constructs as a whole unit
            else if (cl.contains('channel-list')) {
                el.querySelectorAll('.channel-row').forEach(row => {
                    targets.push({ el: row, type: 't-logentry' });
                });
            }
            // fallback generic block
            else {
                targets.push({ el, type: 't-block' });
            }
        }
    }

    walk(section);

    // hide all first
    targets.forEach(t => {
        t.el.classList.add('tab-hud-target');
        t.el.classList.remove('tab-hud-visible', t.type);
    });

    // stagger reveal — 16ms per element for fine granularity
    let delay = 20;
    targets.forEach(t => {
        setTimeout(() => {
            t.el.classList.add('tab-hud-visible', t.type);
        }, delay);
        delay += 16;
    });
}

// prevents skill bars from animating more than once
let skillBarsAnimated = false;

// animates skill bar widths into view
function animateSkillBars() {
    if (skillBarsAnimated) return;
    skillBarsAnimated = true;
    document.querySelectorAll('.skill-bar-fill').forEach(bar => {
        bar.style.width = (bar.dataset.width || '0') + '%';
    });
}

// typing loop for the bio section
function initTypingEffect() {
    const phrases = [
        'Passionate about full-stack development.',
        'Building digital experiences one line at a time.',
        'Always learning. Always building.',
        'Student. Developer. Creator.',
        'Turning ideas into code.'
    ];
    let phraseIdx = 0, charIdx = 0, deleting = false;
    const target = document.getElementById('typed-text');
    if (!target) return;

    function type() {
        const current = phrases[phraseIdx];
        if (!deleting) {
            target.textContent = current.slice(0, ++charIdx);
            if (charIdx === current.length) {
                deleting = true;
                setTimeout(type, 2200);
                return;
            }
            setTimeout(type, 55);
        } else {
            target.textContent = current.slice(0, --charIdx);
            if (charIdx === 0) {
                deleting = false;
                phraseIdx = (phraseIdx + 1) % phrases.length;
                setTimeout(type, 400);
                return;
            }
            setTimeout(type, 30);
        }
    }
    setTimeout(type, 800);
}

// tracks if github projects have been fetched
let projectsLoaded = false;

// only fetches if not yet loaded
function ensureProjectsLoaded() {
    if (!projectsLoaded) fetchGitHubProjects();
}

// fetches repos from the github api
async function fetchGitHubProjects() {
    projectsLoaded = true;
    const statusEl  = document.getElementById('projects-status-text');
    const statusBox = document.getElementById('projects-status');
    const listEl    = document.getElementById('projects-list');
    if (!listEl) return;

    listEl.innerHTML = '';
    if (statusEl) {
        statusEl.textContent    = `Connecting to github.com/${GITHUB_USERNAME}...`;
        statusBox.style.display = 'flex';
    }

    try {
        const res = await fetch(`https://api.github.com/users/${GITHUB_USERNAME}/repos?sort=updated&per_page=12`);
        if (!res.ok) throw new Error(`GitHub API ${res.status}: ${res.statusText}`);

        let repos = await res.json();
        if (!Array.isArray(repos) || repos.length === 0) throw new Error('No repositories found.');

        repos = repos.filter(r => !r.fork && !r.archived).slice(0, 8);
        if (repos.length === 0) throw new Error('No original repositories found.');

        if (statusEl) statusEl.textContent = `Fetching languages for ${repos.length} repos...`;

        const withLangs = await Promise.all(repos.map(async repo => {
            try {
                const lr    = await fetch(repo.languages_url);
                const langs = lr.ok ? Object.keys(await lr.json()) : [];
                return { ...repo, langs: langs.length ? langs : ['N/A'] };
            } catch {
                return { ...repo, langs: ['N/A'] };
            }
        }));

        statusBox.style.display = 'none';
        renderProjects(withLangs);

    } catch (err) {
        if (statusEl) statusEl.textContent = 'Error fetching data.';
        statusBox.style.display = 'none';
        showProjectsError(err, listEl);
    }
}

// converts a repo slug into a readable title
function formatRepoName(name) {
    return name.replace(/[-_]/g, ' ')
        .split(' ')
        .map(w => w.charAt(0).toUpperCase() + w.slice(1))
        .join(' ');
}

// renders project cards to the dom
function renderProjects(repos) {
    const listEl = document.getElementById('projects-list');
    if (!listEl) return;
    listEl.innerHTML = '';

    repos.forEach((repo, i) => {
        const desc = repo.description
            ? (repo.description.length > 100 ? repo.description.slice(0, 100) + '...' : repo.description)
            : 'No description available.';
        const updated  = new Date(repo.updated_at).toLocaleDateString('en-US', {
            year: 'numeric', month: 'short', day: 'numeric'
        });
        const langTags = repo.langs.slice(0, 4).map(l => `<span class="lang-tag">${l}</span>`).join('');
        const liveLink = repo.homepage
            ? `<a href="${repo.homepage}" target="_blank" rel="noopener noreferrer" class="project-link">[DEMO]</a>`
            : '';

        const card = document.createElement('div');
        card.className = 'project-entry';
        card.innerHTML = `
            <div class="project-entry-header">
                <span class="project-num">${String(i + 1).padStart(2, '0')}.</span>
                <span class="project-name">${formatRepoName(repo.name)}</span>
                <div class="project-links">
                    ${liveLink}
                    <a href="${repo.html_url}" target="_blank" rel="noopener noreferrer" class="project-link">[GITHUB]</a>
                </div>
            </div>
            <div class="project-desc">&gt;_ ${desc}</div>
            <div class="project-tags">${langTags}</div>
            <div class="project-meta">
                <span>&#9733; ${repo.stargazers_count}</span>
                <span>&#9394; ${repo.forks_count}</span>
                <span>&#8635; ${updated}</span>
            </div>
        `;

        card.addEventListener('click', e => {
            if (!e.target.closest('a')) window.open(repo.html_url, '_blank', 'noopener,noreferrer');
        });

        listEl.appendChild(card);
    });
}

// shows an error message if the github fetch fails
function showProjectsError(err, listEl) {
    const isRateLimit = err.message && err.message.includes('403');
    listEl.innerHTML = `
        <div class="error-entry">
            <div>[ERR] Failed to load projects from GitHub.</div>
            <div>&gt;_ ${err.message || 'Unknown error'}</div>
            ${isRateLimit ? '<div>[!!] GitHub API rate limit exceeded. Try again later.</div>' : ''}
            <div style="margin-top:8px">
                <a href="https://github.com/${GITHUB_USERNAME}?tab=repositories"
                   target="_blank" rel="noopener noreferrer"
                   class="bios-btn" style="display:inline-block;margin-top:6px">
                    [ VIEW ON GITHUB DIRECTLY ]
                </a>
                <button class="bios-btn" onclick="retryProjects()" style="margin-left:10px">
                    [ RETRY ]
                </button>
            </div>
        </div>
    `;
}

// resets and retries the github fetch
function retryProjects() {
    projectsLoaded = false;
    fetchGitHubProjects();
}

// sends contact form data to the discord webhook as an embed
function initContactForm() {
    const form = document.getElementById('contact-form');
    if (!form) return;

    form.addEventListener('submit', async e => {
        e.preventDefault();
        const name     = document.getElementById('form-name').value.trim();
        const email    = document.getElementById('form-email').value.trim();
        const message  = document.getElementById('form-message').value.trim();
        const statusEl = document.getElementById('form-status');

        if (!name || !email || !message) {
            statusEl.className   = 'form-status error';
            statusEl.textContent = '[ERR] All fields required. Buffer not transmitted.';
            return;
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            statusEl.className   = 'form-status error';
            statusEl.textContent = '[ERR] Invalid email address format.';
            return;
        }

        statusEl.className   = 'form-status';
        statusEl.textContent = '[...] Transmitting to server...';

        try {
            const payload = {
                username: 'Portfolio Contact',
                avatar_url: `https://github.com/${GITHUB_USERNAME}.png`,
                embeds: [{
                    title: 'New Portfolio Message',
                    color: 0x00f5c4,
                    fields: [
                        { name: 'Name',    value: name,    inline: true  },
                        { name: 'Email',   value: email,   inline: true  },
                        { name: 'Message', value: message, inline: false },
                    ],
                    footer: { text: `Sent via BIOS Portfolio  ${new Date().toUTCString()}` }
                }]
            };

            const res = await fetch(DISCORD_WEBHOOK, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (!res.ok) throw new Error(`Webhook returned ${res.status}`);

            statusEl.className   = 'form-status success';
            statusEl.textContent = '[OK] Message transmitted successfully.';
            form.reset();
            setTimeout(() => { statusEl.textContent = ''; }, 5000);

        } catch (err) {
            statusEl.className   = 'form-status error';
            statusEl.textContent = `[ERR] Transmission failed: ${err.message}`;
        }
    });
}

// keyboard navigation for tabs
function initKeyboardNav() {
    document.addEventListener('keydown', e => {
        const numMap = { '1':'main', '2':'about', '3':'skills', '4':'projects', '5':'contact' };

        if (numMap[e.key] && !isInputFocused()) {
            currentTabIdx = TAB_NAMES.indexOf(numMap[e.key]);
            switchTab(numMap[e.key]);
            return;
        }

        if (!isInputFocused()) {
            if (e.key === 'ArrowRight') {
                currentTabIdx = (currentTabIdx + 1) % TAB_NAMES.length;
                switchTab(TAB_NAMES[currentTabIdx]);
                e.preventDefault();
            } else if (e.key === 'ArrowLeft') {
                currentTabIdx = (currentTabIdx - 1 + TAB_NAMES.length) % TAB_NAMES.length;
                switchTab(TAB_NAMES[currentTabIdx]);
                e.preventDefault();
            }
        }
    });
}

// checks if an input or textarea is focused
function isInputFocused() {
    const tag = document.activeElement?.tagName;
    return tag === 'INPUT' || tag === 'TEXTAREA';
}

// f-key shortcuts
function initFKeys() {
    document.addEventListener('keydown', e => {
        if (e.key === 'F10')    { e.preventDefault(); showSavePopup(); }
        if (e.key === 'F5')     { e.preventDefault(); if (TAB_NAMES[currentTabIdx] === 'projects') { projectsLoaded = false; fetchGitHubProjects(); } }
        if (e.key === 'F1')     { e.preventDefault(); switchTab('main'); currentTabIdx = 0; }
        if (e.key === 'Escape') { e.preventDefault(); closePopup(); }
    });
}

// shows the f10 save popup
function showSavePopup() {
    const popup = document.getElementById('save-popup');
    if (!popup) return;
    popup.classList.remove('hidden');

    const yesEl = popup.querySelector('.accent');
    if (yesEl) { yesEl.style.cursor = 'pointer'; yesEl.onclick = () => popup.classList.add('hidden'); }

    const noEl = document.getElementById('popup-no');
    if (noEl) noEl.onclick = () => popup.classList.add('hidden');
}

// hides the popup
function closePopup() {
    document.getElementById('save-popup')?.classList.add('hidden');
}

// start on dom ready
document.addEventListener('DOMContentLoaded', runBootSequence);
