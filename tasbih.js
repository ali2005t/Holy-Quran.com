let count = 0;
let currentBeadIndex = 0;
const dhikrAudio = new Audio('audio/click.mp3');
let isAnimating = false;

const counter = document.getElementById('counter');
const countBtn = document.getElementById('count-btn');
const dhikrBtns = document.querySelectorAll('.dhikr-btn');
const beads = document.querySelectorAll('.bead');

// تحديث العداد والخرز
function updateCounter() {
    if (isAnimating) return;
    isAnimating = true;

    count++;
    counter.textContent = count;

    // إزالة التنشيط من جميع الخرز
    beads.forEach(bead => {
        bead.classList.remove('active');
        bead.classList.remove('counting');
    });

    // تنشيط الخرزة الحالية
    const currentBead = beads[currentBeadIndex];
    currentBead.classList.add('active');
    currentBead.classList.add('counting');

    // تشغيل صوت النقر
    dhikrAudio.currentTime = 0;
    dhikrAudio.play().catch(console.error);

    // تحريك إلى الخرزة التالية
    currentBeadIndex = (currentBeadIndex + 1) % beads.length;

    // اهتزاز عند كل 33
    if (count % 33 === 0) {
        navigator.vibrate && navigator.vibrate(100);
    }

    setTimeout(() => {
        currentBead.classList.remove('counting');
        isAnimating = false;
    }, 300);
}

// زر العد
countBtn.addEventListener('click', () => {
    countBtn.classList.add('clicked');
    setTimeout(() => countBtn.classList.remove('clicked'), 200);
    updateCounter();
});

// أزرار التسبيح
dhikrBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        dhikrBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        // إعادة تعيين العداد والخرز
        count = 0;
        currentBeadIndex = 0;
        counter.textContent = '0';
        beads.forEach(bead => {
            bead.classList.remove('active', 'counting');
        });
    });
});

// دعم لوحة المفاتيح
document.addEventListener('keydown', (e) => {
    if (e.code === 'Space') {
        e.preventDefault();
        countBtn.click();
    }
});

// دعم الأجهزة المحمولة
let touchStartY = 0;
document.addEventListener('touchstart', (e) => {
    touchStartY = e.touches[0].clientY;
});

document.addEventListener('touchend', (e) => {
    const touchEndY = e.changedTouches[0].clientY;
    const deltaY = touchEndY - touchStartY;
    
    if (Math.abs(deltaY) > 50) {
        updateCounter();
    }
});