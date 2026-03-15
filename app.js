// =============================================
// Weather App — Main Logic (WeatherAPI.com)
// Swahili / English
// =============================================

const API_KEY = "25aeb28dd49c4905ae8222324261503";
const API_BASE = "https://api.weatherapi.com/v1/current.json";

// Geolocation options — low accuracy is faster, cache for 5 mins
const GEO_OPTIONS = {
  enableHighAccuracy: false,
  timeout: 5000,
  maximumAge: 300000,
};

// ----- i18n Strings -----

// Swahili translations for WeatherAPI.com condition texts
const weatherConditionsSW = {
  "Sunny": "Jua kali",
  "Clear": "Safi",
  "Partly cloudy": "Mawingu kidogo",
  "Partly Cloudy": "Mawingu kidogo",
  "Cloudy": "Mawingu",
  "Overcast": "Mawingu mazito",
  "Mist": "Ukungu",
  "Fog": "Ukungu mzito",
  "Freezing fog": "Ukungu wa barafu",
  "Patchy rain possible": "Mvua kidogo inawezekana",
  "Patchy rain nearby": "Mvua kidogo karibu",
  "Patchy snow possible": "Theluji kidogo inawezekana",
  "Patchy sleet possible": "Mvua ya barafu kidogo inawezekana",
  "Patchy freezing drizzle possible": "Manyunyu ya barafu inawezekana",
  "Thundery outbreaks possible": "Radi inawezekana",
  "Blowing snow": "Theluji inayopeperushwa",
  "Blizzard": "Dhoruba ya theluji",
  "Light drizzle": "Manyunyu hafifu",
  "Freezing drizzle": "Manyunyu ya barafu",
  "Heavy freezing drizzle": "Manyunyu mazito ya barafu",
  "Patchy light drizzle": "Manyunyu hafifu kidogo",
  "Light rain": "Mvua hafifu",
  "Moderate rain at times": "Mvua wastani mara kwa mara",
  "Moderate rain": "Mvua wastani",
  "Heavy rain at times": "Mvua kubwa mara kwa mara",
  "Heavy rain": "Mvua kubwa",
  "Light freezing rain": "Mvua hafifu ya barafu",
  "Moderate or heavy freezing rain": "Mvua ya barafu wastani au kubwa",
  "Light sleet": "Mvua hafifu ya barafu",
  "Moderate or heavy sleet": "Mvua ya barafu wastani au kubwa",
  "Patchy light rain": "Mvua hafifu kidogo",
  "Light rain shower": "Mvua hafifu ya muda mfupi",
  "Moderate or heavy rain shower": "Mvua ya muda mfupi wastani au kubwa",
  "Torrential rain shower": "Mvua kubwa sana ya muda mfupi",
  "Patchy light snow": "Theluji hafifu kidogo",
  "Light snow": "Theluji hafifu",
  "Patchy moderate snow": "Theluji wastani kidogo",
  "Moderate snow": "Theluji wastani",
  "Patchy heavy snow": "Theluji nzito kidogo",
  "Heavy snow": "Theluji nzito",
  "Light snow showers": "Theluji hafifu ya muda mfupi",
  "Moderate or heavy snow showers": "Theluji ya muda mfupi wastani au nzito",
  "Ice pellets": "Chembe za barafu",
  "Light showers of ice pellets": "Chembe hafifu za barafu",
  "Moderate or heavy showers of ice pellets": "Chembe za barafu wastani au nzito",
  "Patchy light rain with thunder": "Mvua hafifu na radi",
  "Moderate or heavy rain with thunder": "Mvua na radi wastani au kubwa",
  "Patchy light snow with thunder": "Theluji hafifu na radi",
  "Moderate or heavy snow with thunder": "Theluji na radi wastani au nzito",
};

function translateCondition(englishText) {
  if (currentLang === "en") return englishText;
  return weatherConditionsSW[englishText] || englishText;
}

const i18n = {
  sw: {
    appTitle: "Hali ya Hewa",
    tagline: "Hali ya hewa ya wakati halisi, popote.",
    searchPlaceholder: "Tafuta jiji...",
    locationBtn: "Tumia Eneo Langu",
    humidity: "Unyevu",
    wind: "Upepo",
    forecastTitle: "Utabiri wa Siku 5",
    langToggleLabel: "Badilisha Lugha",
    cityNotFound: "Jiji halijapatikana. Tafadhali angalia jina na ujaribu tena.",
    invalidKey: "Ufunguo wa API si sahihi. Tafadhali angalia ufunguo wako.",
    fetchError: "Imeshindwa kupata data ya hali ya hewa. Tafadhali jaribu tena.",
    locationUnsupported: "Kivinjari chako hakitumii eneo.",
    locationDenied: "Ruhusa ya eneo imekataliwa. Tafadhali tafuta jiji badala yake.",
    days: ["Jpi", "Jtt", "Jnn", "Jtn", "Alh", "Ijm", "Jms"],
  },
  en: {
    appTitle: "Weather",
    tagline: "Real-time weather, anywhere.",
    searchPlaceholder: "Search city...",
    locationBtn: "Use My Location",
    humidity: "Humidity",
    wind: "Wind",
    forecastTitle: "5-Day Forecast",
    langToggleLabel: "Change Language",
    cityNotFound: "City not found. Please check the name and try again.",
    invalidKey: "Invalid API key. Please check your key at weatherapi.com.",
    fetchError: "Unable to fetch weather data. Please try again.",
    locationUnsupported: "Geolocation is not supported by your browser.",
    locationDenied: "Location access denied. Please search for a city instead.",
    days: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
  },
};

let currentLang = "sw"; // Default to Swahili

