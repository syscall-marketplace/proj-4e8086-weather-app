import { store } from '../store/appStore.js';
import { toDisplayTemp } from '../utils/tempConvert.js';
import type { DailyForecast, TemperatureUnit } from '../types.js';

const DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

function getDayLabel(dateStr: string): string {
  const d = new Date(dateStr + 'T12:00:00Z');
  return DAY_NAMES[d.getUTCDay()];
}

function getNoonIcon(day: DailyForecast): string {
  const noon = day.entries.find((e) => {
    const h = new Date(e.dt * 1000).getUTCHours();
    return h >= 11 && h <= 14;
  });
  return (noon ?? day.entries[0]).condition.icon;
}

function unitSymbol(unit: TemperatureUnit): string {
  return unit === 'celsius' ? '\u00B0C' : '\u00B0F';
}

function renderSkeleton(): string {
  return `<div class="loading-skeleton">
    <div class="skeleton-strip">
      ${Array.from({ length: 5 }, () => '<div class="skeleton-block"></div>').join('')}
    </div>
  </div>`;
}

function renderStrip(days: DailyForecast[], unit: TemperatureUnit): string {
  const symbol = unitSymbol(unit);
  const cards = days.slice(0, 5).map((day) => {
    const icon = getNoonIcon(day);
    const min = toDisplayTemp(day.minTemp, unit);
    const max = toDisplayTemp(day.maxTemp, unit);
    const pop = Math.round((day.entries.reduce((sum, e) => sum + e.pop, 0) / day.entries.length) * 100);

    return `<div class="forecast-day">
      <div class="forecast-date">${getDayLabel(day.date)}</div>
      <img class="forecast-icon" src="https://openweathermap.org/img/wn/${icon}@2x.png" alt="forecast">
      <div class="forecast-temps">${max}${symbol} / <span class="temp-min">${min}${symbol}</span></div>
      <div class="forecast-pop">\uD83D\uDCA7 ${pop}%</div>
    </div>`;
  });

  return `<div class="forecast-strip">${cards.join('')}</div>`;
}

export function mountForecastStrip(container: HTMLElement): void {
  store.subscribe((state) => {
    if (state.loading) {
      container.innerHTML = renderSkeleton();
    } else if (state.data) {
      container.innerHTML = renderStrip(state.data.forecast, state.unit);
    } else {
      container.innerHTML = '';
    }
  });
}
