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

let currentReciter = 'abdulbasit';
let currentSurah = 1;
const audio = document.getElementById('quran-player');
const surahList = document.querySelector('.surah-list');
const prevButton = document.getElementById('prev-surah');
const nextButton = document.getElementById('next-surah');

// Initialize surah list
function initializeSurahList() {
    surahs.forEach((surah, index) => {
        const surahDiv = document.createElement('div');
        surahDiv.className = 'surah-item';
        surahDiv.textContent = `${index + 1}. ${surah}`;
        surahDiv.addEventListener('click', () => {
            currentSurah = index + 1;
            playSurah();
            updateActiveSurah();
        });
        surahList.appendChild(surahDiv);
    });
}

// Update active surah highlight
function updateActiveSurah() {
    document.querySelectorAll('.surah-item').forEach((item, index) => {
        item.classList.toggle('active', index + 1 === currentSurah);
    });
}

// Play current surah
function playSurah() {
    const surahNumber = currentSurah.toString().padStart(3, '0');
    audio.src = `audio/${currentReciter}/${surahNumber}.mp3`;
    audio.play();
    updateActiveSurah();
}

// Initialize reciter selection
document.querySelectorAll('.reciter').forEach(reciter => {
    reciter.addEventListener('click', () => {
        currentReciter = reciter.dataset.reciter;
        playSurah();
    });
});

// Previous and Next buttons
prevButton.addEventListener('click', () => {
    if (currentSurah > 1) {
        currentSurah--;
        playSurah();
    }
});

nextButton.addEventListener('click', () => {
    if (currentSurah < 114) {
        currentSurah++;
        playSurah();
    }
});

// Auto-play next surah when current one ends
audio.addEventListener('ended', () => {
    if (currentSurah < 114) {
        currentSurah++;
        playSurah();
    }
});

// Initialize the application
initializeSurahList();
updateActiveSurah();