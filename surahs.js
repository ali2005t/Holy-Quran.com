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

const reciterNames = {
    'abdulbasit': 'عبد الباسط عبد الصمد',
    'khaled': 'خالد الجليل',
    'maher': 'ماهر المعيقلي',
    'mishari': 'مشاري العفاسي',
    'nasser': 'ناصر القطامي',
    'yasser': 'ياسر الدوسري'
};

let currentSurah = 1;
const urlParams = new URLSearchParams(window.location.search);
const currentReciter = urlParams.get('reciter') || 'abdulbasit';

// تهيئة القائمة الجانبية
const sidebarToggle = document.getElementById('sidebarToggle');
const sidebar = document.querySelector('.sidebar');

function initializeSidebar() {
    // فتح وإغلاق القائمة الجانبية
    sidebarToggle.addEventListener('click', (e) => {
        e.stopPropagation();
        sidebar.classList.toggle('active');
    });

    // إغلاق القائمة عند النقر خارجها
    document.addEventListener('click', (e) => {
        if (!sidebar.contains(e.target) && !sidebarToggle.contains(e.target)) {
            sidebar.classList.remove('active');
        }
    });

    // منع إغلاق القائمة عند النقر داخلها
    sidebar.addEventListener('click', (e) => {
        e.stopPropagation();
    });
}

// Set reciter image and name in header
document.getElementById('reciter-name').textContent = reciterNames[currentReciter];
document.getElementById('reciter-image').src = `images/${currentReciter}.png`;

const audio = document.getElementById('quran-player');
const surahList = document.querySelector('.surah-list');
const prevButton = document.getElementById('prev-surah');
const nextButton = document.getElementById('next-surah');
const searchInput = document.getElementById('surah-search');
const currentSurahName = document.getElementById('current-surah-name');
const playPauseButton = document.getElementById('play-pause');
const progressBar = document.querySelector('.progress');
const currentTimeDisplay = document.getElementById('current-time');
const durationDisplay = document.getElementById('duration');
const surahMetaInfo = document.getElementById('surah-meta');
let isPlaying = false;

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

// Search functionality
searchInput.addEventListener('input', (e) => {
    const searchTerm = e.target.value.trim();
    document.querySelectorAll('.surah-item').forEach((item, index) => {
        const surahName = surahs[index];
        const shouldShow = surahName.includes(searchTerm) || 
                          (index + 1).toString().includes(searchTerm);
        item.style.display = shouldShow ? 'flex' : 'none';
    });
});

// Update current surah info
function updateCurrentSurahInfo() {
    currentSurahName.textContent = `سورة ${surahs[currentSurah - 1]}`;
    surahMetaInfo.textContent = `القارئ: ${reciterNames[currentReciter]}`;
}

// Play current surah
function playSurah() {
    const surahNumber = currentSurah.toString().padStart(3, '0');
    audio.src = `audio/${currentReciter}/${surahNumber}.mp3`;
    playAudio();
    updateActiveSurah();
    updateCurrentSurahInfo();
    progressBar.style.width = '0%';
}

// وظائف التشغيل والإيقاف
function playAudio() {
    audio.play();
    isPlaying = true;
    playPauseButton.innerHTML = '<i class="fas fa-pause"></i>';
}

function pauseAudio() {
    audio.pause();
    isPlaying = false;
    playPauseButton.innerHTML = '<i class="fas fa-play"></i>';
}

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
    } else {
        pauseAudio();
    }
});

// إضافة مستمع لزر التشغيل/الإيقاف
playPauseButton.addEventListener('click', () => {
    if (isPlaying) {
        pauseAudio();
    } else {
        playAudio();
    }
});

// إضافة مستمع لتحديث حالة الزر عند التوقف
audio.addEventListener('pause', () => {
    pauseAudio();
});

audio.addEventListener('play', () => {
    playAudio();
});

// تحديث شريط التقدم والوقت
function updateProgress() {
    const duration = audio.duration;
    const currentTime = audio.currentTime;
    const progress = (currentTime / duration) * 100;
    progressBar.style.width = progress + '%';
    
    currentTimeDisplay.textContent = formatTime(currentTime);
    durationDisplay.textContent = formatTime(duration);
}

// تنسيق الوقت
function formatTime(seconds) {
    if (isNaN(seconds)) return "00:00";
    const minutes = Math.floor(seconds / 60);
    seconds = Math.floor(seconds % 60);
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

// إضافة مستمعي الأحداث للصوت
audio.addEventListener('timeupdate', updateProgress);
audio.addEventListener('loadedmetadata', () => {
    durationDisplay.textContent = formatTime(audio.duration);
});

// تهيئة التطبيق
document.addEventListener('DOMContentLoaded', () => {
    initializeSidebar();
    initializeSurahList();
    updateActiveSurah();
    updateCurrentSurahInfo();
});