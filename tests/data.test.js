import { describe, it, expect, beforeEach, vi } from 'vitest';
import { state, loadData, saveLists, addToSearchHistory } from '../src/data';

describe('Data Module', () => {
    beforeEach(() => {
        // Reset state and localStorage mocks
        vi.stubGlobal('localStorage', {
            getItem: vi.fn().mockReturnValue(null),
            setItem: vi.fn(),
        });
        state.userLists = { "Favorilerim": [] };
        state.searchHistory = [];
        state.userStats = { totalSearches: 0 };
    });

    it('should load data from localStorage', () => {
        const mockLists = JSON.stringify({ "Favorilerim": ["Perfume1"] });
        localStorage.getItem.mockReturnValueOnce(mockLists); // for userPerfumeLists

        loadData();

        expect(state.userLists["Favorilerim"]).toContain("Perfume1");
        expect(localStorage.getItem).toHaveBeenCalledWith('userPerfumeLists');
    });

    it('should save lists to localStorage', () => {
        state.userLists["Favorilerim"].push("NewPerfume");
        saveLists();
        expect(localStorage.setItem).toHaveBeenCalledWith('userPerfumeLists', JSON.stringify(state.userLists));
    });

    it('should add to search history and limit to 10 items', () => {
        for (let i = 0; i < 15; i++) {
            addToSearchHistory(`term${i}`);
        }
        expect(state.searchHistory.length).toBe(10);
        expect(state.searchHistory[0]).toBe('term14');
        expect(state.userStats.totalSearches).toBe(15);
    });
});
