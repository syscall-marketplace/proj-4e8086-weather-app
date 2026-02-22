import type { AppState, TemperatureUnit, WeatherData } from '../types.js';

type Listener = (state: AppState) => void;

class AppStore {
  private state: AppState;
  private listeners = new Set<Listener>();

  constructor() {
    const savedQuery = localStorage.getItem('weather-query');
    const savedUnit = localStorage.getItem('weather-unit');

    this.state = {
      query: savedQuery ?? '',
      unit: (savedUnit === 'fahrenheit' ? 'fahrenheit' : 'celsius') as TemperatureUnit,
      loading: false,
      error: null,
      data: null,
    };
  }

  getState(): AppState {
    return { ...this.state };
  }

  subscribe(listener: Listener): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notify(): void {
    const snapshot = this.getState();
    for (const listener of this.listeners) {
      listener(snapshot);
    }
  }

  setQuery(query: string): void {
    this.state = { ...this.state, query };
    localStorage.setItem('weather-query', query);
    this.notify();
  }

  setUnit(unit: TemperatureUnit): void {
    this.state = { ...this.state, unit };
    localStorage.setItem('weather-unit', unit);
    this.notify();
  }

  setLoading(loading: boolean): void {
    this.state = { ...this.state, loading };
    this.notify();
  }

  setError(error: string | null): void {
    this.state = { ...this.state, error };
    this.notify();
  }

  setData(data: WeatherData | null): void {
    this.state = { ...this.state, data };
    this.notify();
  }
}

export const store = new AppStore();
