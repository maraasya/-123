/* =========================================================
   INK ART TATTOO — скрипты лендинга
   Чистый JavaScript, без библиотек
   ========================================================= */

'use strict';

/* ---------------------------------------------------------
   0. НАСТРОЙКИ
   --------------------------------------------------------- */
const CONFIG = {
  // Для реальной отправки заявок укажите адрес сервиса обработки форм,
  // например: 'https://formspree.io/f/ВАШ_ID' или 'https://api.web3forms.com/submit'.
  // Пока поле пустое, форма работает в демонстрационном режиме.
  formEndpoint: ''
};

/* ---------------------------------------------------------
   1. ГЕНЕРАТОР ИЛЛЮСТРАЦИЙ
   Чтобы сайт работал сразу, без внешних файлов, изображения
   рисуются как SVG. Чтобы использовать настоящие фото:
   — в массиве GALLERY впишите путь в поле photo ("images/work-1.jpg");
   — для остальных блоков добавьте атрибут data-photo="images/..." элементу .art.
   --------------------------------------------------------- */
const TONES = {
  purple: ['#a78bfa', '#4c1d95', '#150a2a'],
  wine:   ['#fb7185', '#881337', '#2a0610'],
  steel:  ['#e5e7eb', '#6b7280', '#16161a']
};

