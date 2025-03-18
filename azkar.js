// إضافة وظائف التحكم في النافذة المنبثقة
function createOverlay() {
    const overlay = document.createElement('div');
    overlay.className = 'popup-overlay';
    document.body.appendChild(overlay);
    return overlay;
}

function showCompletionPopup() {
    const overlay = createOverlay();
    const popup = document.createElement('div');
    popup.className = 'completion-popup';
    popup.innerHTML = `
        <i class="fas fa-check-circle"></i>
        <div class="message">تم إتمام الذكر ✅</div>
    `;
    document.body.appendChild(popup);

    setTimeout(() => {
        overlay.classList.add('show');
        popup.classList.add('show');
    }, 100);

    setTimeout(() => {
        overlay.classList.remove('show');
        popup.classList.remove('show');
        setTimeout(() => {
            overlay.remove();
            popup.remove();
        }, 300);
    }, 2000);
}

// تحديث وظيفة إنشاء عنصر الذكر
function createZekrElement(zekr, category) {
    const div = document.createElement('div');
    div.className = 'zekr-card';
    
    const zekrContent = `
        <div class="zekr-text">${zekr.text}</div>
        <div class="zekr-info">
            <div class="zekr-counter">
                <span class="repeat-count">${zekr.count} مرات</span>
                <button class="counter-btn" data-count="0" data-target="${zekr.count}">
                    <i class="fas fa-hand-point-up"></i>
                    <span>ذكر</span>
                </button>
            </div>
        </div>
    `;
    
    div.innerHTML = zekrContent;
    
    // إضافة معالج الحدث للزر
    const button = div.querySelector('.counter-btn');
    button.addEventListener('click', function() {
        handleCounterClick(this);
    });
    
    return div;
}

// تحديث وظيفة معالجة النقر على الزر
function handleCounterClick(button) {
    if (button.disabled) return;

    button.classList.add('clicked');
    setTimeout(() => button.classList.remove('clicked'), 200);

    const currentCount = parseInt(button.dataset.count) || 0;
    const targetCount = parseInt(button.dataset.target);
    const newCount = currentCount + 1;
    
    button.dataset.count = newCount;

    if (newCount >= targetCount) {
        button.disabled = true;
        button.classList.add('completed');
        button.innerHTML = '<i class="fas fa-check"></i><span>تم</span>';
        showCompletionPopup();
    } else {
        const remaining = targetCount - newCount;
        button.innerHTML = `<i class="fas fa-hand-point-up"></i><span>متبقي ${remaining}</span>`;
    }
}

// تهيئة القائمة الجانبية
const toggleBtn = document.querySelector('.toggle-sidebar');
const sidebar = document.querySelector('.sidebar');

toggleBtn.addEventListener('click', () => {
    sidebar.classList.toggle('active');
});

// إغلاق القائمة عند النقر خارجها
document.addEventListener('click', (event) => {
    if (!sidebar.contains(event.target) && !toggleBtn.contains(event.target) && sidebar.classList.contains('active')) {
        sidebar.classList.remove('active');
    }
});

// تبديل بين أقسام الأذكار
const tabButtons = document.querySelectorAll('.tab-btn');
const azkarSections = document.querySelectorAll('.azkar-content');

tabButtons.forEach(button => {
    button.addEventListener('click', () => {
        tabButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
        
        azkarSections.forEach(section => {
            section.style.display = 'none';
        });
        
        const targetSection = document.getElementById(button.dataset.tab);
        if (targetSection) {
            targetSection.style.display = 'block';
        }
    });
});

// عرض الأذكار عند تحميل الصفحة
function displayAzkar() {
    const containers = {
        morning: document.getElementById('morning-azkar'),
        evening: document.getElementById('evening-azkar'),
        sleep: document.getElementById('sleep-azkar'),
        prayer: document.getElementById('prayer-azkar')
    };

    // تنظيف المحتوى الحالي
    Object.values(containers).forEach(container => {
        if (container) container.innerHTML = '';
    });

    // إضافة الأذكار لكل قسم
    Object.entries(azkarData).forEach(([category, list]) => {
        const container = containers[category];
        if (container) {
            list.forEach(zekr => {
                const zekrElement = createZekrElement(zekr, category);
                container.appendChild(zekrElement);
            });
        }
    });
}

// تحميل الأذكار عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', displayAzkar);