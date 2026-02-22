import { store } from '../store/appStore.js';
import { fetchWeatherData } from '../services/weatherApi.js';

export async function triggerSearch(city?: string): Promise<void> {
  const query = city ?? store.getState().query;

  if (!query) {
    store.setError('Please enter a city name');
    return;
  }

  store.setLoading(true);
  store.setError(null);

  try {
    const data = await fetchWeatherData(query);
    store.setData(data);
  } catch (err) {
    store.setError(err instanceof Error ? err.message : 'An unexpected error occurred');
    store.setData(null);
  } finally {
    store.setLoading(false);
  }
}

export function initSearch(): void {
  const { query } = store.getState();
  if (query) {
    triggerSearch(query);
  }
}
