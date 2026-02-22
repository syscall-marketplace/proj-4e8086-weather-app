import type { TemperatureUnit } from '../types.js';

export function toDisplayTemp(celsius: number, unit: TemperatureUnit): number {
  if (unit === 'fahrenheit') {
    return Math.round((celsius * 9) / 5 + 32);
  }
  return Math.round(celsius * 10) / 10;
}
