let downloadCount = 1000;

async function loadDownloadCount() {
    try {
        const response = await fetch('data/downloads.json');
        const data = await response.json();
        downloadCount = data.count || 1000;
        updateDownloadDisplay();
    } catch (error) {
        console.error('Error loading download count:', error);
        downloadCount = 1000;
        updateDownloadDisplay();
    }
}

async function incrementDownloadCount() {
    downloadCount++;
    updateDownloadDisplay();

    try {
        const response = await fetch('data/downloads.json', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ count: downloadCount })
        });

        if (!response.ok) {
            saveToLocalStorage();
        }
    } catch (error) {
        console.error('Error saving download count:', error);
        saveToLocalStorage();
    }
}

function saveToLocalStorage() {
    localStorage.setItem('downloadCount', downloadCount);
}

function updateDownloadDisplay() {
    const statNumber = document.querySelector('.stat-number');
    if (statNumber) {
        statNumber.textContent = downloadCount + '+';
    }
}

function handleDownloadClick(event) {
    event.preventDefault();
    incrementDownloadCount();
    alert('Скоро будет доступно для скачивания!');
    return false;
}

document.addEventListener('DOMContentLoaded', function () {
    loadDownloadCount();

    const downloadBtn = document.querySelector('.download-btn');
    if (downloadBtn) {
        downloadBtn.addEventListener('click', handleDownloadClick);
    }
});
