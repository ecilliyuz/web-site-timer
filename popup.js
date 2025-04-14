document.addEventListener('DOMContentLoaded', async () => {
    await updateSiteList();

    document.getElementById('clearData').addEventListener('click', async () => {
        await chrome.storage.local.clear();
        await updateSiteList();
    });
});

async function updateSiteList() {
    const siteList = document.getElementById('siteList');
    siteList.innerHTML = '';

    const data = await chrome.storage.local.get(null);
    const sites = Object.entries(data)
        .map(([domain, seconds]) => ({ domain, seconds }))
        .sort((a, b) => b.seconds - a.seconds);

    // En fazla 10 siteyi göster
    const sitesToShow = sites.slice(0, 10);

    for (const site of sitesToShow) {
        const siteElement = document.createElement('div');
        siteElement.className = 'site-item';

        // Zaman formatını düzenle
        const timeString = formatTime(site.seconds);

        const siteInfo = document.createElement('div');
        siteInfo.className = 'site-info';

        const siteDomain = document.createElement('span');
        siteDomain.className = 'site-domain';
        siteDomain.textContent = site.domain;

        const siteTime = document.createElement('span');
        siteTime.className = 'site-time';
        siteTime.textContent = timeString;

        siteInfo.appendChild(siteDomain);
        siteInfo.appendChild(siteTime);

        const deleteBtn = document.createElement('span');
        deleteBtn.className = 'delete-btn';
        deleteBtn.textContent = '✕';
        deleteBtn.title = 'Bu sitenin istatistiğini sil';
        deleteBtn.addEventListener('click', async () => {
            await deleteSiteData(site.domain);
            await updateSiteList();
        });

        siteElement.appendChild(siteInfo);
        siteElement.appendChild(deleteBtn);

        siteList.appendChild(siteElement);
    }

    if (sites.length === 0) {
        siteList.innerHTML = '<div class="site-item">Henüz site ziyareti kaydedilmedi.</div>';
    } else if (sites.length > 10) {
        const moreInfo = document.createElement('div');
        moreInfo.className = 'site-item';
        moreInfo.style.fontStyle = 'italic';
        moreInfo.textContent = `... ve ${sites.length - 10} site daha`;
        siteList.appendChild(moreInfo);
    }
}

// Saniye cinsinden süreyi formatla (1:10 veya 2:30:45 şeklinde)
function formatTime(totalSeconds) {
    if (totalSeconds < 60) {
        return `${totalSeconds} saniye`;
    }

    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    let timeString = '';

    if (hours > 0) {
        timeString += `${hours}:`;
        // Dakika iki basamaklı olacak
        timeString += `${minutes < 10 ? '0' : ''}${minutes}:`;
    } else {
        timeString += `${minutes}:`;
    }

    // Saniye her zaman iki basamaklı olacak
    timeString += `${seconds < 10 ? '0' : ''}${seconds}`;

    return timeString;
}

async function deleteSiteData(domain) {
    await chrome.storage.local.remove(domain);
} 