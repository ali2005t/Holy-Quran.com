const surahs = [
    "الفاتحة", "البقرة", "آل عمران", "النساء", "المائدة", "الأنعام", "الأعراف", "الأنفال", "التوبة", "يونس",
    "هود", "يوسف", "الرعد", "إبراهيم", "الحجر", "النحل", "الإسراء", "الكهف", "مريم", "طه",
    "الأنبياء", "الحج", "المؤمنون", "النور", "الفرقان", "الشعراء", "النمل", "القصص", "العنكبوت", "الروم",
    "لقمان", "السجدة", "الأحزاب", "سبأ", "فاطر", "يس", "الصافات", "ص", "الزمر", "غافر",
    "فصلت", "الشورى", "الزخرف", "الدخان", "الجاثية", "الأحقاف", "محمد", "الفتح", "الحجرات", "ق",
    "الذاريات", "الطور", "النجم", "القمر", "الرحمن", "الواقعة", "الحديد", "المجادلة", "الحشر", "الممتحنة",
    "الصف", "الجمعة", "المنافقون", "التغابن", "الطلاق", "التحريم", "الملك", "القلم", "الحاقة", "المعارج",
    "نوح", "الجن", "المزمل", "المدثر", "القيامة", "الإنسان", "المرسلات", "النبأ", "النازعات", "عبس",
    "التكوير", "الانفطار", "المطففين", "الانشقاق", "البروج", "الطارق", "الأعلى", "الغاشية", "الفجر", "البلد",
    "الشمس", "الليل", "الضحى", "الشرح", "التين", "العلق", "القدر", "البينة", "الزلزلة", "العاديات",
    "القارعة", "التكاثر", "العصر", "الهمزة", "الفيل", "قريش", "الماعون", "الكوثر", "الكافرون", "النصر",
    "المسد", "الإخلاص", "الفلق", "الناس"
];

document.addEventListener('DOMContentLoaded', () => {
    loadSurahs();
    setupSearchFunctionality();
    setupSidebar();
});

function setupSidebar() {
    const toggleBtn = document.querySelector('.toggle-sidebar');
    const sidebar = document.querySelector('.sidebar');
    
    toggleBtn.addEventListener('click', () => {
        sidebar.classList.toggle('active');
    });

    document.addEventListener('click', (event) => {
        if (!sidebar.contains(event.target) && !toggleBtn.contains(event.target) && sidebar.classList.contains('active')) {
            sidebar.classList.remove('active');
        }
    });
}

async function loadSurahs() {
    try {
        const container = document.querySelector('.surahs-grid');
        let html = '';
        
        for (let i = 0; i < surahs.length; i++) {
            html += `
                <a href="surah.html?number=${i + 1}" class="surah-card">
                    <div class="surah-header">
                        <div class="surah-number">${i + 1}</div>
                        <div class="surah-name">${surahs[i]}</div>
                    </div>
                </a>
            `;
        }
        
        container.innerHTML = html;
    } catch (error) {
        console.error('Error loading surahs:', error);
        document.querySelector('.surahs-grid').innerHTML = `
            <div class="error-message">
                عذراً، حدث خطأ أثناء تحميل السور. يرجى المحاولة مرة أخرى.
            </div>
        `;
    }
}

function setupSearchFunctionality() {
    const searchInput = document.getElementById('surah-search');
    const searchIcon = document.querySelector('.search-icon');
    
    searchInput.addEventListener('input', (e) => {
        const value = e.target.value.toLowerCase();
        const cards = document.querySelectorAll('.surah-card');
        
        cards.forEach((card, index) => {
            const name = surahs[index].toLowerCase();
            const number = (index + 1).toString();
            card.style.display = name.includes(value) || number.includes(value) ? 'flex' : 'none';
        });
        
        searchIcon.style.opacity = value.length > 0 ? '1' : '0.7';
    });

    searchInput.addEventListener('search', () => {
        const cards = document.querySelectorAll('.surah-card');
        cards.forEach(card => card.style.display = 'flex');
        searchIcon.style.opacity = '0.7';
    });
}