// Translation Service using MyMemory API
// Free API: 5,000 chars/day (50,000 with email)
// https://mymemory.translated.net/doc/spec.php

const MYMEMORY_API = 'https://api.mymemory.translated.net/get';

// Cache for translations to avoid repeated API calls
const translationCache = new Map();

// Get cache key
const getCacheKey = (text, from, to) => `${from}:${to}:${text}`;

// Check if we have a cached translation
const getCachedTranslation = (text, from, to) => {
    const key = getCacheKey(text, from, to);
    return translationCache.get(key);
};

// Save translation to cache
const setCachedTranslation = (text, from, to, translation) => {
    const key = getCacheKey(text, from, to);
    translationCache.set(key, translation);

    // Also save to localStorage for persistence
    try {
        const storageKey = `translation_cache_${from}_${to}`;
        const existing = JSON.parse(localStorage.getItem(storageKey) || '{}');
        existing[text] = translation;
        localStorage.setItem(storageKey, JSON.stringify(existing));
    } catch (e) {
        // localStorage might be full or unavailable
        console.warn('Could not save translation to localStorage:', e);
    }
};

// Load cached translations from localStorage
export const loadTranslationCache = (from, to) => {
    try {
        const storageKey = `translation_cache_${from}_${to}`;
        const cached = JSON.parse(localStorage.getItem(storageKey) || '{}');
        Object.entries(cached).forEach(([text, translation]) => {
            const key = getCacheKey(text, from, to);
            translationCache.set(key, translation);
        });
    } catch (e) {
        console.warn('Could not load translation cache:', e);
    }
};

/**
 * Translate text using MyMemory API
 * @param {string} text - Text to translate
 * @param {string} from - Source language (tr, en, ru, ar)
 * @param {string} to - Target language (tr, en, ru, ar)
 * @returns {Promise<string>} - Translated text
 */
export const translateText = async (text, from = 'tr', to = 'en') => {
    // Return original if same language or empty
    if (!text || from === to) return text;

    // Check cache first
    const cached = getCachedTranslation(text, from, to);
    if (cached) return cached;

    // Language code mapping for MyMemory
    const langCodes = {
        'tr': 'tr',
        'en': 'en',
        'ru': 'ru',
        'ar': 'ar'
    };

    const fromCode = langCodes[from] || 'tr';
    const toCode = langCodes[to] || 'en';

    try {
        const url = `${MYMEMORY_API}?q=${encodeURIComponent(text)}&langpair=${fromCode}|${toCode}`;
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        if (data.responseStatus === 200 && data.responseData?.translatedText) {
            const translation = data.responseData.translatedText;
            setCachedTranslation(text, from, to, translation);
            return translation;
        } else if (data.responseStatus === 429) {
            // Rate limit exceeded
            console.warn('Translation API rate limit exceeded');
            return text;
        } else {
            console.warn('Translation failed:', data);
            return text;
        }
    } catch (error) {
        console.error('Translation error:', error);
        return text; // Return original on error
    }
};

/**
 * Translate multiple texts in batch (with delay to avoid rate limiting)
 * @param {string[]} texts - Array of texts to translate
 * @param {string} from - Source language
 * @param {string} to - Target language
 * @returns {Promise<string[]>} - Array of translated texts
 */
export const translateBatch = async (texts, from = 'tr', to = 'en') => {
    if (from === to) return texts;

    const results = [];

    for (let i = 0; i < texts.length; i++) {
        const text = texts[i];
        const translation = await translateText(text, from, to);
        results.push(translation);

        // Small delay between requests to avoid rate limiting
        if (i < texts.length - 1) {
            await new Promise(resolve => setTimeout(resolve, 100));
        }
    }

    return results;
};

/**
 * Translate a perfume object's text fields
 * @param {Object} perfume - Perfume data object
 * @param {string} from - Source language
 * @param {string} to - Target language
 * @returns {Promise<Object>} - Perfume with translated fields
 */
export const translatePerfume = async (perfume, from = 'tr', to = 'en') => {
    if (from === to || !perfume) return perfume;

    const translated = { ...perfume };

    // Translate fields that need translation
    if (perfume.hikaye) {
        translated.hikaye = await translateText(perfume.hikaye, from, to);
    }

    if (perfume.vibe) {
        translated.vibe = await translateText(perfume.vibe, from, to);
    }

    // Notes are more complex - keep original structure but translate
    if (perfume.notalar && typeof perfume.notalar === 'string') {
        translated.notalar = await translateText(perfume.notalar, from, to);
    }

    return translated;
};

/**
 * Check if translation service is available
 * @returns {Promise<boolean>}
 */
export const isTranslationAvailable = async () => {
    try {
        const result = await translateText('test', 'en', 'tr');
        return result !== 'test';
    } catch {
        return false;
    }
};

export default {
    translateText,
    translateBatch,
    translatePerfume,
    loadTranslationCache,
    isTranslationAvailable
};
