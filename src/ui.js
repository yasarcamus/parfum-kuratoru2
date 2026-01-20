import { state, saveLists, saveNotes, saveStats, addToSearchHistory, addToRecentlyViewed, clearRecentlyViewed } from './data.js';
import { showPage, lastPage } from './router.js';
import { getColorForText, debounce } from './utils.js';
import { startQuiz, setupInteractiveQuiz } from './quiz.js';
import { t, getCurrentLanguage, setLanguage, getAvailableLanguages, initI18n, translatePage } from './i18n.js';
import { SimpleVirtualList } from './virtualScroll.js';
import { translateText, translatePerfume, loadTranslationCache } from './translate.js';

const toast = document.getElementById('toast-notification');

// Virtual list instance
let perfumeVirtualList = null;

const perfumeFacts = {
    tr: [
        "Bazı parfümler, kalıcılıklarını artırmak için 'ambergris' adı verilen ve ispermeçet balinasının sindirim sistemi salgılarından oluşan bir madde içerir.",
        "Bir parfümün kokusu, sıkıldığı kişinin cilt kimyasına göre farklılık gösterebilir. Bu yüzden bir koku başkasında harika dururken sizde farklı kokabilir.",
        "'Silaj' kelimesi, Fransızca'da bir teknenin suda ilerlerken arkasında bıraktığı iz anlamına gelir ve parfümün yayılım gücünü ifade eder.",
        "Dünyanın en pahalı parfüm içeriklerinden biri, Iris çiçeğinin kökünden elde edilen 'Orris Tereyağı'dır. Üretimi yıllar sürer.",
        "Tarihteki ilk modern alkol bazlı parfüm, 14. yüzyılda Macaristan Kraliçesi Elizabeth için yapılan 'Macar Suyu' olarak bilinir."
    ],
    en: [
        "Some perfumes contain 'ambergris', a substance from sperm whale digestive secretions, to enhance longevity.",
        "A perfume's scent can vary based on the wearer's skin chemistry. That's why a fragrance might smell different on you than on someone else.",
        "The word 'sillage' comes from French and refers to the trail a boat leaves in water - it describes a perfume's projection.",
        "One of the world's most expensive perfume ingredients is 'Orris Butter', derived from iris flower roots. It takes years to produce.",
        "The first modern alcohol-based perfume was 'Hungary Water', made for Queen Elizabeth of Hungary in the 14th century."
    ],
    ru: [
        "Некоторые духи содержат 'амбру' — вещество из пищеварительных выделений кашалота для усиления стойкости.",
        "Аромат духов может различаться в зависимости от химии кожи. Поэтому один аромат может пахнуть по-разному на разных людях.",
        "Слово 'силлаж' происходит от французского и означает след, который лодка оставляет на воде — оно описывает шлейф аромата.",
        "Один из самых дорогих парфюмерных ингредиентов — 'ирисовое масло', получаемое из корней ириса. Его производство занимает годы.",
        "Первые современные духи на спиртовой основе — 'Венгерская вода', созданная для королевы Венгрии Елизаветы в XIV веке."
    ],
    ar: [
        "تحتوي بعض العطور على 'العنبر'، وهي مادة من إفرازات الجهاز الهضمي لحوت العنبر، لتعزيز الثبات.",
        "يمكن أن تختلف رائحة العطر حسب كيمياء بشرة المستخدم. لذلك قد تشم رائحة العطر بشكل مختلف على شخص آخر.",
        "كلمة 'سيلاج' تأتي من الفرنسية وتشير إلى الأثر الذي تتركه القارب في الماء - وهي تصف قوة انتشار العطر.",
        "من أغلى مكونات العطور في العالم 'زبدة السوسن'، المستخرجة من جذور زهرة السوسن. يستغرق إنتاجها سنوات.",
        "أول عطر حديث قائم على الكحول هو 'ماء هنغاريا'، صُنع للملكة إليزابيث ملكة هنغاريا في القرن الرابع عشر."
    ]
};

