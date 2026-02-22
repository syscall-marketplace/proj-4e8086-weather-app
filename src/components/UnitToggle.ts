import { store } from '../store/appStore.js';
import type { TemperatureUnit } from '../types.js';

export function mountUnitToggle(container: HTMLElement): void {
  const wrapper = document.createElement('div');
  wrapper.className = 'unit-toggle';

  const celsiusBtn = document.createElement('button');
  celsiusBtn.dataset.unit = 'celsius';
  celsiusBtn.textContent = '\u00B0C';

  const fahrenheitBtn = document.createElement('button');
  fahrenheitBtn.dataset.unit = 'fahrenheit';
  fahrenheitBtn.textContent = '\u00B0F';

  wrapper.appendChild(celsiusBtn);
  wrapper.appendChild(fahrenheitBtn);
  container.appendChild(wrapper);

  function updateActive(unit: TemperatureUnit): void {
    celsiusBtn.classList.toggle('active', unit === 'celsius');
    fahrenheitBtn.classList.toggle('active', unit === 'fahrenheit');
  }

  updateActive(store.getState().unit);

  wrapper.addEventListener('click', (e) => {
    const target = e.target as HTMLElement;
    const unit = target.dataset.unit as TemperatureUnit | undefined;
    if (unit) {
      store.setUnit(unit);
    }
  });

  store.subscribe((state) => {
    updateActive(state.unit);
  });
}