/** Мотивы татуировок (центр холста 600×750) */
const MOTIFS = {
  // Роза
  rose(a) {
    let petals = '';
    for (let i = 0; i < 6; i++) {
      petals += `<ellipse cx="300" cy="270" rx="${100 - i * 13}" ry="${135 - i * 17}" transform="rotate(${i * 52} 300 340)" fill="none" stroke="url(#l)" stroke-width="3"/>`;
    }
    return `${petals}
      <circle cx="300" cy="340" r="14" fill="url(#l)"/>
      <path d="M300 470 C288 540 322 610 300 700" fill="none" stroke="${a}" stroke-width="3"/>
      <path d="M298 560 q-70 -20 -95 -75 q70 5 95 75z" fill="none" stroke="${a}" stroke-width="2.5"/>
      <path d="M304 620 q70 -20 95 -75 q-70 5 -95 75z" fill="none" stroke="${a}" stroke-width="2.5"/>`;
  },

  // Мандала (blackwork)
  mandala(a) {
    let petals = '', dots = '';
    for (let i = 0; i < 12; i++) {
      petals += `<path d="M300 360 C268 290 268 225 300 180 C332 225 332 290 300 360Z" transform="rotate(${i * 30} 300 360)" fill="${i % 2 ? 'url(#l)' : 'none'}" stroke="${a}" stroke-width="2.5"/>`;
      dots += `<circle cx="300" cy="150" r="5" transform="rotate(${i * 30} 300 360)" fill="${a}"/>`;
    }
    return `${petals}${dots}
      <circle cx="300" cy="360" r="38" fill="#000" stroke="${a}" stroke-width="3"/>
      <circle cx="300" cy="360" r="215" fill="none" stroke="${a}" stroke-width="2" stroke-dasharray="3 9"/>
      <circle cx="300" cy="360" r="245" fill="none" stroke="${a}" stroke-width="1.5"/>`;
  },

  // Луна (минимализм)
  moon(a) {
    return `<path d="M345 250 A120 120 0 1 0 345 470 A92 92 0 1 1 345 250Z" fill="url(#l)"/>
      <circle cx="420" cy="300" r="5" fill="${a}"/><circle cx="455" cy="360" r="3" fill="${a}"/>
      <circle cx="400" cy="440" r="4" fill="${a}"/><circle cx="215" cy="230" r="3" fill="${a}"/>
      <path d="M180 560 H420" stroke="${a}" stroke-width="2.5" stroke-linecap="round"/>
      <path d="M230 590 H370" stroke="${a}" stroke-width="2" stroke-linecap="round"/>`;
  },

  // Веточка (fine line)
  branch(a) {
    let leaves = '';
    for (let i = 0; i < 7; i++) {
      const y = 640 - i * 70, s = i % 2 ? 1 : -1;
      leaves += `<path d="M300 ${y} q${s * 50} -40 ${s * 95} -15 q${-s * 45} 45 ${-s * 95} 15z" fill="none" stroke="${a}" stroke-width="1.8"/>
                 <path d="M300 ${y} q${s * 40} -14 ${s * 80} -12" fill="none" stroke="${a}" stroke-width="1"/>`;
    }
    return `<path d="M300 710 C278 560 342 460 300 330 C282 260 322 200 300 130" fill="none" stroke="${a}" stroke-width="2"/>${leaves}`;
  },

  // Глаз (реализм)
  eye(a) {
    let lashes = '';
    for (let i = 0; i < 9; i++) {
      const x = 150 + i * 37, y = 330 - Math.sin((i / 8) * Math.PI) * 85;
      lashes += `<line x1="${x}" y1="${y}" x2="${x + (i - 4) * 4}" y2="${y - 26}" stroke="${a}" stroke-width="2"/>`;
    }
    return `<path d="M100 360 Q300 190 500 360 Q300 530 100 360Z" fill="rgba(0,0,0,.45)" stroke="${a}" stroke-width="3"/>
      <circle cx="300" cy="360" r="88" fill="url(#g)" stroke="${a}" stroke-width="3"/>
      <circle cx="300" cy="360" r="62" fill="none" stroke="${a}" stroke-width="1.5" stroke-dasharray="2 5"/>
      <circle cx="300" cy="360" r="34" fill="#000"/>
      <circle cx="326" cy="334" r="13" fill="#fff" opacity=".9"/>
      ${lashes}`;
  },

  // Перекрытие (кавер-ап)
  cover(a) {
    let hatch = '';
    for (let i = 0; i < 14; i++) hatch += `<line x1="${120 + i * 28}" y1="200" x2="${40 + i * 28}" y2="560" stroke="${a}" stroke-width="1.2" opacity=".5"/>`;
    return `<circle cx="250" cy="330" r="130" fill="#000" opacity=".55" stroke="${a}" stroke-width="3"/>
      <circle cx="350" cy="410" r="150" fill="url(#l)" opacity=".7"/>
      <circle cx="300" cy="370" r="190" fill="none" stroke="${a}" stroke-width="3"/>${hatch}`;
  },

  // Кинжал
  dagger(a) {
    return `<path d="M300 130 L335 440 H265Z" fill="url(#l)" stroke="${a}" stroke-width="2"/>
      <line x1="300" y1="150" x2="300" y2="430" stroke="#000" stroke-opacity=".4" stroke-width="2"/>
      <rect x="215" y="440" width="170" height="18" rx="9" fill="${a}"/>
      <rect x="288" y="458" width="24" height="120" rx="8" fill="none" stroke="${a}" stroke-width="3"/>
      <circle cx="300" cy="600" r="24" fill="none" stroke="${a}" stroke-width="3"/>`;
  },

  // Аватар мастера
  avatar(a, label) {
    return `<circle cx="300" cy="300" r="105" fill="url(#l)" opacity=".9"/>
      <path d="M90 750 C90 560 190 470 300 470 C410 470 510 560 510 750Z" fill="url(#l)" opacity=".75"/>
      <text x="300" y="334" text-anchor="middle" font-family="Georgia,serif" font-size="96" font-weight="700" fill="#fff">${label || ''}</text>`;
  }
};

