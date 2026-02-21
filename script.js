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
    { text: '[!!] Coffee level: CRITICALLY LOW', type: 'warn', delay: 970 },
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
        initBIOS();
    }, 650);
}

// runs once after the boot screen finishes
function initBIOS() {
    startClock();
    initTabs();
    initMenuItems();
    initTypingEffect();
    fetchGitHubProjects();
    initContactForm();
    initKeyboardNav();
    initFKeys();
    updateCurrentDate();
    initUptimeCounter();
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

    if (name === 'skills')   setTimeout(animateSkillBars, 50);
    if (name === 'projects') ensureProjectsLoaded();
}

// adds click listeners to main menu items
function initMenuItems() {
    document.querySelectorAll('.menu-item.selectable').forEach(item => {
        item.addEventListener('click', () => switchTab(item.dataset.target));
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
