(() => {
  const dictionary = window.KOSLER_ENGLISH;
  const storageKey = 'kosler-language';
  const textOriginals = new WeakMap();
  const attributeOriginals = new WeakMap();
  const attributes = ['alt', 'title', 'aria-label', 'placeholder', 'aria-description'];
  const metadata = 'meta[name="description"], meta[property="og:title"], meta[property="og:description"], meta[name="twitter:title"], meta[name="twitter:description"]';
  const ignored = 'script, style, noscript, code, pre, [translate="no"]';
  const root = document.documentElement;
  const switcher = document.createElement('div');
  switcher.className = 'kosler-language';
  switcher.setAttribute('role', 'group');
  switcher.setAttribute('translate', 'no');

  const buttons = ['es', 'en'].map(code => {
    const button = document.createElement('button');
    button.type = 'button';
    button.lang = code;
    button.textContent = code.toUpperCase();
    button.setAttribute('aria-label', code === 'es' ? 'Español' : 'English');
    button.addEventListener('click', () => selectLanguage(code));
    switcher.append(button);
    return button;
  });

  const header = document.querySelector('header.nav');
  const navigation = header?.querySelector('.nav-links');
  if (navigation) navigation.after(switcher);
  else (header ?? document.querySelector('main') ?? document.body).prepend(switcher);

  let language = 'es';
  const observer = new MutationObserver(records => {
    observer.disconnect();
    for (const record of records) {
      if (record.type === 'attributes') translateAttributes(record.target);
      if (record.type === 'characterData') translateText(record.target);
      if (record.type === 'childList') record.addedNodes.forEach(translateTree);
    }
    observe();
  });

  function observe() {
    observer.observe(root, {
      subtree: true, childList: true, characterData: true,
      attributes: true, attributeFilter: [...attributes, 'content']
    });
  }

  function update(value, previous, write, remember) {
    if (previous && value === previous.english) {
      if (language === 'es') write(previous.original);
      return;
    }
    const key = value.trim().replace(/\s+/gu, ' ');
    if (!Object.hasOwn(dictionary, key)) return;
    const english = value.match(/^\s*/u)[0] + dictionary[key] + value.match(/\s*$/u)[0];
    remember({ original: value, english });
    if (language === 'en') write(english);
  }

  function translateText(node) {
    const parent = node.parentElement;
    if (!parent || parent.closest(ignored)) return;
    update(node.data, textOriginals.get(node), value => {
      if (parent.matches('option:not([value])')) parent.setAttribute('value', parent.value);
      node.data = value;
    }, original => textOriginals.set(node, original));
  }

  function translateAttributes(element) {
    if (element.closest(ignored)) return;
    const names = element.matches(metadata) ? ['content', ...attributes] : attributes;
    for (const name of names) {
      if (!element.hasAttribute(name)) continue;
      const originals = attributeOriginals.get(element) ?? new Map();
      update(element.getAttribute(name), originals.get(name), value => {
        element.setAttribute(name, value);
      }, original => {
        originals.set(name, original);
        attributeOriginals.set(element, originals);
      });
    }
  }

  function translateTree(node) {
    if (node.nodeType === Node.TEXT_NODE) {
      translateText(node);
      return;
    }
    if (node.nodeType !== Node.ELEMENT_NODE || node.closest(ignored)) return;
    translateAttributes(node);
    for (const child of node.childNodes) translateTree(child);
  }

  function selectLanguage(code) {
    observer.disconnect();
    language = code;
    root.lang = code;
    switcher.setAttribute('aria-label', code === 'en' ? 'Language' : 'Idioma');
    for (const button of buttons) button.setAttribute('aria-pressed', String(button.lang === code));
    translateTree(root);
    observe();
    try { localStorage.setItem(storageKey, code); } catch { /* Storage may be blocked. */ }
  }

  let preference;
  try { preference = localStorage.getItem(storageKey); } catch { /* Default to Spanish. */ }
  selectLanguage(preference === 'en' ? 'en' : 'es');
})();
