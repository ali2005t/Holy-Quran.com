// موقع الكعبة المشرفة
const KAABA_LAT = 21.422487;
const KAABA_LNG = 39.826206;

let userLat = null;
let userLng = null;
let qiblaDirection = 0;

// عناصر DOM
const northDegrees = document.getElementById('north-degrees');
const qiblaDegrees = document.getElementById('qibla-degrees');
const compassArrow = document.querySelector('.compass-arrow');
const qiblaArrow = document.querySelector('.qibla-arrow');
const locationError = document.getElementById('location-error');
const compassError = document.getElementById('compass-error');
const calibrateBtn = document.querySelector('.calibrate-btn');

// تحويل الزوايا من راديان إلى درجات
function toDegrees(rad) {
    return rad * (180 / Math.PI);
}

// تحويل الدرجات إلى راديان
function toRadians(deg) {
    return deg * (Math.PI / 180);
}

// حساب اتجاه القبلة
function calculateQiblaDirection(userLat, userLng) {
    const φ1 = toRadians(userLat);
    const φ2 = toRadians(KAABA_LAT);
    const Δλ = toRadians(KAABA_LNG - userLng);

    const y = Math.sin(Δλ);
    const x = Math.cos(φ1) * Math.tan(φ2) - Math.sin(φ1) * Math.cos(Δλ);
    let qibla = toDegrees(Math.atan2(y, x));

    // تحويل الزاوية إلى اتجاه البوصلة (360 درجة)
    qibla = (qibla + 360) % 360;
    return qibla;
}

// تحديث اتجاه البوصلة والقبلة
function updateCompass(heading) {
    // تحديث البوصلة
    compassArrow.style.transform = `translate(-50%, -100%) rotate(${heading}deg)`;
    northDegrees.textContent = `${Math.round(heading)}°`;

    // تحديث سهم القبلة
    if (qiblaDirection !== null) {
        const qiblaAngle = (qiblaDirection - heading + 360) % 360;
        qiblaArrow.style.transform = `translate(-50%, -100%) rotate(${qiblaAngle}deg)`;
        qiblaDegrees.textContent = `${Math.round(qiblaAngle)}°`;
    }
}

// الحصول على موقع المستخدم
function getUserLocation() {
    if ('geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                userLat = position.coords.latitude;
                userLng = position.coords.longitude;
                qiblaDirection = calculateQiblaDirection(userLat, userLng);
                locationError.style.display = 'none';
            },
            () => {
                locationError.style.display = 'block';
            }
        );
    } else {
        locationError.style.display = 'block';
    }
}

// بدء تتبع اتجاه البوصلة
function startCompass() {
    if ('DeviceOrientationEvent' in window) {
        window.addEventListener('deviceorientationabsolute', (event) => {
            let heading;
            if (event.webkitCompassHeading) {
                // نظام iOS
                heading = event.webkitCompassHeading;
            } else {
                // نظام Android
                heading = 360 - event.alpha;
            }
            updateCompass(heading);
            compassError.style.display = 'none';
        }, true);
    } else {
        compassError.style.display = 'block';
    }
}

// معايرة البوصلة
calibrateBtn.addEventListener('click', () => {
    // طلب الإذن لاستخدام البوصلة في iOS
    if (typeof DeviceOrientationEvent.requestPermission === 'function') {
        DeviceOrientationEvent.requestPermission()
            .then(permissionState => {
                if (permissionState === 'granted') {
                    startCompass();
                }
            })
            .catch(console.error);
    } else {
        // بدء البوصلة مباشرة في Android
        startCompass();
    }
});

// تحميل الصفحة
document.addEventListener('DOMContentLoaded', () => {
    getUserLocation();
    startCompass();

    // إضافة دعم القائمة الجانبية
    document.querySelector('.toggle-sidebar').addEventListener('click', function() {
        document.querySelector('.sidebar').classList.toggle('active');
        this.classList.toggle('active');
    });

    document.addEventListener('click', function(event) {
        const sidebar = document.querySelector('.sidebar');
        const toggleButton = document.querySelector('.toggle-sidebar');
        
        if (!sidebar.contains(event.target) && !toggleButton.contains(event.target)) {
            sidebar.classList.remove('active');
            toggleButton.classList.remove('active');
        }
    });
});