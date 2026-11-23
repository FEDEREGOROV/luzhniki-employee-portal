const pages = [...document.querySelectorAll('[data-page-view]')];
const pageButtons = [...document.querySelectorAll('[data-page]')];
const navButtons = [...document.querySelectorAll('.main-nav__item')];
const mobileNav = document.querySelector('#mobileNav');
const mobileMenu = document.querySelector('#mobileMenu');
const toast = document.querySelector('#toast');
let toastTimer;

function showToast(message) {
  toast.textContent = message;
  toast.classList.add('is-visible');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('is-visible'), 2800);
}

function openPage(pageName, updateHash = true) {
  const target = pages.find((page) => page.dataset.pageView === pageName) || pages[0];
  pages.forEach((page) => page.classList.toggle('is-active', page === target));
  navButtons.forEach((button) => button.classList.toggle('is-active', button.dataset.page === target.dataset.pageView));
  if (updateHash) history.replaceState(null, '', `#${target.dataset.pageView}`);
  mobileNav.hidden = true;
  mobileMenu.setAttribute('aria-expanded', 'false');
  document.querySelector('#notificationPopover').hidden = true;
  window.scrollTo({ top: 0, behavior: 'smooth' });
  setTimeout(() => target.querySelector('h1')?.focus({ preventScroll: true }), 50);
}

pageButtons.forEach((button) => button.addEventListener('click', () => openPage(button.dataset.page)));
window.addEventListener('hashchange', () => openPage(location.hash.slice(1) || 'home', false));
openPage(location.hash.slice(1) || 'home', false);

mobileMenu.addEventListener('click', () => {
  mobileNav.hidden = !mobileNav.hidden;
  mobileMenu.setAttribute('aria-expanded', String(!mobileNav.hidden));
});

document.querySelector('#newsExpand').addEventListener('click', (event) => {
  const more = document.querySelector('#newsMore');
  more.hidden = !more.hidden;
  event.currentTarget.setAttribute('aria-expanded', String(!more.hidden));
  event.currentTarget.textContent = more.hidden ? 'Читать полностью' : 'Свернуть';
});

document.querySelector('#allNews').addEventListener('click', () => showToast('На главной уже показаны все актуальные новости'));

document.querySelectorAll('.org-unit__head').forEach((button) => {
  button.addEventListener('click', () => {
    const body = button.nextElementSibling;
    const expanded = button.getAttribute('aria-expanded') === 'true';
    button.setAttribute('aria-expanded', String(!expanded));
    body.hidden = expanded;
  });
});

const orgSearch = document.querySelector('#orgSearch');
orgSearch.addEventListener('input', () => {
  const query = orgSearch.value.trim().toLocaleLowerCase('ru');
  document.querySelectorAll('.org-person, .org-team').forEach((item) => {
    item.classList.toggle('is-match', query.length > 1 && item.textContent.toLocaleLowerCase('ru').includes(query));
  });
});

const employeeModal = document.querySelector('#employeeModal');
function openEmployeeModal(data) {
  const [name, role, department, initials] = data.split('|');
  document.querySelector('#employeeName').textContent = name;
  document.querySelector('#employeeRole').textContent = role;
  document.querySelector('#employeeDepartment').textContent = department;
  document.querySelector('#employeeInitials').textContent = initials;
  const mailName = name.toLocaleLowerCase('ru').replaceAll(' ', '.');
  document.querySelector('#employeeMail').href = `mailto:${mailName}@luzhniki.ru`;
  employeeModal.hidden = false;
  document.body.style.overflow = 'hidden';
  employeeModal.querySelector('.modal__close').focus();
}

document.querySelectorAll('.employee-open').forEach((button) => button.addEventListener('click', () => openEmployeeModal(button.dataset.employee)));
document.querySelectorAll('[data-close-modal]').forEach((button) => button.addEventListener('click', () => {
  employeeModal.hidden = true;
  document.body.style.overflow = '';
}));

const peopleSearch = document.querySelector('#peopleSearch');
const departmentFilter = document.querySelector('#departmentFilter');
function filterPeople() {
  const query = peopleSearch.value.trim().toLocaleLowerCase('ru');
  const department = departmentFilter.value;
  let visible = 0;
  document.querySelectorAll('#newcomersGrid .person-card').forEach((card) => {
    const matchesText = !query || card.textContent.toLocaleLowerCase('ru').includes(query);
    const matchesDepartment = department === 'all' || card.dataset.department === department;
    card.hidden = !(matchesText && matchesDepartment);
    if (!card.hidden) visible += 1;
  });
  document.querySelector('#peopleEmpty').hidden = visible > 0;
}
peopleSearch.addEventListener('input', filterPeople);
departmentFilter.addEventListener('change', filterPeople);

