document.fonts.ready.then(function () {
    setTimeout(function () {
        const loader = document.getElementById('loader');
        loader.classList.add('hidden');

        setTimeout(function () {
            loader.remove();
        }, 500);
    }, 300);
});

setTimeout(function () {
    const loader = document.getElementById('loader');
    if (loader && !loader.classList.contains('hidden')) {
        loader.classList.add('hidden');
        setTimeout(function () {
            loader.remove();
        }, 500);
    }
}, 3000);

let downloadCount = 0;

async function loadDownloadCount() {
    try {
        const response = await fetch('data/downloads.json');
        const data = await response.json();
        downloadCount = data.count || 0;
        updateDownloadDisplay();
    } catch (error) {
        console.error('Error loading download count:', error);
        downloadCount = 1000;
        updateDownloadDisplay();
    }
}

function updateDownloadDisplay() {
    const downloadCountElement = document.getElementById('download-count');
    if (downloadCountElement) {
        downloadCountElement.textContent = formatNumber(downloadCount);
    }
}

function formatNumber(num) {
    if (num >= 1000) {
        return Math.floor(num / 1000) + 'k+';
    }
    return num.toString();
}

async function saveDownloadCount() {
    try {
        const response = await fetch('api/update-downloads.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ count: downloadCount })
        });

        if (!response.ok) {
            console.error('Failed to save download count');
        }
    } catch (error) {
        console.error('Error saving download count:', error);
    }
}


function handleDownloadClick(event) {
    downloadCount++;
    updateDownloadDisplay();

    saveDownloadCount();

}

document.addEventListener('DOMContentLoaded', function () {
    loadDownloadCount();

    const downloadBtn = document.querySelector('.download-btn');
    if (downloadBtn) {
        downloadBtn.addEventListener('click', handleDownloadClick);
    }
});

/* Theme handling: toggle and persist */
function applyTheme(theme) {
    if (theme === 'dark') {
        document.documentElement.classList.add('dark');
        const btn = document.getElementById('theme-toggle');
        if (btn) btn.setAttribute('aria-pressed', 'true');
    } else {
        document.documentElement.classList.remove('dark');
        const btn = document.getElementById('theme-toggle');
        if (btn) btn.setAttribute('aria-pressed', 'false');
    }
    try { localStorage.setItem('theme', theme); } catch (e) { }
}

function toggleTheme() {
    const isDark = document.documentElement.classList.contains('dark');
    applyTheme(isDark ? 'light' : 'dark');
}

function initTheme() {
    let theme = 'light';
    try { theme = localStorage.getItem('theme') || null; } catch (e) { theme = null; }
    if (!theme) {
        const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
        theme = prefersDark ? 'dark' : 'light';
    }
    applyTheme(theme);

    const toggle = document.getElementById('theme-toggle');
    if (toggle) {
        toggle.addEventListener('click', function () {
            toggleTheme();
        });
    }
}

/* Updates loader: fetch JSON and render list */
async function loadUpdates() {
    const listEl = document.getElementById('updates-list');
    if (!listEl) return;
    const paths = ['data/updates.json', './data/updates.json', '/data/updates.json', 'updates.json'];
    let lastErr = null;
    for (let i = 0; i < paths.length; i++) {
        const p = paths[i];
        try {
            const resp = await fetch(p, {cache: 'no-store'});
            if (!resp.ok) throw new Error('HTTP ' + resp.status + ' for ' + p);
            const data = await resp.json();
            renderUpdates(data);
            return;
        } catch (err) {
            lastErr = err;
            // try next path
        }
    }
    // If fetch failed, try to read inline fallback JSON embedded in the page
    try {
        const inline = document.getElementById('updates-data');
        if (inline && inline.textContent) {
            const parsed = JSON.parse(inline.textContent);
            renderUpdates(parsed);
            return;
        }
    } catch (e) {
        console.warn('Failed to parse inline updates JSON:', e);
        lastErr = lastErr || e;
    }

    listEl.innerHTML = '<li class="updates-empty">Не удалось загрузить обновления.</li>';
    console.error('Failed to load updates from any path and no inline fallback:', lastErr);
}

function renderUpdates(data) {
    const listEl = document.getElementById('updates-list');
    if (!listEl) return;
    if (!data || !Array.isArray(data.updates) || data.updates.length === 0) {
        listEl.innerHTML = '<li class="updates-empty">Список обновлений пуст.</li>';
        return;
    }
    listEl.innerHTML = '';
    data.updates.forEach(function (u) {
        const li = document.createElement('li');
        const when = u.date ? ('<strong>' + escapeHtml(u.date) + '</strong> — ') : '';
        const ver = u.version ? ('<em>' + escapeHtml(u.version) + '</em>') : '';
        const notes = Array.isArray(u.notes) ? u.notes.map(n => escapeHtml(n)).join('<br>') : (u.notes ? escapeHtml(u.notes) : '');
        li.innerHTML = when + ver + (notes ? ('<div class="update-notes">' + notes + '</div>') : '');
        listEl.appendChild(li);
    });
}

function escapeHtml(s) {
    if (!s) return '';
    return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

/* Initialize theme and updates after DOM ready */
document.addEventListener('DOMContentLoaded', function () {
    initTheme();
    loadUpdates();
});