// Get placeholder image URL for a perfume - Realistic bottle shape
const getPerfumeImageUrl = (perfumeName) => {
    // Extract brand name for consistent coloring
    const brand = perfumeName.split(' ')[0];
    const hash = brand.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const hue = hash % 360;
    const saturation = 35 + (hash % 25);
    const lightness = 25 + (hash % 20);

    // Create realistic perfume bottle SVG
    return `data:image/svg+xml,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" width="80" height="110" viewBox="0 0 80 110">
  <defs>
    <!-- Bottle gradient -->
    <linearGradient id="bottle${hash}" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:hsl(${hue}, ${saturation}%, ${lightness + 15}%)"/>
      <stop offset="50%" style="stop-color:hsl(${hue}, ${saturation}%, ${lightness}%)"/>
      <stop offset="100%" style="stop-color:hsl(${hue + 20}, ${saturation + 10}%, ${lightness - 5}%)"/>
    </linearGradient>
    <!-- Cap gradient -->
    <linearGradient id="cap${hash}" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#c4a35a"/>
      <stop offset="50%" style="stop-color:#d4af37"/>
      <stop offset="100%" style="stop-color:#8b7355"/>
    </linearGradient>
    <!-- Glass reflection -->
    <linearGradient id="shine${hash}" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" style="stop-color:rgba(255,255,255,0.4)"/>
      <stop offset="50%" style="stop-color:rgba(255,255,255,0.1)"/>
      <stop offset="100%" style="stop-color:rgba(255,255,255,0)"/>
    </linearGradient>
  </defs>
  
  <!-- Shadow -->
  <ellipse cx="40" cy="106" rx="25" ry="4" fill="rgba(0,0,0,0.2)"/>
  
  <!-- Cap/Sprayer -->
  <rect x="30" y="5" width="20" height="8" rx="2" fill="url(#cap${hash})"/>
  <rect x="35" y="0" width="10" height="8" rx="2" fill="url(#cap${hash})"/>
  
  <!-- Neck -->
  <rect x="32" y="13" width="16" height="12" fill="url(#bottle${hash})"/>
  
  <!-- Main bottle body -->
  <path d="M15 30 Q15 25 32 25 L48 25 Q65 25 65 30 L65 95 Q65 105 40 105 Q15 105 15 95 Z" 
        fill="url(#bottle${hash})" stroke="rgba(255,255,255,0.2)" stroke-width="0.5"/>
  
  <!-- Glass reflection left -->
  <path d="M18 32 Q18 28 30 28 L30 98 Q18 98 18 92 Z" fill="url(#shine${hash})" opacity="0.6"/>
  
  <!-- Label area -->
  <rect x="22" y="45" width="36" height="35" rx="3" fill="rgba(255,255,255,0.15)"/>
  
  <!-- Brand initial -->
  <text x="40" y="70" font-family="Georgia, serif" font-size="22" font-weight="bold" 
        fill="rgba(255,255,255,0.9)" text-anchor="middle">${brand.charAt(0)}</text>
  
  <!-- Liquid level line -->
  <line x1="20" y1="85" x2="60" y2="85" stroke="rgba(255,255,255,0.2)" stroke-width="0.5"/>
</svg>
    `)}`
};


export const showToast = (message) => {
    toast.textContent = message;
    toast.classList.add('show');
    setTimeout(() => {
        toast.classList.remove('show');
    }, 2000);
};

export const createPerfumeCard = (perfumeName, container, options = {}) => {
    const data = state.parfum_veritabani[perfumeName];
    if (!data) return null;

    const { compact = false } = options;

    const card = document.createElement('div');
    card.className = `perfume-card${compact ? ' compact' : ''}`;
    card.onclick = () => renderDetailPage(perfumeName);

    card.innerHTML = `
        <div class="color-swatch" style="background-color: ${getColorForText(perfumeName)};"></div>
        <div class="perfume-info">
            <h3>${perfumeName}</h3>
            <p class="stars">${data.yildiz || ''}</p>
        </div>
    `;

    if (container) {
        container.appendChild(card);
    }

    return card;
}

export const renderPerfumes = () => {
    const list = document.getElementById('results-list');
    if (!list) return;

    const perfumesToDisplay = filterPerfumes();

    const searchInput = document.getElementById('search-input');
    if (searchInput && searchInput.value.trim()) {
        addToSearchHistory(searchInput.value.trim());
    }

    // Clear existing content
    list.innerHTML = '';

    if (perfumesToDisplay.length === 0) {
        list.innerHTML = `<p style="text-align:center; padding: 20px;">${t('noResults')}</p>`;
        return;
    }

    // Use SimpleVirtualList for infinite scroll
    if (perfumeVirtualList) {
        perfumeVirtualList.destroy();
    }

    perfumeVirtualList = new SimpleVirtualList(
        list,
        perfumesToDisplay,
        (perfumeName) => createPerfumeCard(perfumeName, null),
        { batchSize: 20, loadMoreThreshold: 300 }
    );
};

const filterPerfumes = () => {
    const searchTermInput = document.getElementById('search-input');
    if (!searchTermInput) return Object.keys(state.parfum_veritabani);

    const searchTerm = searchTermInput.value.toLowerCase();
    const gender = document.getElementById('gender-select')?.value || 'Tümü';
    const season = document.getElementById('season-select')?.value || 'Tümü';
    const usage = document.getElementById('usage-select')?.value || 'Tümü';
    const scentType = document.getElementById('scent-type-select')?.value || 'Tümü';

    let filtered = Object.keys(state.parfum_veritabani).filter(name => {
        const p = state.parfum_veritabani[name];
        if (!p) return false;

        const p_notalar = (typeof p.notalar === 'string' ? p.notalar : (p.notalar ? Object.values(p.notalar).join(' ') : ''));
        const usageMatch = (usage === 'Tümü' || p.kullanim === usage || (p.kullanim === 'her zaman' && (usage === 'gündüz' || usage === 'gece')));

        const searchMatch = (searchTerm === '' ||
            name.toLowerCase().includes(searchTerm) ||
            p_notalar.toLowerCase().includes(searchTerm) ||
            (p.hikaye && p.hikaye.toLowerCase().includes(searchTerm)) ||
            (p.vibe && p.vibe.toLowerCase().includes(searchTerm)));

        return searchMatch &&
            (gender === 'Tümü' || p.cinsiyet === gender) &&
            (season === 'Tümü' || p.mevsim === season) &&
            usageMatch &&
            (scentType === 'Tümü' || p.koku_turu === scentType);
    });

    const sortValue = document.getElementById('sort-select')?.value || 'a-z';
    filtered.sort((a, b) => {
        const perfumeA = state.parfum_veritabani[a];
        const perfumeB = state.parfum_veritabani[b];

        switch (sortValue) {
            case 'z-a':
                return b.localeCompare(a);
            case 'star-desc':
                return (perfumeB.yildiz?.length || 0) - (perfumeA.yildiz?.length || 0);
            case 'star-asc':
                return (perfumeA.yildiz?.length || 0) - (perfumeB.yildiz?.length || 0);
            case 'a-z':
            default:
                return a.localeCompare(b);
        }
    });

    return filtered;
};

export const renderDetailPage = async (perfumeName) => {
    const data = state.parfum_veritabani[perfumeName];
    if (!data) return;

    // Add to recently viewed
    addToRecentlyViewed(perfumeName);

    showPage('detail-page');

    const url = new URL(window.location.href);
    url.searchParams.set('perfume', encodeURIComponent(perfumeName.replace(/ /g, '_')));
    history.replaceState({ page: 'detail-page', perfume: perfumeName }, '', url.toString());

    window.scrollTo({ top: 0, behavior: 'smooth' });

    const page = document.getElementById('detail-page');

    page.querySelector('.perfume-title').textContent = perfumeName;
    page.querySelector('.perfume-stars').textContent = data.yildiz || '';

    // Get current language and translate if needed
    const currentLang = getCurrentLanguage();

    // Show loading state while translating
    const vibeEl = page.querySelector('.vibe');
    const storyEl = page.querySelector('.story');
    const notesContainer = page.querySelector('.notes');

    if (currentLang !== 'tr') {
        // Show original content first with loading indicator
        vibeEl.innerHTML = `<span class="translating">"${data.vibe || ''}"</span> <span class="translate-loading">⏳</span>`;
        storyEl.innerHTML = `<span class="translating">${data.hikaye || t('noResults')}</span> <span class="translate-loading">⏳</span>`;
        notesContainer.innerHTML = `<p><span class="translating">${data.notalar || t('noResults')}</span> <span class="translate-loading">⏳</span></p>`;

        // Translate content
        try {
            const [translatedVibe, translatedStory, translatedNotes] = await Promise.all([
                data.vibe ? translateText(data.vibe, 'tr', currentLang) : '',
                data.hikaye ? translateText(data.hikaye, 'tr', currentLang) : '',
                data.notalar ? translateText(data.notalar, 'tr', currentLang) : ''
            ]);

            vibeEl.textContent = `"${translatedVibe || data.vibe || ''}"`;
            storyEl.textContent = translatedStory || data.hikaye || t('noResults');
            notesContainer.innerHTML = `<p>${translatedNotes || data.notalar || t('noResults')}</p>`;
        } catch (error) {
            console.error('Translation error:', error);
            // Fall back to original content
            vibeEl.textContent = `"${data.vibe || ''}"`;
            storyEl.textContent = data.hikaye || t('noResults');
            notesContainer.innerHTML = `<p>${data.notalar || t('noResults')}</p>`;
        }
    } else {
        // Turkish - no translation needed
        vibeEl.textContent = `"${data.vibe || ''}"`;
        storyEl.textContent = data.hikaye || t('noResults');
        notesContainer.innerHTML = `<p>${data.notalar || t('noResults')}</p>`;
    }

    const favButton = page.querySelector('#detail-fav-button');
    favButton.classList.toggle('active', state.userLists["Favorilerim"]?.includes(perfumeName));
    favButton.onclick = () => { toggleFavorite(perfumeName); renderDetailPage(perfumeName); };
    page.querySelector('#add-to-list-button').onclick = () => openAddToListModal(perfumeName);
    page.querySelector('#personal-note-input').value = state.personalNotes[perfumeName] || '';
    page.querySelector('#save-note-button').onclick = () => saveNote(perfumeName);
    page.querySelector('.share-button').onclick = () => sharePerfume(perfumeName);
    page.querySelector('.back-button').onclick = () => showPage(lastPage);
    page.querySelector('#online-search-button').onclick = () => {
        const searchQuery = encodeURIComponent(`${perfumeName} parfüm satın al`);
        window.open(`https://www.google.com/search?q=${searchQuery}`, '_blank');
    };
};

