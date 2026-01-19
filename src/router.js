import { renderPerfumes, renderMyListsPage } from './ui.js';

export let currentPage = 'home-page';
export let lastPage = 'home-page';
let isInitialLoad = true;
const scrollPositions = {};

export const showPage = (pageId, fromHistory = false) => {
    const pageContainer = document.getElementById('page-content');
    const pages = {
        'home-page': document.getElementById('home-page'),
        'my-lists-page': document.getElementById('my-lists-page'),
        'detail-page': document.getElementById('detail-page'),
        'quiz-page': document.getElementById('quiz-page'),
        'quiz-results-page': document.getElementById('quiz-results-page'),
        'privacy-policy-page': document.getElementById('privacy-policy-page')
    };
    const navButtons = {
        'home-page': document.getElementById('nav-home'),
        'my-lists-page': document.getElementById('nav-lists')
    };

    const activePageElement = pageContainer.querySelector('.page.active');
    if (activePageElement && (activePageElement.id === 'home-page' || activePageElement.id === 'my-lists-page')) {
        scrollPositions[activePageElement.id] = pageContainer.scrollTop;
    }

    if (currentPage === 'home-page' || currentPage === 'my-lists-page') {
        lastPage = currentPage;
    }

    currentPage = pageId;

    Object.values(pages).forEach(page => page?.classList.remove('active'));
    const newPage = pages[pageId];
    if (newPage) newPage.classList.add('active');

    Object.values(navButtons).forEach(button => button?.classList.remove('active'));
    if (navButtons[pageId]) {
        navButtons[pageId].classList.add('active');
    }

    if (!fromHistory) {
        const url = new URL(window.location.href);
        url.searchParams.set('page', pageId);
        if (isInitialLoad) {
            history.replaceState({ page: pageId }, '', url.toString());
        } else {
            history.pushState({ page: pageId }, '', url.toString());
        }
    }
    isInitialLoad = false;

    if (pageId === 'home-page') renderPerfumes();
    if (pageId === 'my-lists-page') renderMyListsPage();

    if (newPage && (pageId === 'home-page' || pageId === 'my-lists-page')) {
        pageContainer.scrollTop = scrollPositions[pageId] || 0;
    } else {
        pageContainer.scrollTop = 0;
    }
};

export const handleShortcuts = (renderDetailPage) => {
    const params = new URLSearchParams(window.location.search);
    const action = params.get('action');

    if (action === 'surprise') {
        // This requires access to data, which we can import or pass
        // For now, let's assume the caller handles the logic or we import state
        // But renderDetailPage is passed as arg to avoid circular dep if needed
        // Actually, let's move this logic to main.js or ui.js where we have access to everything
    }
};
