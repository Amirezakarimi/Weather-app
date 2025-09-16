// تنظیمات API - OpenMeteo (بدون نیاز به کلید)
const BASE_URL = 'https://api.open-meteo.com/v1';
const GEO_URL = 'https://geocoding-api.open-meteo.com/v1';

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
    'clear': 'fas fa-sun',
    'partly cloudy': 'fas fa-cloud-sun',
    'cloudy': 'fas fa-cloud',
    'overcast': 'fas fa-cloud',
    'mist': 'fas fa-smog',
    'rain': 'fas fa-cloud-rain',
    'snow': 'fas fa-snowflake',
    'thunderstorm': 'fas fa-bolt',
    'fog': 'fas fa-smog'
};

// نام‌های فارسی آب‌وهوا
const weatherDescriptions = {
    'clear': 'صاف',
    'partly cloudy': 'نیمه ابری',
    'cloudy': 'ابری',
    'overcast': 'ابری',
    'mist': 'مه‌آلود',
    'rain': 'باران',
    'snow': 'برف',
    'thunderstorm': 'رعد و برق',
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

// تابع دریافت مختصات شهر
async function getCityCoordinates(city) {
    try {
        const response = await fetch(`${GEO_URL}/search?name=${encodeURIComponent(city)}&count=1&language=fa`);
        
        if (!response.ok) {
            throw new Error('خطا در دریافت مختصات شهر');
        }
        
        const data = await response.json();
        
        if (!data.results || data.results.length === 0) {
            throw new Error('شهر مورد نظر یافت نشد');
        }
        
        return data.results[0];
    } catch (error) {
        console.error('خطای دریافت مختصات:', error);
        throw error;
    }
}

// تابع دریافت اطلاعات آب‌وهوا
async function getWeatherData(latitude, longitude) {
    try {
        const response = await fetch(
            `${BASE_URL}/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code&hourly=temperature_2m,weather_code&daily=temperature_2m_max,temperature_2m_min,weather_code&timezone=auto`
        );
        
        if (!response.ok) {
            throw new Error('خطا در دریافت اطلاعات آب‌وهوا');
        }
        
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('خطای دریافت آب‌وهوا:', error);
        throw error;
    }
}

// تابع تبدیل کد آب‌وهوا به متن
function getWeatherText(code) {
    const weatherCodes = {
        0: 'صاف',
        1: 'نیمه ابری',
        2: 'نیمه ابری',
        3: 'ابری',
        45: 'مه‌آلود',
        48: 'مه‌آلود',
        51: 'بارش سبک',
        53: 'بارش متوسط',
        55: 'بارش شدید',
        61: 'باران',
        63: 'باران',
        65: 'باران شدید',
        71: 'برف',
        73: 'برف',
        75: 'برف شدید',
        77: 'برف',
        80: 'بارش پراکنده',
        81: 'بارش پراکنده',
        82: 'بارش پراکنده',
        85: 'برف پراکنده',
        86: 'برف پراکنده',
        95: 'رعد و برق',
        96: 'رعد و برق',
        99: 'رعد و برق'
    };
    
    return weatherCodes[code] || 'نامشخص';
}

// تابع تبدیل کد آب‌وهوا به آیکون
function getWeatherIcon(code) {
    if (code >= 0 && code <= 3) return 'fas fa-sun';
    if (code >= 45 && code <= 48) return 'fas fa-smog';
    if (code >= 51 && code <= 55) return 'fas fa-cloud-rain';
    if (code >= 61 && code <= 65) return 'fas fa-cloud-rain';
    if (code >= 71 && code <= 77) return 'fas fa-snowflake';
    if (code >= 80 && code <= 82) return 'fas fa-cloud-rain';
    if (code >= 85 && code <= 86) return 'fas fa-snowflake';
    if (code >= 95 && code <= 99) return 'fas fa-bolt';
    
    return 'fas fa-question';
}

// تابع نمایش اطلاعات آب‌وهوای فعلی
function displayCurrentWeather(data, cityName) {
    const current = data.current;
    
    document.getElementById('cityName').textContent = cityName;
    document.getElementById('dateTime').textContent = formatDate(new Date());
    document.getElementById('temperature').textContent = Math.round(current.temperature_2m);
    
    const weatherText = getWeatherText(current.weather_code);
    const weatherIconClass = getWeatherIcon(current.weather_code);
    
    document.getElementById('weatherIcon').className = weatherIconClass;
    document.getElementById('weatherDescription').textContent = weatherText;
    
    document.getElementById('feelsLike').textContent = `${Math.round(current.temperature_2m)}°C`;
    document.getElementById('humidity').textContent = `${current.relative_humidity_2m}%`;
    document.getElementById('windSpeed').textContent = `${Math.round(current.wind_speed_10m)} km/h`;
    document.getElementById('visibility').textContent = '10.0 km'; // OpenMeteo این داده را ندارد
}

// تابع نمایش پیش‌بینی
function displayForecast(data) {
    forecast.innerHTML = '';
    
    // نمایش 5 روز آینده
    data.daily.time.slice(0, 5).forEach((date, index) => {
        const maxTemp = Math.round(data.daily.temperature_2m_max[index]);
        const minTemp = Math.round(data.daily.temperature_2m_min[index]);
        const avgTemp = Math.round((maxTemp + minTemp) / 2);
        const weatherCode = data.daily.weather_code[index];
        const weatherText = getWeatherText(weatherCode);
        const weatherIconClass = getWeatherIcon(weatherCode);
        
        const forecastItem = document.createElement('div');
        forecastItem.className = 'forecast-item';
        forecastItem.innerHTML = `
            <div class="forecast-date">${formatShortDate(new Date(date))}</div>
            <i class="forecast-icon ${weatherIconClass}"></i>
            <div class="forecast-temp">${avgTemp}°C</div>
            <div class="forecast-desc">${weatherText}</div>
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
        // ابتدا مختصات شهر را دریافت کنید
        const cityData = await getCityCoordinates(city);
        
        // سپس اطلاعات آب‌وهوا را دریافت کنید
        const weatherData = await getWeatherData(cityData.latitude, cityData.longitude);
        
        displayCurrentWeather(weatherData, cityData.name);
        displayForecast(weatherData);
        
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
                    const weatherData = await getWeatherData(latitude, longitude);
                    
                    // نام شهر را از مختصات دریافت کنید
                    const geoResponse = await fetch(`${GEO_URL}/search?latitude=${latitude}&longitude=${longitude}&count=1`);
                    const geoData = await geoResponse.json();
                    
                    if (geoData.results && geoData.results.length > 0) {
                        cityInput.value = geoData.results[0].name;
                    } else {
                        cityInput.value = 'موقعیت شما';
                    }
                    
                    displayCurrentWeather(weatherData, cityInput.value);
                    displayForecast(weatherData);
                    
                    weatherInfo.style.display = 'block';
                    error.style.display = 'none';
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

// اجرای خودکار جستجو بر اساس موقعیت در بارگذاری صفحه
document.addEventListener('DOMContentLoaded', () => {
    // جستجوی خودکار بر اساس موقعیت
    getLocationWeather();
});

// تابع به‌روزرسانی خودکار هر 30 دقیقه
setInterval(() => {
    if (weatherInfo.style.display !== 'none') {
        searchWeather();
    }
}, 30 * 60 * 1000); 

// متغیر نقشه و مارکر
let map, marker;

// دریافت مختصات با نام شهر (بازاستفاده از OpenMeteo Geocoding)
async function getCityLatLng(city) {
	const url = `${GEO_URL}/search?name=${encodeURIComponent(city)}&count=1`;
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

// نمایش نقشه برای شهر
async function showMapForCity(city) {
	try {
		const coords = await getCityLatLng(city);
		if (!coords) return;
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
	} catch (err) {
		console.error('خطا در نمایش نقشه:', err);
	}
}

// قلاب پس از نمایش اطلاعات برای نشان دادن نقشه
const originalDisplayCurrentWeather = displayCurrentWeather;
displayCurrentWeather = function(data, city) {
	originalDisplayCurrentWeather(data, city);
	const effectiveCity = city || document.getElementById('cityName').textContent;
	showMapForCity(effectiveCity);
};

// همچنین هنگام دریافت موقعیت جغرافیایی مستقیم (lat/lng)
async function showMapForLatLng(lat, lng) {
	try {
		if (map) {
			map.setView([lat, lng], 10);
			if (marker) {
				marker.setLatLng([lat, lng]);
			} else {
				marker = L.marker([lat, lng]).addTo(map);
			}
		} else {
			map = L.map('map').setView([lat, lng], 10);
			L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
				attribution: '© OpenStreetMap contributors'
			}).addTo(map);
			marker = L.marker([lat, lng]).addTo(map);
		}
	} catch (err) {
		console.error('خطا در نمایش نقشه با مختصات:', err);
	}
}

// در مسیر موقعیت‌یابی، بعد از دریافت داده‌ها نقشه را هم بروز کن
const originalGetLocationWeather = getLocationWeather;
getLocationWeather = function() {
	if (!navigator.geolocation) return originalGetLocationWeather();
	navigator.geolocation.getCurrentPosition(async (position) => {
		const { latitude, longitude } = position.coords;
		try {
			const weatherData = await getWeatherData(latitude, longitude);
			// دریافت نام شهر از سرویس جئوکدینگ
			const geoResponse = await fetch(`${GEO_URL}/search?latitude=${latitude}&longitude=${longitude}&count=1`);
			const geoData = await geoResponse.json();
			const name = (geoData.results && geoData.results.length > 0) ? geoData.results[0].name : 'موقعیت شما';
			cityInput.value = name;
			displayCurrentWeather(weatherData, name);
			displayForecast(weatherData);
			weatherInfo.style.display = 'block';
			error.style.display = 'none';
			await showMapForLatLng(latitude, longitude);
		} catch (error) {
			console.error('خطا در دریافت موقعیت:', error);
		}
	}, (error) => {
		console.error('خطا در دسترسی به موقعیت:', error);
	});
}; 