/** Возвращает data-URI с SVG-иллюстрацией */
function makeArt(type, tone = 'purple', label = '') {
  const [a, b, bg] = TONES[tone] || TONES.purple;
  const motif = (MOTIFS[type] || MOTIFS.rose)(a, label);
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 750">
    <defs>
      <radialGradient id="g" cx="50%" cy="40%" r="75%"><stop offset="0" stop-color="${b}" stop-opacity=".6"/><stop offset="1" stop-color="${bg}"/></radialGradient>
      <linearGradient id="l" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${a}"/><stop offset="1" stop-color="${b}"/></linearGradient>
    </defs>
    <rect width="600" height="750" fill="url(#g)"/>
    <rect width="600" height="750" fill="none" stroke="${a}" stroke-opacity=".12" stroke-width="20"/>
    ${motif}
  </svg>`;
  return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
}

/** Вставляет изображения во все блоки .art[data-art] */
function hydrateArt(root = document) {
  root.querySelectorAll('.art[data-art]').forEach(el => {
    if (el.querySelector('img')) return;
    const fallback = makeArt(el.dataset.art, el.dataset.tone, el.dataset.label);
    const img = new Image();
    img.alt = el.dataset.alt || '';
    img.loading = 'lazy';
    img.decoding = 'async';
    img.src = el.dataset.photo || fallback;
    // если фото не загрузилось, показываем иллюстрацию
    img.onerror = () => { img.onerror = null; img.src = fallback; };
    el.appendChild(img);
  });
}

/* ---------------------------------------------------------
   2. ДАННЫЕ ГАЛЕРЕИ
   style: minimal | realism | blackwork | fineline | cover
   photo: путь к реальному фото (необязательно)
   --------------------------------------------------------- */
const GALLERY = [
  { style: 'realism',   label: 'Реализм',      art: 'eye',     tone: 'wine',   title: 'Взгляд',               master: 'Артём Волков',   desc: 'Реалистичный глаз с проработкой бликов и радужки. Один сеанс, около 5 часов.', photo: '' },
  { style: 'blackwork', label: 'Blackwork',    art: 'mandala', tone: 'purple', title: 'Мандала на плечо',     master: 'Максим Крылов',  desc: 'Симметричный орнамент из плотного чёрного пигмента. Работа в два сеанса.', photo: '' },
  { style: 'fineline',  label: 'Fine Line',    art: 'branch',  tone: 'steel',  title: 'Ветвь на предплечье',  master: 'Алина Северова', desc: 'Тонкая ботаническая композиция линией в одну иглу.', photo: '' },
  { style: 'minimal',   label: 'Минимализм',   art: 'moon',    tone: 'steel',  title: 'Лунный серп',          master: 'Дарья Лисицына', desc: 'Небольшая работа для запястья: чистая форма и три звезды.', photo: '' },
  { style: 'cover',     label: 'Перекрытие',   art: 'cover',   tone: 'purple', title: 'Новая жизнь рисунка',  master: 'Илья Громов',    desc: 'Перекрытие старой работы насыщенной композицией с плотным контуром.', photo: '' },
  { style: 'realism',   label: 'Реализм',      art: 'rose',    tone: 'wine',   title: 'Роза с листьями',      master: 'Артём Волков',   desc: 'Реалистичная роза с мягкой светотенью. Один сеанс, около 4 часов.', photo: '' },
  { style: 'blackwork', label: 'Blackwork',    art: 'dagger',  tone: 'steel',  title: 'Кинжал',               master: 'Максим Крылов',  desc: 'Графика в чёрном цвете с контрастной штриховкой.', photo: '' },
  { style: 'fineline',  label: 'Fine Line',    art: 'rose',    tone: 'purple', title: 'Нежная роза',          master: 'Алина Северова', desc: 'Тонкий контур розы без заливки, небольшой размер.', photo: '' },
  { style: 'minimal',   label: 'Минимализм',   art: 'dagger',  tone: 'purple', title: 'Мини-кинжал',          master: 'Дарья Лисицына', desc: 'Компактный символ высотой 5 см, лёгкий контур.', photo: '' },
  { style: 'cover',     label: 'Перекрытие',   art: 'mandala', tone: 'wine',   title: 'Орнамент поверх',      master: 'Илья Громов',    desc: 'Старая надпись скрыта орнаментом. Консультация заняла 30 минут.', photo: '' },
  { style: 'realism',   label: 'Реализм',      art: 'eye',     tone: 'steel',  title: 'Чёрно-белый портрет',  master: 'Артём Волков',   desc: 'Монохромная реалистичная работа с мягким градиентом.', photo: '' },
  { style: 'fineline',  label: 'Fine Line',    art: 'moon',    tone: 'wine',   title: 'Луна и звёзды',        master: 'Алина Северова', desc: 'Тонкая линия и точечные звёзды, работа под ключицей.', photo: '' }
];

/* ---------------------------------------------------------
   3. ШАПКА, МОБИЛЬНОЕ МЕНЮ, АКТИВНЫЙ ПУНКТ
   --------------------------------------------------------- */
const header = document.getElementById('header');
const burger = document.getElementById('burger');
const nav = document.getElementById('nav');

function setMenu(open) {
  nav.classList.toggle('is-open', open);
  burger.classList.toggle('is-open', open);
  burger.setAttribute('aria-expanded', String(open));
  burger.setAttribute('aria-label', open ? 'Закрыть меню' : 'Открыть меню');
  document.body.classList.toggle('no-scroll', open);
}

burger.addEventListener('click', () => setMenu(!nav.classList.contains('is-open')));
nav.querySelectorAll('a').forEach(link => link.addEventListener('click', () => setMenu(false)));
document.addEventListener('keydown', e => { if (e.key === 'Escape') setMenu(false); });

// Фон шапки при прокрутке
function onScroll() { header.classList.toggle('is-scrolled', window.scrollY > 40); }
window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

// Подсветка активного раздела
const navLinks = [...document.querySelectorAll('.nav__link')];
const sectionObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navLinks.forEach(l => l.classList.toggle('is-active', l.getAttribute('href') === '#' + entry.target.id));
    }
  });
}, { rootMargin: '-45% 0px -50% 0px' });
document.querySelectorAll('main section[id]').forEach(s => sectionObserver.observe(s));

/* ---------------------------------------------------------
   4. АНИМАЦИЯ ПОЯВЛЕНИЯ ПРИ ПРОКРУТКЕ
   --------------------------------------------------------- */
const revealObserver = new IntersectionObserver((entries, obs) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const el = entry.target;
    el.classList.add('is-visible');
    obs.unobserve(el);
    // после завершения анимации убираем задержку, чтобы hover-эффекты были мгновенными
    setTimeout(() => { el.style.transitionDelay = ''; el.classList.add('reveal-done'); }, 1500);
  });
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

function initReveal() {
  document.querySelectorAll('.reveal').forEach(el => {
    // небольшая задержка внутри сеток для эффекта каскада
    const siblings = el.parentElement ? [...el.parentElement.children].filter(c => c.classList.contains('reveal')) : [];
    const index = siblings.indexOf(el);
    if (index > 0) el.style.transitionDelay = Math.min(index * 80, 400) + 'ms';
    revealObserver.observe(el);
  });
}

/* ---------------------------------------------------------
   5. СЧЁТЧИКИ СТАТИСТИКИ
   --------------------------------------------------------- */
function animateCounter(el) {
  const target = Number(el.dataset.count);
  const suffix = el.dataset.suffix || '';
  const duration = 1800;
  const start = performance.now();

  function frame(now) {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3); // плавное замедление
    el.textContent = Math.round(target * eased).toLocaleString('ru-RU') + (progress === 1 ? suffix : '');
    if (progress < 1) requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
}

const counterObserver = new IntersectionObserver((entries, obs) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) { animateCounter(entry.target); obs.unobserve(entry.target); }
  });
}, { threshold: 0.6 });
document.querySelectorAll('[data-count]').forEach(el => counterObserver.observe(el));

/* ---------------------------------------------------------
   6. ГАЛЕРЕЯ: ОТРИСОВКА И ФИЛЬТРАЦИЯ
   --------------------------------------------------------- */
const galleryGrid = document.getElementById('gallery-grid');

function renderGallery() {
  galleryGrid.innerHTML = GALLERY.map((item, i) => `
    <figure class="gallery__item" data-style="${item.style}" data-index="${i}" tabindex="0" role="button"
            aria-label="Открыть работу: ${item.title}" style="animation-delay:${i * 50}ms">
      <img src="${item.photo || makeArt(item.art, item.tone)}" alt="${item.title}, ${item.label}" loading="lazy"
           onerror="this.onerror=null;this.src='${makeArt(item.art, item.tone).replace(/'/g, '%27')}'">
      <span class="gallery__zoom"><svg class="i"><use href="#i-arrow"/></svg></span>
      <figcaption class="gallery__cap">
        <h3>${item.title}</h3>
        <p>${item.label} · ${item.master}</p>
      </figcaption>
    </figure>`).join('');
}

const filterButtons = document.querySelectorAll('.filter');
filterButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    const filter = btn.dataset.filter;
    filterButtons.forEach(b => { b.classList.toggle('is-active', b === btn); b.setAttribute('aria-selected', String(b === btn)); });

    let shown = 0;
    galleryGrid.querySelectorAll('.gallery__item').forEach(item => {
      const match = filter === 'all' || item.dataset.style === filter;
      item.classList.toggle('is-hidden', !match);
      if (match) {
        // перезапуск анимации появления
        item.style.animation = 'none'; void item.offsetWidth;
        item.style.animation = `pop .6s var(--ease) ${shown * 60}ms both`;
        shown++;
      }
    });
  });
});

/* ---------------------------------------------------------
   7. МОДАЛЬНОЕ ОКНО С УВЕЛИЧЕНИЕМ ИЗОБРАЖЕНИЙ
   --------------------------------------------------------- */
const modal = document.getElementById('modal');
const modalImg = document.getElementById('modal-img');
const modalTitle = document.getElementById('modal-title');
const modalDesc = document.getElementById('modal-desc');
let currentIndex = 0;
let lastFocused = null;

/** Индексы работ, видимых при текущем фильтре */
function visibleIndexes() {
  return [...galleryGrid.querySelectorAll('.gallery__item:not(.is-hidden)')].map(el => Number(el.dataset.index));
}

function fillModal(index) {
  const item = GALLERY[index];
  currentIndex = index;
  modalImg.src = item.photo || makeArt(item.art, item.tone);
  modalImg.alt = `${item.title}, ${item.label}`;
  modalTitle.textContent = item.title;
  modalDesc.textContent = `${item.label} · мастер ${item.master}. ${item.desc}`;
}

function openModal(index) {
  lastFocused = document.activeElement;
  fillModal(index);
  modal.classList.add('is-open');
  modal.setAttribute('aria-hidden', 'false');
  document.body.classList.add('no-scroll');
  modal.querySelector('.modal__close').focus();
}

function closeModal() {
  modal.classList.remove('is-open');
  modal.setAttribute('aria-hidden', 'true');
  document.body.classList.remove('no-scroll');
  if (lastFocused) lastFocused.focus();
}

function stepModal(dir) {
  const list = visibleIndexes();
  const pos = list.indexOf(currentIndex);
  fillModal(list[(pos + dir + list.length) % list.length]);
}

galleryGrid.addEventListener('click', e => {
  const item = e.target.closest('.gallery__item');
  if (item) openModal(Number(item.dataset.index));
});
galleryGrid.addEventListener('keydown', e => {
  if (e.key !== 'Enter' && e.key !== ' ') return;
  const item = e.target.closest('.gallery__item');
  if (item) { e.preventDefault(); openModal(Number(item.dataset.index)); }
});

modal.querySelectorAll('[data-close]').forEach(el => el.addEventListener('click', closeModal));
document.getElementById('modal-prev').addEventListener('click', () => stepModal(-1));
document.getElementById('modal-next').addEventListener('click', () => stepModal(1));
document.addEventListener('keydown', e => {
  if (!modal.classList.contains('is-open')) return;
  if (e.key === 'Escape') closeModal();
  if (e.key === 'ArrowLeft') stepModal(-1);
  if (e.key === 'ArrowRight') stepModal(1);
});

/* ---------------------------------------------------------
   8. КНОПКИ «ЗАПИСАТЬСЯ» У МАСТЕРОВ
   --------------------------------------------------------- */
document.querySelectorAll('[data-book]').forEach(btn => {
  btn.addEventListener('click', () => {
    document.getElementById('master').value = btn.dataset.book;
    clearError('master');
    document.getElementById('booking').scrollIntoView({ behavior: 'smooth' });
    setTimeout(() => document.getElementById('name').focus({ preventScroll: true }), 700);
  });
});

/* ---------------------------------------------------------
   9. ФОРМА ЗАПИСИ: ПРОВЕРКА И ОТПРАВКА
   --------------------------------------------------------- */
const form = document.getElementById('booking-form');
const submitBtn = document.getElementById('submit-btn');

// Нельзя выбрать прошедшую дату (с учётом местного часового пояса)
const dateInput = document.getElementById('date');
(function setMinDate() {
  const d = new Date();
  d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
  dateInput.min = d.toISOString().split('T')[0];
})();

/** Правила проверки: возвращают текст ошибки или пустую строку */
const VALIDATORS = {
  name(v) {
    v = v.trim();
    if (!v) return 'Укажите ваше имя';
    if (v.length < 2) return 'Имя слишком короткое';
    if (!/^[A-Za-zА-Яа-яЁё\s'’-]+$/.test(v)) return 'Имя может содержать только буквы';
    return '';
  },
  phone(v) {
    const digits = v.replace(/\D/g, '');
    if (!v.trim()) return 'Укажите номер телефона';
    if (!/^[\d\s()+-]+$/.test(v)) return 'Телефон содержит недопустимые символы';
    if (digits.length < 10 || digits.length > 12) return 'Введите корректный номер (10–12 цифр)';
    return '';
  },
  email(v) {
    v = v.trim();
    if (!v) return 'Укажите электронную почту';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v)) return 'Введите почту в формате name@example.com';
    return '';
  },
  master(v) { return v ? '' : 'Выберите мастера'; },
  style(v) { return v ? '' : 'Выберите стиль татуировки'; },
  date(v) {
    if (!v) return 'Выберите дату сеанса';
    if (v < dateInput.min) return 'Дата не может быть в прошлом';
    return '';
  },
  agree(_, el) { return el.checked ? '' : 'Необходимо ваше согласие'; }
};

function errorBox(name) { return form.querySelector(`[data-error-for="${name}"]`); }

function showError(name, message) {
  const box = errorBox(name);
  if (box) box.textContent = message;
  const field = form.elements[name].closest('.field');
  if (field) field.classList.toggle('has-error', Boolean(message));
}
function clearError(name) { showError(name, ''); }

function validateField(name) {
  const el = form.elements[name];
  const message = VALIDATORS[name](el.value, el);
  showError(name, message);
  return !message;
}

// Проверка «на лету»: при уходе с поля и при исправлении ошибки
Object.keys(VALIDATORS).forEach(name => {
  const el = form.elements[name];
  el.addEventListener('blur', () => validateField(name));
  const evt = (el.tagName === 'SELECT' || el.type === 'checkbox' || el.type === 'date') ? 'change' : 'input';
  el.addEventListener(evt, () => {
    if (el.closest('.field')?.classList.contains('has-error') || errorBox(name)?.textContent) validateField(name);
  });
});

/** Показ уведомления */
const toast = document.getElementById('toast');
let toastTimer;
function showToast(message, isError = false) {
  toast.textContent = message;
  toast.classList.toggle('is-error', isError);
  toast.classList.add('is-show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('is-show'), 5500);
}

form.addEventListener('submit', async e => {
  e.preventDefault();

  // защита от ботов: если скрытое поле заполнено, молча выходим
  if (form.elements['_gotcha'].value) return;

  const results = Object.keys(VALIDATORS).map(validateField);
  if (results.includes(false)) {
    const firstBad = form.querySelector('.has-error input, .has-error select') || form.elements.agree;
    firstBad.focus();
    showToast('Проверьте поля формы: есть незаполненные или неверные данные.', true);
    return;
  }

  const originalText = submitBtn.textContent;
  submitBtn.disabled = true;
  submitBtn.textContent = 'Отправляем…';

  try {
    if (CONFIG.formEndpoint) {
      // Реальная отправка в сервис обработки форм
      const response = await fetch(CONFIG.formEndpoint, {
        method: 'POST',
        headers: { 'Accept': 'application/json' },
        body: new FormData(form)
      });
      if (!response.ok) throw new Error('Ошибка сервера: ' + response.status);
    } else {
      // Демонстрационный режим: имитация отправки
      await new Promise(resolve => setTimeout(resolve, 900));
    }

    const name = form.elements.name.value.trim().split(/\s+/)[0];
    showToast(`Спасибо, ${name}! Заявка принята. Мы свяжемся с вами в ближайшее время.`);
    form.reset();
  } catch (err) {
    console.error(err);
    showToast('Не удалось отправить заявку. Попробуйте ещё раз или позвоните нам.', true);
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = originalText;
  }
});

/* ---------------------------------------------------------
   10. ЗАПУСК
   --------------------------------------------------------- */
document.getElementById('year').textContent = new Date().getFullYear();
renderGallery();
hydrateArt();
initReveal();