const portalToday = new Date(2026, 10, 23);
let calendarDate = new Date(portalToday.getFullYear(), portalToday.getMonth(), 1);
const birthdaysByDate = {
  '2026-10-03': [{ name: 'Игорь Смирнов', role: 'Транспортный отдел', initials: 'ИС' }],
  '2026-10-14': [{ name: 'Марина Яковлева', role: 'Дирекция спорта', initials: 'МЯ' }],
  '2026-11-06': [{ name: 'Светлана Орехова', role: 'Маркетинг', initials: 'СО' }],
  '2026-11-12': [{ name: 'Артём Кузнецов', role: 'Инженерная служба', initials: 'АК' }],
  '2026-11-18': [{ name: 'Елена Новикова', role: 'Отдел кадров', initials: 'ЕН' }],
  '2026-11-26': [{ name: 'Андрей Колесников', role: 'Дирекция спорта', initials: 'АК' }],
  '2026-11-28': [
    { name: 'Оксана Петрова', role: 'Пресс-служба', initials: 'ОП' },
    { name: 'Михаил Ларин', role: 'Инженерная служба', initials: 'МЛ' },
  ],
  '2026-11-29': [{ name: 'Алёна Сафина', role: 'Финансовое управление', initials: 'АС' }],
  '2026-12-02': [{ name: 'Роман Ильин', role: 'Эксплуатация', initials: 'РИ' }],
  '2026-12-15': [{ name: 'Мария Соколова', role: 'Спорт и события', initials: 'МС' }],
  '2026-12-22': [{ name: 'Павел Зорин', role: 'Транспортный отдел', initials: 'ПЗ' }],
  '2026-12-30': [{ name: 'Наталья Ершова', role: 'Дирекция по персоналу', initials: 'НЕ' }],
  '2027-01-08': [{ name: 'Денис Ковалёв', role: 'Коммуникации', initials: 'ДК' }],
  '2027-01-21': [{ name: 'Вера Титова', role: 'Спортивные программы', initials: 'ВТ' }],
};

const monthFormatter = new Intl.DateTimeFormat('ru-RU', { month: 'long', year: 'numeric' });
const shortMonthFormatter = new Intl.DateTimeFormat('ru-RU', { month: 'short' });
const monthPrepositional = ['январе', 'феврале', 'марте', 'апреле', 'мае', 'июне', 'июле', 'августе', 'сентябре', 'октябре', 'ноябре', 'декабре'];

function dateKey(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function renderCalendar() {
  const year = calendarDate.getFullYear();
  const month = calendarDate.getMonth();
  const firstDay = new Date(year, month, 1);
  const mondayOffset = (firstDay.getDay() + 6) % 7;
  const gridStart = new Date(year, month, 1 - mondayOffset);
  const monthLabel = monthFormatter.format(calendarDate).replace(' г.', '');
  document.querySelector('#calendarMonth').textContent = monthLabel.charAt(0).toUpperCase() + monthLabel.slice(1);
  document.querySelector('#monthBirthdayTitle').textContent = `В ${monthPrepositional[month]}`;

  const cells = [];
  for (let index = 0; index < 42; index += 1) {
    const day = new Date(gridStart.getFullYear(), gridStart.getMonth(), gridStart.getDate() + index);
    const key = dateKey(day);
    const events = birthdaysByDate[key] || [];
    const outside = day.getMonth() !== month;
    const today = key === dateKey(portalToday);
    const eventMarkup = events.map((person) => `<span class="month-day__event">${person.name}</span>`).join('');
    cells.push(`<button class="month-day${outside ? ' is-outside' : ''}${today ? ' is-today' : ''}" role="gridcell" data-date="${key}" aria-label="${day.getDate()} ${shortMonthFormatter.format(day)}${events.length ? `, дней рождения: ${events.length}` : ''}"><span class="month-day__number">${day.getDate()}</span>${eventMarkup}</button>`);
  }
  const monthGrid = document.querySelector('#monthGrid');
  monthGrid.innerHTML = cells.join('');
  monthGrid.querySelectorAll('.month-day').forEach((button) => {
    button.addEventListener('click', () => {
      const people = birthdaysByDate[button.dataset.date] || [];
      if (!people.length) showToast('В этот день дней рождения нет');
      else showToast(people.map((person) => person.name).join(', '));
    });
  });

  const entries = Object.entries(birthdaysByDate)
    .filter(([key]) => key.startsWith(`${year}-${String(month + 1).padStart(2, '0')}`))
    .flatMap(([key, people]) => people.map((person) => ({ ...person, day: Number(key.slice(-2)) })))
    .sort((a, b) => a.day - b.day || a.name.localeCompare(b.name, 'ru'));
  const list = document.querySelector('#monthBirthdayList');
  const empty = document.querySelector('#monthBirthdayEmpty');
  list.innerHTML = entries.map((person) => `<div class="month-person"><span class="avatar avatar--lime">${person.initials}</span><div><strong>${person.name}</strong><small>${person.role}</small></div><time>${person.day}</time></div>`).join('');
  empty.hidden = entries.length > 0;
}

document.querySelector('#calendarPrev').addEventListener('click', () => {
  calendarDate = new Date(calendarDate.getFullYear(), calendarDate.getMonth() - 1, 1);
  renderCalendar();
});
document.querySelector('#calendarNext').addEventListener('click', () => {
  calendarDate = new Date(calendarDate.getFullYear(), calendarDate.getMonth() + 1, 1);
  renderCalendar();
});
document.querySelector('#calendarToday').addEventListener('click', () => {
  calendarDate = new Date(portalToday.getFullYear(), portalToday.getMonth(), 1);
  renderCalendar();
});
renderCalendar();

const profileModal = document.querySelector('#profileModal');
const profileForm = document.querySelector('#profileForm');
function closeProfileModal() {
  profileModal.hidden = true;
  document.body.style.overflow = '';
}
document.querySelector('#editProfile').addEventListener('click', () => {
  profileModal.hidden = false;
  document.body.style.overflow = 'hidden';
  profileForm.elements.name.focus();
});
document.querySelectorAll('[data-close-profile]').forEach((button) => button.addEventListener('click', closeProfileModal));
profileForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const data = Object.fromEntries(new FormData(profileForm));
  document.querySelector('#profileName').textContent = data.name;
  document.querySelector('#profileEmail').textContent = data.email;
  document.querySelector('#profilePhone').textContent = data.phone;
  document.querySelector('.profile-chip__copy strong').textContent = data.name;
  try { localStorage.setItem('luzhnikiProfile', JSON.stringify(data)); } catch (_) { /* local storage may be disabled */ }
  closeProfileModal();
  showToast('Профиль сохранён');
});

