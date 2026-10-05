(function () {
  'use strict';

  const LOCALE = 'es-AR';
  const STORAGE_KEY = 'schemaweek.tasks';
  const STORAGE_VERSION = 1;
  const PRIORITY_LABELS = { high: 'Prioridad alta', medium: 'Prioridad media', low: 'Prioridad baja' };
  const PRIORITY_ORDER = { high: 0, medium: 1, low: 2 };
  const BLANK_MESSAGE = 'No puede contener solo espacios.';
  const FIELD_ERRORS = {
    title: {
      valueMissing: 'Ingresá un título.'
    },
    subject: {
      valueMissing: 'Ingresá la materia.'
    },
    duration: {
      valueMissing: 'Ingresá la duración estimada.',
      badInput: 'Ingresá un número válido.',
      rangeUnderflow: 'La duración mínima es 0,5 horas.',
      rangeOverflow: 'La duración máxima es 40 horas.',
      stepMismatch: 'Usá múltiplos de 0,5 horas.'
    },
    dueDate: {
      valueMissing: 'Elegí una fecha límite.',
      badInput: 'Ingresá una fecha válida.'
    }
  };

  const dateFormatter = new Intl.DateTimeFormat(LOCALE, { day: 'numeric', month: 'short' });
  const dateWithYearFormatter = new Intl.DateTimeFormat(LOCALE, {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });
  const hoursFormatter = new Intl.NumberFormat(LOCALE, { maximumFractionDigits: 1 });

  const elements = {
    form: document.getElementById('task-form'),
    titleInput: document.getElementById('title'),
    subjectInput: document.getElementById('subject'),
    subjectOptions: document.getElementById('subject-options'),
    formStatus: document.getElementById('form-status'),
    list: document.getElementById('task-list'),
    tasksTitle: document.getElementById('tasks-title'),
    emptyState: document.getElementById('empty-state'),
    pending: document.getElementById('stat-pending'),
    completed: document.getElementById('stat-completed'),
    overdue: document.getElementById('stat-overdue'),
    hours: document.getElementById('stat-hours'),
    progress: document.getElementById('progress'),
    progressText: document.getElementById('progress-text'),
    nextDue: document.getElementById('next-due'),
    template: document.getElementById('task-template'),
    storageWarning: document.getElementById('storage-warning'),
    undoNotice: document.getElementById('undo-notice'),
    undoMessage: document.getElementById('undo-message'),
    undoButton: document.getElementById('undo-button'),
    announcer: document.getElementById('announcer')
  };

  let tasks = [];
  let lastDeleted = null;

  function getToday() {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), now.getDate());
  }

  function parseLocalDate(isoDate) {
    const [year, month, day] = isoDate.split('-').map(Number);
    return new Date(year, month - 1, day);
  }

  function isValidIsoDate(value) {
    if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) {
      return false;
    }
    const [year, month, day] = value.split('-').map(Number);
    const date = new Date(year, month - 1, day);
    return date.getFullYear() === year && date.getMonth() === month - 1 && date.getDate() === day;
  }

  function isNonBlankString(value) {
    return typeof value === 'string' && value.trim() !== '';
  }

  function isValidTask(task) {
    return task !== null
      && typeof task === 'object'
      && isNonBlankString(task.id)
      && isNonBlankString(task.title)
      && typeof task.description === 'string'
      && isNonBlankString(task.subject)
      && Number.isFinite(task.durationHours)
      && task.durationHours > 0
      && Object.keys(PRIORITY_ORDER).includes(task.priority)
      && isValidIsoDate(task.dueDate)
      && typeof task.completed === 'boolean'
      && typeof task.createdAt === 'string';
  }

  function loadTasks() {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw === null) {
        return [];
      }
      const data = JSON.parse(raw);
      if (!data || data.version !== STORAGE_VERSION || !Array.isArray(data.tasks)) {
        return [];
      }
      return data.tasks.filter(isValidTask);
    } catch {
      return [];
    }
  }

  function saveTasks() {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ version: STORAGE_VERSION, tasks }));
      elements.storageWarning.hidden = true;
    } catch {
      elements.storageWarning.hidden = false;
    }
  }

  function createTask(values) {
    return {
      id: Date.now().toString(36) + Math.random().toString(36).slice(2, 8),
      title: values.title.trim(),
      description: values.description.trim(),
      subject: values.subject.trim(),
      durationHours: Number(values.duration),
      priority: values.priority,
      dueDate: values.dueDate,
      completed: false,
      createdAt: new Date().toISOString()
    };
  }

  function formatDate(isoDate, today) {
    const date = parseLocalDate(isoDate);
    const formatter = date.getFullYear() === today.getFullYear() ? dateFormatter : dateWithYearFormatter;
    return formatter.format(date);
  }

  function formatHours(hours) {
    return `${hoursFormatter.format(hours)} h`;
  }

  function formatOverdue(count) {
    return `${count} ${count === 1 ? 'vencida' : 'vencidas'}`;
  }

  function isOverdue(task, today) {
    return !task.completed && parseLocalDate(task.dueDate) < today;
  }

  function isUpcoming(task, today) {
    return !task.completed && parseLocalDate(task.dueDate) >= today;
  }

  function isDueToday(task, today) {
    return !task.completed && parseLocalDate(task.dueDate).getTime() === today.getTime();
  }

  function sortTasks(list) {
    return [...list].sort((a, b) => {
      if (a.completed !== b.completed) {
        return a.completed ? 1 : -1;
      }
      return a.dueDate.localeCompare(b.dueDate)
        || PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority]
        || a.createdAt.localeCompare(b.createdAt);
    });
  }

  function computeSummary(list, today) {
    const pendingTasks = list.filter((task) => !task.completed);
    const completedCount = list.length - pendingTasks.length;

    return {
      pending: pendingTasks.length,
      completed: completedCount,
      overdue: list.filter((task) => isOverdue(task, today)).length,
      pendingHours: pendingTasks.reduce((sum, task) => sum + task.durationHours, 0),
      progress: list.length === 0 ? 0 : Math.round((completedCount / list.length) * 100),
      nextDue: sortTasks(list.filter((task) => isUpcoming(task, today)))[0] || null
    };
  }

  function formatNextDue(summary, today) {
    if (summary.nextDue) {
      return `Próxima entrega: ${summary.nextDue.title}, ${formatDate(summary.nextDue.dueDate, today)}`;
    }
    return summary.overdue > 0
      ? `Sin próximas entregas · ${formatOverdue(summary.overdue)}`
      : 'No hay entregas pendientes.';
  }

  function renderSummary(summary, today) {
    elements.pending.textContent = summary.pending;
    elements.completed.textContent = summary.completed;
    elements.overdue.textContent = summary.overdue;
    elements.overdue.closest('.stat').classList.toggle('stat--alert', summary.overdue > 0);
    elements.hours.textContent = formatHours(summary.pendingHours);
    elements.progress.value = summary.progress;
    elements.progressText.textContent = `${summary.progress}%`;
    elements.nextDue.textContent = formatNextDue(summary, today);
  }

  function renderTaskList(list, today) {
    const fragment = document.createDocumentFragment();

    list.forEach((task) => {
      const item = elements.template.content.firstElementChild.cloneNode(true);
      const check = item.querySelector('.task__check');
      const priorityBadge = item.querySelector('.task__priority');
      const description = item.querySelector('.task__description');
      const due = item.querySelector('.task__due');
      const overdue = isOverdue(task, today);

      item.dataset.id = task.id;
      item.classList.toggle('task--completed', task.completed);
      item.classList.toggle('task--overdue', overdue);

      check.checked = task.completed;
      item.querySelector('.task__toggle-text').textContent = `Tarea completada: ${task.title}`;
      item.querySelector('.task__title').textContent = task.title;
      item.querySelector('.task__subject').textContent = task.subject;
      item.querySelector('.task__duration').textContent = formatHours(task.durationHours);
      priorityBadge.textContent = PRIORITY_LABELS[task.priority];
      priorityBadge.classList.add(`badge--${task.priority}`);
      item.querySelector('.task__overdue').hidden = !overdue;
      item.querySelector('.task__today').hidden = !isDueToday(task, today);
      due.dateTime = task.dueDate;
      due.textContent = `Vence ${formatDate(task.dueDate, today)}`;
      description.textContent = task.description;
      description.hidden = task.description === '';
      item.querySelector('.task__delete').setAttribute('aria-label', `Eliminar tarea: ${task.title}`);

      fragment.appendChild(item);
    });

    elements.list.replaceChildren(fragment);
    elements.emptyState.hidden = list.length > 0;
  }

  function renderSubjectOptions() {
    const subjects = new Map();
    tasks.forEach((task) => {
      const key = task.subject.toLocaleLowerCase(LOCALE);
      if (!subjects.has(key)) {
        subjects.set(key, task.subject);
      }
    });

    const options = [...subjects.values()]
      .sort((a, b) => a.localeCompare(b, LOCALE))
      .map((subject) => {
        const option = document.createElement('option');
        option.value = subject;
        return option;
      });

    elements.subjectOptions.replaceChildren(...options);
  }

  function render() {
    const today = getToday();
    renderSummary(computeSummary(tasks, today), today);
    renderTaskList(sortTasks(tasks), today);
    renderSubjectOptions();
  }

  function commit() {
    saveTasks();
    render();
  }

  function findItem(id) {
    return [...elements.list.children].find((item) => item.dataset.id === id) || null;
  }

  function focusTaskCheck(id) {
    const item = findItem(id);
    if (item) {
      item.querySelector('.task__check').focus();
    }
  }

  function showUndo(task) {
    lastDeleted = task;
    elements.undoNotice.hidden = false;
    elements.undoMessage.textContent = `Tarea eliminada: ${task.title}`;
  }

  function clearUndo() {
    lastDeleted = null;
    elements.undoNotice.hidden = true;
    elements.undoMessage.textContent = '';
  }

  function getErrorMessage(input) {
    if (input.type === 'text' && input.value !== '' && input.value.trim() === '') {
      return BLANK_MESSAGE;
    }
    const messages = FIELD_ERRORS[input.name];
    if (!messages || input.validity.valid) {
      return '';
    }
    const match = Object.entries(messages).find(([flag]) => input.validity[flag]);
    return match ? match[1] : '';
  }

  function updateValidity(input) {
    input.setCustomValidity('');
    input.setCustomValidity(getErrorMessage(input));
  }

  function handleFormInput(event) {
    updateValidity(event.target);
    elements.formStatus.textContent = '';
  }

  function handleInvalid(event) {
    updateValidity(event.target);
  }

  function handleSubmit(event) {
    event.preventDefault();
    const values = Object.fromEntries(new FormData(elements.form));
    const task = createTask(values);
    tasks.push(task);
    clearUndo();
    commit();
    elements.form.reset();
    elements.formStatus.textContent = `Tarea creada: ${task.title}`;
    elements.titleInput.focus();
  }

  function handleListChange(event) {
    const check = event.target.closest('.task__check');
    if (!check) {
      return;
    }
    const id = check.closest('.task').dataset.id;
    const task = tasks.find((entry) => entry.id === id);
    task.completed = check.checked;
    clearUndo();
    commit();
    focusTaskCheck(id);
    elements.announcer.textContent = task.completed
      ? `Tarea completada: ${task.title}. Se movió al final de la lista.`
      : `Tarea marcada como pendiente: ${task.title}.`;
  }

  function handleListClick(event) {
    const button = event.target.closest('.task__delete');
    if (!button) {
      return;
    }
    const item = button.closest('.task');
    const id = item.dataset.id;
    const neighbour = item.nextElementSibling || item.previousElementSibling;
    const task = tasks.find((entry) => entry.id === id);

    tasks = tasks.filter((entry) => entry.id !== id);
    commit();
    showUndo(task);

    if (neighbour) {
      focusTaskCheck(neighbour.dataset.id);
    } else {
      elements.tasksTitle.focus();
    }
  }

  function handleUndo() {
    const restored = lastDeleted;
    if (!restored) {
      return;
    }
    tasks.push(restored);
    clearUndo();
    commit();
    focusTaskCheck(restored.id);
  }

  function handleVisibilityChange() {
    if (!document.hidden) {
      render();
    }
  }

  function handleStorageChange(event) {
    if (event.key === STORAGE_KEY) {
      tasks = loadTasks();
      clearUndo();
      render();
    }
  }

  function scheduleMidnightRefresh() {
    const now = new Date();
    const nextMidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
    window.setTimeout(() => {
      render();
      scheduleMidnightRefresh();
    }, nextMidnight - now);
  }

  function init() {
    tasks = loadTasks();
    elements.form.addEventListener('input', handleFormInput);
    elements.form.addEventListener('invalid', handleInvalid, true);
    elements.form.addEventListener('submit', handleSubmit);
    elements.list.addEventListener('change', handleListChange);
    elements.list.addEventListener('click', handleListClick);
    elements.undoButton.addEventListener('click', handleUndo);
    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('storage', handleStorageChange);
    render();
    scheduleMidnightRefresh();
  }

  init();
})();
