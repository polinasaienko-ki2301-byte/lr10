// Key used to remember the user's language choice in localStorage
const STORAGE_KEY = 'preferredLanguage';
const SUPPORTED_LANGUAGES = ['en', 'uk'];

// Translation resources (UI texts + product texts)
const resources = {
  en: {
    translation: {
      title: 'Product Catalog',
      language: 'Language:',
      intro: 'Browse our products below.',
      buy: 'Add to cart',
      products: {
        1: { name: 'Laptop', description: 'Lightweight laptop for work and study.' },
        2: { name: 'Headphones', description: 'Wireless headphones with noise cancelling.' },
        3: { name: 'Keyboard', description: 'Mechanical keyboard with backlight.' },
        4: { name: 'Mouse', description: 'Ergonomic wireless mouse.' }
      }
    }
  },
  uk: {
    translation: {
      title: 'Каталог товарів',
      language: 'Мова:',
      intro: 'Перегляньте наші товари нижче.',
      buy: 'Додати в кошик',
      products: {
        1: { name: 'Ноутбук', description: 'Легкий ноутбук для роботи та навчання.' },
        2: { name: 'Навушники', description: 'Бездротові навушники з шумозаглушенням.' },
        3: { name: 'Клавіатура', description: 'Механічна клавіатура з підсвічуванням.' },
        4: { name: 'Миша', description: 'Ергономічна бездротова миша.' }
      }
    }
  }
};

// Product data (language-independent). Replace with the result of your
// fetch() request from the previous practical work if needed.
const products = [
  { id: 1, price: 1200 },
  { id: 2, price: 150 },
  { id: 3, price: 90 },
  { id: 4, price: 40 }
];

const selector = document.getElementById('language-selector');
const modal = document.getElementById('language-modal');
const catalog = document.getElementById('catalog');

// Read saved language safely (localStorage may be unavailable)
function getSavedLanguage() {
  try {
    const lang = localStorage.getItem(STORAGE_KEY);
    return SUPPORTED_LANGUAGES.includes(lang) ? lang : null;
  } catch (e) {
    return null;
  }
}

// Save the chosen language
function saveLanguage(lang) {
  try {
    localStorage.setItem(STORAGE_KEY, lang);
  } catch (e) {
    console.warn('Could not save language:', e);
  }
}

// Render the product catalog using the current language
function renderCatalog() {
  const formatter = new Intl.NumberFormat(i18next.language, {
    style: 'currency',
    currency: 'USD'
  });

  catalog.innerHTML = '';
  products.forEach((product) => {
    const card = document.createElement('article');
    card.className = 'card';

    const name = document.createElement('h3');
    name.textContent = i18next.t(`products.${product.id}.name`);

    const description = document.createElement('p');
    description.textContent = i18next.t(`products.${product.id}.description`);

    const price = document.createElement('span');
    price.className = 'price';
    price.textContent = formatter.format(product.price);

    const button = document.createElement('button');
    button.type = 'button';
    button.textContent = i18next.t('buy');

    card.append(name, description, price, button);
    catalog.appendChild(card);
  });
}

// Update all static texts marked with data-i18n, then the catalog
function updateContent() {
  document.documentElement.lang = i18next.language;
  document.querySelectorAll('[data-i18n]').forEach((el) => {
    el.textContent = i18next.t(el.dataset.i18n);
  });
  selector.value = i18next.language;
  renderCatalog();
}

// Change language, remember the choice and refresh the page texts
function setLanguage(lang) {
  saveLanguage(lang);
  i18next.changeLanguage(lang, updateContent);
}

// Initialize i18next with the saved language (or English as a fallback)
const savedLanguage = getSavedLanguage();

i18next.init({
  lng: savedLanguage || 'en',
  fallbackLng: 'en',
  debug: false,
  resources
}, function (err) {
  if (err) return console.error(err);

  updateContent();

  // First visit: show the modal; the catalog is shown after the user chooses
  if (!savedLanguage) {
    modal.hidden = false;
  }
});

// Language choice inside the modal
modal.querySelectorAll('button[data-lang]').forEach((button) => {
  button.addEventListener('click', () => {
    setLanguage(button.dataset.lang);
    modal.hidden = true;
  });
});

// Language switcher on the page
selector.addEventListener('change', function () {
  setLanguage(this.value);
});