const toggleFavorite = (perfumeName) => {
    const favList = state.userLists["Favorilerim"];
    if (!favList) state.userLists["Favorilerim"] = [];
    const index = favList.indexOf(perfumeName);
    if (index > -1) {
        favList.splice(index, 1);
        showToast(t('removedFromFavorites'));
    } else {
        favList.push(perfumeName);
        state.userStats.favoritesAdded++;
        saveStats();
        showToast(t('addedToFavorites'));
    }
    saveLists();
};

const saveNote = (perfumeName) => {
    const noteInput = document.getElementById('personal-note-input');
    const noteText = noteInput.value.trim();
    if (noteText) {
        state.personalNotes[perfumeName] = noteText;
    } else {
        delete state.personalNotes[perfumeName];
    }
    saveNotes();
    showToast(t('noteSaved'));
};

const sharePerfume = (perfumeName) => {
    const base = window.location.origin + window.location.pathname;
    const url = `${base}?page=detail-page&perfume=${encodeURIComponent(perfumeName.replace(/ /g, '_'))}`;
    const shareData = { title: t('appTitle'), text: `${perfumeName}`, url };
    if (navigator.share) {
        navigator.share(shareData).catch(console.error);
    } else {
        navigator.clipboard.writeText(shareData.url).then(() => showToast(t('linkCopied')));
    }
};