// ----- DOM Elements -----

const appTitle       = document.getElementById("appTitle");
const tagline        = document.getElementById("tagline");
const searchForm     = document.getElementById("searchForm");
const cityInput      = document.getElementById("cityInput");
const locationBtn    = document.getElementById("locationBtn");
const locationBtnText = document.getElementById("locationBtnText");
const langToggle     = document.getElementById("langToggle");
const langLabel      = document.getElementById("langLabel");
const loader         = document.getElementById("loader");
const errorMsg       = document.getElementById("errorMsg");
const weatherCard    = document.getElementById("weatherCard");
const weatherIcon    = document.getElementById("weatherIcon");
const temperature    = document.getElementById("temperature");
const description    = document.getElementById("description");
const cityName       = document.getElementById("cityName");
const humidity       = document.getElementById("humidity");
const windSpeed      = document.getElementById("windSpeed");
// i18n label elements
const humidityLabel = document.querySelector('[data-i18n="humidity"]');
const windLabel     = document.querySelector('[data-i18n="wind"]');

// ----- Language Toggle -----

function t(key) {
  return i18n[currentLang][key] || key;
}

function applyLanguage() {
  const lang = i18n[currentLang];
  appTitle.textContent        = lang.appTitle;
  tagline.textContent         = lang.tagline;
  cityInput.placeholder       = lang.searchPlaceholder;
  locationBtnText.textContent = lang.locationBtn;
  humidityLabel.textContent   = lang.humidity;
  windLabel.textContent       = lang.wind;
  langLabel.textContent       = lang.langToggleLabel;
  document.documentElement.lang = currentLang === "sw" ? "sw" : "en";
  // Re-translate current weather description if visible
  if (lastWeatherCondition) {
    description.textContent = translateCondition(lastWeatherCondition);
  }
}

langToggle.addEventListener("click", () => {
  currentLang = currentLang === "sw" ? "en" : "sw";
  applyLanguage();
});

// ----- State Helpers -----

function showLoader() {
  loader.classList.remove("hidden");
  weatherCard.classList.add("hidden");
  errorMsg.classList.add("hidden");
}

function hideLoader() {
  loader.classList.add("hidden");
}

function showError(message) {
  hideLoader();
  weatherCard.classList.add("hidden");
  errorMsg.textContent = message;
  errorMsg.classList.remove("hidden");
}

function showWeather() {
  hideLoader();
  errorMsg.classList.add("hidden");
  weatherCard.classList.remove("hidden");
}

// ----- Dynamic Background -----

function getBackgroundClass(code, isDay) {
  if (!isDay) return "weather-night";
  if (code === 1000) return "weather-clear";
  if (code >= 1003 && code <= 1009) return "weather-clouds";
  if (code === 1030 || code === 1135 || code === 1147) return "weather-mist";
  if ([1063,1150,1153,1168,1171,1180,1183,1186,1189,1192,1195,1198,1201,1240,1243,1246].includes(code)) return "weather-rain";
  if ([1066,1069,1072,1114,1117,1204,1207,1210,1213,1216,1219,1222,1225,1237,1249,1252,1255,1258,1261,1264].includes(code)) return "weather-snow";
  if ([1087,1273,1276,1279,1282].includes(code)) return "weather-thunderstorm";
  return "weather-clear";
}

function setBackground(code, isDay) {
  document.body.className = document.body.className
    .replace(/\bweather-\S+/g, "")
    .trim();
  document.body.classList.add(getBackgroundClass(code, isDay));
}

// ----- Render Weather Data -----

let lastWeatherCondition = null;

function renderWeather(data) {
  const current   = data.current;
  const location  = data.location;
  const condition = current.condition;

  lastWeatherCondition = condition.text;

  temperature.textContent = Math.round(current.temp_c);
  description.textContent = translateCondition(condition.text);
  cityName.textContent    = `${location.name}, ${location.country}`;
  humidity.textContent     = `${current.humidity}%`;
  windSpeed.textContent    = `${current.wind_kph} km/h`;

  weatherIcon.src = `https:${condition.icon}`.replace("64x64", "128x128");
  weatherIcon.alt = condition.text;

  setBackground(condition.code, current.is_day === 1);
}



// ----- API Calls -----

async function fetchWeather(query) {
  showLoader();
  try {
    const url = `${API_BASE}?key=${API_KEY}&q=${encodeURIComponent(query)}&aqi=no`;
    const res = await fetch(url);

    if (!res.ok) {
      const errData = await res.json().catch(() => null);
      if (res.status === 400 || res.status === 404) {
        throw new Error(t("cityNotFound"));
      }
      if (res.status === 401 || res.status === 403) {
        throw new Error(t("invalidKey"));
      }
      throw new Error(t("fetchError"));
    }

    const data = await res.json();
    renderWeather(data);
    showWeather();
  } catch (err) {
    showError(err.message);
  }
}

// ----- Event Handlers -----

searchForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const city = cityInput.value.trim();
  if (city) fetchWeather(city);
});

locationBtn.addEventListener("click", () => {
  if (!navigator.geolocation) {
    showError(t("locationUnsupported"));
    return;
  }
  showLoader();
  navigator.geolocation.getCurrentPosition(
    (pos) => fetchWeather(`${pos.coords.latitude},${pos.coords.longitude}`),
    ()    => showError(t("locationDenied")),
    GEO_OPTIONS
  );
});

// ----- Init -----

applyLanguage();

(function init() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (pos) => fetchWeather(`${pos.coords.latitude},${pos.coords.longitude}`),
      () => { /* Silently fall back */ },
      GEO_OPTIONS
    );
  }
})();
