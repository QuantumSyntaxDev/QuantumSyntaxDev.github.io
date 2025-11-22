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