export const renderMyListsPage = () => {
    const page = document.getElementById('my-lists-page');
    page.innerHTML = `
        <div style="text-align:center;margin:25px 0;">
            <button id="stats-button" class="styled-button secondary-button" style="width:100%;max-width:300px;padding:14px 24px;font-size:1.05em;">📊 ${t('yourStats')}</button>
        </div>
        <div id="create-list-form"><input type="text" id="new-list-name-input" placeholder="${t('newListPlaceholder')}"><button id="create-list-button" class="styled-button primary-button">${t('createList')}</button></div>
        <div id="custom-lists-container"></div>
    `;
    const container = page.querySelector('#custom-lists-container');
    page.querySelector('#stats-button').onclick = renderStatsPage;
    const listNames = Object.keys(state.userLists);
    if (listNames.length === 0) {
        container.innerHTML = `<p style="text-align:center; padding: 20px;">${t('noResults')}</p>`;
    } else {
        listNames.forEach(listName => {
            const listEntry = document.createElement('div');
            listEntry.className = 'list-entry';
            const perfumeCount = state.userLists[listName].length;
            let actionsHTML = '';
            if (listName !== "Favorilerim") {
                actionsHTML = `<div class="list-actions"><button class="rename-list-btn" title="Rename">✏️</button><button class="delete-list-btn" title="Delete">🗑️</button></div>`;
            }
            const displayName = listName === "Favorilerim" ? t('favorites') : listName;
            listEntry.innerHTML = `<div class="list-info"><h3>${displayName}</h3><span class="perfume-count">${t('perfumeCount', { count: perfumeCount })}</span></div>${actionsHTML}`;
            container.appendChild(listEntry);
            listEntry.querySelector('.list-info').onclick = () => renderListDetailPage(listName);
            if (listName !== "Favorilerim") {
                listEntry.querySelector('.rename-list-btn').onclick = () => renameList(listName);
                listEntry.querySelector('.delete-list-btn').onclick = () => deleteList(listName);
            }
        });
    }
    page.querySelector('#create-list-button').onclick = createNewList;
};

const createNewList = () => {
    const input = document.getElementById('new-list-name-input');
    const listName = input.value.trim();
    if (listName && !state.userLists.hasOwnProperty(listName)) {
        state.userLists[listName] = [];
        saveLists();
        state.userStats.listsCreated++;
        saveStats();
        renderMyListsPage();
        input.value = '';
        showToast(t('listCreated', { name: listName }));
    } else if (state.userLists.hasOwnProperty(listName)) {
        showToast(t('alreadyInList'));
    } else {
        showToast(t('error'));
    }
};

const deleteList = (listName) => {
    if (confirm(`Delete "${listName}"?`)) {
        delete state.userLists[listName];
        saveLists();
        renderMyListsPage();
        showToast(t('listDeleted'));
    }
};

const renameList = (oldName) => {
    const newName = prompt("Enter new name:", oldName)?.trim();
    if (!newName || newName === oldName) return;
    if (state.userLists.hasOwnProperty(newName)) {
        showToast(t('alreadyInList'));
        return;
    }
    state.userLists[newName] = state.userLists[oldName];
    delete state.userLists[oldName];
    saveLists();
    renderMyListsPage();
};

export const renderListDetailPage = (listName) => {
    showPage('my-lists-page');
    const page = document.getElementById('my-lists-page');
    page.innerHTML = '';
    const header = document.createElement('div');
    header.className = 'list-detail-header';
    const backButton = document.createElement('button');
    backButton.innerHTML = `${t('back')}`;
    backButton.className = 'action-button list-detail-back-button';
    backButton.onclick = renderMyListsPage;
    const title = document.createElement('h2');
    title.className = 'accent list-detail-title';
    const displayName = listName === "Favorilerim" ? t('favorites') : listName;
    title.textContent = displayName;
    header.appendChild(backButton);
    header.appendChild(title);
    page.appendChild(header);
    const perfumeList = state.userLists[listName];
    const perfumeContainer = document.createElement('div');
    page.appendChild(perfumeContainer);
    if (perfumeList && perfumeList.length > 0) {
        perfumeList.forEach(perfumeName => {
            if (state.parfum_veritabani[perfumeName]) createPerfumeCard(perfumeName, perfumeContainer);
        });
    } else {
        perfumeContainer.innerHTML = `<p style="text-align:center; padding: 20px;">${t('noResults')}</p>`;
    }
};

