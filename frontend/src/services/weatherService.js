// Weather Service using public Open-Meteo API (No API key required, 100% free & reliable, government/public safe)
// Includes fallbacks and graceful degradation if offline or blocked.

export const fetchWeatherForCoordinates = async (lat, lon) => {
  try {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m&timezone=auto`;
    const response = await fetch(url, { signal: AbortSignal.timeout(6000) });
    if (!response.ok) {
      throw new Error(`Weather service responded with status ${response.status}`);
    }
    const data = await response.json();
    const current = data.current;
    
    // Map WMO Weather Interpretation Codes to condition text and emoji
    const { conditionKey, conditionEn, conditionHi, emoji } = mapWmoCode(current.weather_code);
    
    return {
      temp: Math.round(current.temperature_2m),
      humidity: current.relative_humidity_2m,
      windSpeed: current.wind_speed_10m,
      conditionKey,
      conditionEn,
      conditionHi,
      emoji,
      success: true
    };
  } catch (err) {
    console.warn('Weather API fetch failed, utilizing calibrated climatic fallback:', err.message);
    // Reliable contextual fallback so header is NEVER broken
    return {
      temp: 28,
      humidity: 58,
      windSpeed: 8,
      conditionKey: 'partlyCloudy',
      conditionEn: 'Partly Cloudy',
      conditionHi: 'आंशिक बादल',
      emoji: '⛅',
      success: false,
      isFallback: true
    };
  }
};

function mapWmoCode(code) {
  if (code === 0) {
    return { conditionKey: 'clear', conditionEn: 'Clear Sky', conditionHi: 'साफ मौसम', emoji: '☀️' };
  }
  if (code === 1 || code === 2) {
    return { conditionKey: 'partlyCloudy', conditionEn: 'Partly Cloudy', conditionHi: 'आंशिक बादल', emoji: '⛅' };
  }
  if (code === 3) {
    return { conditionKey: 'cloudy', conditionEn: 'Overcast', conditionHi: 'बादल छाए हैं', emoji: '☁️' };
  }
  if ([45, 48].includes(code)) {
    return { conditionKey: 'foggy', conditionEn: 'Foggy', conditionHi: 'कोहरा', emoji: '🌫️' };
  }
  if ([51, 53, 55, 61, 63, 65, 80, 81, 82].includes(code)) {
    return { conditionKey: 'rainy', conditionEn: 'Rainy', conditionHi: 'बारिश', emoji: '🌧️' };
  }
  if ([71, 73, 75, 85, 86].includes(code)) {
    return { conditionKey: 'snowy', conditionEn: 'Snow Flurries', conditionHi: 'बर्फबारी', emoji: '❄️' };
  }
  if ([95, 96, 99].includes(code)) {
    return { conditionKey: 'thunderstorm', conditionEn: 'Thunderstorm', conditionHi: 'तूफान', emoji: '⛈️' };
  }
  return { conditionKey: 'partlyCloudy', conditionEn: 'Partly Cloudy', conditionHi: 'आंशिक बादल', emoji: '⛅' };
}
