# API های جایگزین رایگان برای هواشناسی

## 🌤️ WeatherAPI.com (توصیه شده)

### مزایا:
- ✅ **1,000,000 درخواست رایگان در ماه**
- ✅ **فعال‌سازی فوری**
- ✅ **داده‌های دقیق**
- ✅ **پشتیبانی از شهرهای ایران**

### نحوه دریافت:
1. به https://www.weatherapi.com/ بروید
2. روی "Get Started for Free" کلیک کنید
3. ثبت‌نام کنید
4. کلید API دریافت کنید

### استفاده:
```javascript
const API_KEY = 'your_weatherapi_key';
const BASE_URL = 'https://api.weatherapi.com/v1';
```

---

## 🌦️ OpenMeteo (کاملاً رایگان)

### مزایا:
- ✅ **نامحدود رایگان**
- ✅ **بدون نیاز به ثبت‌نام**
- ✅ **داده‌های دقیق**

### استفاده:
```javascript
// بدون کلید API نیاز نیست
const BASE_URL = 'https://api.open-meteo.com/v1';
```

### مثال درخواست:
```
https://api.open-meteo.com/v1/forecast?latitude=35.6892&longitude=51.3890&current=temperature_2m,relative_humidity_2m,wind_speed_10m&hourly=temperature_2m&daily=temperature_2m_max,temperature_2m_min&timezone=auto
```

---

## 🌡️ Tomorrow.io (رایگان)

### مزایا:
- ✅ **500 درخواست رایگان در روز**
- ✅ **داده‌های پیشرفته**
- ✅ **پیش‌بینی دقیق**

### نحوه دریافت:
1. به https://www.tomorrow.io/ بروید
2. ثبت‌نام کنید
3. کلید API دریافت کنید

---

## 🔄 نحوه تغییر API

### گزینه 1: استفاده از WeatherAPI.com
1. فایل `script_alternative.js` را به `script.js` تغییر نام دهید
2. کلید WeatherAPI.com را تنظیم کنید
3. فایل `index.html` را باز کنید

### گزینه 2: استفاده از OpenMeteo (بدون کلید)
```javascript
// در script.js
const BASE_URL = 'https://api.open-meteo.com/v1';

async function getWeatherData(city) {
    // ابتدا مختصات شهر را دریافت کنید
    const geoResponse = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${city}&count=1`);
    const geoData = await geoResponse.json();
    
    if (geoData.results && geoData.results.length > 0) {
        const { latitude, longitude } = geoData.results[0];
        
        const weatherResponse = await fetch(
            `${BASE_URL}/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,wind_speed_10m&hourly=temperature_2m&daily=temperature_2m_max,temperature_2m_min&timezone=auto`
        );
        
        return await weatherResponse.json();
    }
}
```

### گزینه 3: استفاده از داده‌های نمونه (برای تست)
```javascript
// داده‌های نمونه برای تست
const sampleData = {
    current: {
        temp_c: 25,
        feelslike_c: 27,
        humidity: 60,
        wind_kph: 15,
        vis_km: 10,
        condition: { text: 'آفتابی' }
    },
    location: { name: 'تهران' },
    forecast: {
        forecastday: [
            { date: '2024-01-01', day: { avgtemp_c: 25, condition: { text: 'آفتابی' } } },
            { date: '2024-01-02', day: { avgtemp_c: 23, condition: { text: 'نیمه ابری' } } },
            // ... بیشتر
        ]
    }
};
```

## 📋 مقایسه API ها

| API | درخواست رایگان | نیاز به کلید | کیفیت داده |
|-----|----------------|--------------|------------|
| WeatherAPI.com | 1M/ماه | ✅ | ⭐⭐⭐⭐⭐ |
| OpenMeteo | نامحدود | ❌ | ⭐⭐⭐⭐ |
| Tomorrow.io | 500/روز | ✅ | ⭐⭐⭐⭐⭐ |
| OpenWeatherMap | 1000/روز | ✅ | ⭐⭐⭐⭐ |

## 🚀 توصیه

**برای شروع سریع:** از OpenMeteo استفاده کنید (بدون نیاز به کلید)
**برای استفاده طولانی مدت:** از WeatherAPI.com استفاده کنید 