const openAddToListModal = (perfumeName) => {
    const modal = document.getElementById('add-to-list-modal');
    const listContainer = document.getElementById('modal-list-container');
    listContainer.innerHTML = '';
    const customLists = Object.keys(state.userLists).filter(name => name !== "Favorilerim");

    if (customLists.length === 0) {
        listContainer.innerHTML = `<p style="text-align:center;">${t('noResults')}</p>`;
    } else {
        customLists.forEach(listName => {
            const listButton = document.createElement('button');
            listButton.className = 'styled-button';
            listButton.textContent = listName;
            listButton.onclick = () => addPerfumeToList(perfumeName, listName);
            listContainer.appendChild(listButton);
        });
    }
    modal.style.display = 'flex';
};

const addPerfumeToList = (perfumeName, listName) => {
    const list = state.userLists[listName];
    if (list && !list.includes(perfumeName)) {
        list.push(perfumeName);
        saveLists();
        showToast(t('addedToList', { list: listName }));
    } else {
        showToast(t('alreadyInList'));
    }
    closeAddToListModal();
};

export const closeAddToListModal = () => document.getElementById('add-to-list-modal').style.display = 'none';

// Language selector setup
const setupLanguageSelector = () => {
    const selector = document.getElementById('language-selector');
    if (!selector) return;

    const languages = getAvailableLanguages();
    const currentLang = getCurrentLanguage();

    selector.innerHTML = languages.map(lang =>
        `<option value="${lang.code}" ${lang.code === currentLang ? 'selected' : ''}>${lang.flag} ${lang.name}</option>`
    ).join('');

    selector.onchange = (e) => {
        setLanguage(e.target.value);
        // Reload UI with new language
        location.reload();
    };
};

export const renderRightSidebar = async () => {
    const sidebarRight = document.getElementById('desktop-sidebar-right');
    if (!sidebarRight || Object.keys(state.parfum_veritabani).length === 0) return;

    const currentLang = getCurrentLanguage();

    const multiWordBrands = ["Yves Saint Laurent", "Maison Francis Kurkdjian", "Dolce&Gabbana", "Giorgio Armani", "Carolina Herrera", "Jean Paul Gaultier", "Acqua di Parma", "Creed", "Tom Ford", "Viktor&Rolf", "Parfums de Marly", "Maison Martin Margiela", "L'Artisan Parfumeur"];
    const getBrand = (name) => {
        const foundMulti = multiWordBrands.find(b => name.startsWith(b));
        return foundMulti || name.split(' ')[0];
    };

    const allBrands = [...new Set(Object.keys(state.parfum_veritabani).map(name => getBrand(name)))];
    let randomBrand, brandPerfumes;
    let attempts = 0;

    do {
        randomBrand = allBrands[Math.floor(Math.random() * allBrands.length)];
        brandPerfumes = Object.keys(state.parfum_veritabani).filter(name => name.startsWith(randomBrand));
        attempts++;
    } while (brandPerfumes.length < 6 && attempts < allBrands.length)

    let brandSpotlightHTML = '';
    if (brandPerfumes.length >= 6) {
        const types = brandPerfumes.map(p => state.parfum_veritabani[p].koku_turu);
        const typeCounts = types.reduce((acc, type) => { acc[type] = (acc[type] || 0) + 1; return acc; }, {});
        const sortedTypes = Object.keys(typeCounts).sort((a, b) => typeCounts[b] - typeCounts[a]);

        let brandDescription = `${randomBrand}, ${sortedTypes.slice(0, 2).join(' & ')}`;

        const shuffled = brandPerfumes.sort(() => 0.5 - Math.random());
        const selectedPerfumes = shuffled.slice(0, 6);

        // Translate vibes if not Turkish
        const vibeTexts = await Promise.all(selectedPerfumes.map(async pName => {
            const pData = state.parfum_veritabani[pName];
            const vibeText = pData.vibe?.substring(0, 60) || '';
            if (currentLang !== 'tr' && vibeText) {
                try {
                    return await translateText(vibeText, 'tr', currentLang);
                } catch {
                    return vibeText;
                }
            }
            return vibeText;
        }));

        let recommendationsHTML = '';
        selectedPerfumes.forEach((pName, index) => {
            recommendationsHTML += `
                <div class="brand-perfume-recommendation" data-perfume="${pName}">
                    <div class="recommendation-info">
                        <strong>${pName.replace(randomBrand + ' ', '')}:</strong>
                        <span>${vibeTexts[index]}...</span>
                    </div>
                </div>`;
        });

        brandSpotlightHTML = `
            <div class="sidebar-section">
                <h3>${t('weeklyPicks')}: ${randomBrand}</h3>
                <p>${brandDescription}</p>
                <div class="recommendations-container">
                    ${recommendationsHTML}
                </div>
            </div>`;
    }

    sidebarRight.innerHTML = brandSpotlightHTML;
    if (brandPerfumes.length >= 6) {
        sidebarRight.querySelectorAll('.brand-perfume-recommendation').forEach(el => {
            el.onclick = () => renderDetailPage(el.dataset.perfume);
        });
    }
};

