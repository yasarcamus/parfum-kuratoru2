// Internationalization (i18n) Module
// Supports: Turkish (tr), English (en), Russian (ru), Arabic (ar)

const translations = {
    tr: {
        // Header
        appTitle: "Parfüm Küratörü",
        toggleTheme: "Temayı Değiştir",

        // Navigation
        navHome: "Ana Sayfa",
        navLists: "Listelerim",

        // Filters
        filtersTitle: "🔍 Filtreler & Arama",
        searchPlaceholder: "Parfüm, nota, hikaye ara...",
        genderAll: "Tüm Cinsiyetler",
        genderFemale: "Kadın",
        genderMale: "Erkek",
        genderUnisex: "Unisex",
        seasonAll: "Tüm Mevsimler",
        seasonSpring: "İlkbahar",
        seasonSummer: "Yaz",
        seasonAutumn: "Sonbahar",
        seasonWinter: "Kış",
        seasonAllYear: "Dört Mevsim",
        usageAll: "Tüm Kullanım Alanları",
        usageDay: "Gündüz",
        usageNight: "Gece",
        usageAlways: "Her Zaman",
        usageSpecial: "Özel",
        scentAll: "Tüm Koku Türleri",
        filterGender: "Cinsiyet",
        filterSeason: "Mevsim",
        filterUsage: "Kullanım",
        filterScentType: "Koku Türü",
        sortAZ: "İsme Göre (A-Z)",
        sortZA: "İsme Göre (Z-A)",
        sortStarDesc: "Yıldıza Göre (En Yüksek)",
        sortStarAsc: "Yıldıza Göre (En Düşük)",

        // Buttons
        startSearch: "✨ Koku Avına Başla",
        surpriseMe: "🎲 Beni Şaşırt!",
        findPerfume: "🧬 Sana Uygun Parfümü Bul",
        back: "< Geri",
        saveNote: "Notu Kaydet",
        onlineSearch: "🛍️ Online Ara & Fiyatları Karşılaştır",
        close: "Kapat",
        restartQuiz: "Testi Yeniden Yap",
        backToHome: "Ana Sayfaya Dön",
        startQuiz: "Teste Başla",
        createList: "Oluştur",
        clearHistory: "Temizle",

        // Detail Page
        vibeTitle: "--- His (Vibe) ---",
        storyTitle: "--- Hikayesi ---",
        notesTitle: "--- Notalar ---",
        personalNotesTitle: "--- Kişisel Notlarım ---",
        personalNotePlaceholder: "Bu parfümle ilgili düşüncelerin...",
        topNotes: "ÜST NOTALAR",
        middleNotes: "ORTA NOTALAR",
        baseNotes: "ALT NOTALAR",

        // Lists
        myLists: "Listelerim",
        favorites: "Favorilerim",
        newListPlaceholder: "Yeni liste adı...",
        addToList: "Bir Listeye Ekle",
        perfumeCount: "{count} parfüm",

        // Recently Viewed
        recentlyViewed: "Son Görüntülenenler",
        noRecentlyViewed: "Henüz parfüm görüntülemediniz.",

        // Quiz
        quizTitle: "Koku Kimliğini Keşfet",
        quizDescription: "Sadece birkaç basit soruyla sana en uygun, ruhunu yansıtan parfümü bulalım. Kişisel koku zevkini keşfetmeye hazır mısın?",
        quizResultsTitle: "🎉 Sana Özel Önerilerimiz!",
        quizResultsDescription: "Verdiğin cevaplara göre koku profilinle en uyumlu parfümler:",
        matchPercentage: "%{percent} Uyumlu",
        noResults: "Sana uygun bir parfüm bulamadık. İstersen testi yeniden dene!",

        // Quiz Questions
        q1: "İdeal bir gün senin için nasıl geçer?",
        q1a1: "Kumsalda güneşlenerek",
        q1a2: "Şömine başında kitap okuyarak",
        q1a3: "Doğada uzun bir yürüyüşle",
        q1a4: "Şık bir akşam yemeğiyle",

        q2: "Seni en iyi hangi koku ailesi tanımlar?",
        q2a1: "Taze kesilmiş çiçekler",
        q2a2: "Yeni sıkılmış portakal suyu",
        q2a3: "Gizemli baharatlar ve tütsü",
        q2a4: "Yağmur sonrası orman kokusu",

        q3: "Bu parfümü en çok nerede kullanmak istersin?",
        q3a1: "Günlük, ofis veya okulda",
        q3a2: "Özel bir davet veya randevuda",
        q3a3: "Her an, her yerde!",
        q3a4: "Sadece hafta sonu keyfi için",

        q4: "Hangi malzeme sana daha çekici geliyor?",
        q4a1: "Kadife ve ipek",
        q4a2: "Deri ve ahşap",
        q4a3: "Kristal ve metal",
        q4a4: "Pamuk ve keten",

        q5: "Bir renk seçsen hangisi olurdu?",
        q5a1: "Altın sarısı veya şampanya",
        q5a2: "Koyu bordo veya siyah",
        q5a3: "Turkuaz veya deniz mavisi",
        q5a4: "Pastel pembe veya lavanta",

        q6: "Hangi ortam sana daha çekici?",
        q6a1: "Işıltılı bir gala gecesi",
        q6a2: "Sakin bir kütüphane",
        q6a3: "Hareketli bir pazar yeri",
        q6a4: "Tenha bir sahil",

        q7: "Parfümün ne kadar kalıcı olsun?",
        q7a1: "Hafif ve ferah, iz bırakmasın",
        q7a2: "Orta kalıcılık, dengeli",
        q7a3: "Güçlü ve kalıcı, fark edilsin",
        q7a4: "Çok güçlü, gün boyu sürsün",

        // Toasts
        addedToFavorites: "Favorilere eklendi!",
        removedFromFavorites: "Favorilerden çıkarıldı.",
        noteSaved: "Notunuz kaydedildi!",
        addedToList: '"{list}" listesine eklendi!',
        alreadyInList: "Bu parfüm zaten bu listede.",
        listCreated: '"{name}" listesi oluşturuldu!',
        listDeleted: "Liste silindi.",
        linkCopied: "Link kopyalandı!",

        // Footer
        contactUs: "Bize Ulaşın:",
        privacyPolicy: "Gizlilik Politikası",
        copyright: "© 2025 Parfüm Küratörü. Tüm hakları saklıdır.",

        // Sidebar
        dailyPerfume: "Günün Parfümü",
        weeklyPicks: "Haftanın Seçkisi",
        didYouKnow: "Biliyor muydunuz?",
        yourStats: "İstatistikleriniz",
        totalSearches: "Toplam Arama",
        favoritesAdded: "Favorilere Eklenen",
        listsCreated: "Oluşturulan Liste",
        quizzesTaken: "Yapılan Test",

        // Misc
        loading: "Yükleniyor...",
        noResults: "Sonuç bulunamadı.",
        error: "Bir hata oluştu."
    },

    en: {
        // Header
        appTitle: "Perfume Curator",
        toggleTheme: "Toggle Theme",

        // Navigation
        navHome: "Home",
        navLists: "My Lists",

        // Filters
        filtersTitle: "🔍 Filters & Search",
        searchPlaceholder: "Search perfume, notes, story...",
        genderAll: "All Genders",
        genderFemale: "Women",
        genderMale: "Men",
        genderUnisex: "Unisex",
        seasonAll: "All Seasons",
        seasonSpring: "Spring",
        seasonSummer: "Summer",
        seasonAutumn: "Autumn",
        seasonWinter: "Winter",
        seasonAllYear: "All Year",
        usageAll: "All Occasions",
        usageDay: "Daytime",
        usageNight: "Night",
        usageAlways: "Anytime",
        usageSpecial: "Special",
        scentAll: "All Scent Types",
        filterGender: "Gender",
        filterSeason: "Season",
        filterUsage: "Occasion",
        filterScentType: "Scent Type",
        sortAZ: "Name (A-Z)",
        sortZA: "Name (Z-A)",
        sortStarDesc: "Rating (Highest)",
        sortStarAsc: "Rating (Lowest)",

        // Buttons
        startSearch: "✨ Start Scent Hunt",
        surpriseMe: "🎲 Surprise Me!",
        findPerfume: "🧬 Find Your Perfume",
        back: "< Back",
        saveNote: "Save Note",
        onlineSearch: "🛍️ Search Online & Compare Prices",
        close: "Close",
        restartQuiz: "Take Quiz Again",
        backToHome: "Back to Home",
        startQuiz: "Start Quiz",
        createList: "Create",
        clearHistory: "Clear",

        // Detail Page
        vibeTitle: "--- Vibe ---",
        storyTitle: "--- Story ---",
        notesTitle: "--- Notes ---",
        personalNotesTitle: "--- My Personal Notes ---",
        personalNotePlaceholder: "Your thoughts about this perfume...",
        topNotes: "TOP NOTES",
        middleNotes: "HEART NOTES",
        baseNotes: "BASE NOTES",

        // Lists
        myLists: "My Lists",
        favorites: "My Favorites",
        newListPlaceholder: "New list name...",
        addToList: "Add to List",
        perfumeCount: "{count} perfumes",

        // Recently Viewed
        recentlyViewed: "Recently Viewed",
        noRecentlyViewed: "You haven't viewed any perfumes yet.",

        // Quiz
        quizTitle: "Discover Your Scent Identity",
        quizDescription: "Let us find the perfect perfume that reflects your soul with just a few simple questions. Are you ready to discover your personal scent preference?",
        quizResultsTitle: "🎉 Your Personalized Recommendations!",
        quizResultsDescription: "Based on your answers, these perfumes match your scent profile:",
        matchPercentage: "{percent}% Match",
        noResults: "We couldn't find a matching perfume. Try the quiz again!",

        // Quiz Questions
        q1: "How would your ideal day go?",
        q1a1: "Sunbathing on the beach",
        q1a2: "Reading by the fireplace",
        q1a3: "A long walk in nature",
        q1a4: "An elegant dinner out",

        q2: "Which scent family describes you best?",
        q2a1: "Freshly cut flowers",
        q2a2: "Freshly squeezed orange juice",
        q2a3: "Mysterious spices and incense",
        q2a4: "Forest after rain",

        q3: "Where would you mostly wear this perfume?",
        q3a1: "Daily, office or school",
        q3a2: "Special occasion or date",
        q3a3: "Anytime, anywhere!",
        q3a4: "Weekend leisure only",

        q4: "Which material appeals to you more?",
        q4a1: "Velvet and silk",
        q4a2: "Leather and wood",
        q4a3: "Crystal and metal",
        q4a4: "Cotton and linen",

        q5: "If you had to choose a color?",
        q5a1: "Gold or champagne",
        q5a2: "Deep burgundy or black",
        q5a3: "Turquoise or ocean blue",
        q5a4: "Pastel pink or lavender",

        q6: "Which setting appeals to you more?",
        q6a1: "A glamorous gala night",
        q6a2: "A quiet library",
        q6a3: "A bustling market",
        q6a4: "A secluded beach",

        q7: "How long should the perfume last?",
        q7a1: "Light and fresh, no trace",
        q7a2: "Medium longevity, balanced",
        q7a3: "Strong and lasting, noticeable",
        q7a4: "Very strong, all day long",

        // Toasts
        addedToFavorites: "Added to favorites!",
        removedFromFavorites: "Removed from favorites.",
        noteSaved: "Your note has been saved!",
        addedToList: 'Added to "{list}"!',
        alreadyInList: "This perfume is already in this list.",
        listCreated: '"{name}" list created!',
        listDeleted: "List deleted.",
        linkCopied: "Link copied!",

        // Footer
        contactUs: "Contact Us:",
        privacyPolicy: "Privacy Policy",
        copyright: "© 2025 Perfume Curator. All rights reserved.",

        // Sidebar
        dailyPerfume: "Perfume of the Day",
        weeklyPicks: "Weekly Picks",
        didYouKnow: "Did You Know?",
        yourStats: "Your Statistics",
        totalSearches: "Total Searches",
        favoritesAdded: "Favorites Added",
        listsCreated: "Lists Created",
        quizzesTaken: "Quizzes Taken",

        // Misc
        loading: "Loading...",
        noResults: "No results found.",
        error: "An error occurred."
    },

    ru: {
        // Header
        appTitle: "Парфюмерный Куратор",
        toggleTheme: "Сменить тему",

        // Navigation
        navHome: "Главная",
        navLists: "Мои списки",

        // Filters
        filtersTitle: "🔍 Фильтры и Поиск",
        searchPlaceholder: "Поиск духов, нот, истории...",
        genderAll: "Все",
        genderFemale: "Женские",
        genderMale: "Мужские",
        genderUnisex: "Унисекс",
        seasonAll: "Все сезоны",
        seasonSpring: "Весна",
        seasonSummer: "Лето",
        seasonAutumn: "Осень",
        seasonWinter: "Зима",
        seasonAllYear: "Круглый год",
        usageAll: "Все случаи",
        usageDay: "Дневной",
        usageNight: "Вечерний",
        usageAlways: "Всегда",
        usageSpecial: "Особый",
        scentAll: "Все типы ароматов",
        filterGender: "Пол",
        filterSeason: "Сезон",
        filterUsage: "Случай",
        filterScentType: "Тип аромата",
        sortAZ: "По имени (А-Я)",
        sortZA: "По имени (Я-А)",
        sortStarDesc: "По рейтингу (высший)",
        sortStarAsc: "По рейтингу (низший)",

        // Buttons
        startSearch: "✨ Начать поиск",
        surpriseMe: "🎲 Удиви меня!",
        findPerfume: "🧬 Найди свой аромат",
        back: "< Назад",
        saveNote: "Сохранить заметку",
        onlineSearch: "🛍️ Искать онлайн",
        close: "Закрыть",
        restartQuiz: "Пройти тест снова",
        backToHome: "На главную",
        startQuiz: "Начать тест",
        createList: "Создать",
        clearHistory: "Очистить",

        // Detail Page
        vibeTitle: "--- Атмосфера ---",
        storyTitle: "--- История ---",
        notesTitle: "--- Ноты ---",
        personalNotesTitle: "--- Мои заметки ---",
        personalNotePlaceholder: "Ваши мысли об этом аромате...",
        topNotes: "ВЕРХНИЕ НОТЫ",
        middleNotes: "СЕРДЕЧНЫЕ НОТЫ",
        baseNotes: "БАЗОВЫЕ НОТЫ",

        // Lists
        myLists: "Мои списки",
        favorites: "Избранное",
        newListPlaceholder: "Название списка...",
        addToList: "Добавить в список",
        perfumeCount: "{count} ароматов",

        // Recently Viewed
        recentlyViewed: "Недавно просмотренные",
        noRecentlyViewed: "Вы ещё не просматривали ароматы.",

        // Quiz
        quizTitle: "Узнай свой аромат",
        quizDescription: "Давайте найдём идеальный аромат, отражающий вашу душу, с помощью нескольких простых вопросов.",
        quizResultsTitle: "🎉 Ваши рекомендации!",
        quizResultsDescription: "На основе ваших ответов, эти ароматы подходят вам:",
        matchPercentage: "{percent}% совпадение",
        noResults: "Мы не нашли подходящий аромат. Попробуйте тест снова!",

        // Quiz Questions
        q1: "Как бы прошёл ваш идеальный день?",
        q1a1: "Загорая на пляже",
        q1a2: "Читая у камина",
        q1a3: "Долгая прогулка на природе",
        q1a4: "Элегантный ужин",

        q2: "Какое семейство ароматов описывает вас лучше?",
        q2a1: "Свежесрезанные цветы",
        q2a2: "Свежевыжатый апельсиновый сок",
        q2a3: "Таинственные специи и ладан",
        q2a4: "Лес после дождя",

        q3: "Где бы вы носили этот аромат?",
        q3a1: "Повседневно, в офисе",
        q3a2: "Особый случай или свидание",
        q3a3: "В любое время, везде!",
        q3a4: "Только на выходных",

        q4: "Какой материал вам больше нравится?",
        q4a1: "Бархат и шёлк",
        q4a2: "Кожа и дерево",
        q4a3: "Кристалл и металл",
        q4a4: "Хлопок и лён",

        q5: "Если бы нужно было выбрать цвет?",
        q5a1: "Золотой или шампань",
        q5a2: "Тёмно-бордовый или чёрный",
        q5a3: "Бирюзовый или морской синий",
        q5a4: "Пастельно-розовый или лавандовый",

        q6: "Какая обстановка вам ближе?",
        q6a1: "Гламурный вечер",
        q6a2: "Тихая библиотека",
        q6a3: "Оживлённый рынок",
        q6a4: "Уединённый пляж",

        q7: "Какая стойкость аромата вам нужна?",
        q7a1: "Лёгкий и свежий",
        q7a2: "Средняя стойкость",
        q7a3: "Сильный и стойкий",
        q7a4: "Очень сильный, на весь день",

        // Toasts
        addedToFavorites: "Добавлено в избранное!",
        removedFromFavorites: "Удалено из избранного.",
        noteSaved: "Заметка сохранена!",
        addedToList: 'Добавлено в "{list}"!',
        alreadyInList: "Этот аромат уже в списке.",
        listCreated: 'Список "{name}" создан!',
        listDeleted: "Список удалён.",
        linkCopied: "Ссылка скопирована!",

        // Footer
        contactUs: "Связаться с нами:",
        privacyPolicy: "Политика конфиденциальности",
        copyright: "© 2025 Парфюмерный Куратор. Все права защищены.",

        // Sidebar
        dailyPerfume: "Аромат дня",
        weeklyPicks: "Выбор недели",
        didYouKnow: "Знаете ли вы?",
        yourStats: "Ваша статистика",
        totalSearches: "Всего поисков",
        favoritesAdded: "Добавлено в избранное",
        listsCreated: "Создано списков",
        quizzesTaken: "Пройдено тестов",

        // Misc
        loading: "Загрузка...",
        noResults: "Ничего не найдено.",
        error: "Произошла ошибка."
    },

    ar: {
        // Header
        appTitle: "مُنسّق العطور",
        toggleTheme: "تغيير المظهر",

        // Navigation
        navHome: "الرئيسية",
        navLists: "قوائمي",

        // Filters
        filtersTitle: "🔍 الفلاتر والبحث",
        searchPlaceholder: "ابحث عن عطر، نوتة، قصة...",
        genderAll: "الكل",
        genderFemale: "نسائي",
        genderMale: "رجالي",
        genderUnisex: "للجنسين",
        seasonAll: "كل المواسم",
        seasonSpring: "الربيع",
        seasonSummer: "الصيف",
        seasonAutumn: "الخريف",
        seasonWinter: "الشتاء",
        seasonAllYear: "طوال السنة",
        usageAll: "كل المناسبات",
        usageDay: "نهاري",
        usageNight: "ليلي",
        usageAlways: "دائماً",
        usageSpecial: "خاص",
        scentAll: "كل أنواع العطور",
        filterGender: "الجنس",
        filterSeason: "الموسم",
        filterUsage: "المناسبة",
        filterScentType: "نوع العطر",
        sortAZ: "بالاسم (أ-ي)",
        sortZA: "بالاسم (ي-أ)",
        sortStarDesc: "بالتقييم (الأعلى)",
        sortStarAsc: "بالتقييم (الأدنى)",

        // Buttons
        startSearch: "✨ ابدأ البحث",
        surpriseMe: "🎲 فاجئني!",
        findPerfume: "🧬 اكتشف عطرك",
        back: "< رجوع",
        saveNote: "حفظ الملاحظة",
        onlineSearch: "🛍️ البحث ومقارنة الأسعار",
        close: "إغلاق",
        restartQuiz: "إعادة الاختبار",
        backToHome: "العودة للرئيسية",
        startQuiz: "ابدأ الاختبار",
        createList: "إنشاء",
        clearHistory: "مسح",

        // Detail Page
        vibeTitle: "--- الأجواء ---",
        storyTitle: "--- القصة ---",
        notesTitle: "--- النوتات ---",
        personalNotesTitle: "--- ملاحظاتي ---",
        personalNotePlaceholder: "أفكارك عن هذا العطر...",
        topNotes: "النوتات العليا",
        middleNotes: "نوتات القلب",
        baseNotes: "النوتات القاعدية",

        // Lists
        myLists: "قوائمي",
        favorites: "المفضلة",
        newListPlaceholder: "اسم القائمة الجديدة...",
        addToList: "إضافة إلى قائمة",
        perfumeCount: "{count} عطور",

        // Recently Viewed
        recentlyViewed: "شوهد مؤخراً",
        noRecentlyViewed: "لم تشاهد أي عطور بعد.",

        // Quiz
        quizTitle: "اكتشف هويتك العطرية",
        quizDescription: "دعنا نجد العطر المثالي الذي يعكس روحك من خلال بضعة أسئلة بسيطة.",
        quizResultsTitle: "🎉 توصياتك الشخصية!",
        quizResultsDescription: "بناءً على إجاباتك، هذه العطور تناسبك:",
        matchPercentage: "{percent}% توافق",
        noResults: "لم نجد عطراً مناسباً. جرب الاختبار مرة أخرى!",

        // Quiz Questions
        q1: "كيف يمضي يومك المثالي؟",
        q1a1: "الاستجمام على الشاطئ",
        q1a2: "القراءة بجانب المدفأة",
        q1a3: "نزهة طويلة في الطبيعة",
        q1a4: "عشاء أنيق",

        q2: "أي عائلة عطرية تصفك أفضل؟",
        q2a1: "الزهور الطازجة",
        q2a2: "عصير البرتقال الطازج",
        q2a3: "التوابل الغامضة والبخور",
        q2a4: "الغابة بعد المطر",

        q3: "أين ستستخدم هذا العطر؟",
        q3a1: "يومياً، في المكتب",
        q3a2: "مناسبة خاصة أو موعد",
        q3a3: "في أي وقت وأي مكان!",
        q3a4: "عطلة نهاية الأسبوع فقط",

        q4: "أي مادة تجذبك أكثر؟",
        q4a1: "المخمل والحرير",
        q4a2: "الجلد والخشب",
        q4a3: "الكريستال والمعدن",
        q4a4: "القطن والكتان",

        q5: "لو اخترت لوناً؟",
        q5a1: "الذهبي أو الشامبانيا",
        q5a2: "العنابي الداكن أو الأسود",
        q5a3: "الفيروزي أو الأزرق البحري",
        q5a4: "الوردي الباستيل أو اللافندر",

        q6: "أي بيئة تجذبك أكثر؟",
        q6a1: "حفلة فاخرة",
        q6a2: "مكتبة هادئة",
        q6a3: "سوق مزدحم",
        q6a4: "شاطئ منعزل",

        q7: "كم تريد أن يدوم العطر؟",
        q7a1: "خفيف ومنعش",
        q7a2: "متوسط الثبات",
        q7a3: "قوي وثابت",
        q7a4: "قوي جداً، طوال اليوم",

        // Toasts
        addedToFavorites: "أُضيف إلى المفضلة!",
        removedFromFavorites: "أُزيل من المفضلة.",
        noteSaved: "تم حفظ ملاحظتك!",
        addedToList: 'أُضيف إلى "{list}"!',
        alreadyInList: "هذا العطر موجود بالفعل في القائمة.",
        listCreated: 'تم إنشاء قائمة "{name}"!',
        listDeleted: "تم حذف القائمة.",
        linkCopied: "تم نسخ الرابط!",

        // Footer
        contactUs: "تواصل معنا:",
        privacyPolicy: "سياسة الخصوصية",
        copyright: "© 2025 مُنسّق العطور. جميع الحقوق محفوظة.",

        // Sidebar
        dailyPerfume: "عطر اليوم",
        weeklyPicks: "اختيارات الأسبوع",
        didYouKnow: "هل تعلم؟",
        yourStats: "إحصائياتك",
        totalSearches: "إجمالي البحث",
        favoritesAdded: "المفضلة المضافة",
        listsCreated: "القوائم المنشأة",
        quizzesTaken: "الاختبارات المكتملة",

        // Misc
        loading: "جاري التحميل...",
        noResults: "لا توجد نتائج.",
        error: "حدث خطأ."
    }
};