try {
  const saved = JSON.parse(localStorage.getItem('luzhnikiProfile'));
  if (saved?.name && saved?.email && saved?.phone) {
    profileForm.elements.name.value = saved.name;
    profileForm.elements.email.value = saved.email;
    profileForm.elements.phone.value = saved.phone;
    document.querySelector('#profileName').textContent = saved.name;
    document.querySelector('#profileEmail').textContent = saved.email;
    document.querySelector('#profilePhone').textContent = saved.phone;
    document.querySelector('.profile-chip__copy strong').textContent = saved.name;
  }
} catch (_) { /* ignore malformed local data */ }

document.querySelectorAll('[data-toast]').forEach((button) => button.addEventListener('click', () => showToast(button.dataset.toast)));

const searchOverlay = document.querySelector('#searchOverlay');
const globalSearch = document.querySelector('#globalSearch');
const searchResults = document.querySelector('#searchResults');
const searchData = [
  { title: 'Андрей Колесников', detail: 'Руководитель проектов · Дирекция спорта', page: 'birthdays' },
  { title: 'Мария Соколова', detail: 'Менеджер по мероприятиям', page: 'newcomers' },
  { title: 'Роман Ильин', detail: 'Инженер эксплуатации', page: 'newcomers' },
  { title: 'Структура компании', detail: 'Все подразделения и сотрудники', page: 'structure' },
  { title: 'Финансовый онлайн-зачёт', detail: 'Новость · 6 октября 2026', page: 'home' },
  { title: 'Заказать справку', detail: 'Сервис личного кабинета', page: 'profile' },
  { title: 'Контакты портала', detail: 'Поддержка сотрудников', page: 'about' },
];

function closeSearch() {
  searchOverlay.hidden = true;
  document.body.style.overflow = '';
}
document.querySelector('#searchToggle').addEventListener('click', () => {
  searchOverlay.hidden = false;
  document.body.style.overflow = 'hidden';
  setTimeout(() => globalSearch.focus(), 50);
});
document.querySelector('#searchClose').addEventListener('click', closeSearch);
searchOverlay.addEventListener('click', (event) => { if (event.target === searchOverlay) closeSearch(); });
document.querySelectorAll('[data-search-page]').forEach((button) => button.addEventListener('click', () => { closeSearch(); openPage(button.dataset.searchPage); }));
globalSearch.addEventListener('input', () => {
  const query = globalSearch.value.trim().toLocaleLowerCase('ru');
  if (!query) { searchResults.hidden = true; searchResults.innerHTML = ''; return; }
  const matches = searchData.filter((item) => `${item.title} ${item.detail}`.toLocaleLowerCase('ru').includes(query));
  searchResults.innerHTML = matches.length
    ? matches.map((item) => `<button data-result-page="${item.page}"><strong>${item.title}</strong><small>${item.detail}</small></button>`).join('')
    : '<p>Ничего не найдено. Попробуйте другой запрос.</p>';
  searchResults.hidden = false;
  searchResults.querySelectorAll('[data-result-page]').forEach((button) => button.addEventListener('click', () => { closeSearch(); openPage(button.dataset.resultPage); }));
});

const notificationPopover = document.querySelector('#notificationPopover');
document.querySelector('#notifyButton').addEventListener('click', (event) => {
  event.stopPropagation();
  notificationPopover.hidden = !notificationPopover.hidden;
});
document.addEventListener('click', (event) => {
  if (!notificationPopover.hidden && !notificationPopover.contains(event.target)) notificationPopover.hidden = true;
});

document.addEventListener('keydown', (event) => {
  if (event.key !== 'Escape') return;
  if (!searchOverlay.hidden) closeSearch();
  if (!employeeModal.hidden) { employeeModal.hidden = true; document.body.style.overflow = ''; }
  if (!profileModal.hidden) closeProfileModal();
  notificationPopover.hidden = true;
});