export const renderLeftSidebar = async () => {
    const sidebarLeft = document.getElementById('desktop-sidebar-left');
    if (!sidebarLeft || Object.keys(state.parfum_veritabani).length === 0) return;

    const allPerfumes = Object.keys(state.parfum_veritabani);
    const randomPerfumeName = allPerfumes[Math.floor(Math.random() * allPerfumes.length)];
    const data = state.parfum_veritabani[randomPerfumeName];

    const lang = getCurrentLanguage();
    const facts = perfumeFacts[lang] || perfumeFacts.en;
    const randomFact = facts[Math.floor(Math.random() * facts.length)];

    // Translate vibe if not Turkish
    let vibeText = data.vibe?.substring(0, 80) || '';
    if (lang !== 'tr' && vibeText) {
        try {
            vibeText = await translateText(vibeText, 'tr', lang);
        } catch (e) {
            // Keep original on error
        }
    }

    const discoveryHTML = `
        <div class="sidebar-section">
            <h3>${t('dailyPerfume')}</h3>
            <div class="sidebar-perfume-card">
                <h4>${randomPerfumeName}</h4>
                <p>"${vibeText}..."</p>
                <button class="styled-button secondary-button">${t('back').replace('< ', '')}</button>
            </div>
        </div>`;

    const factHTML = `
        <div class="sidebar-section">
            <h3>${t('didYouKnow')}</h3>
            <p>${randomFact}</p>
        </div>`;

    sidebarLeft.innerHTML = discoveryHTML + factHTML;
    sidebarLeft.querySelector('.sidebar-perfume-card button').onclick = () => renderDetailPage(randomPerfumeName);
};

export const renderWeeklyPicks = () => {
    const picksContainer = document.getElementById('weekly-picks-panel');
    if (!picksContainer) return;

    picksContainer.innerHTML = `<h3>${t('weeklyPicks')}</h3><div id="weekly-picks-list"></div>`;
    const listElement = document.getElementById('weekly-picks-list');

    const topPerfumes = Object.keys(state.parfum_veritabani).filter(name => state.parfum_veritabani[name].yildiz === "★★★★★");

    const shuffled = topPerfumes.sort(() => 0.5 - Math.random());
    let selected = shuffled.slice(0, 6);

    selected.forEach(perfumeName => {
        createPerfumeCard(perfumeName, listElement);
    });
};

export const setupFilterAccordion = () => {
    const toggleBtn = document.getElementById('filter-toggle-btn');
    const filterArea = document.getElementById('filter-area');

    if (!toggleBtn || !filterArea) return;

    const isExpanded = localStorage.getItem('filterExpanded') !== 'false';
    if (isExpanded) {
        filterArea.classList.add('expanded');
        toggleBtn.classList.add('active');
    }

    toggleBtn.onclick = () => {
        filterArea.classList.toggle('expanded');
        toggleBtn.classList.toggle('active');
        localStorage.setItem('filterExpanded', filterArea.classList.contains('expanded'));
    };
};

export const renderStatsPage = () => {
    const page = document.getElementById('my-lists-page');
    page.innerHTML = `
        <div class="header">
            <button class="back-button action-button" id="stats-back-btn">${t('back')}</button>
        </div>
        <h2 class="accent" style="padding-top:15px;text-align:center;">📊 ${t('yourStats')}</h2>
        <div style="padding:20px;">
            <div style="background:var(--frame-bg-color);padding:15px;border-radius:8px;margin-bottom:15px;">
                <h3 style="margin:0 0 10px 0;color:var(--accent-color);">🔍 ${t('totalSearches')}</h3>
                <p style="font-size:2em;margin:0;font-weight:bold;">${state.userStats.totalSearches}</p>
            </div>
            <div style="background:var(--frame-bg-color);padding:15px;border-radius:8px;margin-bottom:15px;">
                <h3 style="margin:0 0 10px 0;color:var(--accent-color);">⭐ ${t('favoritesAdded')}</h3>
                <p style="font-size:2em;margin:0;font-weight:bold;">${state.userStats.favoritesAdded}</p>
            </div>
            <div style="background:var(--frame-bg-color);padding:15px;border-radius:8px;margin-bottom:15px;">
                <h3 style="margin:0 0 10px 0;color:var(--accent-color);">📚 ${t('listsCreated')}</h3>
                <p style="font-size:2em;margin:0;font-weight:bold;">${state.userStats.listsCreated}</p>
            </div>
            <div style="background:var(--frame-bg-color);padding:15px;border-radius:8px;margin-bottom:15px;">
                <h3 style="margin:0 0 10px 0;color:var(--accent-color);">🧬 ${t('quizzesTaken')}</h3>
                <p style="font-size:2em;margin:0;font-weight:bold;">${state.userStats.quizzesTaken}</p>
            </div>
        </div>
    `;
    page.querySelector('#stats-back-btn').onclick = renderMyListsPage;
};

