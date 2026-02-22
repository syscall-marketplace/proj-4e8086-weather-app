import './styles/main.css';
import { mountSearchBar } from './components/SearchBar.js';
import { mountUnitToggle } from './components/UnitToggle.js';
import { mountCurrentWeather } from './components/CurrentWeather.js';
import { mountForecastStrip } from './components/ForecastStrip.js';
import { initSearch } from './controllers/searchController.js';

const app = document.getElementById('app')!;

app.innerHTML = `
  <header>
    <h1>Weather App</h1>
    <div id="unit-container"></div>
  </header>
  <main>
    <div id="search-container"></div>
    <div id="weather-container"></div>
    <div id="forecast-container"></div>
  </main>
`;

mountSearchBar(document.getElementById('search-container')!);
mountUnitToggle(document.getElementById('unit-container')!);
mountCurrentWeather(document.getElementById('weather-container')!);
mountForecastStrip(document.getElementById('forecast-container')!);

initSearch();
