// تنظیمات API
const API_KEY = '8e9e9b70c31b6c41e565bdf011bbdc34'; // کلید API خود را اینجا قرار دهید
// اگر کلید بالا کار نمی‌کند، کلید جدید دریافت کنید
// کلید تست (موقت): '1234567890abcdef1234567890abcdef'
const BASE_URL = 'https://api.openweathermap.org/data/2.5';

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
    '01d': 'fas fa-sun',
    '01n': 'fas fa-moon',
    '02d': 'fas fa-cloud-sun',
    '02n': 'fas fa-cloud-moon',
    '03d': 'fas fa-cloud',
    '03n': 'fas fa-cloud',
    '04d': 'fas fa-cloud',
    '04n': 'fas fa-cloud',
    '09d': 'fas fa-cloud-rain',
    '09n': 'fas fa-cloud-rain',
    '10d': 'fas fa-cloud-sun-rain',
    '10n': 'fas fa-cloud-moon-rain',
    '11d': 'fas fa-bolt',
    '11n': 'fas fa-bolt',
    '13d': 'fas fa-snowflake',
    '13n': 'fas fa-snowflake',
    '50d': 'fas fa-smog',
    '50n': 'fas fa-smog'
};

// نام‌های فارسی آب‌وهوا
const weatherDescriptions = {
    'clear sky': 'آسمان صاف',
    'few clouds': 'کمی ابری',
    'scattered clouds': 'ابرهای پراکنده',
    'broken clouds': 'ابرهای شکسته',
    'shower rain': 'بارش باران',
    'rain': 'باران',
    'thunderstorm': 'رعد و برق',
    'snow': 'برف',
    'mist': 'مه',
    'fog': 'مه',
    'haze': 'مه‌آلود',
    'smoke': 'دود',
    'dust': 'گرد و غبار',
    'sand': 'شن',
    'ash': 'خاکستر',
    'squall': 'توفان',
    'tornado': 'گردباد'
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

// تابع تبدیل دما (حالا که از units=metric استفاده می‌کنیم، نیازی به تبدیل نیست)
function kelvinToCelsius(temp) {
    return Math.round(temp); // دما در سلسیوس است
}

// تابع تبدیل سرعت باد از متر بر ثانیه به کیلومتر بر ساعت
function mpsToKmh(mps) {
    return Math.round(mps * 3.6);
}

// تابع تبدیل دید از متر به کیلومتر
function metersToKm(meters) {
    return (meters / 1000).toFixed(1);
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

// تابع دریافت آب‌وهوای فعلی
async function getCurrentWeather(city) {
    try {
        const response = await fetch(`${BASE_URL}/weather?q=${city}&appid=${API_KEY}&lang=fa&units=metric`);
        
        if (!response.ok) {
            if (response.status === 404) {
                throw new Error('شهر مورد نظر یافت نشد');
            } else if (response.status === 401) {
                throw new Error('کلید API نامعتبر است');
            } else {
                throw new Error(`خطا در دریافت آب‌وهوا (کد: ${response.status})`);
            }
        }
        
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('خطای آب‌وهوای فعلی:', error);
        throw error;
    }
}

// تابع دریافت پیش‌بینی 5 روزه
async function getForecast(city) {
    try {
        const response = await fetch(`${BASE_URL}/forecast?q=${city}&appid=${API_KEY}&lang=fa&units=metric`);
        
        if (!response.ok) {
            if (response.status === 404) {
                throw new Error('شهر مورد نظر یافت نشد');
            } else if (response.status === 401) {
                throw new Error('کلید API نامعتبر است');
            } else {
                throw new Error(`خطا در دریافت پیش‌بینی (کد: ${response.status})`);
            }
        }
        
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('خطای پیش‌بینی:', error);
        throw error;
    }
}

// تابع نمایش اطلاعات آب‌وهوای فعلی
function displayCurrentWeather(data) {
    const temp = kelvinToCelsius(data.main.temp);
    const feelsLikeTemp = kelvinToCelsius(data.main.feels_like);
    const windSpeedKmh = mpsToKmh(data.wind.speed);
    const visibilityKm = metersToKm(data.visibility);
    
    cityName.textContent = data.name;
    dateTime.textContent = formatDate(new Date());
    temperature.textContent = temp;
    
    const iconCode = data.weather[0].icon;
    weatherIcon.className = weatherIcons[iconCode] || 'fas fa-question';
    
    const description = data.weather[0].description;
    weatherDescription.textContent = weatherDescriptions[description] || description;
    
    feelsLike.textContent = `${feelsLikeTemp}°C`;
    humidity.textContent = `${data.main.humidity}%`;
    windSpeed.textContent = `${windSpeedKmh} km/h`;
    visibility.textContent = `${visibilityKm} km`;
}

// تابع نمایش پیش‌بینی
function displayForecast(data) {
    forecast.innerHTML = '';
    
    // گروه‌بندی پیش‌بینی‌ها بر اساس روز
    const dailyForecasts = {};
    
    data.list.forEach(item => {
        const date = new Date(item.dt * 1000);
        const day = date.toDateString();
        
        if (!dailyForecasts[day]) {
            dailyForecasts[day] = [];
        }
        dailyForecasts[day].push(item);
    });
    
    // نمایش 5 روز آینده
    const days = Object.keys(dailyForecasts).slice(0, 5);
    
    days.forEach(day => {
        const dayData = dailyForecasts[day];
        const avgTemp = Math.round(
            dayData.reduce((sum, item) => sum + kelvinToCelsius(item.main.temp), 0) / dayData.length
        );
        
        const mostFrequentWeather = dayData.reduce((prev, current) => {
            const prevCount = dayData.filter(item => item.weather[0].main === prev.weather[0].main).length;
            const currentCount = dayData.filter(item => item.weather[0].main === current.weather[0].main).length;
            return currentCount > prevCount ? current : prev;
        });
        
        const iconCode = mostFrequentWeather.weather[0].icon;
        const description = mostFrequentWeather.weather[0].description;
        
        const forecastItem = document.createElement('div');
        forecastItem.className = 'forecast-item';
        forecastItem.innerHTML = `
            <div class="forecast-date">${formatShortDate(new Date(day))}</div>
            <i class="forecast-icon ${weatherIcons[iconCode] || 'fas fa-question'}"></i>
            <div class="forecast-temp">${avgTemp}°C</div>
            <div class="forecast-desc">${weatherDescriptions[description] || description}</div>
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
        const [currentData, forecastData] = await Promise.all([
            getCurrentWeather(city),
            getForecast(city)
        ]);
        
        displayCurrentWeather(currentData);
        displayForecast(forecastData);
        
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
                        `${BASE_URL}/weather?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&lang=fa&units=metric`
                    );
                    
                    if (response.ok) {
                        const data = await response.json();
                        cityInput.value = data.name;
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
        const response = await fetch(`${BASE_URL}/weather?q=Tehran&appid=${API_KEY}&units=metric`);
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
    if (API_KEY === 'YOUR_API_KEY') {
        showError('لطفاً کلید API را در فایل script.js تنظیم کنید');
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