export const populateSelect = (elementId, property, labelKey, valuePrefix = '') => {
    const select = document.getElementById(elementId);
    if (!select) return;

    // Save current selection to restore after update
    const currentVal = select.value;

    // Get unique values from data
    const uniqueValues = [...new Set(Object.values(state.parfum_veritabani).map(p => p[property]).filter(Boolean))];
    const sortedValues = uniqueValues.sort();

    // Helper to translate values
    const translateValue = (val) => {
        if (!valuePrefix) return val.charAt(0).toUpperCase() + val.slice(1);

        // Map common values to translation keys
        // Gender
        if (property === 'cinsiyet') {
            if (val === 'kadın') return t('genderFemale');
            if (val === 'erkek') return t('genderMale');
            if (val === 'unisex') return t('genderUnisex');
        }
        // Season
        if (property === 'mevsim') {
            if (val === 'ilkbahar') return t('seasonSpring');
            if (val === 'yaz') return t('seasonSummer');
            if (val === 'sonbahar') return t('seasonAutumn');
            if (val === 'kış') return t('seasonWinter');
            if (val === 'dört mevsim') return t('seasonAllYear');
        }
        // Usage
        if (property === 'kullanim') {
            if (val === 'gündüz') return t('usageDay');
            if (val === 'gece') return t('usageNight');
            if (val === 'her zaman') return t('usageAlways');
            if (val === 'özel') return t('usageSpecial');
        }

        return val.charAt(0).toUpperCase() + val.slice(1);
    };

    // Get "All" label translation based on property
    let allLabel = t('genderAll'); // fallback
    if (property === 'mevsim') allLabel = t('seasonAll');
    if (property === 'kullanim') allLabel = t('usageAll');
    if (property === 'koku_turu') allLabel = t('scentAll');

    select.innerHTML = `<option value="Tümü">${allLabel}</option>`;

    sortedValues.forEach(val => {
        const option = document.createElement('option');
        option.value = val;
        option.textContent = translateValue(val);
        select.appendChild(option);
    });

    // Restore selection if it still exists
    if (currentVal && (currentVal === 'Tümü' || sortedValues.includes(currentVal))) {
        select.value = currentVal;
    }
};

export const setupThemeToggle = () => {
    const toggleButton = document.getElementById('theme-toggle-button');
    const body = document.body;
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light') { body.classList.add('light-mode'); toggleButton.textContent = '☀️'; }
    else { toggleButton.textContent = '🌙'; }
    toggleButton.addEventListener('click', () => { body.classList.toggle('light-mode'); const isLight = body.classList.contains('light-mode'); localStorage.setItem('theme', isLight ? 'light' : 'dark'); toggleButton.textContent = isLight ? '☀️' : '🌙'; });
};

export const setupPrivacyPage = () => {
    const page = document.getElementById('privacy-policy-page');
    if (page) {
        page.querySelector('.back-button').onclick = () => showPage(lastPage);
    }
};

