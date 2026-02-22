import { store } from '../store/appStore.js';
import { triggerSearch } from '../controllers/searchController.js';

export function mountSearchBar(container: HTMLElement): void {
  const wrapper = document.createElement('div');
  wrapper.className = 'search-bar';

  const input = document.createElement('input');
  input.type = 'text';
  input.placeholder = 'Search city...';
  input.value = store.getState().query;

  const button = document.createElement('button');
  button.textContent = 'Search';

  wrapper.appendChild(input);
  wrapper.appendChild(button);
  container.appendChild(wrapper);

  function handleSearch(): void {
    const value = input.value.trim();
    if (!value) return;
    store.setQuery(value);
    triggerSearch();
  }

  button.addEventListener('click', handleSearch);
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  });

  store.subscribe((state) => {
    if (state.loading) {
      button.disabled = true;
      button.textContent = 'Searching\u2026';
    } else {
      button.disabled = false;
      button.textContent = 'Search';
    }
  });
}
