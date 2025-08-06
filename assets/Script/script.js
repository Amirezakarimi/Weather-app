const API_KEY = '4b9b4d4c083e456b8e0170844250508'; // کلید WeatherAPI.com
const BASE_URL = 'https://api.weatherapi.com/v1';

// عناصر DOM
const cityInput = document.getElementById('cityInput');
const searchBtn = document.getElementById('searchBtn');
const weatherInfo = document.getElementById('weatherInfo');
const loading = document.getElementById('loading');
const error = document.getElementById('error');
const errorText = document.getElementById('errorText');

// عناصر اطلاعات آب‌وهوا
const cityName = document.getElementById('cityName');
const dateTime = document.getElementById('dateTime');
const temperature = document.getElementById('temperature');
const weatherIcon = document.getElementById('weatherIcon');
const weatherDescription = document.getElementById('weatherDescription');
const feelsLike = document.getElementById('feelsLike');
const humidity = document.getElementById('humidity');
const windSpeed = document.getElementById('windSpeed');
const visibility = document.getElementById('visibility');
const forecast = document.getElementById('forecast');

// کلاس‌های آب‌وهوا برای آیکون‌ها
const weatherIcons = {
    'sunny': 'fas fa-sun',
    'clear': 'fas fa-sun',
    'partly cloudy': 'fas fa-cloud-sun',
    'cloudy': 'fas fa-cloud',
    'overcast': 'fas fa-cloud',
    'mist': 'fas fa-smog',
    'patchy rain': 'fas fa-cloud-rain',
    'light rain': 'fas fa-cloud-rain',
    'moderate rain': 'fas fa-cloud-rain',
    'heavy rain': 'fas fa-cloud-showers-heavy',
    'patchy snow': 'fas fa-snowflake',
    'light snow': 'fas fa-snowflake',
    'heavy snow': 'fas fa-snowflake',
    'thunder': 'fas fa-bolt',
    'fog': 'fas fa-smog'
};

// نام‌های فارسی آب‌وهوا
const weatherDescriptions = {
    'sunny': 'آفتابی',
    'clear': 'صاف',
    'partly cloudy': 'نیمه ابری',
    'cloudy': 'ابری',
    'overcast': 'ابری',
    'mist': 'مه‌آلود',
    'patchy rain': 'بارش پراکنده',
    'light rain': 'بارش سبک',
    'moderate rain': 'بارش متوسط',
    'heavy rain': 'بارش شدید',
    'patchy snow': 'برف پراکنده',
    'light snow': 'برف سبک',
    'heavy snow': 'برف شدید',
    'thunder': 'رعد و برق',
    'fog': 'مه'
};

// تابع تبدیل تاریخ به فارسی
function formatDate(date) {
    const options = {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    };
    
    const persianDate = new Intl.DateTimeFormat('fa-IR', options).format(date);
    return persianDate;
}

// تابع تبدیل تاریخ کوتاه
function formatShortDate(date) {
    const options = {
        weekday: 'short',
        month: 'short',
        day: 'numeric'
    };
    
    const persianDate = new Intl.DateTimeFormat('fa-IR', options).format(date);
    return persianDate;
}

// تابع تبدیل سرعت باد از کیلومتر بر ساعت
function kmhToKmh(kmh) {
    return Math.round(kmh);
}

// تابع تبدیل دید از کیلومتر
function kmToKm(km) {
    return km.toFixed(1);
}

// تابع نمایش لودینگ
function showLoading() {
    weatherInfo.style.display = 'none';
    error.style.display = 'none';
    loading.style.display = 'block';
}

// تابع مخفی کردن لودینگ
function hideLoading() {
    loading.style.display = 'none';
}

// تابع نمایش خطا
function showError(message) {
    weatherInfo.style.display = 'none';
    loading.style.display = 'none';
    error.style.display = 'block';
    errorText.textContent = message;
}

// تابع دریافت آب‌وهوای فعلی و پیش‌بینی
async function getWeatherData(city) {
    try {
        const response = await fetch(`${BASE_URL}/forecast.json?key=${API_KEY}&q=${city}&days=5&aqi=no`);
        
        if (!response.ok) {
            if (response.status === 400) {
                throw new Error('شهر مورد نظر یافت نشد');
            } else if (response.status === 401) {
                throw new Error('کلید API نامعتبر است');
            } else {
                throw new Error(`خطا در دریافت اطلاعات (کد: ${response.status})`);
            }
        }
        
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('خطای دریافت اطلاعات:', error);
        throw error;
    }
}

// تابع نمایش اطلاعات آب‌وهوای فعلی
function displayCurrentWeather(data) {
    const current = data.current;
    const location = data.location;
    
    cityName.textContent = location.name;
    dateTime.textContent = formatDate(new Date());
    temperature.textContent = Math.round(current.temp_c);
    
    const condition = current.condition.text.toLowerCase();
    weatherIcon.className = weatherIcons[condition] || 'fas fa-question';
    weatherDescription.textContent = weatherDescriptions[condition] || current.condition.text;
    
    feelsLike.textContent = `${Math.round(current.feelslike_c)}°C`;
    humidity.textContent = `${current.humidity}%`;
    windSpeed.textContent = `${kmhToKmh(current.wind_kph)} km/h`;
    visibility.textContent = `${kmToKm(current.vis_km)} km`;
}

