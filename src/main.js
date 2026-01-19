import { loadData, fetchParfums, state } from './data.js';
import { showPage, handleShortcuts } from './router.js';
import { setupUI, renderDetailPage } from './ui.js';
import { startQuiz } from './quiz.js';

// PWA Install Prompt
let deferredPrompt = null;

const setupPWAInstall = () => {
    window.addEventListener('beforeinstallprompt', (e) => {
        e.preventDefault();
        deferredPrompt = e;
        showInstallBanner();
    });

    window.addEventListener('appinstalled', () => {
        deferredPrompt = null;
        // Toast is in ui.js, but we can't import it easily if it's not exported.
        // For now, let's skip the toast or export showToast from ui.js
    });
};

const showInstallBanner = () => {
    if (localStorage.getItem('pwaInstallDismissed') === 'true') return;

    const banner = document.createElement('div');
    banner.id = 'install-banner';
    banner.style.cssText = 'position:fixed;bottom:80px;left:50%;transform:translateX(-50%);background:var(--accent-color);color:var(--accent-text-color);padding:15px 20px;border-radius:12px;box-shadow:0 4px 20px rgba(0,0,0,0.3);z-index:1000;max-width:90%;text-align:center;animation:slideUp 0.3s ease;';
    banner.innerHTML = `
        <p style="margin:0 0 10px 0;font-weight:bold;">📱 Ana Ekrana Ekle</p>
        <p style="margin:0 0 15px 0;font-size:0.9em;">Uygulamayı telefonunuza kurun, daha hızlı erişin!</p>
        <button id="install-btn" style="background:#fff;color:var(--accent-color);border:none;padding:10px 20px;border-radius:8px;font-weight:bold;margin-right:10px;cursor:pointer;">Kur</button>
        <button id="dismiss-btn" style="background:transparent;color:#fff;border:1px solid #fff;padding:10px 20px;border-radius:8px;cursor:pointer;">Daha Sonra</button>
    `;
    document.body.appendChild(banner);

    document.getElementById('install-btn').onclick = async () => {
        if (deferredPrompt) {
            deferredPrompt.prompt();
            const { outcome } = await deferredPrompt.userChoice;
            deferredPrompt = null;
            banner.remove();
        }
    };

    document.getElementById('dismiss-btn').onclick = () => {
        localStorage.setItem('pwaInstallDismissed', 'true');
        banner.remove();
    };
};

const checkForSharedLink = () => {
    const params = new URLSearchParams(window.location.search);
    let encoded = params.get('perfume');
    if (!encoded && window.location.hash && window.location.hash.includes('#perfume=')) {
        encoded = window.location.hash.substring(1).split('=')[1];
    }
    if (encoded) {
        const perfumeName = decodeURIComponent(encoded.replace(/_/g, ' '));
        if (state.parfum_veritabani[perfumeName]) {
            renderDetailPage(perfumeName);
            return true;
        }
    }
    return false;
};

const init = async () => {
    loadData();

    window.addEventListener('popstate', (event) => {
        const params = new URLSearchParams(window.location.search);
        const pageId = params.get('page') || 'home-page';
        showPage(pageId, true);
    });

    try {
        await fetchParfums();
        setupUI();

        if ('serviceWorker' in navigator) {
            window.addEventListener('load', () => {
                navigator.serviceWorker.register('/servis-calisani.js')
                    .then(reg => console.log('Servis Çalışanı kaydedildi.'))
                    .catch(err => console.log('Servis Çalışanı hatası:', err));
            });
        }

        setupPWAInstall();
        // handleShortcuts(); // Needs to be implemented or moved

        if (checkForSharedLink()) {
            // Handled in checkForSharedLink
        } else {
            const params = new URLSearchParams(window.location.search);
            const initialPage = params.get('page');

            // Check for store mode (QR code access) - auto-start quiz
            if (params.has('store')) {
                // Small delay to ensure UI is ready
                setTimeout(() => {
                    startQuiz();
                }, 100);
            } else if (initialPage) {
                showPage(initialPage);
            } else {
                showPage('home-page');
            }
        }

    } catch (error) {
        console.error('Başlatma hatası:', error);
        document.getElementById('results-list').innerHTML = '<p style="text-align:center; padding: 20px; color: red;">Veritabanı yüklenemedi.</p>';
    }
};

document.addEventListener('DOMContentLoaded', init);
