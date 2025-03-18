// تهيئة عناصر الصفحة
const languageSelect = document.getElementById('language-select');
const toggleBtn = document.querySelector('.toggle-sidebar');
const sidebar = document.querySelector('.sidebar');

// تحديد اللغة المحفوظة
const currentLang = localStorage.getItem('language') || 'ar';
languageSelect.value = currentLang;
document.documentElement.lang = currentLang;
document.documentElement.dir = currentLang === 'ar' ? 'rtl' : 'ltr';

// تفعيل/تعطيل القائمة الجانبية
toggleBtn.addEventListener('click', () => {
    sidebar.classList.toggle('active');
});

// تغيير اللغة
languageSelect.addEventListener('change', (e) => {
    const lang = e.target.value;
    localStorage.setItem('language', lang);
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    updateTranslations();
});

// تحديث الترجمات في الصفحة
function updateTranslations() {
    const lang = localStorage.getItem('language') || 'ar';
    const elements = document.querySelectorAll('[data-translate]');
    
    elements.forEach(element => {
        const key = element.getAttribute('data-translate');
        if (translations[lang] && translations[lang][key]) {
            element.textContent = translations[lang][key];
        }
    });
}

// تحديث الترجمات عند تحميل الصفحة
updateTranslations();