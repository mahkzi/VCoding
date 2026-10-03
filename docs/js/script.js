(function () {
  'use strict';

  const LOCALE = 'en-GB';
  const PRIORITY_LABELS = { high: 'High', medium: 'Medium', low: 'Low' };

  const dateFormatter = new Intl.DateTimeFormat(LOCALE, { day: '2-digit', month: '2-digit' });
  const hoursFormatter = new Intl.NumberFormat(LOCALE, { maximumFractionDigits: 1 });

  const elements = {
    form: document.getElementById('task-form'),
    titleInput: document.getElementById('title'),
    list: document.getElementById('task-list'),
    emptyState: document.getElementById('empty-state'),
    pending: document.getElementById('stat-pending'),
    completed: document.getElementById('stat-completed'),
    hours: document.getElementById('stat-hours'),
    progress: document.getElementById('progress'),
    progressText: document.getElementById('progress-text'),
    nextDue: document.getElementById('next-due'),
    template: document.getElementById('task-template')
  };

  let tasks = [];

  function getToday() {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), now.getDate());
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

  function parseLocalDate(isoDate) {
    const [year, month, day] = isoDate.split('-').map(Number);
    return new Date(year, month - 1, day);
  }

  function formatDate(isoDate) {
    return dateFormatter.format(parseLocalDate(isoDate));
  }

  function formatHours(hours) {
    return `${hoursFormatter.format(hours)} h`;
  }

  function isOverdue(task, today) {
    return !task.completed && parseLocalDate(task.dueDate) < today;
  }

  function sortTasks(list) {
    return [...list].sort((a, b) => {
      if (a.completed !== b.completed) {
        return a.completed ? 1 : -1;
      }
      return a.dueDate.localeCompare(b.dueDate) || a.createdAt.localeCompare(b.createdAt);
    });
  }

  function computeSummary(list, today) {
    const pendingTasks = list.filter((task) => !task.completed);
    const completedCount = list.length - pendingTasks.length;
    const upcoming = pendingTasks.filter((task) => parseLocalDate(task.dueDate) >= today);

    return {
      pending: pendingTasks.length,
      completed: completedCount,
      pendingHours: pendingTasks.reduce((sum, task) => sum + task.durationHours, 0),
      progress: list.length === 0 ? 0 : Math.round((completedCount / list.length) * 100),
      nextDue: sortTasks(upcoming)[0] || null
    };
  }

  function renderSummary(summary) {
    elements.pending.textContent = summary.pending;
    elements.completed.textContent = summary.completed;
    elements.hours.textContent = formatHours(summary.pendingHours);
    elements.progress.value = summary.progress;
    elements.progressText.textContent = `${summary.progress}%`;
    elements.nextDue.textContent = summary.nextDue
      ? `Next due: ${summary.nextDue.title}, ${formatDate(summary.nextDue.dueDate)}`
      : 'No pending deadlines.';
  }

  function renderTaskList(list, today) {
    const fragment = document.createDocumentFragment();

    list.forEach((task) => {
      const item = elements.template.content.firstElementChild.cloneNode(true);
      const check = item.querySelector('.task__check');
      const priorityBadge = item.querySelector('.badge:not(.badge--overdue)');
      const description = item.querySelector('.task__description');
      const due = item.querySelector('.task__due');
      const overdue = isOverdue(task, today);

      item.dataset.id = task.id;
      item.classList.toggle('task--completed', task.completed);
      item.classList.toggle('task--overdue', overdue);

      check.checked = task.completed;
      check.setAttribute('aria-label', `Mark as completed: ${task.title}`);
      item.querySelector('.task__title').textContent = task.title;
      item.querySelector('.task__subject').textContent = task.subject;
      item.querySelector('.task__duration').textContent = formatHours(task.durationHours);
      priorityBadge.textContent = PRIORITY_LABELS[task.priority];
      priorityBadge.classList.add(`badge--${task.priority}`);
      item.querySelector('.badge--overdue').hidden = !overdue;
      due.dateTime = task.dueDate;
      due.textContent = `Due ${formatDate(task.dueDate)}`;
      description.textContent = task.description;
      description.hidden = task.description === '';
      item.querySelector('.task__delete').setAttribute('aria-label', `Delete task: ${task.title}`);

      fragment.appendChild(item);
    });

    elements.list.replaceChildren(fragment);
    elements.emptyState.hidden = list.length > 0;
  }

  function render() {
    const today = getToday();
    renderSummary(computeSummary(tasks, today));
    renderTaskList(sortTasks(tasks), today);
  }

  function handleSubmit(event) {
    event.preventDefault();
    const values = Object.fromEntries(new FormData(elements.form));
    tasks.push(createTask(values));
    render();
    elements.form.reset();
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
    render();
    elements.list.querySelector(`[data-id="${id}"] .task__check`).focus();
  }

  function handleListClick(event) {
    const button = event.target.closest('.task__delete');
    if (!button) {
      return;
    }
    const id = button.closest('.task').dataset.id;
    tasks = tasks.filter((task) => task.id !== id);
    render();
  }

  function init() {
    elements.form.addEventListener('submit', handleSubmit);
    elements.list.addEventListener('change', handleListChange);
    elements.list.addEventListener('click', handleListClick);
    render();
  }

  init();
})();
