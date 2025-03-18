// تهيئة المتغيرات
const cityNameElement = document.getElementById('city-name');
const dateElement = document.getElementById('date');
const getLocationBtn = document.getElementById('get-location');
const prayerTimesElements = {
    fajr: document.getElementById('fajr-time'),
    sunrise: document.getElementById('sunrise-time'),
    dhuhr: document.getElementById('dhuhr-time'),
    asr: document.getElementById('asr-time'),
    maghrib: document.getElementById('maghrib-time'),
    isha: document.getElementById('isha-time')
};
const nextPrayerName = document.getElementById('next-prayer-name');
const nextPrayerTime = document.getElementById('next-prayer-time');
const timeRemaining = document.getElementById('time-remaining');

// تحويل أسماء الصلوات إلى العربية
const prayerNamesArabic = {
    'Fajr': 'الفجر',
    'Sunrise': 'الشروق',
    'Dhuhr': 'الظهر',
    'Asr': 'العصر',
    'Maghrib': 'المغرب',
    'Isha': 'العشاء'
};

// تهيئة متغيرات مواقيت الصلاة
let prayerTimes = {};
let currentLocation = null;
let updateInterval;

// دالة لتحديث التاريخ
function updateDate() {
    const now = new Date();
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const lang = localStorage.getItem('language') || 'ar';
    dateElement.textContent = now.toLocaleDateString(lang === 'ar' ? 'ar-SA' : 'en-US', options);
}

// تحديث التوقيت المتبقي للصلاة القادمة
function updateNextPrayer() {
    const now = new Date();
    const currentTime = now.getTime();
    const prayers = {
        'الفجر': convertToDateObject(prayerTimes.Fajr),
        'الشروق': convertToDateObject(prayerTimes.Sunrise),
        'الظهر': convertToDateObject(prayerTimes.Dhuhr),
        'العصر': convertToDateObject(prayerTimes.Asr),
        'المغرب': convertToDateObject(prayerTimes.Maghrib),
        'العشاء': convertToDateObject(prayerTimes.Isha)
    };

    let nextPrayer = null;
    let nextPrayerTime = null;

    // البحث عن الصلاة القادمة
    for (const [prayer, time] of Object.entries(prayers)) {
        if (time.getTime() > currentTime) {
            nextPrayer = prayer;
            nextPrayerTime = time;
            break;
        }
    }

    // إذا لم يتم العثور على صلاة اليوم، نأخذ أول صلاة في اليوم التالي
    if (!nextPrayer) {
        nextPrayer = 'الفجر';
        nextPrayerTime = new Date(convertToDateObject(prayerTimes.Fajr));
        nextPrayerTime.setDate(nextPrayerTime.getDate() + 1);
    }

    // تحديث واجهة المستخدم
    document.getElementById('next-prayer-name').textContent = nextPrayer;
    document.getElementById('next-prayer-time').textContent = 
        formatTime(nextPrayerTime.toTimeString().slice(0, 5));

    // حساب الوقت المتبقي
    const timeDiff = nextPrayerTime.getTime() - currentTime;
    const hours = Math.floor(timeDiff / (1000 * 60 * 60));
    const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));

    // تنسيق العرض بالعربية
    const timeRemainingText = hours > 0 ? 
        `متبقي ${hours} ساعة و ${minutes} دقيقة` : 
        `متبقي ${minutes} دقيقة`;
    
    document.getElementById('time-remaining').textContent = timeRemainingText;

    // إضافة تأثيرات بصرية عندما يقترب وقت الصلاة
    if (hours === 0 && minutes <= 15) {
        document.querySelector('.next-prayer').classList.add('prayer-soon');
    } else {
        document.querySelector('.next-prayer').classList.remove('prayer-soon');
    }
}

// دالة مساعدة لتحويل وقت الصلاة إلى كائن Date
function convertToDateObject(timeStr) {
    const today = new Date();
    const [hours, minutes] = timeStr.split(':');
    return new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate(),
        parseInt(hours),
        parseInt(minutes)
    );
}

// تنسيق الوقت بالصيغة العربية
function formatTime(timeStr) {
    const [hours, minutes] = timeStr.split(':');
    const time = new Date();
    time.setHours(parseInt(hours));
    time.setMinutes(parseInt(minutes));
    
    return time.toLocaleTimeString('ar-SA', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
    });
}

// الحصول على مواقيت الصلاة من API
async function fetchPrayerTimes(latitude, longitude) {
    try {
        const date = new Date();
        const response = await fetch(
            `https://api.aladhan.com/v1/timings/${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}?` +
            `latitude=${latitude}&longitude=${longitude}&method=4`
        );
        const data = await response.json();
        
        if (data.code === 200) {
            prayerTimes = data.data.timings;
            
            // تحديث واجهة المستخدم
            document.getElementById('fajr-time').textContent = formatTime(prayerTimes.Fajr);
            document.getElementById('sunrise-time').textContent = formatTime(prayerTimes.Sunrise);
            document.getElementById('dhuhr-time').textContent = formatTime(prayerTimes.Dhuhr);
            document.getElementById('asr-time').textContent = formatTime(prayerTimes.Asr);
            document.getElementById('maghrib-time').textContent = formatTime(prayerTimes.Maghrib);
            document.getElementById('isha-time').textContent = formatTime(prayerTimes.Isha);

            updateNextPrayer();
            
            // بدء التحديث التلقائي
            if (updateInterval) clearInterval(updateInterval);
            updateInterval = setInterval(updateNextPrayer, 30000); // تحديث كل 30 ثانية
        }
    } catch (error) {
        console.error('Error fetching prayer times:', error);
        showNotification('حدث خطأ في جلب مواقيت الصلاة', 'error');
    }
}

// الحصول على الموقع الحالي
function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            async (position) => {
                currentLocation = {
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude
                };

                // الحصول على اسم المدينة
                try {
                    const response = await fetch(
                        `https://nominatim.openstreetmap.org/reverse?lat=${currentLocation.latitude}&lon=${currentLocation.longitude}&format=json`
                    );
                    const data = await response.json();
                    document.getElementById('city-name').textContent = data.address.city || data.address.town || data.address.state;
                } catch (error) {
                    console.error('Error fetching city name:', error);
                }

                // تحديث التاريخ
                const date = new Date();
                document.getElementById('date').textContent = date.toLocaleDateString('ar-SA', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                });

                await fetchPrayerTimes(currentLocation.latitude, currentLocation.longitude);
                showNotification('تم تحديث مواقيت الصلاة');
            },
            (error) => {
                console.error('Error getting location:', error);
                showNotification('لم نتمكن من تحديد موقعك', 'error');
            }
        );
    } else {
        showNotification('متصفحك لا يدعم تحديد الموقع', 'error');
    }
}

// إضافة الإشعارات المحسنة
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <div class="notification-icon">
            <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
        </div>
        <div class="notification-message">${message}</div>
    `;
    
    document.body.appendChild(notification);
    
    requestAnimationFrame(() => {
        notification.classList.add('show');
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }, 2000);
    });
}

// إعداد أحداث الصفحة
document.addEventListener('DOMContentLoaded', () => {
    // زر تحديد الموقع
    document.getElementById('get-location').addEventListener('click', getLocation);
    
    // تحديث تلقائي عند تحميل الصفحة
    getLocation();

    // تفعيل إشعارات مواقيت الصلاة
    if ('Notification' in window) {
        Notification.requestPermission();
    }
});

// تنظيف عند مغادرة الصفحة
window.addEventListener('beforeunload', () => {
    if (updateInterval) {
        clearInterval(updateInterval);
    }
});