export const setupUI = () => {
    // Initialize i18n
    initI18n();

    document.getElementById('search-button').onclick = renderPerfumes;
    document.getElementById('surprise-button').onclick = () => {
        const allPerfumes = Object.keys(state.parfum_veritabani);
        const randomPerfume = allPerfumes[Math.floor(Math.random() * allPerfumes.length)];
        renderDetailPage(randomPerfume);
    };
    document.getElementById('start-quiz-button').onclick = startQuiz;
    document.getElementById('nav-home').onclick = () => showPage('home-page');
    document.getElementById('nav-lists').onclick = () => showPage('my-lists-page');
    document.getElementById('close-modal-button').onclick = closeAddToListModal;
    document.getElementById('add-to-list-modal').onclick = (e) => { if (e.target.id === 'add-to-list-modal') closeAddToListModal(); };

    const debouncedRender = debounce(renderPerfumes, 200);
    document.getElementById('sort-select').addEventListener('change', debouncedRender);
    const genderSel = document.getElementById('gender-select');
    const seasonSel = document.getElementById('season-select');
    const usageSel = document.getElementById('usage-select');
    const scentSel = document.getElementById('scent-type-select');
    genderSel && genderSel.addEventListener('change', debouncedRender);
    seasonSel && seasonSel.addEventListener('change', debouncedRender);
    usageSel && usageSel.addEventListener('change', debouncedRender);
    scentSel && scentSel.addEventListener('change', debouncedRender);

    const searchInput = document.getElementById('search-input');
    if (searchInput) {
        searchInput.addEventListener('input', debouncedRender);
        searchInput.addEventListener('keydown', (e) => { if (e.key === 'Enter') { e.preventDefault(); renderPerfumes(); } });
    }

    document.getElementById('privacy-link-mobile').onclick = (e) => { e.preventDefault(); showPage('privacy-policy-page'); };
    document.getElementById('privacy-link-desktop').onclick = (e) => { e.preventDefault(); showPage('privacy-policy-page'); };

    document.getElementById('privacy-link-desktop').onclick = (e) => { e.preventDefault(); showPage('privacy-policy-page'); };

    // Initial populate
    populateSelect('gender-select', 'cinsiyet', 'filterGender', true);
    populateSelect('season-select', 'mevsim', 'filterSeason', true);
    populateSelect('usage-select', 'kullanim', 'filterUsage', true);
    populateSelect('scent-type-select', 'koku_turu', 'filterScentType');

    // Setup language selector
    setupLanguageSelector();

    renderLeftSidebar();
    renderRightSidebar();

    setupThemeToggle();
    setupPrivacyPage();
    setupInteractiveQuiz();
    renderWeeklyPicks();
    setupFilterAccordion();

    // Translate static UI elements
    translateUI();

    // Listen for language changes
    window.addEventListener('languageChanged', () => {
        translatePage();
        translateUI();

        // Re-translate detail page if it's currently visible
        const detailPage = document.getElementById('detail-page');
        if (detailPage && detailPage.classList.contains('active')) {
            const perfumeTitle = detailPage.querySelector('.perfume-title');
            if (perfumeTitle && perfumeTitle.textContent) {
                // Re-render detail page with new language
                renderDetailPage(perfumeTitle.textContent);
            }
        }

        // Re-render sidebars with new language
        renderLeftSidebar();
        renderRightSidebar();
    });
};

// Translate all static UI elements based on current language
const translateUI = () => {
    // Re-populate selects with new language
    populateSelect('gender-select', 'cinsiyet', 'filterGender', true);
    populateSelect('season-select', 'mevsim', 'filterSeason', true);
    populateSelect('usage-select', 'kullanim', 'filterUsage', true);
    populateSelect('scent-type-select', 'koku_turu', 'filterScentType');

    // Header title
    const appTitle = document.querySelector('h1[data-i18n="appTitle"]');
    if (appTitle) appTitle.textContent = t('appTitle');

    // Navigation buttons
    const navHome = document.getElementById('nav-home');
    const navLists = document.getElementById('nav-lists');
    if (navHome) navHome.innerHTML = `🔍<br class="mobile-only"> ${t('navHome')}`;
    if (navLists) navLists.innerHTML = `📚<br class="mobile-only"> ${t('navLists')}`;

    // Filter section
    const filterToggle = document.getElementById('filter-toggle-btn');
    if (filterToggle) {
        filterToggle.innerHTML = `<span>${t('filtersTitle')}</span><span class="arrow">▼</span>`;
    }

    // Search input placeholder
    const searchInput = document.getElementById('search-input');
    if (searchInput) searchInput.placeholder = t('searchPlaceholder');

    // Action buttons
    const searchBtn = document.getElementById('search-button');
    const surpriseBtn = document.getElementById('surprise-button');
    const quizBtn = document.getElementById('start-quiz-button');

    if (searchBtn) searchBtn.textContent = t('startSearch');
    if (surpriseBtn) surpriseBtn.textContent = t('surpriseMe');
    if (quizBtn) quizBtn.textContent = t('findPerfume');

    // Sort select options
    const sortSelect = document.getElementById('sort-select');
    if (sortSelect) {
        sortSelect.options[0].textContent = t('sortAZ');
        sortSelect.options[1].textContent = t('sortZA');
        sortSelect.options[2].textContent = t('sortStarDesc');
        sortSelect.options[3].textContent = t('sortStarAsc');
    }

    // Modal
    const modalTitle = document.querySelector('#add-to-list-modal h4');
    const closeModalBtn = document.getElementById('close-modal-button');
    if (modalTitle) modalTitle.textContent = t('addToList');
    if (closeModalBtn) closeModalBtn.textContent = t('close');

    // Detail page labels
    const vibeTitle = document.querySelector('#detail-page .section h4');
    if (vibeTitle) {
        const sections = document.querySelectorAll('#detail-page .section h4');
        if (sections[0]) sections[0].textContent = t('vibeTitle');
        if (sections[1]) sections[1].textContent = t('storyTitle');
        if (sections[2]) sections[2].textContent = t('notesTitle');
        if (sections[3]) sections[3].textContent = t('personalNotesTitle');
    }

    const personalNoteInput = document.getElementById('personal-note-input');
    const saveNoteBtn = document.getElementById('save-note-button');
    const onlineSearchBtn = document.getElementById('online-search-button');

    if (personalNoteInput) personalNoteInput.placeholder = t('personalNotePlaceholder');
    if (saveNoteBtn) saveNoteBtn.textContent = t('saveNote');
    if (onlineSearchBtn) onlineSearchBtn.textContent = t('onlineSearch');
};

