const links = [...document.querySelectorAll('.pd-navigation [data-section]')];
const panels = links.map(link => document.getElementById('panel-' + link.dataset.section));

if (links.length && panels.every(Boolean)) {
  function showSection() {
    const fragment = location.hash;
    const selected = links.findIndex(link =>
      link.hash === fragment || '#' + link.dataset.section === fragment
    );
    const current = selected < 0 ? 0 : selected;
    links.forEach((link, index) => {
      if (index === current) link.setAttribute('aria-current', 'true');
      else link.removeAttribute('aria-current');
      panels[index].hidden = index !== current;
    });
  }

  document.querySelectorAll('.pd-navigation a, [data-program-jump]').forEach(link => {
    link.addEventListener('click', event => {
      if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
      const panel = document.getElementById(link.hash.slice(1));
      if (!panel) return;
      event.preventDefault();
      if (location.hash !== link.hash) history.pushState(null, '', link.hash);
      showSection();
      panel.scrollIntoView({block: 'start'});
      panel.tabIndex = -1;
      panel.focus({preventScroll: true});
    });
  });
  showSection();
  window.addEventListener('hashchange', showSection);
}