// Current language
let currentLanguage = localStorage.getItem('preferredLanguage') || 'tr';

// RTL languages
const rtlLanguages = ['ar'];

/**
 * Get translation for a key
 * @param {string} key - Translation key
 * @param {Object} params - Parameters for interpolation (e.g., {count: 5})
 * @returns {string} Translated string
 */
export function t(key, params = {}) {
    const lang = translations[currentLanguage] || translations.tr;
    let text = lang[key] || translations.tr[key] || key;

    // Interpolate parameters
    Object.keys(params).forEach(param => {
        text = text.replace(`{${param}}`, params[param]);
    });

    return text;
}

/**
 * Set current language
 * @param {string} lang - Language code (tr, en, ru, ar)
 */
export function setLanguage(lang) {
    if (translations[lang]) {
        currentLanguage = lang;
        localStorage.setItem('preferredLanguage', lang);

        // Update document direction for RTL languages
        document.documentElement.dir = rtlLanguages.includes(lang) ? 'rtl' : 'ltr';
        document.documentElement.lang = lang;

        // Dispatch event for UI update
        window.dispatchEvent(new CustomEvent('languageChanged', { detail: { lang } }));
    }
}

/**
 * Get current language
 * @returns {string} Current language code
 */
export function getCurrentLanguage() {
    return currentLanguage;
}

/**
 * Get all available languages
 * @returns {Array} Array of language objects
 */
export function getAvailableLanguages() {
    return [
        { code: 'tr', name: 'Türkçe', flag: '🇹🇷' },
        { code: 'en', name: 'English', flag: '🇬🇧' },
        { code: 'ru', name: 'Русский', flag: '🇷🇺' },
        { code: 'ar', name: 'العربية', flag: '🇸🇦' }
    ];
}

/**
 * Initialize i18n (call on app start)
 */
export function initI18n() {
    const savedLang = localStorage.getItem('preferredLanguage');
    if (savedLang && translations[savedLang]) {
        currentLanguage = savedLang;
    }

    // Set initial direction
    document.documentElement.dir = rtlLanguages.includes(currentLanguage) ? 'rtl' : 'ltr';
    document.documentElement.lang = currentLanguage;
}

/**
 * Translate all elements with data-i18n attribute
 */
export function translatePage() {
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (el.tagName === 'INPUT' && el.placeholder) {
            el.placeholder = t(key);
        } else {
            el.textContent = t(key);
        }
    });
}

export default { t, setLanguage, getCurrentLanguage, getAvailableLanguages, initI18n, translatePage };
