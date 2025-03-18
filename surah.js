// الحصول على رقم السورة من URL
const urlParams = new URLSearchParams(window.location.search);
const surahNumber = urlParams.get('number');

// تهيئة القائمة الجانبية
const toggleBtn = document.querySelector('.toggle-sidebar');
const sidebar = document.querySelector('.sidebar');

toggleBtn.addEventListener('click', function() {
    sidebar.classList.toggle('active');
});

document.addEventListener('click', function(event) {
    if (!sidebar.contains(event.target) && !toggleBtn.contains(event.target) && sidebar.classList.contains('active')) {
        sidebar.classList.remove('active');
    }
});

// تحميل بيانات السورة عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', async () => {
    if (surahNumber) {
        await loadSurah(surahNumber);
    }

    // التنقل بين السور
    document.getElementById('prev-page').addEventListener('click', () => {
        if (surahNumber > 1) {
            window.location.href = `surah.html?number=${parseInt(surahNumber) - 1}`;
        }
    });

    document.getElementById('next-page').addEventListener('click', () => {
        if (surahNumber < 114) {
            window.location.href = `surah.html?number=${parseInt(surahNumber) + 1}`;
        }
    });
});

// إضافة خيارات التحكم في القراءة
const toolbar = document.createElement('div');
toolbar.className = 'surah-toolbar';
toolbar.innerHTML = `
    <div class="toolbar-controls">
        <button id="fontSize-decrease" title="تصغير الخط">
            <i class="fas fa-minus"></i>
        </button>
        <button id="fontSize-increase" title="تكبير الخط">
            <i class="fas fa-plus"></i>
        </button>
        <button id="copy-ayah" title="نسخ الآية">
            <i class="fas fa-copy"></i>
        </button>
        <button id="share-ayah" title="مشاركة الآية">
            <i class="fas fa-share-alt"></i>
        </button>
        <button id="play-ayah" title="استماع للآية">
            <i class="fas fa-play"></i>
        </button>
    </div>
`;
document.querySelector('.surah-header').appendChild(toolbar);

// تكبير وتصغير حجم الخط
let currentFontSize = 1.2; // الحجم الافتراضي
const fontSizeStep = 0.1;
const maxFontSize = 2.0;
const minFontSize = 0.8;

document.getElementById('fontSize-increase').addEventListener('click', () => {
    if (currentFontSize < maxFontSize) {
        currentFontSize += fontSizeStep;
        updateFontSize();
    }
});

document.getElementById('fontSize-decrease').addEventListener('click', () => {
    if (currentFontSize > minFontSize) {
        currentFontSize -= fontSizeStep;
        updateFontSize();
    }
});

function updateFontSize() {
    document.querySelectorAll('.ayah-text').forEach(ayah => {
        ayah.style.fontSize = `${currentFontSize}rem`;
    });
    localStorage.setItem('surahFontSize', currentFontSize);
}

// استعادة حجم الخط المحفوظ
const savedFontSize = localStorage.getItem('surahFontSize');
if (savedFontSize) {
    currentFontSize = parseFloat(savedFontSize);
    updateFontSize();
}

// نسخ ومشاركة الآيات
document.addEventListener('click', (e) => {
    const ayahElement = e.target.closest('.ayah');
    if (!ayahElement) return;

    const toolbar = document.querySelector('.surah-toolbar');
    const ayahText = ayahElement.querySelector('.ayah-text').textContent;
    const ayahNumber = ayahElement.querySelector('.ayah-number').textContent;
    const surahName = document.querySelector('.surah-title').textContent;
    
    toolbar.querySelector('#copy-ayah').onclick = async () => {
        try {
            await navigator.clipboard.writeText(`${ayahText} [${surahName}: ${ayahNumber}]`);
            showNotification('تم نسخ الآية بنجاح');
        } catch (err) {
            showNotification('حدث خطأ أثناء نسخ الآية', 'error');
        }
    };
    
    toolbar.querySelector('#share-ayah').onclick = () => {
        if (navigator.share) {
            navigator.share({
                title: surahName,
                text: `${ayahText} [${surahName}: ${ayahNumber}]`,
                url: window.location.href
            }).catch(console.error);
        } else {
            showNotification('متصفحك لا يدعم مشاركة المحتوى', 'error');
        }
    };
});

// إضافة الإشعارات
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.classList.add('show');
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }, 2000);
    }, 100);
}

// مشغل الصوت للآيات
let audioPlayer = null;

document.getElementById('play-ayah').addEventListener('click', async () => {
    const activeAyah = document.querySelector('.ayah.active');
    if (!activeAyah) return;

    const ayahNumber = activeAyah.querySelector('.ayah-number').textContent;
    const audioUrl = `https://api.alquran.cloud/v1/ayah/${surahNumber}:${ayahNumber}/audio`;

    try {
        const response = await fetch(audioUrl);
        const data = await response.json();
        
        if (data.code === 200) {
            if (audioPlayer) {
                audioPlayer.pause();
            }
            
            audioPlayer = new Audio(data.data.audio);
            audioPlayer.play();
        }
    } catch (error) {
        showNotification('حدث خطأ أثناء تشغيل الصوت', 'error');
    }
});

// إضافة التأثير النشط عند النقر على آية
document.addEventListener('click', (e) => {
    const ayahElement = e.target.closest('.ayah');
    if (!ayahElement) return;

    document.querySelectorAll('.ayah').forEach(ayah => {
        ayah.classList.remove('active');
    });
    ayahElement.classList.add('active');
});

async function loadSurah(surahNumber) {
    try {
        const response = await fetch(`https://api.alquran.cloud/v1/surah/${surahNumber}`);
        const data = await response.json();
        
        document.querySelector('.surah-title').textContent = data.data.name;
        document.querySelector('.surah-type').textContent = `النوع: ${data.data.revelationType === 'Meccan' ? 'مكية' : 'مدنية'}`;
        document.querySelector('.ayah-count').textContent = `عدد الآيات: ${data.data.numberOfAyahs}`;
        
        const ayatContainer = document.querySelector('.ayat-container');
        ayatContainer.innerHTML = '';
        
        // إضافة البسملة إلا لسورة التوبة
        if (surahNumber !== 9) {
            const bismillah = document.createElement('div');
            bismillah.className = 'bismillah';
            bismillah.textContent = 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ';
            ayatContainer.appendChild(bismillah);
        }
        
        // إضافة الآيات
        let currentLine = document.createElement('div');
        currentLine.className = 'ayah-line';
        ayatContainer.appendChild(currentLine);

        data.data.ayahs.forEach((ayah) => {
            const ayahSpan = document.createElement('span');
            ayahSpan.className = 'ayah';
            
            const textSpan = document.createElement('span');
            textSpan.className = 'ayah-text';
            textSpan.textContent = ayah.text;
            
            const numberSpan = document.createElement('span');
            numberSpan.className = 'ayah-number';
            numberSpan.textContent = ayah.numberInSurah;
            
            ayahSpan.appendChild(textSpan);
            ayahSpan.appendChild(numberSpan);
            currentLine.appendChild(ayahSpan);
        });

    } catch (error) {
        console.error('Error loading surah:', error);
        document.querySelector('.ayat-container').innerHTML = `
            <div class="error">
                عذراً، حدث خطأ أثناء تحميل السورة. يرجى المحاولة مرة أخرى.
            </div>
        `;
    }
}