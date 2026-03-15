# 🌤️ Hali ya Hewa — Weather App

A clean, modern weather app built with vanilla HTML, CSS & JavaScript. Supports **Swahili** and **English** with a one-click language toggle.

## Features

- 🔍 **City Search** — Type any city name to get current weather
- 📍 **Auto-detect Location** — Uses your browser's geolocation on page load
- 🌡️ **Temperature** — Displayed in °C
- 💧 **Humidity** & 💨 **Wind Speed** — Shown with clean icons
- 🌐 **Bilingual** — Swahili (default) / English toggle with translated weather descriptions
- 🎨 **Dynamic Backgrounds** — Gradient shifts based on weather (clear, clouds, rain, snow, thunder, mist, night)
- 📱 **Responsive** — Works on mobile, tablet & desktop

## Tech Stack

- **HTML5** / **CSS3** / **JavaScript** (no frameworks)
- **[WeatherAPI.com](https://www.weatherapi.com/)** — Free tier for current weather data
- **Google Fonts** — Inter

## Getting Started

1. Clone the repo:
   ```bash
   git clone https://github.com/YOUR_USERNAME/weather-app.git
   ```
2. Open `index.html` in your browser — that's it!

   Or serve locally:
   ```bash
   npx -y serve .
   ```

## API Key

The app uses [WeatherAPI.com](https://www.weatherapi.com/) (free tier). To use your own key, edit line 6 in `app.js`:

```js
const API_KEY = "your_key_here";
```

## Project Structure

```
├── index.html   — Page structure
├── style.css    — Styling & dynamic backgrounds
├── app.js       — API calls, i18n, geolocation
└── README.md
```

## License

MIT
