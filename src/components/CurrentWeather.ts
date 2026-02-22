import { store } from '../store/appStore.js';
import { toDisplayTemp } from '../utils/tempConvert.js';
import type { CurrentWeather as CurrentWeatherData, TemperatureUnit } from '../types.js';

const WIND_ARROWS = ['\u2191', '\u2197', '\u2192', '\u2198', '\u2193', '\u2199', '\u2190', '\u2196'];

function windArrow(deg: number): string {
  return WIND_ARROWS[Math.round(deg / 45) % 8];
}

function formatTime(unix: number, timezone: number): string {
  const ms = (unix + timezone) * 1000;
  const d = new Date(ms);
  const h = d.getUTCHours().toString().padStart(2, '0');
  const m = d.getUTCMinutes().toString().padStart(2, '0');
  return `${h}:${m}`;
}

function unitSymbol(unit: TemperatureUnit): string {
  return unit === 'celsius' ? '\u00B0C' : '\u00B0F';
}

function renderSkeleton(): string {
  return `<div class="loading-skeleton">
    <div class="skeleton-block skeleton-card"></div>
  </div>`;
}

function renderError(message: string): string {
  return `<div class="error-banner">
    <span class="error-icon">\u26A0</span>
    <span class="error-message">${escapeHtml(message)}</span>
  </div>`;
}

function escapeHtml(str: string): string {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function renderCard(data: CurrentWeatherData, unit: TemperatureUnit): string {
  const temp = toDisplayTemp(data.temperature, unit);
  const feelsLike = toDisplayTemp(data.feelsLike, unit);
  const symbol = unitSymbol(unit);
  const visibilityKm = (data.visibility / 1000).toFixed(1);

  return `<div class="current-card">
    <div class="city-name">${escapeHtml(data.city)}, ${escapeHtml(data.country)}</div>
    <div class="condition">
      <img src="https://openweathermap.org/img/wn/${data.condition.icon}@2x.png" alt="${escapeHtml(data.condition.description)}">
      <span>${capitalize(data.condition.description)}</span>
    </div>
    <div class="temp">${temp}${symbol}</div>
    <div class="details-grid">
      <div class="detail-chip">
        <div class="detail-label">Feels Like</div>
        <div class="detail-value">${feelsLike}${symbol}</div>
      </div>
      <div class="detail-chip">
        <div class="detail-label">Humidity</div>
        <div class="detail-value">${data.humidity}%</div>
      </div>
      <div class="detail-chip">
        <div class="detail-label">Pressure</div>
        <div class="detail-value">${data.pressure} hPa</div>
      </div>
      <div class="detail-chip">
        <div class="detail-label">Wind</div>
        <div class="detail-value">${data.windSpeed} m/s ${windArrow(data.windDeg)}</div>
      </div>
      <div class="detail-chip">
        <div class="detail-label">Visibility</div>
        <div class="detail-value">${visibilityKm} km</div>
      </div>
      <div class="detail-chip">
        <div class="detail-label">Sunrise</div>
        <div class="detail-value">${formatTime(data.sunrise, data.timezone)}</div>
      </div>
      <div class="detail-chip">
        <div class="detail-label">Sunset</div>
        <div class="detail-value">${formatTime(data.sunset, data.timezone)}</div>
      </div>
    </div>
  </div>`;
}

export function mountCurrentWeather(container: HTMLElement): void {
  store.subscribe((state) => {
    if (state.loading) {
      container.innerHTML = renderSkeleton();
    } else if (state.error) {
      container.innerHTML = renderError(state.error);
    } else if (state.data) {
      container.innerHTML = renderCard(state.data.current, state.unit);
    } else {
      container.innerHTML = '';
    }
  });
}