// تابع نمایش پیش‌بینی
function displayForecast(data) {
    forecast.innerHTML = '';
    
    // نمایش 5 روز آینده
    data.forecast.forecastday.forEach(day => {
        const date = new Date(day.date);
        const avgTemp = Math.round(day.day.avgtemp_c);
        const condition = day.day.condition.text.toLowerCase();
        
        const forecastItem = document.createElement('div');
        forecastItem.className = 'forecast-item';
        forecastItem.innerHTML = `
            <div class="forecast-date">${formatShortDate(date)}</div>
            <i class="forecast-icon ${weatherIcons[condition] || 'fas fa-question'}"></i>
            <div class="forecast-temp">${avgTemp}°C</div>
            <div class="forecast-desc">${weatherDescriptions[condition] || day.day.condition.text}</div>
        `;
        
        forecast.appendChild(forecastItem);
    });
}

// تابع جستجوی آب‌وهوا
async function searchWeather() {
    const city = cityInput.value.trim();
    
    if (!city) {
        showError('لطفاً نام شهر را وارد کنید');
        return;
    }
    
    showLoading();
    
    try {
        const data = await getWeatherData(city);
        
        displayCurrentWeather(data);
        displayForecast(data);
        
        weatherInfo.style.display = 'block';
        error.style.display = 'none';
    } catch (error) {
        showError(error.message);
    } finally {
        hideLoading();
    }
}

// رویدادهای کلیک و کلید
searchBtn.addEventListener('click', searchWeather);

cityInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        searchWeather();
    }
});

// تابع جستجوی خودکار بر اساس موقعیت جغرافیایی
function getLocationWeather() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const { latitude, longitude } = position.coords;
                
                try {
                    const response = await fetch(
                        `${BASE_URL}/forecast.json?key=${API_KEY}&q=${latitude},${longitude}&days=1`
                    );
                    
                    if (response.ok) {
                        const data = await response.json();
                        cityInput.value = data.location.name;
                        searchWeather();
                    }
                } catch (error) {
                    console.error('خطا در دریافت موقعیت:', error);
                }
            },
            (error) => {
                console.error('خطا در دسترسی به موقعیت:', error);
            }
        );
    }
}

// تابع تست کلید API
async function testAPIKey() {
    try {
        const response = await fetch(`${BASE_URL}/forecast.json?key=${API_KEY}&q=Tehran&days=1`);
        if (response.ok) {
            console.log('✅ کلید API معتبر است');
            return true;
        } else {
            console.error('❌ کلید API نامعتبر است:', response.status);
            return false;
        }
    } catch (error) {
        console.error('❌ خطا در تست کلید API:', error);
        return false;
    }
}

// اجرای خودکار جستجو بر اساس موقعیت در بارگذاری صفحه
document.addEventListener('DOMContentLoaded', async () => {
    // اگر API_KEY تنظیم نشده، پیام هشدار نمایش دهید
    if (API_KEY === 'YOUR_WEATHERAPI_KEY') {
        showError('لطفاً کلید WeatherAPI.com را در فایل script_alternative.js تنظیم کنید');
        return;
    }
    
    // تست کلید API
    const isAPIValid = await testAPIKey();
    if (!isAPIValid) {
        showError('کلید API نامعتبر است. لطفاً کلید صحیح را وارد کنید');
        return;
    }
    
    // جستجوی خودکار بر اساس موقعیت
    getLocationWeather();
});

// تابع به‌روزرسانی خودکار هر 30 دقیقه
setInterval(() => {
    if (weatherInfo.style.display !== 'none') {
        searchWeather();
    }
}, 30 * 60 * 1000); 

// تابع دریافت مختصات شهر با استفاده از OpenMeteo Geocoding
async function getCityLatLng(city) {
    const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1`;
    const res = await fetch(url);
    const data = await res.json();
    if (data.results && data.results.length > 0) {
        return {
            lat: data.results[0].latitude,
            lng: data.results[0].longitude
        };
    }
    return null;
}

// متغیر نقشه و مارکر
let map, marker;

// تابع نمایش نقشه
async function showMapForCity(city) {
    const coords = await getCityLatLng(city);
    if (!coords) return;

    // اگر نقشه قبلاً ساخته شده بود، فقط مرکز و مارکر را جابجا کن
    if (map) {
        map.setView([coords.lat, coords.lng], 10);
        if (marker) {
            marker.setLatLng([coords.lat, coords.lng]);
        } else {
            marker = L.marker([coords.lat, coords.lng]).addTo(map);
        }
    } else {
        map = L.map('map').setView([coords.lat, coords.lng], 10);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors'
        }).addTo(map);
        marker = L.marker([coords.lat, coords.lng]).addTo(map);
    }
}

// فراخوانی نمایش نقشه بعد از نمایش اطلاعات شهر
const oldDisplayCurrentWeather = window.displayCurrentWeather;
window.displayCurrentWeather = function(data) {
    oldDisplayCurrentWeather(data);
    const city = data.name || document.getElementById('cityName').textContent;
    showMapForCity(city);
}; 

