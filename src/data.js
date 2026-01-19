export const state = {
    parfum_veritabani: {},
    userLists: { "Favorilerim": [] },
    personalNotes: {},
    searchHistory: [],
    recentlyViewed: [], // Recently viewed perfumes (max 10)
    userStats: { totalSearches: 0, favoritesAdded: 0, listsCreated: 0, quizzesTaken: 0 }
};

export const loadData = () => {
    state.userLists = JSON.parse(localStorage.getItem('userPerfumeLists')) || { "Favorilerim": [] };
    state.personalNotes = JSON.parse(localStorage.getItem('perfumePersonalNotes')) || {};
    state.searchHistory = JSON.parse(localStorage.getItem('searchHistory')) || [];
    state.recentlyViewed = JSON.parse(localStorage.getItem('recentlyViewed')) || [];
    state.userStats = JSON.parse(localStorage.getItem('userStats')) || { totalSearches: 0, favoritesAdded: 0, listsCreated: 0, quizzesTaken: 0 };
};

export const saveLists = () => localStorage.setItem('userPerfumeLists', JSON.stringify(state.userLists));
export const saveNotes = () => localStorage.setItem('perfumePersonalNotes', JSON.stringify(state.personalNotes));
export const saveSearchHistory = () => localStorage.setItem('searchHistory', JSON.stringify(state.searchHistory.slice(-10)));
export const saveStats = () => localStorage.setItem('userStats', JSON.stringify(state.userStats));
export const saveRecentlyViewed = () => localStorage.setItem('recentlyViewed', JSON.stringify(state.recentlyViewed.slice(0, 10)));

// Add perfume to recently viewed (max 10, most recent first)
export const addToRecentlyViewed = (perfumeName) => {
    if (!perfumeName) return;

    // Remove if already exists (to move to front)
    state.recentlyViewed = state.recentlyViewed.filter(name => name !== perfumeName);

    // Add to front
    state.recentlyViewed.unshift(perfumeName);

    // Keep only 10
    state.recentlyViewed = state.recentlyViewed.slice(0, 10);

    saveRecentlyViewed();
};

// Clear recently viewed history
export const clearRecentlyViewed = () => {
    state.recentlyViewed = [];
    localStorage.removeItem('recentlyViewed');
};

export const addToSearchHistory = (term) => {
    if (term && term.trim().length > 2) {
        state.searchHistory = [term, ...state.searchHistory.filter(t => t !== term)].slice(0, 10);
        saveSearchHistory();
        state.userStats.totalSearches++;
        saveStats();
    }
};

export const fetchParfums = async () => {
    try {
        const response = await fetch('parfumler.json');
        if (!response.ok) throw new Error('Ağ yanıtı sorunlu');
        state.parfum_veritabani = await response.json();
        return state.parfum_veritabani;
    } catch (error) {
        console.error('Veritabanı yüklenemedi:', error);
        throw error;
    }
};
