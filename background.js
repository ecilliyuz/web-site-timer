let startTime;
let currentTab;
let isTracking = false;
let updateInterval;

// Periyodik olarak süreleri güncelle (30 saniyede bir)
function startPeriodicUpdates() {
    // Eğer zaten çalışan bir interval varsa durduralım
    if (updateInterval) {
        clearInterval(updateInterval);
    }

    // Her 30 saniyede bir süreyi kaydet
    updateInterval = setInterval(() => {
        if (currentTab && currentTab.url && isTracking) {
            updateTime(currentTab.url, false); // Süreyi güncelle ama startTime'ı sıfırlama
        }
    }, 30000); // 30 saniye
}

// Tarayıcı başlatıldığında aktif sekmeyi kontrol et
chrome.runtime.onStartup.addListener(async () => {
    const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
    if (tabs.length > 0) {
        handleTabChange(tabs[0]);
    }
    startPeriodicUpdates();
});

// Tarayıcı eklentisi yüklendiğinde aktif sekmeyi kontrol et
chrome.runtime.onInstalled.addListener(async () => {
    const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
    if (tabs.length > 0) {
        handleTabChange(tabs[0]);
    }
    startPeriodicUpdates();
});

// Sekme değiştirildiğinde olayı yakala
chrome.tabs.onActivated.addListener(async (activeInfo) => {
    const tab = await chrome.tabs.get(activeInfo.tabId);
    handleTabChange(tab);
});

// Sekme güncellendiğinde olayı yakala
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    // Aktif sekme güncellendiyse ve URL değiştiyse
    if (tab.active && changeInfo.url) {
        handleTabChange(tab);
    }
});

// Tarayıcı penceresi değiştiğinde olayı yakala
chrome.windows.onFocusChanged.addListener(async (windowId) => {
    if (windowId !== chrome.windows.WINDOW_ID_NONE) {
        const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
        if (tabs.length > 0) {
            handleTabChange(tabs[0]);
        }
    } else {
        // Pencere odağı kaybolduğunda süreyi güncelle
        if (currentTab && currentTab.url) {
            updateTime(currentTab.url, true);
            isTracking = false;
        }
    }
});

function handleTabChange(tab) {
    // Geçerli sekmenin süresini güncelle
    if (currentTab && currentTab.url && isTracking) {
        updateTime(currentTab.url, true);
    }

    // Geçersiz URL'leri kontrol et
    if (!tab || !tab.url || tab.url.startsWith('chrome://') || tab.url.startsWith('chrome-extension://')) {
        isTracking = false;
        currentTab = null;
        return;
    }

    currentTab = tab;
    startTime = Date.now();
    isTracking = true;
}

async function updateTime(url, resetStartTime = true) {
    try {
        // URL geçerli mi kontrol et
        if (!url || url.startsWith('chrome://') || url.startsWith('chrome-extension://')) return;

        // Ana domaini al (www. ile başlıyorsa onu kaldır)
        const urlObj = new URL(url);
        let domain = urlObj.hostname;

        // www. ile başlıyorsa kaldır
        if (domain.startsWith('www.')) {
            domain = domain.substring(4);
        }

        const currentTime = Date.now();
        const timeSpent = Math.floor((currentTime - startTime) / 1000); // saniye cinsinden

        // Çok kısa süreler için güncelleme yapma (tab geçişi çok hızlıysa)
        if (timeSpent < 1) return;

        const data = await chrome.storage.local.get(domain);
        const storedTime = data[domain] || 0;

        await chrome.storage.local.set({
            [domain]: storedTime + timeSpent
        });

        // Eğer resetStartTime true ise, startTime'ı şu anki zamana ayarla
        if (resetStartTime) {
            startTime = Date.now();
        } else {
            // Periyodik güncellemede süre güncellendikten sonra startTime'ı güncellenen zamana ayarla
            startTime = currentTime;
        }
    } catch (error) {
        console.error("Süre güncellenirken hata oluştu:", error);
    }
} 