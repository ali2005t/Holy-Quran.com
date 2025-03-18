// تحقق مما إذا كانت هذه هي الصفحة الرئيسية
function isHomePage() {
    return window.location.pathname === '/' || window.location.pathname.endsWith('index.html');
}

// تفعيل/تعطيل الوضع الليلي
function toggleDarkMode() {
    const isDarkMode = localStorage.getItem('darkMode') === 'enabled';
    if (isDarkMode) {
        disableDarkMode();
    } else {
        enableDarkMode();
    }
}

// تفعيل الوضع الليلي
function enableDarkMode() {
    document.body.classList.add('dark-mode');
    localStorage.setItem('darkMode', 'enabled');
    if (document.getElementById('dark-mode-toggle')) {
        document.getElementById('dark-mode-toggle').checked = true;
    }
}

// تعطيل الوضع الليلي
function disableDarkMode() {
    document.body.classList.remove('dark-mode');
    localStorage.setItem('darkMode', 'disabled');
    if (document.getElementById('dark-mode-toggle')) {
        document.getElementById('dark-mode-toggle').checked = false;
    }
}

// تحديث اتجاه وترجمة الصفحة
function updateLanguageSettings() {
    const lang = localStorage.getItem('language') || 'ar';
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';

    if (typeof updateTranslations === 'function') {
        updateTranslations();
    }
}

// تحقق من حالة الوضع الليلي عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', () => {
    if (localStorage.getItem('darkMode') === 'enabled') {
        enableDarkMode();
    }

    // إضافة مستمع الحدث لزر تبديل الوضع الليلي
    const darkModeToggle = document.getElementById('dark-mode-toggle');
    if (darkModeToggle) {
        darkModeToggle.addEventListener('change', toggleDarkMode);
    }

    // تحديث إعدادات اللغة
    updateLanguageSettings();
});

// التحقق من حالة الوضع الليلي المحفوظة
if (localStorage.getItem('darkMode') === 'enabled') {
    document.body.classList.add('dark-mode');
}

// تحديث الوضع الليلي عند تغيير الإعداد في نافذة أخرى
window.addEventListener('storage', (e) => {
    if (e.key === 'darkMode') {
        if (e.newValue === 'enabled') {
            enableDarkMode();
        } else {
            disableDarkMode();
        }
    } else if (e.key === 'language') {
        updateLanguageSettings();
    }
});

// تصدير الدوال للاستخدام في الملفات الأخرى
window.darkMode = {
    enable: enableDarkMode,
    disable: disableDarkMode,
    toggle: toggleDarkMode,
    isEnabled: () => document.body.classList.contains('dark-mode')
};